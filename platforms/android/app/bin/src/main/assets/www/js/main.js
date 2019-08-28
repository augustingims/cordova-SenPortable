var btn = document.getElementById("send");
var map = document.getElementById("mapshow");
var reflesh = document.getElementById("reflesh");

var latitude = document.getElementById("latitude");
var longitude = document.getElementById("longitude");
var ip = document.getElementById("ip");
var imei = document.getElementById("imei");

var database = null;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        initDatabase();
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        networkinterface.getWiFiIPAddress(onSuccess, onError);
        networkinterface.getCarrierIPAddress(onSuccess, onError);
        getIMEI();
        getPosition();
    }

};
  
app.initialize();

function initDatabase() {
    try{
        if(window.openDatabase){
            database = window.openDatabase('senportable', '0.1', 'senportable', 65536);
            database.transaction(function(transaction) {
              transaction.executeSql('CREATE TABLE coordonnees (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, latitude TEXT NOT NULL, longitude TEXT NOT NULL, ip TEXT NOT NULL, imei TEXT NOT NULL)');
            });
        }
    }catch(e){
        console.log(e);
    }
    
}

function executeQuery($query,callback){
    try{
        if(window.openDatabase){
            database.transaction(function(tx){
                tx.executeSql($query,[],function(tx,result){
                    if(typeof(callback) == "function"){
                            callback(result);
                    }else{
                            if(callback != undefined){
                                eval(callback+"(result)");
                            }
                    }
                },
                function(tx,error){
                    console.log(error);
                    console.log(tx);
                });
            });
        }
    }catch(e){
        console.log(e);
    }
}

function insertValue(){
    var sql = 'insert into coordonnees (latitude,longitude,ip,imei) VALUES ("'+latitude.value+'","'+longitude.value+'","'+ip.value+'","'+imei.value+'")';
    executeQuery(sql,function(results){console.log(results)});
}


function onSuccess(ipInformation) {
    $("#ip").val(ipInformation.ip);
}
  
function onError(error) {
    console.log(error);
}

reflesh.onclick = function() {
    window.location.reload();
}

btn.onclick = function() {
    if(verify()){
        insertValue();
    } else {
      window.alert("Actualiser l'application pour pour recuperer les informations requises.");
    }
    
}

map.onclick = function() {
    window.location = "map.html";
}

function getIMEI() { 
    cordova.plugins.IMEI(function (err, imei) {
        console.log('imei', imei);
        $("#imei").val(imei);
        console.log(err);
    });
}

function verify(){
    var ok = false;
    if(longitude!=null && longitude.value!=""){
      ok = true;
      $("#longitude").removeClass("invalid").addClass("valid");
    }else{
      $("#longitude").removeClass("valid").addClass("invalid");
      ok = false;
    } 
  
    if(latitude!=null && latitude.value!=""){
      ok = true;
      $("#latitude").removeClass("invalid").addClass("valid");
    }else{
      $("#latitude").removeClass("valid").addClass("invalid");
      ok = false;
    } 

    if(ip!=null && ip.value!=""){
        ok = true;
        $("#ip").removeClass("invalid").addClass("valid");
      }else{
        $("#ip").removeClass("valid").addClass("invalid");
        ok = false;
      } 

      if(imei!=null && imei.value!=""){
        ok = true;
        $("#imei").removeClass("invalid").addClass("valid");
      }else{
        $("#imei").removeClass("valid").addClass("invalid");
        ok = false;
      } 
    return ok;
}

function getPosition() { 
    var options = { enableHighAccuracy: true, maximumAge: 3600000 }

    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options); 

    function onSuccess(position) { 
        $("#latitude").val(position.coords.latitude);
        $("#longitude").val(position.coords.longitude);
    }; 

    function onError(error) { 
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n'); 
    } 
}