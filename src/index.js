
document.addEventListener("DOMContentLoaded", () => {
    const QUOTES_EMBEDED = ("http://localhost:3000/quotes?_embed=likes")
    const QUOTES_URL = ("http://localhost:3000/quotes")
    const LIKES_URL = ("http://localhost:3000/likes")
    const quoteList = document.querySelector("#quote-list")
    const form = document.querySelector("#new-quote-form")

    const init = () => {
        fetch(QUOTES_EMBEDED)
        .then(res => res.json())
        .then(quotes => renderQuotes(quotes))
    }
    init();

    const deleteQuote = (quote) => {
        return fetch(`${QUOTES_URL}/${quote.id}`, {
             method: "DELETE"
         })
     }

    const postQuote = (event) => {
        return fetch(QUOTES_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
               quote: event.target.quote.value,
               author: event.target.author.value
            })
        }).then(res => res.json());
    }
    
    const postLike = (quote) => {
        return fetch(LIKES_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quoteID: quote.id 
            })
        }).then(res => res.json())
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        postQuote(event).then(quote => (renderNewQuote(quote)))
    })

    renderQuotes = (quotes) => {
        quotes.forEach (quote =>
            renderNewQuote(quote))
    }
    
    renderNewQuote = (quote) => {
        const li = document.createElement('li')
        li.className = 'quote-card'

        const blockQuote = document.createElement('blockquote')
        blockQuote.className = "blockquote"

        const quoteParagraph = document.createElement('p')
        quoteParagraph.className = "mb-0"
        quoteParagraph.innerText = quote.quote

        const authorTag = document.createElement('footer')
        authorTag.className = "blockquote-footer"
        authorTag.innerText = quote.author 

        const likeBtn = document.createElement('button')
        likeBtn.className = 'btn-success'
        likeBtn.innerText = "Likes:"

        const likeBtnSpan = document.createElement('span')
        likeBtnSpan.innerText = 0

        likeBtn.append(likeBtnSpan)
        likeBtn.addEventListener('click', () => {
            postLike(quote).then(() => likeBtn.children[0].innerText++)
        })

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn-danger'
        deleteBtn.innerText = "Delete"

        deleteBtn.addEventListener('click', () => {
            deleteQuote(quote).then( () => {
                li.remove();
            })
        })

        const editBtn = document.createElement('button')
        editBtn.innerText = "Edit Quote"

        li.append(blockQuote, quoteParagraph, authorTag, likeBtn, deleteBtn, editBtn)
        quoteList.append(li)
    }
    

})
