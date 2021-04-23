// Set max height of pop-up window
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
};