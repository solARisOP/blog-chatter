from django.shortcuts import render
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from bs4 import BeautifulSoup
from langchain.text_splitter import RecursiveCharacterTextSplitter
from django.http import JsonResponse
from langchain.vectorstores.chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.llms.google_palm import GooglePalm
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
import random, string, json, requests, os

data_packages = {}

# Create your views here.
def ind(request):
    if 'sessionid' not in request.session:
        context = {'flag' : 0}
    else:
        context = {'flag' : 1}
        print(request.session['sessionid'])

    return render(request, 'home.html', context)

def retreiveEmbbed(urls, sessionid, request):
    data = []
    for url in urls: 
        params = {'api_key': os.environ['scraperapi_key'], 'url': url}
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        response = requests.get('http://api.scraperapi.com/', params=params, headers=headers)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, "html.parser")
        doc = soup.get_text()
        
        text_splitter = RecursiveCharacterTextSplitter(
            separators = ['\n\n', '\n', '.', ','],
            chunk_size = 1000,
        )
        chunks = text_splitter.split_text(doc)

        data.extend(chunks)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vdb = Chroma.from_texts(data, embeddings)

    data_packages[sessionid] = vdb
    return True

def urlResolver(request):
    data = json.loads(request.body.decode('utf-8'))
    urls = data['urls']
    if 'sessionid' not in request.session:
        client = ''.join(random.choices(string.ascii_letters+string.digits, k=30))
        while client in data_packages:
            client = ''.join(random.choices(string.ascii_letters+string.digits, k=30))
        request.session['sessionid'] = client

    sessionid  = request.session['sessionid']
    validater = URLValidator()
    for url in urls:
        try:
            validater(url)
        except ValidationError:
            return JsonResponse({'message' : 'nope', 'url' : url})
    retreiveEmbbed(urls, sessionid, request)
    return JsonResponse({'message' : 'ok'})

def questionAnswer(request):
    data = json.loads(request.body.decode('utf-8'))
    sessionid  = request.session['sessionid']
    query = data['query']
    retriever = data_packages[sessionid]
    llm = GooglePalm(google_api_key=os.environ['palm_api_key'], temperature=0.5)
    prompt_template = """You are a very helpfull assistant and you only use the information provided to you to answer the questions not anything extra. Use the following pieces of context to answer the question at the end. If you cant make out the answer from the context, just say that you don't know, don't try to make up an answer and please take care of that the answer should strictly from the context only that i have provided and not the info that you already have.

    {context}

    Question: {question}
    Helpful Answer:"""
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    chain = RetrievalQA.from_chain_type(llm=llm, retriever = retriever.as_retriever(), chain_type_kwargs={"prompt": PROMPT})
    result = chain({'query' : query}, return_only_outputs=True)
    return JsonResponse({'response' : result['result']})

