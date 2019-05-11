var data = new Array();
data[0]= new Array();
data[1]= new Array();
data[2]= new Array();

function deleteLine(index) {
    $("#fila" + index).remove();
}

function draw(){
    //alert("Hello! I am an alert box!!");
    var c = document.getElementById("myCanvas");
    if (c.getContext) {
        var ctx = c.getContext('2d');
        
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

function drawDot(){
    ctx.beginPath();
    ctx.fillStyle = "#e67300";
    ctx.arc(20, 20, 15, 0, 4 * Math.PI, true);
    ctx.stroke();
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

function fillData(){
    document.getElementById("id1").innerHTML = data[0].id;
    document.getElementById("percentage1").innerHTML = data[0].percentage;

    document.getElementById("id2").innerHTML = data[1].id;
    document.getElementById("percentage2").innerHTML = data[1].percentage;

    document.getElementById("id3").innerHTML = data[2].id;
    document.getElementById("percentage3").innerHTML = data[2].percentage;

    document.getElementById("gender").innerHTML = data[0].gender;
    document.getElementById("time").innerHTML = data[0].time;
    document.getElementById("distance").innerHTML = data[0].distance;
    document.getElementById("surface").innerHTML = data[0].surface;
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
                    alert("id:" + id);
                    console.log(id)

                };
            };
        currentRow.onclick = createClickHandler(currentRow);
    }
}

