let quote = document.querySelector('#quote');


// add random quote to home page 
async function getQuote(elem) {
  const rand = Math.floor(Math.random() * 1500)
  const result = await fetch('https://type.fit/api/quotes')

  const data = await result.json()

  let quote = {
    author: data[rand].author,
    quote: data[rand].text
  }

  elem.innerHTML = `${quote.quote} <br>- ${quote.author}`

}

function greeting() {

  let greeting;
  let hours = new Date().getHours()

  if (hours >= 6 && hours < 12) {
    greeting = 'Good morning'
  }
  else if (hours >= 12 && hours < 18) {
    greeting = 'Good afternoon'
  }
  else if (hours >= 18 && hours < 23) {
    greeting = 'Good evening'
  }
  else greeting = 'Good night'

  document.querySelector('#greeting').innerHTML = `${greeting}, `
}


getQuote(quote);

greeting();