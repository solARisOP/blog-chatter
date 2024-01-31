
# Blog Scraper and Q&A System

This project allows users to input articles/blog links, scrapes the content, creates a vector database (vectordb) index, and enables users to query specific questions about the content. The backend utilizes Google PALM for question answering based on the vectordb index generated from the scraped articles.


# Tech Stack

* Python, Django: Backend development for scraping, indexing, and handling API calls.
* Vectordb, ChromaDB: Utilized for efficient storage and retrieval of vectorized information.
* Google PALM: Integrated for powerful question-answering capabilities.

# Features

* Article Scraping: Users can input article/blog links, and the project scrapes and indexes the content.
* Vectordb Indexing: Store and manage article information in a vectordb index for efficient querying.
* Question-Answering with PALM: Utilize Google PALM to answer user queries based on the vectordb index.
* API Integration: Send API calls to Google PALM with user questions and vectordb context for accurate answers.


## Run Locally

Clone the project

```bash
  git clone https://github.com/solARisOP/blog-chatter.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  pip install -r requirements.txt
```

Make Migrations

```bash
  python manage.py makemigrations
```

Apply Migrations

```bash
  python manage.py migrate
```

Start the server

```bash
  python manage.py runserver
```



## Environment Variables

Google PALM API Key

Obtain an API key from Google PALM and add it to the .env file in your project directory

```bash
  PALM_API_KEY = 'your-api-key'
```



# Usage

#### Input Article URLs
Navigate to the application, input article/blog links, and submit to initiate scraping.

#### Query Questions
Once articles are indexed, users can input questions to get relevant answers from the vectordb using Google PALM.
