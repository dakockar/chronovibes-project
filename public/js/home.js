
// add random quote to home page 

async function getQuote(elem) {
  const rand = Math.floor(Math.random() * 1500)
  const result = await fetch('https://type.fit/api/quotes')
      
  const data = await result.json()
      
  let quote = {
      author: data[rand].author,
      quote: data[rand].text
  }

  elem.innerHTML= `${quote.quote} <br>- ${quote.author}`

  }

  getQuote(quote)