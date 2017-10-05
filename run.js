


var Nightmare = require('nightmare');
 var  async = require("async");
 var  nightmare = Nightmare({
        show: true
    });

/*
async function run () {
    var result = await nightmare
    //load a url
        .goto('https://facebook.com')
        .type('#email', "migzmarcaida")
        .type('#pass', "latteinnovation")
        .click('#u_0_2')
        .wait('._1frb')
        .type('._1frb',"09477277091")
        .wait(5000)
        .click('._19bs')
        .wait('a._2yet')

        .evaluate(function() {
            return document.querySelector('a._1ii5').href;
        });


    //queue and end the Nightmare instance along with the Electron instance it wraps
    await nightmare.end();

    console.log(result);
};

run();*/

var scraper = new Nightmare()
    .goto('https://facebook.com')
    .type('#email', "migzmarcaida")
    .type('#pass', "latteinnovation")
    .click('#u_0_2');

//Trying to use async module to iterate through urls

function load(num, callback){
    scraper
        .wait('._1frb')
        .type('._1frb',num)
        .wait(5000)
        .click('._19bs')
        .wait('a._2yet')
        .wait(2000)
        .run(function(err, nightmare) {
            if (err) {
                console.log(err);
            }
            console.log(num)
            callback()
        });
}

var numbersList = ["9082353517","09477277091","09187548444"]

async.eachSeries(numbersList, load, function (err) {
    console.log('done!');
});