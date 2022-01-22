// set UI widget
setFilterUIWidgetContent(intialStartDate,initialEndDate);



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