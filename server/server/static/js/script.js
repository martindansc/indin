var data = new Array();
data[0]= {};
data[1]= {};
data[2]= {};

var canvas;
var ctx_i;

function deleteLine(index) {
    $("#fila" + index).remove();
}

function draw(){
    var c = document.getElementById("myCanvas");
    if (c.getContext) {
        var ctx = c.getContext('2d');
        canvas = c;

        ctx_i = ctx;
        
        ctx.fillStyle = "#e67300";  
        ctx.fillRect(100, 75, 200, 70);
        ctx.clearRect(105, 80, 190, 60);
        ctx.fillStyle = "#ffbf80";
        ctx.fillRect(103, 78, 194, 64);

        ctx.fillStyle = "#e67300";  
        ctx.fillRect(400, 75, 200, 70);
        ctx.clearRect(405, 80, 190, 60);
        ctx.fillStyle = "#ffbf80";
        ctx.fillRect(403, 78, 194, 64);
       
        ctx.fillStyle = "#e67300";  
        ctx.fillRect(100, 200, 525, 70);
        ctx.clearRect(105, 205, 515, 60);
        ctx.fillStyle = "#ffbf80";
        ctx.fillRect(103, 203, 519, 64);
      }
}

function drawDot(x, y){
    ctx_i.beginPath();
    ctx_i.fillStyle = "#e67300";
    ctx_i.arc(x, y, 15, 0, 4 * Math.PI, true);
    ctx_i.stroke();
}
function saveData(){

    data[0] = {
        id :  5566,
        percentage : "50%",
        gender : "Boy",
        section : "Girls section",
        velocity : 10,
        distance: 700,
        area : 1969,
        positionX : 50,
        positionY : 50,
        time: 50,
        surface: 80
      };

}

function printDetail(id) {
    document.getElementById("gender").innerHTML = data[id].gender;
    document.getElementById("time").innerHTML = data[id].time;
    document.getElementById("section").innerHTML = data[id].section;
    document.getElementById("distance").innerHTML = data[id].distance;
    document.getElementById("surface").innerHTML = data[id].surface;
}

function fillData(){
    for(var i = 0; i < data.length; i++) {
        document.getElementById("id" + (i + 1)).innerHTML = data[i].id;
        document.getElementById("percentage" + (i + 1)).innerHTML = data[i].percentage;
        drawDot(data[i].positionx*canvas.width/4, data[i].positiony*canvas.height/3);
    }
    
}

function hola(){
    var table = document.getElementById("informationTable");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                    var cell = row.getElementsByTagName("td")[0];
                    var id = cell.innerHTML;
                    printDetail(id.split("_")[1]);
                };
            };
        currentRow.onclick = createClickHandler(currentRow);
    }
}

var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/connect/');

chatSocket.onmessage = function(e) {
    var updated_data = JSON.parse(e.data);
    console.log(updated_data);
    data = updated_data;
    fillData();
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

var counter = 0;
var max = 1;

setInterval(function(){
    if(counter < max) {
        chatSocket.send(JSON.stringify({
            'message': counter
        }));
        counter++;
    }
}, 500);
