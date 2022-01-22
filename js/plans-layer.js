import { initialWhereClause, windowArea } from './constants.js';

// Plan Review Features - map service
export const planSubmissions = L.esri.featureLayer({
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