var t1 = new TimelineLite();
var autoplay = false;
var numSquares = 50;

$("#slider_rotate").slider({
    min: -90,
    max: 90,
    step: 5,
    change: function() {
        var angle = $("#slider_rotate").slider("value");
        $("#text_rotate").text("Rotation: " + angle + " degrees");
        t1.clear();
        t1.to("svg#squaresvg g#layer1", 3, {rotation:angle, transformOrigin:"50% 50%"})        
    },
    slide: function(){$("#autoplay").prop('checked', false);}
})
.slider("pips");

$("#autoplay").click(function() {
    if (!autoplay) {
        t1.clear();
        t1.to("svg#squaresvg g#layer1", 6, {rotation:180, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1});
        autoplay = true;
        $("#button_icon").removeClass( "glyphicon glyphicon-play" ).addClass( "glyphicon glyphicon-pause" );
    } else {
        t1.clear();
        var angle = $("#slider_rotate").slider("value");
        t1.set("svg#squaresvg g#layer1", {rotation:angle, transformOrigin:"50% 50%"});
        autoplay = false;
        $("#button_icon").removeClass( "glyphicon glyphicon-pause" ).addClass( "glyphicon glyphicon-play" );
    }
});

$("input[name=square_colour]").change(function() {
    var colour = $("input[name=square_colour]:checked").val();
    
    if (colour == "redandblue") {
        d3.select("svg#squaresvg g#layer0")
            .selectAll("rect")
            .attr("class", "styleBlue");

        d3.select("svg#squaresvg g#layer1")
            .selectAll("rect")
            .attr("class", "styleRed");                
    } else if (colour == "black") {
        d3.select("svg#squaresvg g#layer0")
            .selectAll("rect")
            .attr("class", "styleBlack");

        d3.select("svg#squaresvg g#layer1")
            .selectAll("rect")
            .attr("class", "styleBlack");
    }        
});

$("#number_squares").change(function() {
    numSquares = parseInt($("#number_squares").val());  

    t1.clear();
    d3.selectAll("svg#squaresvg g").remove();

    drawLayers();    
});

function drawLayers() {
    d3.select("svg#squaresvg").attr("viewBox", "0 0 " + numSquares + " " + numSquares);
    
    var layer0 = d3.select("svg#squaresvg")
                    .append("g")
                    .attr("id", "layer0");
                    
    var layer1 = d3.select("svg#squaresvg")
                    .append("g")
                    .attr("id", "layer1");
        
    for (var i=0; i<numSquares; i++) {
        for (var j=0; j<numSquares / 2; j++) {          
            layer0
            .append("rect")
            .attr("class", "styleBlack")
            .attr("x", j * 2 + i % 2)
            .attr("y", i)
            .attr("width", 1)
            .attr("height", 1);
            
            layer1
            .append("rect")
            .attr("class", "styleBlack")
            .attr("x", j * 2 + i % 2)
            .attr("y", i)
            .attr("width", 1)
            .attr("height", 1);            
        }
    }
}

$(document).ready(function() {
    drawLayers();
});
