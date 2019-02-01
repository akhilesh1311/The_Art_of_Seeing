$(document).ready(function() {

    var $toggleButton = $('.toggle-button'),
        $menuWrap = $('.menu-wrap'),
        $sidebarArrow = $('.sidebar-menu-arrow');

    var menuPanelOpen = false;

    // Hamburger button

    $toggleButton.on('click', function() {

        var t1 = new TimelineLite();

        if (!menuPanelOpen) {
            t1.to('.menu-wrap', 1, {x:-260, ease: Bounce.easeOut}, 0);
            t1.to('.menu-bar-bottom', 0.5, {rotation:315, transformOrigin:"0% 50%"}, 0.1);
            t1.to('.menu-bar-middle', 0.5, {y:100, rotation: -360, autoAlpha:0, transformOrigin:"50% 50%"}, 0.2);
            t1.to('.menu-bar-top', 0.5, {rotation:-315, transformOrigin:"0% 50%"}, 0.3);
            menuPanelOpen = true;
        } else {
            t1.to('.menu-wrap', 1, {x:0, ease: Back.easeIn.config(2)}, 0);
            
            t1.to('.menu-bar-top', 0.5, {rotation:0, transformOrigin:"0% 50%"}, 0.1);
            t1.to('.menu-bar-middle', 0.5, {y:0, rotation:0, autoAlpha:1, transformOrigin:"50% 50%"}, 0.2);
            t1.to('.menu-bar-bottom', 0.5, {rotation:0, transformOrigin:"0% 50%"}, 0.3);

            menuPanelOpen = false;
        }
    });
});