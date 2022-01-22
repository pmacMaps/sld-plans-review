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
});// Set max height of pop-up window
const setPopupMaxHeight = (windowArea) => {
    let maxHeight;
    if (windowArea < 315000 ) {
        maxHeight = 150;
    } else {
        maxHeight = 500;
    }
    return maxHeight;
};

// Set max width of pop-up window
const setPopupMaxWidth = (windowWidth) => {
    let maxWidth;
    if (windowWidth < 450 ) {
        maxWidth = 240;
    } else {
        maxWidth = 300;
    }
    return maxWidth;
};

// return text for map legend alt text
const returnAltTextForLegend = (layerName, layerLabel) => {
    let appendText;
    if (layerLabel === "" || layerLabel === " ") {
        appendText = layerName;
    } else {
        appendText = layerLabel;
    }
    const altText = `alt="legend icon representing ${appendText}"`;
    return altText;
};

// create a legend element for a map service
const createMapLegend = (url,element) => {
	// legend plugin uses dynamic map layer object
	const dynamicMapService = L.esri.dynamicMapLayer({url: url});
	dynamicMapService.legend(function(error, legend) {
		let html = '';
		if(!error) {
            legend.layers.forEach(element => {
                html += '<ul>'
                html += `<li><strong>${element.layerName}</strong></li>`;

                element.legend.forEach(item => {
                    const iconAlt = returnAltTextForLegend(element.layerName, item.label);

                    html += L.Util.template('<li><img ' + iconAlt + ' width="{width}" height="{height}" src="data:{contentType};base64,{imageData}"><span>{label}</span></li>', item);
                });

                html += '</ul>';

			});
        } else {
		    html+= '<h4>There was an error creating the legend</h4>';
        }
		$(element).prepend(html);
	});
};

// return text value from domain
const returnDomainText = (value) => {
    let landUse;
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
};

// Convert JSON date format to plain language format
const convertJSONDateToString = (jsonDate) => {
    let shortDate;
    if (jsonDate) {
        const regex = /-?\d+/;
        const matches = regex.exec(jsonDate);
        const dt = new Date(parseInt(matches[0]));
        const month = dt.getMonth() + 1;
        const monthString = month > 9 ? month : '0' + month;
        const day = dt.getDate();
        const dayString = day > 9 ? day : '0' + day;
        const year = dt.getFullYear();
        shortDate = `${monthString}-${dayString}-${year}`;
    }
    return shortDate;
};

// test for null or empty string values
const testforFiedlValues = (field, defaultValue) => {
    let returnVal;
    if (field !== null && field !== '') {
        returnVal = field;
    } else {
        returnVal = defaultValue;
    }
    return returnVal;
};

// re-format numbers with commas
const returnNumberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//  Basemap Changer
const zoomToMuni = (selectedMuni) => {
    // where clause
    const whereClause = `MUNI = '${selectedMuni}'`;
    const query = L.esri.query({
        url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Property_Assessment/Roads_Municipal_Boundaries/MapServer/0'
    });
    query.where(whereClause).bounds(function(error, latLngBounds, response) {
        if (error) {
            // add message to console
            console.warn('An error with the query request has occured');
            console.warn(`Code: ${error.code}; Message: ${error.message}`);
            // set content of results element
        } else if (response.features < 1) {
         // add message to console
         console.log('No features selected');
         // set content of results element
        } else {
            map.fitBounds(latLngBounds);
        }
    });
    // close basemap modal
    $('#muniZoomModal').modal('hide');
};

// function to handle load event for map services
const processLoadEvent = (service) => {
   // service request success event
   service.on('requestsuccess', function(e) {
      // set isLoaded property to true
      service.options.isLoaded = true;
   });
   // request error event
   service.on('requesterror', function(e) {
      // if the error url matches the url for the map service, display error messages
      // without this logic, various urls related to the service appear
      if (e.url == service.options.url) {
         // set isLoaded property to false
         service.options.isLoaded = false;
         // add warning messages to console
         console.warn(`Layer failed to load: ${service.options.url}`);
         console.warn(`Code: ${e.code}; Message: ${e.message}`);
         // close modal window
         $('#layerErrorModal').modal('show');
      }
   });
};

// set definition query for plan submissions layer
const setDateQuery = (dateStart,dateEnd) => {
    const definitionQuery = `DATE >= date '${dateStart}' AND DATE <= date '${dateEnd}'`;
    return definitionQuery;
};/*** Date Picker ***/
$(function() {
    // get user selected date from calendar ui
    const getDate = (element) => {
      let date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
        $('#dateErrorModal').modal('show');
      }
      return date;
    };
    // set date format
    const dateFormat = "mm/dd/yy",
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
});/*** Variables ***/
// viewport
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const windowArea = windowWidth * windowHeight;
// home coordinates
const homeCoords = [40.15, -77.25];

/*** Map & Controls ***/
// PA State Plane South (ft) projection
const spcPACrs = new L.Proj.CRS('EPSG:2272', '+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs',  {
    origin: [-1.192142E8, 1.461669E8],
    resolutions: [
      260.41666666666663,
      86.80555555555556,
      43.40277777777778,
      20.833333333333332,
      10.416666666666666,
      6.944444444444444,
      4.166666666666666,
      2.083333333333333,
      1.0416666666666665,
      0.5208333333333333
    ]
  });

const map = L.map('map', {
   center: homeCoords,
   zoom: 0,
   zoomControl: false,
   crs: spcPACrs,
   minZoom: 0,
   maxZoom: 8
});

// Zoom Home Control
const zoomHomeControl = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: homeCoords,
    homeZoom: 0
}).addTo(map);

// Full Screen Control
const fullscreenControl = new L.Control.Fullscreen({
  position: 'topleft'
}).addTo(map);// month and day for start date
const startDate = '01-01-';
// month and day for end date
const endDate = '12-31-';
// get current year to set definition query for Plan Submissions
const currentYear = new Date().getFullYear();
// initial start date
const intialStartDate = startDate + currentYear;
// initial end date
const initialEndDate = endDate + currentYear;
// definition query for plan submissions layer
const initialWhereClause = setDateQuery(intialStartDate,initialEndDate);

/*** Layers ***/
// 2020 Imagery - cached map service
const imagery2020 = L.esri.tiledMapLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Imagery/Imagery2020/MapServer',
    maxZoom: 8,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Cumberland County',
    errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
    isLoaded: false
  });

// Roads & Municipal Boundaries - cached map service
const roadsMunicipality = L.esri.tiledMapLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Property_Assessment/Roads_Municipal_Boundaries/MapServer',
    maxZoom: 8,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Cumberland County',
    errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
    isLoaded: false
  });

// Plan Review Features - map service
const planSubmissions = L.esri.featureLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Reviewed_SALDO_Plans_Public/MapServer/0',
    where: initialWhereClause,
    onEachFeature: function(feature, layer) {
        // Pop-up control for small screen sizes
        if (windowArea < 315000 ) {
            // Hide leaflet controls when pop-up opens
            layer.on('popupopen', function() {
                $('div.leaflet-top').css('opacity', 0);
                $('div.leaflet-bottom').css('opacity', 0);
            });
            // Display Leaflet controls when pop-up closes
            layer.on('popupclose', function() {
                $('div.leaflet-top').css('opacity', 1);
                $('div.leaflet-bottom').css('opacity', 1);
            });
        }
    },
    isLoaded: false
});

// format popup for plan review featres
planSubmissions.bindPopup(function(evt, layer) {
    // reformat date field value
    const jsonDate = evt.feature.properties.DATE;
    const formattedDate = convertJSONDateToString(jsonDate);
    // reformat land use coded domain value
    const landUseField = evt.feature.properties.LANDUSE;
    const formattedLandUse = returnDomainText(landUseField);
    // test for null values in square footage field
    const sqFtField = evt.feature.properties.SQFT;
    let sqFtVal = testforFiedlValues(sqFtField, 'N/A');
    // if value numeric, re-format
    if (sqFtVal !== 'N/A') {
        sqFtVal = returnNumberWithCommas(sqFtField);
    }
    // test for null values in units field
    const unitsField = evt.feature.properties.UNITS;
    const unitsVal = testforFiedlValues(unitsField, 'N/A');
    // test for null values in pdf plan link field
    const pdfLinkField = evt.feature.properties.PLNLINK;
    let pdfLinkVal = testforFiedlValues(pdfLinkField, 'Plan not available');

    if (pdfLinkVal !== 'Plan not available') {
        pdfLinkVal = `<a target="_blank" rel="noopener" href="${pdfLinkField}">View Electronic Plan</a>`;
    }

    // return popup content
    let popupContent = '<div class="feat-popup">';
    popupContent += '<h3><span class="gray-text">Plan Name:</span> {NAME}</h3>';
    popupContent += '<ul>';
    popupContent += `<li><span class="gray-text">Land Use:</span> ${formattedLandUse}</li>`;
    popupContent += `<li><span class="gray-text">Date Received:</span> ${formattedDate}</li>`;
    popupContent += `<li><span class="gray-text">Square Footage:</span> ${sqFtVal}</li>`;
    popupContent += `<li><span class="gray-text">Number of Proposed Units:</span> ${unitsVal}</li>`;
    popupContent += `<li><span class="gray-text">Plan & Comments (pdf):</span> ${pdfLinkVal}</li>`;
    popupContent += '</ul>';
    popupContent += '<h4><strong>Description:</strong></h4>';
    popupContent += '<p>{DESCRIPTION}</p>';
    popupContent += '</div>';
    return L.Util.template(popupContent, evt.feature.properties);
}, {closeOnClick: true, maxHeight: setPopupMaxHeight(windowArea), maxWidth: setPopupMaxWidth(windowWidth)});

// array of map services to run loading function on
const mapServices = [imagery2020,roadsMunicipality, planSubmissions];

// call load/error events function on layers
mapServices.forEach(element => processLoadEvent(element));
// add layers to map
mapServices.forEach(element => element.addTo(map));

// set UI widget
setFilterUIWidgetContent(intialStartDate,initialEndDate);

// Create Map Legend
createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Property_Assessment/Roads_Municipal_Boundaries/MapServer', '#map-legend-content');

createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Reviewed_SALDO_Plans_Public/MapServer', '#map-legend-content');

// filter logic
function clearFilter() {
    planSubmissions.setWhere(initialWhereClause);
    // reset UI widget
    setFilterUIWidgetContent(intialStartDate,initialEndDate);
    // close modal
    $('#filterModal').modal('hide');
    // refresh plan submissions layer on map
    planSubmissions.refresh();
}

function setFilter() {
    // beginning date
    const from = $('#fromDate').val();
    // ending date
    const to = $('#toDate').val();
    // where clause for filter
    const where_clause = `DATE >= date '${from}' AND DATE <= date '${to}'`;
    // apply filter
    planSubmissions.setWhere(where_clause);
    // get count of features
    // if no features exist, add message
    // call clearFilter()
    // reset UI widget
    setFilterUIWidgetContent(from,to);
    // close modal
    $('#filterModal').modal('hide');
    // refresh plan submissions layer on map
    planSubmissions.refresh();
}

// add event listeners
$('#setFilter').click(setFilter);
$('#clearFilter').click(clearFilter);

// filter by selected year
$("#plansSelectedYear").on("change", function(e) {
    // user selected year
    const userYear = $(this).val();
    // initial date for query
    const userStartDate = startDate + userYear;
    // end date for query
    const userEndDate = endDate + userYear;
    // create definition query
    const userQuery = setDateQuery(userStartDate,userEndDate);
    // apply defitional query
    planSubmissions.setWhere(userQuery);
    // close panel
    $('#panelSelectByYearFilter').collapse("hide");
    // reset default value
    resetDefaultOptionElement('plansSelectedYear');
    // reset UI widget
    setFilterUIWidgetContent(userStartDate,userEndDate);
    // close modal
    $('#filterYearModal').modal('hide');
    // refresh plan submissions layer on map
    planSubmissions.refresh();
});

// filter by start and end year
$('#setFilterMultipleYears').on('click', function(e) {
    // start year
    const filterStartYear = $('#plansStartYear').val();
    // end year
    const filterEndYear = $('#plansEndYear').val();
    // query from date
    const filterFromDate = startDate + filterStartYear;
    // query end date
    const filterEndDate = endDate + filterEndYear;
    // construct defintion query
    const where_clause = setDateQuery(filterFromDate, filterEndDate);
    // apply query
    planSubmissions.setWhere(where_clause);
    // close panel
    $('#panelSelectByStartEndYearFilter').collapse('hide');
    // reset default value
    resetDefaultOptionElement('plansStartYear');
    resetDefaultOptionElement('plansEndYear');
    // reset UI widget
    setFilterUIWidgetContent(filterFromDate,filterEndDate);
    // close modal
    $('#filterMultiYearModal').modal('hide');
    // refresh plan submissions layer on map
    planSubmissions.refresh();
});// CCPA Composite Locatoer
const ccpaProvider = L.esri.Geocoding.geocodeServiceProvider({
    label: 'Street Addresses',
    maxResults: 8,
    attribution: 'Cumberland County',
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Locators/Composite_Address_Locator/GeocodeServer'
});

// Feature Layer Provider - Submitted Plans
const featureLayerProvider = L.esri.Geocoding.featureLayerProvider({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Reviewed_SALDO_Plans_Public/MapServer/0',
    label: 'Submitted Plans',
    maxResults: 8,
    searchFields: ['NAME'],
    formatSuggestion: function(feature){
        return feature.properties.NAME;
    }
});

const addressSearchControl = L.esri.Geocoding.geosearch({
    useMapBounds: false,
    providers: [featureLayerProvider,ccpaProvider],
    placeholder: 'Search by Plan or Street Address',
    title: 'Search Tool',
    expanded: true,
    collapseAfterResult: false,
    zoomToResult: false
}).addTo(map);

/*** Address search results event ***/
addressSearchControl.on('results', function(data) {
    // make sure there is a result
    if (data.results.length > 0) {
        // set map view
        map.setView(data.results[0].latlng, 7);
        // open pop-up for location
        const popup = L.popup({closeOnClick: true}).setLatLng(data.results[0].latlng).setContent(data.results[0].text).openOn(map);
    } else {
        // open pop-up with no results message
        const popup = L.popup({closeOnClick: true}).setLatLng(map.getCenter()).setContent('No results were found. Please try a different address.').openOn(map);
    }

    // close search panel
    $('#searchModal').modal('hide');
});const locateControl = L.control.locate({
    position: "topleft",
    drawCircle: true,
    follow: false,
    setView: true,
    keepCurrentZoomLevel: false,
    markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
      },
    circleStyle: {
        weight: 1,
        clickable: false
      },
    icon: "fa fa-location-arrow",
    iconLoading: "fa fa-spinner fa-spin",
    metric: false,
    onLocationError: function(err) {
        alert(err.message);
    },
    onLocationOutsideMapBounds: function(context) {
        alert(context.options.strings.outsideMapBoundsMsg);
    },
    strings: {
        title: "Find my location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem to be located outside the boundaries of the map"
      },
    locateOptions: {
        maxZoom: 18,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
    }
}).addTo(map);/*** Remove loading screen after services loaded ***/
const loadScreenTimer = window.setInterval(function() {
  const backCover = $('#back-cover');
  let imagery2020Loaded = imagery2020.options.isLoaded,
       roadsMuniLoaded = roadsMunicipality.options.isLoaded,
       planReviewLoaded = planSubmissions.options.isLoaded;

    if (imagery2020Loaded && roadsMuniLoaded && planReviewLoaded) {
        // remove loading screen
        window.setTimeout(function() {
        backCover.fadeOut('slow');
       }, 500);

        // clear timer
        window.clearInterval(loadScreenTimer);
    } else {
      console.log('layers still loading');
    }
}, 1500);

// Remove loading screen when warning modal is closed
$('#layerErrorModal').on('hide.bs.modal', function(e) {
   // remove loading screen
   $('#back-cover').fadeOut('slow');
   // clear timer
   window.clearInterval(loadScreenTimer);
});