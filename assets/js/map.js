'use strict';
/*** Variables ***/
// viewport
var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var windowArea = windowWidth * windowHeight;
// map & controls
var map;
var homeCoords = [40.15, -77.25];
var zoomHomeControl;
// layers
var spcPACrs;
var mapServices;
var imagery2018;
var roadsMunicipality;
var legendRoadsMuni;
var planSubmissions;
var legendPlanSubmissions;
/* loading screen */
var loadScreenTimer;
/*** Functions ***/
//  Basemap Changer
function zoomToMuni(selectedMuni) {    
    // where clause
    var whereClause = '"MUNI" = ' + "'" + selectedMuni + "'";
    var query = L.esri.query({
        url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/RoadsMunicipalBoundaries/MapServer/0'
    });    
    query.where(whereClause).bounds(function(error, latLngBounds, response) {
        if (error) {
            // add message to console
            console.warn('An error with the query request has occured');
            console.warn('Code: ' + error.code + '; Message: ' + error.message);
            // set content of results element
        } else if (response.features < 1) {        
         // add message to console
         console.log('No features selected');
         // set content of results element
        } else {
            map.fitBounds(latLngBounds);
        }
    });    
    // close basemap panel
    $('#panelMuniZoom').collapse("hide");
}
// function to handle load event for map services
function processLoadEvent(service) {
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
         console.warn('Layer failed to load: ' + service.options.url);
         console.warn('Code: ' + e.code + '; Message: ' + e.message);
                              
         // show modal window
         $('#layerErrorModal').modal('show'); 
      }
   });
}
/*** Map & Controls ***/
// PA State Plane South (ft) projection
spcPACrs = new L.Proj.CRS('EPSG:2272', '+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs',  {
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
map = L.map('map', {
   center: homeCoords,
   zoom: 0,
   zoomControl: false,
   crs: spcPACrs,
   minZoom: 0,
   maxZoom: 7
});
// Zoom Home Control
zoomHomeControl = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: homeCoords,
    homeZoom: 0    
}).addTo(map);
/*** Layers ***/
// 2018 Imagery - cached map service
imagery2018 = L.esri.tiledMapLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Imagery2018/MapServer',
    maxZoom: 7,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Cumberland County',
    errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
    isLoaded: false
  });
// Roads & Municipal Boundaries - cached map service
roadsMunicipality = L.esri.tiledMapLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/RoadsMunicipalBoundaries/MapServer',
    maxZoom: 7,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Cumberland County',
    errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
    isLoaded: false
  });
// Plan Review Features - map service
planSubmissions = L.esri.featureLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/PlanSubmissionsReview/MapServer/0',
    isLoaded: false
});
// format popup for plan review featres
planSubmissions.bindPopup(function(evt, layer) {    
    // reformat date field value
    var jsonDate = evt.feature.properties.DATE;
    var formattedDate = convertJSONDateToString(jsonDate);
    // reformat land use coded domain value
    var landUseField = evt.feature.properties.LANDUSE;
    var formattedLandUse = returnDomainText(landUseField);
    // test for null values in square footage field
    var sqFtField = evt.feature.properties.SQFT;
    var sqFtVal;
    if (sqFtField !== null && sqFtField !== '') {
        sqFtVal = sqFtField;
    } else {
        sqFtVal = 'N/A';
    }
    // return popup content
    var popupContent = '<div class="feat-popup">';
    popupContent += '<h3><span class="gray-text">Plan Name:</span> {NAME}</h3>';
    popupContent += '<ul>';
    popupContent += '<li><span class="gray-text">Land Use:</span> ' + formattedLandUse  + '</li>';
    popupContent += '<li><span class="gray-text">Date Reviewed:</span> ' + formattedDate + '</li>';
    popupContent += '<li><span class="gray-text">Square Footage:</span> ' + sqFtVal + '</li>';   
    popupContent += '</ul>';
    popupContent += '<h4><strong>Description:</strong></h4>';
    popupContent += '<p>{DESCRIPTION}</p>';
    popupContent += '</div>';    
    return L.Util.template(popupContent, evt.feature.properties);		
}, {closeOnClick: true, maxHeight: setPopupMaxHeight(windowArea), maxWidth: setPopupMaxWidth(windowWidth)});

// array of map services to run loading function on
mapServices = [imagery2018,roadsMunicipality, planSubmissions];
// call load/error events function on layers
for (var i = 0; i < mapServices.length; i++) {
    processLoadEvent(mapServices[i]);    
}
// add services to map
for (var i = 0; i < mapServices.length; i++) {
    mapServices[i].addTo(map);
}
// Run address locator module
addressLocator(windowArea);
// Run locate me module
locateControl();
// Create Map Legend
createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/RoadsMunicipalBoundaries/MapServer', '#map-legend-content');
createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/PlanSubmissionsReview/MapServer', '#map-legend-content');
// filter logic
function clearFilter() {
    planSubmissions.setWhere("");
}
function setFilter() {
    // beginning date
    var from = $('#fromDate').val();     
    // ending date
    var to = $('#toDate').val();
    // where clause for filter
    var where_clause = '"DATE" >= date ' + "'" + from + "'" + ' AND "DATE" <= date' + " '" + to + "'";  
    // apply filter
    planSubmissions.setWhere(where_clause);    
    // get count of features
    // if no features exist, add message
    // call clearFilter()
}
// add event listeners
$('#setFilter').click(setFilter);
$('#clearFilter').click(clearFilter);
/*** Remove loading screen after services loaded ***/
loadScreenTimer = window.setInterval(function() { 
    var backCover = $('#back-cover'),
       imagery2018Loaded = imagery2018.options.isLoaded,
       roadsMuniLoaded = roadsMunicipality.options.isLoaded,
       planReviewLoaded = planSubmissions.options.isLoaded;
    
    if (imagery2018Loaded && roadsMuniLoaded && planReviewLoaded) {
        // remove loading screen
        window.setTimeout(function() {
        backCover.fadeOut('slow');         
       }, 2000);
        
        // clear timer
        window.clearInterval(loadScreenTimer);        
    } else {
      console.log('layers still loading');    
    }
}, 2000);   
// Remove loading screen when warning modal is closed
$('#layerErrorModal').on('hide.bs.modal', function(e) {
   // remove loading screen
   $('#back-cover').fadeOut('slow');
   // clear timer
   window.clearInterval(loadScreenTimer);     
});