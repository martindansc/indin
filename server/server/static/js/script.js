var data = [];
data[0]= {};
data[1]= {};
data[2]= {};

var hist = [];

var canvas;
var ctx_i;

var colors = [
    "blue", "red", "green"
]

function deleteLine(index) {
    $("#fila" + index).remove();
}

function draw(){
    var c = document.getElementById("myCanvas");
    if (c.getContext) {
        var ctx = c.getContext('2d');
        canvas = c;

        ctx_i = ctx;

        ctx.clearRect(0, 0, c.width, c.height);
        
        ctx.fillStyle = "#e67300";  
        ctx.fillRect(130, 75, 200, 70);
        ctx.clearRect(135, 80, 190, 60);
        ctx.fillStyle = "#ffbf80";
        ctx.fillRect(133, 78, 194, 64);

        ctx.fillStyle = "#e67300";  
        ctx.fillRect(430, 75, 200, 70);
        ctx.clearRect(435, 80, 190, 60);
        ctx.fillStyle = "#ffbf80";
        ctx.fillRect(433, 78, 194, 64);
       
        ctx.fillStyle = "#e67300";  
        ctx.fillRect(130, 200, 525, 70);
        ctx.clearRect(135, 205, 515, 60);
        ctx.fillStyle = "#ffbf80";
        ctx.fillRect(133, 203, 519, 64);
      }
}

function drawDot(i, x, y, radius){
    ctx_i.beginPath();
    ctx_i.fillStyle = colors[i];
    ctx_i.arc(x, y, radius, 0, 4 * Math.PI, true);
    ctx_i.fill();
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

var selected = 0;

function printDetail(id) {
    document.getElementById("gender").innerHTML = data[id].gender;
    document.getElementById("time").innerHTML = data[id].time;
    document.getElementById("section").innerHTML = data[id].section;
    document.getElementById("distance").innerHTML = Math.round(data[id].distance * 100) / 100;
    document.getElementById("surface").innerHTML = Math.round(data[id].surface * 100) / 100;
}

function fillData(){

    for(var i = 0; i < data.length; i++) {
        document.getElementById("id" + (i + 1)).innerHTML = data[i].id;
        document.getElementById("percentage" + (i + 1)).innerHTML = Math.round(data[i].percentage * 100) / 100;

        for(var j = 0; j < hist.length; j++) {
            var hist_data = hist[j];
            drawDot(i, hist_data[i].positionx*canvas.width/4, hist_data[i].positiony*canvas.height/3, 4);
        }

        drawDot(j, data[i].positionx*canvas.width/4, data[i].positiony*canvas.height/3, 10);

        printDetail(selected);
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
                    var selected_id = id.split("_")[1];
                    selected = selected_id;
                    printDetail(selected);
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
    data = new Array();
    for(var i = 0; i < updated_data.length; i++) {
        var id = updated_data[i].id.split("_")[1];
        data[id] = updated_data[i];
    }
    hist.push(data);
    draw();
    fillData();
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

var counter = 219;
var max = 219;
var minutes;


function playVideo(id) {
    var video = document.getElementById(id);
    video.pause();
    video.currentTime = 0;
    video.load();
    video.play();
}

function play(){
    counter = 0;
    draw();

    hist = [];

    // restart the video
    playVideo("myVideo");
    playVideo("myVideo2");
}

var i = setInterval(function() {

    var video = document.getElementById("myVideo");
	if(video.readyState > 0) {
        var minutes = video.duration;
        
        setInterval(function(){
            if(counter < max) {
                chatSocket.send(JSON.stringify({
                    'message': counter
                }));
                counter++;
            }
        }, minutes*1000 / max);

		clearInterval(i);
	}
}, 200);


function toggle() {

}