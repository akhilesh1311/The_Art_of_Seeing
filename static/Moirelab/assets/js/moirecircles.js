var t1 = new TimelineLite();
var numberBigCircles = 5,
    depthBigCircles = 40,
    zoomFactor = 1;
var autoplay = true;

$("#number_big_circles").change(function() {
    numberBigCircles = parseInt($("#number_big_circles").val());
    redrawMoire();
});  

$("#depth_big_circles").change(function() {
    depthBigCircles = parseInt($("#depth_big_circles").val());
    redrawMoire();
});  

$("#zoom_factor").change(function() {
    zoomFactor = $("#zoom_factor").val();
    redrawMoire();
});

$("#autoplay1").click(function() {
    if (!autoplay) {
        t1.play();
        autoplay = true;
        $("#button_icon").removeClass( "glyphicon glyphicon-play" ).addClass( "glyphicon glyphicon-pause" );
    } else {
        t1.pause();
        autoplay = false;
        $("#button_icon").removeClass( "glyphicon glyphicon-pause" ).addClass( "glyphicon glyphicon-play" );
    }
});

function redrawMoire() {
    t1.clear();
    d3.selectAll("svg#moireAnimation1 g").remove();
    
    createMoireCircles();
    animateMoireCircles();

     if (!autoplay) {
        t1.play();
        autoplay = true;
        $("#button_icon").removeClass( "glyphicon glyphicon-play" ).addClass( "glyphicon glyphicon-pause" );
    }       
}

function createMoireCircles() {

    var allCircle = d3.select("svg#moireAnimation1")
                    .append("g")
                    .attr("id", "all_circle");

    for (var i=0; i < numberBigCircles; i++) {
        var moireCircle = allCircle
                    .append("g")
                    .attr("id", "moire_circle" + i);
        
        for (var j=0; j<depthBigCircles; j++) {
            moireCircle
            .append("circle")
            .attr("class", "circleStyle")
            .attr("cx", "0")
            .attr("cy", "0")
            .attr("r", (j/depthBigCircles * 2 * zoomFactor));
        }
    }
    
}

function animateMoireCircles() {

    t1.staggerFrom("#moire_circle0 circle", 3, {x:-2.5, autoAlpha:0, scale:0, transformOrigin:"50% 50%"}, 0.1, 0)
      .staggerFrom("#moire_circle1 circle", 3, {x:2.5, autoAlpha:0, scale:0, transformOrigin:"50% 50%"}, 0.1, 0)
      .staggerFrom("#moire_circle2 circle", 3, {y:2.5, autoAlpha:0, scale:0, transformOrigin:"50% 50%"}, 0.1, 0)
      .staggerFrom("#moire_circle3 circle", 3, {y:-2.5, autoAlpha:0, scale:0, transformOrigin:"50% 50%"}, 0.1, 0)
      .staggerFrom("#moire_circle4 circle", 3, {autoAlpha:0, scale:0, transformOrigin:"50% 50%"}, 0.1, 0);
    
    t1.to("#moire_circle0", 5, {x:-1.5, ease: Power1.easeInOut, repeat:-1, yoyo:true}, 3 + depthBigCircles * 0.1)
      .to("#moire_circle1", 5, {x:1.5, ease: Power1.easeInOut, repeat:-1, yoyo:true}, 3 + depthBigCircles * 0.1)
      .to("#moire_circle2", 5, {y:1.5, ease: Power1.easeInOut, repeat:-1, yoyo:true}, 3 + depthBigCircles * 0.1)
      .to("#moire_circle3", 5, {y:-1.5, ease: Power1.easeInOut, repeat:-1, yoyo:true}, 3 + depthBigCircles * 0.1);          
}

$(document).ready(function() {
    createMoireCircles();
    animateMoireCircles();
})