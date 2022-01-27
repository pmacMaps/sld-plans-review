import { initialWhereClause, intialStartDate, initialEndDate } from './constants.js';

// set filter dates in user interface widget
export const setFilterUIWidgetContent = (startDate,endDate) => {
    // start date span
    const startDateSpan = document.getElementById('startDateUI');
    // end date span
    const endDateSpan = document.getElementById('endDateUI');

    // set values
    startDateSpan.innerHTML = startDate;
    endDateSpan.innerHTML = endDate;
};

// set definition query for layer based on a start and end data
export const setDateQuery = (dateStart, dateEnd) => {
    const definitionQuery = "DATE >= date '".concat(dateStart, "' AND DATE <= date '").concat(dateEnd, "'");
    return definitionQuery;
};

// filter logic
export const clearFilter = (layer) => {
    layer.setWhere(initialWhereClause);
    // reset UI widget
    setFilterUIWidgetContent(intialStartDate,initialEndDate);
    // close modal
    $('#filterModal').modal('hide');
    // refresh plan submissions layer on map
    layer.refresh();
};

export const setFilter = (layer) => {
    // beginning date
    const from = $('#fromDate').val();
    // ending date
    const to = $('#toDate').val();
    // where clause for filter
    const where_clause = `DATE >= date '${from}' AND DATE <= date '${to}'`;
    // apply filter
    layer.setWhere(where_clause);
    // get count of features
    // if no features exist, add message
    // call clearFilter()
    // reset UI widget
    setFilterUIWidgetContent(from,to);
    // close modal
    $('#filterModal').modal('hide');
    // refresh plan submissions layer on map
    layer.refresh();
};