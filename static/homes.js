var btns = document.getElementById('sub-s');
var queryBtns = document.getElementById('query-sub-s');
var querys = document.getElementById('query-s');
var urlBlocks = document.getElementById('url-block-s');
var urlAdds = document.getElementById('add-url-s');
var urlCnts = 2;
var ansBlocks= document.getElementById('answer-s');
var opener =  document.getElementById('opener');
var closer = document.getElementById('closer');
var preUrlBar = document.getElementById('pre-url-bar');
var urlBar = document.getElementById('url-bar');
var qaSmall = document.getElementById('qa-small');

urlAdds.addEventListener('click', ()=>{
    if(urlCnts < 5)
    {
        urlBlocks.innerHTML  += `<div class="mb-3">
            <label for="url${urlCnts+1}-s" class="form-label">url ${urlCnts+1}</label>
            <input type="url" class="form-control" id="url${urlCnts+1}-s">
        </div>`;
        urlCnts++;
    }
});

var urlForms = (contner) => {
    btns.disabled = true;
    queryBtns.disabled = true;
    var elements = contner.elements;
    var urls = [];
    var x = 0, flag = 0;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].tagName === 'INPUT' && elements[i].value != '' && elements[i].getAttribute("name") != "csrfmiddlewaretoken") {
            x++;
            var str = elements[i].value;
            var url = "";
            try {
                url = new URL(str);
            } catch (_) {
                flag=1;
                break;
            }
            urls.push(url);

        }
    }
    if(flag == 1)
    {
        alert(`url ${x} is incorrect`);
    }

    if(urls.length > 0)
    {
        resolver(urls);
    }
}

var resolvers = (urls) => {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    fetch('urlResolver', {
        method: 'POST',
        body: JSON.stringify({ urls: urls }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if(data['message'] == "nope")
            {
                alert(`${data['url']} is invalid or not reachable`);
                btns.disabled = false;
            } 
            else
            {
                querys.disabled = false;
                queryBtns.disabled = false;
                btns.disabled = false;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

var queryAndAnswers = ()=>{
    while(ansBlocks.lastElementChild){
        ansBlocks.removeChild(ansBlocks.lastElementChild);
    }
    queryBtns.disabled = true;
    btns.disabled = true;
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    fetch('querys', {
        method: 'POST',
        body: JSON.stringify({querys: querys.value }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        var p = document.createElement('p');
        p.textContent = data['response']
        p.classList.add("text-break");
        p.classList.add("f6");
        ansBlocks.appendChild(p);
        queryBtns.disabled = false;
        btns.disabled = false;
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}

opener.addEventListener('click',()=>{
    urlBar.style.display = "block";
    qaSmall.style.position = "absolute";
});

closer.addEventListener('click', ()=>{
    urlBar.style.display = "none";
    qaSmall.style.position = "";
});