
let today = new Date()
let currentDate = today.getDate()
let currentMonth = today.getMonth()
let currentYear = today.getFullYear()


// generate calendar view in entries page (maybe elsewhere?)

function createCal(year, month) {
      
    let d = new Date(year, month) // get first day of given month
       
    let table = '<table><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr>'
    let mName = monthName(d.getMonth())  
    
    // empty cells
    for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>'
    }

    // filled cells
    while (d.getMonth() == month ) {
        table += `<td><a href="/something/${d.getMonth()+1}/${d.getDate()}">${d.getDate()}</a></td>`

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

    // header.innerHTML = `${mName} ${d.getFullYear()}`
    // elem.innerHTML = table
    document.querySelector('.cal-month').innerHTML = `${mName} ${d.getFullYear()}`
    document.querySelector('.cal-table').innerHTML = table
    
}

function getDay(date) {
    let day = date.getDay()
    if (day == 0) day = 7
    return day - 1
}

function monthName(num)  {
        
        switch (num) {
            case 0:
                return 'January';
            case 1:
                return 'February';
            case 2:
                return 'March';
            case 3:
                return 'April';
            case 4:
                return 'May';
            case 5:
                return 'June';
            case 6:
                return 'July';
            case 7:
                return 'August';
            case 8:
                return 'September';
            case 9:
                return 'October';
            case 10:
                return 'November';
            case 11:
                return 'December';
        }
    }   



