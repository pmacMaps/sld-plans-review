'use strict';

// Attach search control for desktop or mobile
// remove jQuery [future step]
const attachSearch = () => {
    const parentName = $(".geocoder-control").parent().attr("id"),
    geocoder = $(".geocoder-control"),
    width = $(window).width();

    if (width < 992 && parentName !== "geocodeMobile") {
        geocoder.detach();
        $("#geocodeMobile").append(geocoder);
    } else if (width >= 992 && parentName !== "geocode"){
        geocoder.detach();
        $("#geocode").append(geocoder);
    }
}

/*** Navigation Modal Windows ***/
// Open Search info window
$("#search-btn").click(function() {
    $('#searchModal').modal('show');
});

// Open About info window
$("#about-btn").click(function() {
    $('#aboutModal').modal('show');
});

// Open Legend info window
$("#legend-btn").click(function() {
    $('#legendModal').modal('show');
});

// Open Discliamer info window
$("#disclaimer-btn").click(function() {
    $('#disclaimerModal').modal('show');
});

// open standard filter window
$("#std-filter-btn").click(function() {
    $('#filterModal').modal('show');
});

// Open filter by year info window
$("#year-filter-btn").click(function() {
    $('#filterYearModal').modal('show');
});

// Open filter by mulitple years info window
$("#multi-year-filter-btn").click(function() {
    $('#filterMultiYearModal').modal('show');
});

// Open municipal zoom info window
$("#muni-zoom-btn").click(function() {
    $('#muniZoomModal').modal('show');
});

// reset default value
const resetDefaultOptionElement = (id) => {
    // construct selector
    const selector = '#' + id + ' option';
    // reset default option
    $(selector).prop('selected', function() {
        return this.defaultSelected;
    });
};

// set filter dates in user interface widget
const setFilterUIWidgetContent = (startDate,endDate) => {
    // start date span
    const startDateSpan = document.getElementById('startDateUI');
    // end date span
    const endDateSpan = document.getElementById('endDateUI');

    // set values
    startDateSpan.innerHTML = startDate;
    endDateSpan.innerHTML = endDate;
};

/* Document Ready */
$(document).ready(function() {
    // zoom to muni widget
	$("#selectMuni").on("change", function(e) {
        zoomToMuni($(this).val());
    });

    attachSearch();

    $(window).resize(function() {
        attachSearch();
    });
});