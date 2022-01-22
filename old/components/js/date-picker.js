/*** Date Picker ***/
$(function() {
    // get user selected date from calendar ui
    const getDate = (element) => {
      let date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
        $('#dateErrorModal').modal('show');
      }
      return date;
    };
    // set date format
    const dateFormat = "mm/dd/yy",
      from = $( "#fromDate" )
        .datepicker({
          defaultDate: "0",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#toDate" ).datepicker({
        defaultDate: "0",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });
});