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

// set definition query for plan submissions layer
const setDateQuery = (dateStart,dateEnd) => {
    const definitionQuery = `DATE >= date '${dateStart}' AND DATE <= date '${dateEnd}'`;
    return definitionQuery;
};