const Nightmare = require('nightmare')
var nightmare = Nightmare({show: false })
var mysql = require('mysql');
var goNumbers = nightmare.goto('https://facebook.com').wait('body').type('#email', "migzmarcaida").type('#pass', "latteinnovation").click('#u_0_2');
var connection = mysql.createConnection({host : 'localhost',user : 'root',password : '',database : 'fb_phone',});
var queryString = 'Select id,number from numbers';
var updatequeryNo = 'update numbers set status = "N" where id = ?';
var updatequeryYes = 'update numbers set status = "Y" where id = ?';

connection.query(queryString, function (err,rows,fields) {
    if(err) throw err;
	goNumbers.wait()
		.then(function(result)
		{
			return loopAgain(nightmare,rows,0) //and finally run the function again since it's still here
		})
			.catch((error) => {
			console.error('Search failed:', error);
	});

});

function loopAgain(nightmare,numbers,count){

	/*console.log(numbers[count])*/
    return nightmare
            .wait('._1frb')
            .wait(4000)
            .type('._1frb', numbers[count].number)
            .wait(4000)
            .click('._19bs')
            .wait(4000)
            .wait('a._2yet')
            .evaluate(() => document.querySelector('a._1ii5').href)
.then(function(result)
    {
        if(result)
        {
            var x = count++;
            console.log("url: " + result + "num: " + numbers[x].number )

            connection.query(updatequeryYes,[numbers[x].id],function(err,results){
                console.log(results);
			});

            return loopAgain(nightmare,numbers,x+1)
        }
    })
        .catch((error) => {

        var x = count++;
    console.log("url: " + "No Result " + "num: " + numbers[x].number )

    connection.query(updatequeryNo,[numbers[x].id],function(err,results){
        console.log(results);
    });
    return loopAgain(nightmare,numbers,x+1)
});

}


