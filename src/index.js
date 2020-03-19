const requests = new HTTPRequests;
const QUOTES_URL = "http://localhost:3000/quotes?_embed=likes";
const QUOTE = "http://localhost:3000/quotes";
const ul = document.querySelector("#quote-list");

const newQuote = document.querySelector(".btn-primary");
newQuote.addEventListener("click", (e) => addNewQuote(e))

document.addEventListener("DOMContentLoaded",function() {
    requests.get(QUOTES_URL).then(data => {

        data.forEach(e => {   
            const element = createQuote(e);  
            appendQuote(element);
        });

    });
    
})

//create a new quote when load the page and when a new quote is created through the form
function createQuote(e){
    const li = document.createElement("li");
    const blockQuote = document.createElement("blockquote");
    const content = document.createElement("p");
    const author = document.createElement("footer");
    const likeBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    li.className = 'quote-card';
    li.id = `quote_${e.id}`;
    blockQuote.className = "blockquote";
    content.className = "mb-0";
    author.className = "blockquote-footer";
    likeBtn.className = 'btn-success';
    deleteBtn.className = 'btn-danger';

    content.innerText = e.quote;
    author.innerText = e.author;
    if (e.likes) likeBtn.innerHTML = `Likes: <span>${e.likes.length}</span>`;
    else likeBtn.innerHTML = `Likes: <span>0</span>`;
    likeBtn.addEventListener("click", e => likeQuote(e));
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", e => deleteQuote(e));

    blockQuote.append(content,author,likeBtn,deleteBtn);
    li.append(blockQuote);
    return li;
}

//append a quote to the ul
function appendQuote(li){
    ul.append(li);
}

//add a new quote when submiting the form
function addNewQuote(e){
    e.preventDefault();
    const quote = document.querySelector("#new-quote");
    const author = document.querySelector("#author");
    const newQuote = {
        "quote": quote.value,
        "author": author.value
    };
    requests.post(QUOTE,newQuote)
      .then(data => {
          const li = createQuote(data);
          appendQuote(li);
      });
    quote.value = "";
    author.value = "";
}

//delete a quote
function deleteQuote(e){
    const li = e.target.parentNode.parentNode;
    const id = li.id.split("_")[1];
    requests.delete(`${QUOTE}/${id}`)
      .then(data => li.remove());
}

function likeQuote(e){
    const li = e.target.parentNode.parentNode;
    const id = parseInt(li.id.split("_")[1],10);
    const newLike = {
        "quoteId": id
    };
    requests.post('http://localhost:3000/likes',newLike)
      .then(data => updateLikes(data));
}

function updateLikes(quote){
    
    const li = document.querySelector(`#quote_${quote.quoteId}`);
    const likeBtn = li.querySelector(".btn-success");
    const newNumber = parseInt(likeBtn.children[0].innerText,10) + 1; 
    likeBtn.children[0].innerText = newNumber;
    // debugger;
}