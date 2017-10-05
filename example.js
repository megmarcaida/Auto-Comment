/*
var Nightmare = require('nightmare');
var nightmare = Nightmare({show:true})
var urls = ['http://yahoo.com', 'http://google.com', 'http://facebook.com'];

var results = [];
urls.forEach(function(url) {
    nightmare.goto(url)
        .wait('body')
        .title()
        .then(function(result) {
            results.push(result);
        });
});
console.dir(results)*/

const test = function() {
    return new Promise((resolve, reject) => {
        resolve(123)
    })
}

var Nightmare = require('nightmare');
var nightmare = Nightmare({show: false })

var numbersList = ["9082353517","09477277091","9275302256","09289839383","09164615323","09189839383"]

var goNumbers = nightmare
 .goto('https://facebook.com')
 .type('#email', "migzmarcaida")
 .type('#pass', "latteinnovation")
 .click('#u_0_2');


 /*   goNumbers.wait()
        .wait(5000)
        .wait('._1frb')*/
        /*.wait('a._2yet')*/
    /*.evaluate(() => document.querySelector('a._1ii5').href)*/

   /* .then(function async (result) {

     /!*   let run = async () => {
            let a = await test()
            console.log(a)
        }

        run()*!/


  })*/
goNumbers.wait()
    .wait('._1frb')
    .type('._1frb', "09477277091")
    .wait(5000)
    .click('._19bs')
    .wait('a._2yet')
    .evaluate(() => document.querySelector('a._1ii5').href)
.then(function(result)
{
    return loopAgain(nightmare,numbersList,0) //and finally run the function again since it's still here
})
    .catch((error) => {
    console.error('Search failed:', error);
  });

    function loopAgain(nightmare,numbers,count){

        /*console.log(numbers[count])*/
        return nightmare
            .wait('._1frb')
                .wait(5000)
            .type('._1frb', numbers[count])
            .wait(5000)
            .click('._19bs')
            .wait(5000)
            .wait('a._2yet')
            .evaluate(() => document.querySelector('a._1ii5').href)
            .then(function(result)
            {
                if(result)
                {
                    var x = count++;
                    console.log("url: " + result + "num: " + numbers[x] )
                    return loopAgain(nightmare,numbers,x+1)
                }
            })
            .catch((error) => {

                    var x = count++;
                    console.log("url: " + "No Result " + "num: " + numbers[x] )
                    return loopAgain(nightmare,numbers,x+1)
            });

    }


/*

var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })
// Now split it line by line into an array.
var numberList = ['09187578744','09477277091','09152485784']
console.log("Found "+(numberList.length)+" numbers.");

// Go get the balances of the cards we've found.
getNumbers(numberList);

function getNumbers(numbers) {
    console.log("Now retrieving  " + numbers.length + " numbers.");
    var goNumbers = new Nightmare()
        .viewport(800, 1600)
        .goto('https://facebook.com')
        .type('#email', "migzmarcaida")
        .type('#passw', "UltimateP@ssw0rd")
        .click('#u_0_2-in');
    //Iterate through every card, enter its PIN, check the value, write it to disk.
    for (i = 0; i < numbers.length; i++) {
        console.log(i + ": " + numbers.length);
        // Continue where nightmare left off..
        goNumbers.wait()
        // Enter the PIN (screenshot here) & click the button, then wait for a response.
            .wait('._1frb')
            .type('#_1frb', numbers[i])
            .wait()
            .click('._19bs')
            .wait('a._2yet')
            // Take another screenshot to be sure of what we're seeing.
            .screenshot('./screens/postBtnClick'+i+'.jpg')
            .wait('#gift-card-submited')
            .evaluate(() => document.querySelector('a._1ii5').href)
            //Now one final thing... refresh the page so we can check more cards.
            .refresh();
      }
    goNumbers.run();
}*/
