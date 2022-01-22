/*** Remove loading screen after services loaded ***/
const loadScreenTimer = window.setInterval(function() {
  const backCover = $('#back-cover');
  let imagery2020Loaded = imagery2020.options.isLoaded,
       roadsMuniLoaded = roadsMunicipality.options.isLoaded,
       planReviewLoaded = planSubmissions.options.isLoaded;

    if (imagery2020Loaded && roadsMuniLoaded && planReviewLoaded) {
        // remove loading screen
        window.setTimeout(function() {
        backCover.fadeOut('slow');
       }, 500);

        // clear timer
        window.clearInterval(loadScreenTimer);
    } else {
      console.log('layers still loading');
    }
}, 1500);

// Remove loading screen when warning modal is closed
$('#layerErrorModal').on('hide.bs.modal', function(e) {
   // remove loading screen
   $('#back-cover').fadeOut('slow');
   // clear timer
   window.clearInterval(loadScreenTimer);
});