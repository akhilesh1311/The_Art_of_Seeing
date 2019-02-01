var t1 = new TimelineLite();
var autoplay = false;
var numTriangles = 50;

$("#slider_rotate").slider({
    min: -180,
    max: 180,
    step: 5,
    change: function() {
        var angle = $("#slider_rotate").slider("value");
        $("#text_rotate").text("Rotation: " + angle + " degrees");
        t1.clear();
        t1.to("svg#trianglesvg g#layer1", 3, {rotation:angle, transformOrigin:"50% 50%"})        
    },
    slide: function(){$("#autoplay").prop('checked', false);}
})
.slider("pips");

$("#autoplay").click(function() {
    if (!autoplay) {
        t1.clear();
        t1.to("svg#trianglesvg g#layer1", 10, {rotation:360, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1});
        autoplay = true;
        $("#button_icon").removeClass( "glyphicon glyphicon-play" ).addClass( "glyphicon glyphicon-pause" );
    } else {
        t1.clear();
        var angle = $("#slider_rotate").slider("value");
        t1.set("svg#trianglesvg g#layer1", {rotation:angle, transformOrigin:"50% 50%"});
        autoplay = false;
        $("#button_icon").removeClass( "glyphicon glyphicon-pause" ).addClass( "glyphicon glyphicon-play" );
    }
});

$("input[name=square_colour]").change(function() {
    var colour = $("input[name=square_colour]:checked").val();
    
    if (colour == "redandblue") {
        d3.select("svg#trianglesvg g#layer0")
            .selectAll("path")
            .attr("class", "styleBlue");

        d3.select("svg#trianglesvg g#layer1")
            .selectAll("path")
            .attr("class", "styleRed");                
    } else if (colour == "black") {
        d3.select("svg#trianglesvg g#layer0")
            .selectAll("path")
            .attr("class", "styleBlack");

        d3.select("svg#trianglesvg g#layer1")
            .selectAll("path")
            .attr("class", "styleBlack");        
    }        
});

$("#number_triangles").change(function() {
    numTriangles = parseInt($("#number_triangles").val());  

    t1.clear();
    d3.selectAll("svg#trianglesvg g").remove();

    drawLayers();    
});

function drawLayers(){
    d3.select("svg#trianglesvg").attr("viewBox", "0 0 " + numTriangles * 2 + " " + numTriangles * 2);    
    
    var layer0 = d3.select("svg")
                    .append("g")
                    
                    .attr("id", "layer0");
    var layer1 = d3.select("svg")
                    .append("g")
                    .attr("id", "layer1");

    for (var i=0; i<numTriangles; i++) {
        for (var j=0; j<numTriangles; j++) {
        
            layer0
            .append("path")
            .attr("class", "styleBlack")
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(2))
            .attr("transform", "translate(" + (j * 2 + i % 2) + "," + (i * 2) + ")");
            
            layer1
            .append("path")
            .attr("class", "styleBlack")
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(2))
            .attr("transform", "translate(" + (j * 2 + i % 2) + "," + (i * 2) + ")");
        }
    }
}

$(document).ready(function() {
    drawLayers();
});
