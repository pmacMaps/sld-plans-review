/*********************************************************************
* Name: ESRI Leaflet Address Search
* Version: 1.2
* Created by: Patrick McKinney, Cumberland County GIS & ESRI
* Code sample from ESRI Leaflet Calcite project - https://github.com/Esri/calcite-maps/tree/master/samples/esri-leaflet
* Notes: for use with ESRI Leaflet Geocoder version 2.x and Leaflet 1.x
* requires variable windowArea which is window height * window width
* requires jQuery
* Notes: may want to add in code to hide left map controls on popup open for smaller devices
**********************************************************************/

function addressLocator(windowArea) {
    'use strict';
    
    /*** Variables ***/
    var addressSearchControl,
    ccpaProvider,
    featureLayerProvider;
    
    // CCPA Composite Locatoer
    ccpaProvider = L.esri.Geocoding.geocodeServiceProvider({
        label: 'Street Addresses',
        maxResults: 8,
        attribution: 'Cumberland County',
        url: '//gis.ccpa.net/arcgiswebadaptor/rest/services/Composite_Address_Locator/GeocodeServer'   
    });
    
    // Feature Layer Provider - Submitted Plans
    featureLayerProvider = L.esri.Geocoding.featureLayerProvider({
        url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/PlanSubmissionsReview/MapServer/0',
        label: 'Submitted Plans',
        maxResults: 8,
        searchFields: ['NAME'],
        formatSuggestion: function(feature){
            return feature.properties.NAME;
        }    
    });      
    
    addressSearchControl = L.esri.Geocoding.geosearch({
        useMapBounds: false,
        providers: [featureLayerProvider,ccpaProvider],
        placeholder: 'Search by Plan Name or Street Address',
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
            var popup = L.popup({closeOnClick: true}).setLatLng(data.results[0].latlng).setContent(data.results[0].text).openOn(map);             
        } else {
            // open pop-up with no results message
            var popup = L.popup({closeOnClick: true}).setLatLng(map.getCenter()).setContent('No results were found. Please try a different address.').openOn(map);           
        }
        
        // close search panel
        $('#panelSearch').collapse("hide");        
    });
}