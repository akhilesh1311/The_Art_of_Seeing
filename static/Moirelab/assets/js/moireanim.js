var t2 = new TimelineLite();
var numberTriangles = 50;
    numberCircles = 3;
    
function createMoireTriangles() {

    var allTriangle = d3.select("svg#mainAnimation");
    
    for (var i=0; i < numberCircles; i++) {
        var circleLayer = allTriangle
                    .append("g")
                    .attr("id", "moire_anim_main" + i);
        
        for (var j=0; j < numberTriangles; j++) {
            circleLayer
            .append("path")
            .attr("class", "triangleStyle")
            .attr("d", "M 183.13844,172 16.861561,172 100,28 Z")
            .attr("transform", "rotate(" + (360/numberTriangles * j) + " 0 0) scale(" + (i / numberCircles + 0.6) + ")");
        }
    }        
}

function animateMoireTriangles() {    
    t2.staggerFrom("#moire_anim_main0 path", 3, {autoAlpha:0}, 0.05, 0)
      .staggerFrom("#moire_anim_main1 path", 3, {autoAlpha:0}, 0.05, 1)
      .staggerFrom("#moire_anim_main2 path", 3, {autoAlpha:0}, 0.05, 2);
    
    t2.to("#moire_anim_main0", 3, {rotation:360, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:2, yoyo:true}, 6)
      .to("#moire_anim_main1", 3, {rotation:-360, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:2, yoyo:true}, 6)
      .to("#moire_anim_main2", 3, {rotation:360, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:2, yoyo:true}, 6);
}

$(document).ready(function() {
    createMoireTriangles();
    animateMoireTriangles();
});    
