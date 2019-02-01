var t1 = new TimelineLite();
var numberDots = 2000,
    dotSize = 0.4,
    layerScale = 1,
    colour = "redandblue";

$("#number_dots").change(function() {
    numberDots = parseInt($("#number_dots").val());
    
    t1.clear();
    d3.selectAll("svg#dotsvg g").remove();
    
    $("#slider_rotate").slider("option", "value", 0);
    $("#slider_translate_x").slider("option", "value", 0);
    $("#slider_translate_y").slider("option", "value", 0);
    
    drawLayers();
});

$("#dot_size").change(function() {
    dotSize = parseFloat($("#dot_size").val());
    
    d3.select("svg#dotsvg")
        .selectAll("circle")
        .attr("r", dotSize);
});

$("#layer_scale").change(function() {
    layerScale = parseFloat($("#layer_scale").val());

    t1.clear();
    d3.selectAll("svg#dotsvg g").remove();
    
    $("#slider_rotate").slider("option", "value", 0);
    $("#slider_translate_x").slider("option", "value", 0);
    $("#slider_translate_y").slider("option", "value", 0);
    
    drawLayers();
});


$("input[name=dot_colour]").change(function() {
    colour = $("input[name=dot_colour]:checked").val();
    
    if (colour == "redandblue") {
        d3.select("svg#dotsvg g#layer0")
            .selectAll("circle")
            .attr("class", "styleBlue");

        d3.select("svg#dotsvg g#layer1")
            .selectAll("circle")
            .attr("class", "styleRed");
    } else if (colour == "black") {
        d3.select("svg#dotsvg g#layer0")
            .selectAll("circle")
            .attr("class", "styleBlack");

        d3.select("svg#dotsvg g#layer1")
            .selectAll("circle")
            .attr("class", "styleBlack");        
    }        
});

$("#slider_rotate").slider({
    min: -15,
    max: 15,
    change: function() {
        var angle = $("#slider_rotate").slider("value");
        $("#text_rotate").text("Rotation: " + angle + " degrees");
        t1.clear();
        t1.to("svg#dotsvg g#layer1", 2, {rotation:angle, transformOrigin:"50% 50%"})
    }
})
.slider("pips");

$("#slider_translate_x").slider({
    min: -10,
    max: 10,
    change: function() {
        var distance = $("#slider_translate_x").slider("value");
        $("#text_translate_x").text("Translate X: " + distance);
        t1.clear();
        t1.to("svg#dotsvg g#layer1", 2, {x:distance, transformOrigin:"50% 50%"})
    }
})
.slider("pips");

$("#slider_translate_y").slider({
    min: -10,
    max: 10,
    change: function() {
        var distance = $("#slider_translate_y").slider("value");
        $("#text_translate_y").text("Translate Y: " + distance);
        t1.clear();
        t1.to("svg#dotsvg g#layer1", 2, {y:distance, transformOrigin:"50% 50%"})
    }        
})
.slider("pips");    

function drawLayers() {    
    var layer0 = d3.select("svg#dotsvg")
                    .append("g")
                    .attr("id", "layer0");
                    
    var layer1 = d3.select("svg#dotsvg")
                    .append("g")
                    .attr("id", "layer1");
        
    for (var j=0; j<numberDots; j++) {
        
        var xPosition = Math.random() * 100;
        var yPosition = Math.random() * 100;
    
        layer0
        .append("circle")
        .attr("class", function(d) { if (colour == "redandblue") return "styleBlue"; else return "styleBlack";})
        .attr("cx", xPosition)
        .attr("cy", yPosition)
        .attr("r", dotSize);

        layer1
        .append("circle")
        .attr("class", function(d) { if (colour == "redandblue") return "styleRed"; else return "styleBlack";})
        .attr("cx", (xPosition -50) * layerScale + 50)
        .attr("cy", (yPosition -50) * layerScale + 50)
        .attr("r", dotSize);
        
    }
}

$(document).ready(function() {
    drawLayers();
});
