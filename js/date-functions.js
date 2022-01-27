// set definition query for layer based on a start and end data
export const setDateQuery = (dateStart, dateEnd) => {
    const definitionQuery = "DATE >= date '".concat(dateStart, "' AND DATE <= date '").concat(dateEnd, "'");
    return definitionQuery;
};