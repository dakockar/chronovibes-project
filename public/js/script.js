document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("chronovibes-project JS imported successfully!");
  },
  false
);


getQuote()

// add randomized quote to home page

async function getQuote() {
    const rand = Math.floor(Math.random() * 1500)
    const result = await fetch('https://type.fit/api/quotes')
        
    const data = await result.json()
        
    let quote = {
        author: data[rand].author,
        quote: data[rand].text
    }

    document.querySelector('#quote').innerHTML= `${quote.quote} <br>- ${quote.author}`

    }
        