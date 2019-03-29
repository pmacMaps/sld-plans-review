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
// create a legend element for a map service
function createMapLegend(url,element) {
	// legend plugin uses dynamic map layer object
	var dynamicMapService = L.esri.dynamicMapLayer({url: url});	
	dynamicMapService.legend(function(error, legend) {
		var html = '';
		if(!error) {
			for (var i = 0, len = legend.layers.length; i < len; i++) {
				html += '<ul>'
				html += '<li><strong>' + legend.layers[i].layerName + '</strong></li>';
				for(var j = 0, jj = legend.layers[i].legend.length; j < jj; j++){
					html += L.Util.template('<li><img width="{width}" height="{height}" src="data:{contentType};base64,{imageData}"><span>{label}</span></li>', legend.layers[i].legend[j]);
				}
				html += '</ul>';
			}
        } else {
			html+= '<h4>There was an error creating the legend</h4>';
		}		
		$(element).prepend(html);		
	});
}
// return text value from domain
function returnDomainText(value) {
    var landUse = null;    
    switch (value) {
            case 1:
                landUse = 'Residential';
                break;
            case 2:
                landUse = 'Commercial';
                break;
            case 3:
                landUse = 'Institutional';
                break;
            case 4:
                landUse = 'Industrial';
                break;
            case 5:
                landUse = 'Agriculture';
                break;
            case 6:
                landUse = 'Woodland';
                break;
            default:            
                landUse = 'Other';
            }
        return landUse;	
}
// Convert JSON date format to plain language format
function convertJSONDateToString(jsonDate) {
    var shortDate = null;
    if (jsonDate) {
        var regex = /-?\d+/;
        var matches = regex.exec(jsonDate);
        var dt = new Date(parseInt(matches[0]));
        var month = dt.getMonth() + 1;
        var monthString = month > 9 ? month : '0' + month;
        var day = dt.getDate();
        var dayString = day > 9 ? day : '0' + day;
        var year = dt.getFullYear();
        shortDate = monthString + '-' + dayString + '-' + year;
    }
    return shortDate;
}
// test for null or empty string values
function testforFiedlValues(field) {
    var returnVal;
    if (field !== null && field !== '') {
        returnVal = field;
    } else {
        returnVal = 'N/A';
    }
    return returnVal;
}
// re-format numbers with commas
function returnNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/*** Date Picker ***/
$( function() {
    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
        $('#dateErrorModal').modal('show');
      } 
      return date;
    }    
    var dateFormat = "mm/dd/yy",
      from = $( "#fromDate" )
        .datepicker({
          defaultDate: "0",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#toDate" ).datepicker({
        defaultDate: "0",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });    
  });
/*** Event Listeners ***/
$(document).ready(function(){
    // control if filter widget appears on screen
    function controlFilterWidgetUI() {
        var width = $(window).width();
        var elements = [$('#panelFilter'), $('#collapseFilter')];    
        if ( width <= 767) {
            // add or remove class
            for (var i = 0; i < elements.length; i++) {
                elements[i].attr("aria-expanded", "false");            
                if (elements[i].hasClass("in")) {
                    elements[i].removeClass("in");
                }
            }                  
        }
    }
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
    // zoom to muni widget
	$("#selectMuni").on("change", function(e) {
        zoomToMuni($(this).val());
    }); 
    // call functions    
    mobileNavScroll();
    controlFilterWidgetUI();    
    attachSearch();      
    // Search
    var input = $(".geocoder-control-input");
    input.focus(function(){
        $("#panelSearch .panel-body").css("height", "150px");
    });
    input.blur(function(){
        $("#panelSearch .panel-body").css("height", "auto");
    });    
    // resize event
    $(window).resize(function() {
        mobileNavScroll();
        attachSearch();        
    });    
});