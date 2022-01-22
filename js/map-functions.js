// Set max height of pop-up window
export const setPopupMaxHeight = (windowArea) => {
    let maxHeight;
    if (windowArea < 315000 ) {
        maxHeight = 150;
    } else {
        maxHeight = 500;
    }
    return maxHeight;
};

// Set max width of pop-up window
export const setPopupMaxWidth = (windowWidth) => {
    let maxWidth;
    if (windowWidth < 450 ) {
        maxWidth = 240;
    } else {
        maxWidth = 300;
    }
    return maxWidth;
};

// Basemap Changer
export const zoomToMuni = (selectedMuni) => {
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
export const processLoadEvent = (service) => {
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