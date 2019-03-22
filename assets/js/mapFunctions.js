'use strict';
// Make collapsed navigation scroll
function mobileNavScroll() {
    $(".navbar-collapse").css({maxHeight: $(window).height() - $(".navbar-header").height() + "px"});
}

// Set max height of pop-up window 
function setPopupMaxHeight(windowArea) {
    var maxHeight;
    if (windowArea < 315000 ) {
        maxHeight = 150;
    } else {
        maxHeight = 500;
    }
    return maxHeight;
}

// Set max width of pop-up window 
function setPopupMaxWidth(windowWidth) {
    var maxWidth;
    if (windowWidth < 450 ) {
        maxWidth = 240;
    } else {
        maxWidth = 300;
    }
    return maxWidth;
}


/**********************
*** Event Listeners ***
***********************/

$(document).ready(function(){
    mobileNavScroll();
    
    // Basemap changed
    // could use for zoom to muni
	$("#selectMuni").on("change", function(e) {
        zoomToMuni($(this).val());
    });
    
    // Search
    var input = $(".geocoder-control-input");
    input.focus(function(){
        $("#panelSearch .panel-body").css("height", "150px");
    });
    input.blur(function(){
        $("#panelSearch .panel-body").css("height", "auto");
    });
    
    // Attach search control for desktop or mobile
    function attachSearch() {
        var parentName = $(".geocoder-control").parent().attr("id"),
            geocoder = $(".geocoder-control"),
            width = $(window).width();
        if (width <= 767 && parentName !== "geocodeMobile") {
            geocoder.detach();
            $("#geocodeMobile").append(geocoder);
        } else if (width > 767 && parentName !== "geocode"){
            geocoder.detach();
            $("#geocode").append(geocoder);
        }
    }
    
    $(window).resize(function() {
        mobileNavScroll();
        attachSearch();
    });
    
    attachSearch();
});