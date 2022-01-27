

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