// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var PORT = 4000;



//phantom mysql
const Nightmare = require('nightmare')
var nightmare = Nightmare({show: true, height: 1100,width: 1920 })
var mysql = require('mysql');

var connection = mysql.createConnection({host : 'localhost',user : 'root',password : '',database : 'youtube',});
var queryString = 'Select id,keyword from keywords where status = "0"';
var userString = 'Select id,emailaddress,password from users where status = "0"';
var updatequeryNo = 'update keywords set status = "N" where id = ?';
var updatequeryYes = 'update keywords set status = "Y" where id = ?';


var korText= "GTA스포츠 빅 이벤트 " +
    " 첫충15%/매충10%지급" +
    " 다폴적중올미적이벤트 " +
    " 출책 및 생일이벤트 " +
    " 메이저실시간스포츠GTA " +
    "실시간해외배당연동 " +
    " 스포츠전종목  " +
    " 주요경기고배당제공 " +
    " 다양한실시간게임 " +
    "";


app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});




io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('restart', function(data) {
           process.exit();

    });

    client.on('clicked', function(data) {
        console.log("RUNNING...");
        //console.log(data);
        var gokeywords = nightmare.goto('https://www.youtube.com/results?sp=CANQFA%253D%253D&q='+data.keyword).wait('body')
        //START


        connection.query(userString,function(error,userrows,field){
            connection.query(queryString, function (err, rows, fields) {

                    //console.log(JSON.stringify(rows))
                //console.log(JSON.stringify(userrows))
                    console.log(userrows[0].emailaddress)
                    if (err) throw err;
                    return nightmare.goto("https://accounts.google.com/signin/v2/identifier?passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3D%252F&uilel=3&service=youtube&flowName=GlifWebSignIn&flowEntry=ServiceLogin")
                            .wait(5000)
                            .wait('#Email')
                            .type('#Email',userrows[0].emailaddress + '\u000d')
                            .wait('#Passwd')
                            .type('#Passwd', userrows[0].password + '\u000d')
                            .then(function (result) {
                                return search(nightmare, rows, 0, data, 1,userrows,0) //and finally run the function again since it's still here
                            })
                            .catch((error) => {
                            console.log('Search Failed: ' + error)
                    });

            });

        });

        function search(nightmare,rows,count,data,loopcount,userrows,usercount){
            //console.log((loopcount+2) + " AW")
            return nightmare
                //.goto('https://www.youtube.com/results?sp=CANQFA%253D%253D&q='+ rows[count].keyword ).wait('body')
                    .wait(10000)
                    .click('#contents > ytd-video-renderer:nth-child('+loopcount+') > #dismissable > ytd-thumbnail a#thumbnail ')
                    .wait(10000)
                    .scrollTo(400, 0)
                    .wait('yt-formatted-string#simplebox-placeholder')
                    .click('yt-formatted-string#simplebox-placeholder')
                    .wait(10000)
                    .scrollTo(400, 0)
                    .wait('yt-formatted-string#simplebox-placeholder')
                    .click('yt-formatted-string#simplebox-placeholder')
                    .wait(4000)
                    .wait('#textarea')
                    .insert('#textarea',data.message)
                    .wait(5000)
                    .click('ytd-button-renderer#submit-button')
                    .wait(5000)
                    .exists('#footer-message.footer-error-message')
                    .then(function(ifExist)
                    {
                        console.log(ifExist)
                        if(!ifExist) {

                            console.log(x);
                            /* connection.query(updatequeryYes,[result,keywords[x].id],function(err,results){
                             io.emit('searchUpdate',"Result :" + "User Exist. , URL :" + result  + "<br>" + JSON.stringify(results));
                             console.log(results);
                             });*/
                            if (loopcount < data.loopcount) {
                                return searchLoop(nightmare, rows, count, data, loopcount + 1,userrows,usercount)
                            }
                            else {
                                return searchLoop(nightmare, rows, count + 1, data, 0,userrows,usercount)
                            }
                        }
                        else{
                            io.emit('checkIfAccountReported',userrows[usercount].emailaddress)
                            console.log('ACCOUNT REPORTED');

                            return start(nightmare,rows,count,data,loopcount,userrows,usercount+1);
                        }
                    })
                    .catch((error) => {

                    var x = count++;
            console.log("FIRST SEARCH" )

            /* connection.query(updatequeryNo,[keywords[x].id],function(err,results){
             io.emit('searchUpdate',"Result :" + "User Doesn't Exist."  + "<br>" + JSON.stringify(results));
             console.log(results);
             });*/
            if (loopcount < data.loopcount) {
                return searchLoop(nightmare, rows, x, data,loopcount,userrows,usercount)
            }
            else
            {
                return searchLoop(nightmare, rows, x+1, data,0,userrows,usercount)
            }
        });
        }



        function start(nightmare,rows,count,data,loopcount,userrows,usercount) {
            console.log("SUCCESS RESTART")
            console.log(userrows[usercount].emailaddress)
                return nightmare.goto("https://youtube.com/logout")
                        .wait('body')
                        .goto("https://accounts.google.com/signin/v2/identifier?passive=true&continue=https%3A%2F%2Fwww.youtube.com")
                    .wait(5000)
                    .wait('#identifierId')
                    .type('#identifierId', userrows[usercount].emailaddress + '\u000d')
                    .wait(5000)
                    .wait('input.whsOnd')
                    .type('input.whsOnd', userrows[usercount].password + '\u000d')
                    .wait(5000)
                    .then(function (result) {
                        console.log("going to loop....")
                        return searchLoop(nightmare,rows,count,data,loopcount,userrows,usercount)
                    })
                    .catch((error) => {
                        console.log('Search Failed: ' + error)
                    });
        }



        function searchLoop(nightmare,rows,count,data,loopcount,userrows,usercount){
            //console.log((loopcount+2) + " AW")
            return nightmare
                    .goto('https://www.youtube.com/results?sp=CANQFA%253D%253D&q='+ rows[count].keyword ).wait('body')
                    .wait(10000)
                    //.click('a#video-title:nth-child(4)')
                    .click('#contents > ytd-video-renderer:nth-child('+loopcount+') > #dismissable > ytd-thumbnail a#thumbnail ')
                    .wait(10000)
                    .scrollTo(400, 0)
                    .wait('yt-formatted-string#simplebox-placeholder')
                    .click('yt-formatted-string#simplebox-placeholder')
                    .wait(10000)
                    .scrollTo(400, 0)
                    .wait('yt-formatted-string#simplebox-placeholder')
                    .click('yt-formatted-string#simplebox-placeholder')
                    .wait(4000)
                    .wait('#textarea')
                    .type('#textarea',data.message)
                    .wait(5000)
                    .click('ytd-button-renderer#submit-button').wait(5000)
                    .exists('#footer-message.footer-error-message')
                    .then(function(ifExist)
                    {

                        var x = count;
                        //console.log("url: " + result )

                        if (!ifExist) {
                            console.log('Existing');
                            if (loopcount < data.loopcount) {
                                console.log(x);
                                return searchLoop(nightmare, rows, x, data, loopcount + 1);

                            }
                            else {
                                connection.query(updatequeryYes, [rows[count].id], function (err, results) {
                                    io.emit('searchUpdate', "Result : Done Commenting <br>" + JSON.stringify(results));
                                    console.log(results);
                                });
                                return searchLoop(nightmare, rows, x + 1, data, 0)

                            }
                        }
                        else {
                            io.emit('checkIfAccountReported',userrows[usercount].emailaddress)
                            console.log('ACCOUNT REPORTED');

                            return start(nightmare,rows,count,data,loopcount,userrows,usercount+1);
                        }
                    })
                    .catch((error) => {

                    var x = count++;
                    console.log("Catch Error FAILED. RESTARTING....." )

                    /* connection.query(updatequeryNo,[keywords[x].id],function(err,results){
                     io.emit('searchUpdate',"Result :" + "User Doesn't Exist."  + "<br>" + JSON.stringify(results));
                     console.log(results);
                     });*/
                    if (loopcount < data.loopcount) {

                        return searchLoop(nightmare, rows, x, data,loopcount+1);
                    }
                    else
                    {
                        connection.query(updatequeryYes,[rows[count].id],function(err,results){
                            io.emit('searchUpdate',"Result : Done Commenting <br>" + JSON.stringify(results));
                            console.log(results);
                        });
                        return searchLoop(nightmare, rows, x+1, data,0);

                    }
        });
        }





    });
});

//start our web server and socket.io server listening

/*server.listen(5000, function(){
    console.log('listening on *:5000');
    console.log(korText)
});*/




server.listen( PORT, "127.0.0.1", 34, function(){
    console.log( "Server listening on port:%s", PORT );
});