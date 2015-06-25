var express = require('express');
var app = express();

var serverState = 'inactive';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/serverState', function (request, response) {
    writeServerState(response);
});

function writeServerState(response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    var jsonObject = {state: serverState};
    var json = JSON.stringify(jsonObject);
    response.end(json);
}
app.post('/serverState', function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        if (body.length > 1e6)
            request.connection.destroy();
        var newServerState = JSON.parse(body).state;
        if (newServerState != undefined && newServerState != "") {
            serverState = newServerState;
        }
        writeServerState(response);
    });
});

app.get('/currentTimestamp', function (request, response) {
    response.send('' + Date.now());
});

app.get('/', function (request, response) {
    response.send('Hello World!');
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
