var btn = document.getElementById('sub');
var queryBtn = document.getElementById('query-sub');
var query = document.getElementById('query');
var urlBlock = document.getElementById('url-block');
var urlAdd = document.getElementById('add-url');
var urlCnt = 2;
var ansBlock= document.getElementById('answer');

urlAdd.addEventListener('click', ()=>{
    if(urlCnt < 5)
    {
        console.log("here");
        urlBlock.innerHTML  += `<div class="mb-3">
            <label for="url${urlCnt+1}" class="form-label">url ${urlCnt+1}</label>
            <input type="url" class="form-control" id="url${urlCnt+1}">
        </div>`;
        urlCnt++;
    }
});

var urlForm = (contner) => {
    btn.disabled = true;
    queryBtn.disabled = true;
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

var resolver = (urls) => {
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
                btn.disabled = false;
            } 
            else
            {
                query.disabled = false;
                queryBtn.disabled = false;
                btn.disabled = false;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

var queryAndAnswer = ()=>{
    while(ansBlock.lastElementChild){
        ansBlock.removeChild(ansBlock.lastElementChild);
    }
    queryBtn.disabled = true;
    btn.disabled = true;
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    fetch('query', {
        method: 'POST',
        body: JSON.stringify({query: query.value }),
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
        p.classList.add("h4");
        ansBlock.appendChild(p);
        queryBtn.disabled = false;
        btn.disabled = false;
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}