
document.addEventListener("DOMContentLoaded", () => {


    const BASE_URL = "http://localhost:3000/"
    const quotesUrl = BASE_URL + "quotes"
    const quotesWithLikes = quotesUrl + "?_embed=likes"
    const likesUrl = "http://localhost:3000/likes"
    
    const quoteForm = document.querySelector("#new-quote-form")

  

    const renderAllQuotes = (quotes) => {
        quotes.forEach(renderQoute)
    }

    const fetchAllQuotes = () => {
        return fetch(quotesWithLikes)
        .then(resp => resp.json())
        .then(renderAllQuotes)
    }


    quoteForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const newQuote = event.target.quote.value
        const newAuthor = event.target.author.value

        fetch((quotesUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                quote: newQuote,
                author: newAuthor
            })
        }).then(resp => resp.json())
            .then(renderQoute)
    })



    const renderQoute = (quote) => {

        const unorderesListOfQuotes = document.querySelector("#quote-list")

        const li = document.createElement("li")

        const blockquoteEl = document.createElement("blockquote")
        blockquoteEl.className = "blockquote"

        const p = document.createElement("p")
        p.className = "mb-0"
        p.innerHTML = quote.quote 

        const pForm = document.createElement("form")
        pForm.className = "edit-form"
        // const editForm = document.querySelector("#edit-form")
        // editButton.input = p

        const footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author

        const span = document.createElement("span")
        span.innerText = quote.likes.length

        const likesButton = document.createElement("button")
        likesButton.className = "btn-success"
        likesButton.innerText = `Likes: `
        likesButton.append(span)
            likesButton.addEventListener("click", (e) => {
                //console.log('quote inside fetch', quote)
                fetch((likesUrl), {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                    },
                    body: JSON.stringify({
                        quoteId: quote.id
                    })
                }).then(resp => resp.json())
                .then(() => {span.innerText = `${parseInt(span.innerText) + 1}`})
            })
        

        const deleteButton = document.createElement("button")
        deleteButton.className = "btn-danger"
        deleteButton.innerText = "Delete"

            deleteButton.addEventListener("click", () => {
                fetch((`${quotesUrl}/${quote.id}`), {
                    method: "DELETE"
                }).then(() => li.remove())
                
            })

        const editButton = document.createElement("button")
        editButton.innerText = "EDIT"
        editButton.style.background = "yellow"
            editButton.addEventListener("click", (newQuote) => {
                fetch((`${quotesUrl}/${quote.id}`), {
                    
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Acept: "application/json"
                    },
                    body: JSON.stringify({
                        quote: newQuote.quote,
                        author: quote.author,
                        likes: quote.likes
                    }),
                    
                }).then(resp => resp.json())
                .then(renderQoute)
            })

      

        unorderesListOfQuotes.append(li)
        li.append(blockquoteEl)
        blockquoteEl.append(pForm, footer, likesButton, deleteButton, editButton)
        pForm.append(p)
    }

//     <li class='quote-card'>
//   <blockquote class="blockquote">
//     <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//     <footer class="blockquote-footer">Someone famous</footer>
//     <br>
//     <button class='btn-success'>Likes: <span>0</span></button>
//     <button class='btn-danger'>Delete</button>
//   </blockquote>
// </li>


    fetchAllQuotes()
})


