var t1 = new TimelineLite();     
var numberSpikeCircles = 3,
    spikesBigCircles = 30,
    animationType = "translate_and_rotate";
var autoplay = true;

$("#number_spike_circles").change(function() {
    numberSpikeCircles = parseInt($("#number_spike_circles").val());
    redrawMoire();
});

$("#spikes_big_circles").change(function() {
    spikesBigCircles = parseInt($("#spikes_big_circles").val()) / 2;
    redrawMoire();
});      

$("#animation_type").change(function() {
    animationType = $("#animation_type").val();
    redrawMoire();
});

$("#autoplay2").click(function() {
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
    d3.selectAll("svg#moireAnimation2 g").remove();
    
    createMoireSpikes();
    animateMoireSpikes();

     if (!autoplay) {
        t1.play();
        autoplay = true;
        $("#button_icon").removeClass( "glyphicon glyphicon-play" ).addClass( "glyphicon glyphicon-pause" );
    }       
}

function createMoireSpikes() {    
    for (var i=0; i<numberSpikeCircles; i++) {
        var moireArc = d3.select("svg#moireAnimation2")
                    .append("g")
                    .attr("id", "moire_arc_group" + i);
        
        for (var j=0; j<spikesBigCircles; j++) {
            var element = moireArc.append("g")
                .attr("transform", "rotate(" + (180/spikesBigCircles * j) + ")")
                
            element.append("path")
                .attr("class", "arc_single")
                .attr("d", "M 0,0 L 0,2 A 2,2 0 0,0 0.10467,1.99726 L -0.10467,-1.99726 A 2,2 0 0,1 0,-2 L 0,0");
        }
    }           
}

function animateMoireSpikes() {
    t1.set("#moire_arc_group1", {autoAlpha:0});
    t1.set("#moire_arc_group2", {autoAlpha:0});
    t1.set("#moire_arc_group3", {autoAlpha:0});
    t1.staggerFrom("#moire_arc_group0 g", 1, {autoAlpha:0}, 0.05, 0);

    t1.set("#moire_arc_group1", {autoAlpha:1}, spikesBigCircles * 0.05 + 0.5);
    t1.set("#moire_arc_group2", {autoAlpha:1}, spikesBigCircles * 0.05 + 0.5);
    t1.set("#moire_arc_group3", {autoAlpha:1}, spikesBigCircles * 0.05 + 0.5);
    t1.to("#moire_arc_group0", 2.5, {x:-1, ease: Power1.easeInOut}, spikesBigCircles * 0.05 + 1)
      .to("#moire_arc_group1", 2.5, {x:1, ease: Power1.easeInOut}, spikesBigCircles * 0.05 + 1)
      .to("#moire_arc_group2", 2.5, {y:1, ease: Power1.easeInOut}, spikesBigCircles * 0.05 + 1)
      .to("#moire_arc_group3", 2.5, {y:-1, ease: Power1.easeInOut}, spikesBigCircles * 0.05 + 1);

    t1.to("#moire_arc_group0", 8, {x:1, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4)
      .to("#moire_arc_group1", 8, {x:-1, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4)
      .to("#moire_arc_group2", 8, {y:-1, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4)
      .to("#moire_arc_group3", 8, {y:1, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4);

    if (animationType == "translate_and_rotate") {
        t1.to("#moire_arc_group0", 8, {rotation:720, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4)
          .to("#moire_arc_group1", 8, {rotation:720, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4)
          .to("#moire_arc_group2", 8, {rotation:720, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4)
          .to("#moire_arc_group3", 8, {rotation:720, transformOrigin:"50% 50%", ease: Power1.easeInOut, repeat:-1, yoyo:true}, spikesBigCircles * 0.05 + 4);
    }
}

$(document).ready(function() {
    createMoireSpikes();
    animateMoireSpikes();
})