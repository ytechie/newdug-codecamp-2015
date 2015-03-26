var Q = require("q");
var eventHubs = require('eventhubs-js');
var easyConfig = require('easy-config');

//Don't use your key in real development. Use a generated SAS token!

var config = easyConfig.loadConfig();

if (!config.EventHubsNamespace) {
    throw new Error("Config file not found, or you forgot to set the namespace in the config.");
}

testSendContinuous();
    
function sendRandomData() {
    var deferral = Q.defer();
    
    var payload = {
        Timestamp: new Date(),
        Temperature: (Math.random() * 100) + 1,
        Humidity: Math.random()
    }
    
    eventHubs.sendMessage({
        message: payload,
        deviceId: 1
    }).then(function () {
        console.log('Sent ' + JSON.stringify(payload));
        deferral.resolve();
    }).catch(function (error) {
        console.log('Error sending message: ' + error);
        deferral.reject(error);
    }).done();
    
    return deferral.promise;
}


function testSendContinuous() {
    eventHubs.init({
        hubNamespace: config.EventHubsNamespace,
        hubName: config.EventHubsHubName,
        keyName: config.EventHubsKeyName,
        key: config.EventHubsKey
    });
    
    setInterval(sendRandomData, 1000);
}