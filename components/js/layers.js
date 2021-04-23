// month and day for start date
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
});