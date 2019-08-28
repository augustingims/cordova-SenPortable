var  database = window.openDatabase('senportable', '0.1', 'senportable', 65536);

var retour = document.getElementById("retour");

var map, marker;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        screen.orientation.lock('portrait');
        screen.orientation.unlock();
        
        selectValue();
        
        
    }

};

app.initialize();

function initMap(latd,lon) {
    var geo = {lat: latd, lng: lon};
    map = new google.maps.Map(document.getElementById('map'), {zoom: 13, center: geo});
    marker = new google.maps.Marker({position: geo, map: map});
}

function selectValue(){
    var query = 'SELECT * FROM coordonnees where id = 1';
    database.transaction(function(tx){
        tx.executeSql(query, [], function(tx, result)
        {
            if(result.rows.length > 0){
                lon = result.rows[0].longitude;
                lat = result.rows[0].latitude;
                initMap(Number(lat),Number(lon));
                console.log(result.rows);
            }else{
                window.alert("Les informations n'ont ete sauvegardees");
            }
        },
        function(tx,error){
            console.log(error);
            console.log(tx);
        });
    });
}

retour.onclick = function() {
    window.history.back();
}