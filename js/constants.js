// viewport
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
export const windowArea = windowWidth * windowHeight;
// home coordinates
export const homeCoords = [40.15, -77.25];
// month and day for start date
const startDate = '01-01-';
// month and day for end date
const endDate = '12-31-';
// get current year to set definition query for Plan Submissions
const currentYear = new Date().getFullYear();
// initial start date
export const intialStartDate = startDate + currentYear;
// initial end date
export const initialEndDate = endDate + currentYear;
// definition query for plan submissions layer
//export const initialWhereClause = setDateQuery(intialStartDate,initialEndDate);