document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("chronovibes-project JS imported successfully!");
  },
  false
);



// add randomized quote to home page 
// TODO: view specific functions might have to be defined directly in the view files inside script tags

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


// generate a calendar for the month passed as args
// TODO add links to specific days inside the td elements

function createCal(elem, year, month) {
      let m = month - 1 // get month number in js
      let d = new Date(year, m) // get first day of given month
  
      let table = '<table><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr>'
  
      // empty cells
      for (let i = 0; i < getDay(d); i++) {
          table += '<td></td>'
      }
  
      // filled cells
      while (d.getMonth() == m ) {
          table += `<td>${d.getDate()}</td>`
  
          if (getDay(d) % 7 == 6) { // gets to last day of week
              table += '<tr></tr>'
          }
          d.setDate(d.getDate() + 1)
      }
  
      if (getDay(d) != 0) {
          for (let i = getDay(d); i < 7; i++) {
              table += '<td></td>'
          }
      }
  
      table += '</tr></table>'
      elem.innerHTML = table
  
  }
  

function getDay(date) {
    let day = date.getDate()
    if (day == 0) day = 7
    return day - 1
  }