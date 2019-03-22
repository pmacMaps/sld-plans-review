'use strict';
/*** Variables ***/
// boolean if browser is on a mobile device or not
var isMobileDevice = L.Browser.mobile;
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
    // magic to zoom to muni
    console.log(selectedMuni);    
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
imagery2018 = L.esri.tiledMapLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Imagery2018/MapServer',
    maxZoom: 7,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Cumberland County',
    errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
    isLoaded: false
  });

roadsMunicipality = L.esri.tiledMapLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/RoadsMunicipalBoundaries/MapServer',
    maxZoom: 7,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Cumberland County',
    errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
    isLoaded: false
  });

planSubmissions = L.esri.featureLayer({
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/PlanSubmissionsReview/MapServer/0',
    isLoaded: false
});

// Add tooltip to MDJ Offices
/*
function bindTooltipMDJOffices() {
    mdjOffices.bindTooltip(function(evt) {
        return L.Util.template('<span class="feat-tooltip">District {District} Office</span>', evt.feature.properties);
    }, {opacity: 1, interactive: true});
}

// Add Popup to MDJ Offices
mdjOffices.bindPopup(function(evt, layer) {    
    // for non-mobile devices, close tool tip when popup opens
    if (!isMobileDevice) {
        evt.on('popupopen', function() {
            mdjOffices.unbindTooltip();
        });
        
        evt.on('popupclose', bindTooltipMDJOffices);
    }
    
    // return popup content
    return L.Util.template('<div class="feat-popup"><h2>Judge: {NAME} / District: {District}</h2><hr /><p>The address for this office is {LOCATION}, {CITY}, {STATE} {ZIP}.</p>The telephone number is {PHONE}.<p>Public Defender Day is {PDD}.<p></div>', evt.feature.properties);		
}, {closeOnClick: true, maxHeight: setPopupMaxHeight(windowArea), maxWidth: setPopupMaxWidth(windowWidth)});
8
*/

// Add tool tip to MDJ offices for non-mobile browsers
/*
if (!isMobileDevice) {
    bindTooltipMDJOffices();
}
*/

// list of map services
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
legendRoadsMuni = L.esri.dynamicMapLayer({url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/RoadsMunicipalBoundaries/MapServer'});
legendPlanSubmissions = L.esri.dynamicMapLayer({url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/PlanSubmissionsReview/MapServer'});

/*** Legend ***/
// plan review sites
legendPlanSubmissions.legend(function(error, legend){
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
    //document.getElementById('map-legend-content').innerHTML = html;
    $('#map-legend-content').prepend(html);
});

// roads & municipality
legendRoadsMuni.legend(function(error, legend){
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
    //document.getElementById('map-legend-content').innerHTML = html;
    $('#map-legend-content').append(html);
});

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