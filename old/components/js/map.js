/*** Variables ***/
// viewport
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const windowArea = windowWidth * windowHeight;
// home coordinates
const homeCoords = [40.15, -77.25];

/*** Map & Controls ***/
// PA State Plane South (ft) projection
const spcPACrs = new L.Proj.CRS('EPSG:2272', '+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs',  {
    origin: [-1.192142E8, 1.461669E8],
    resolutions: [
      260.41666666666663,
      86.80555555555556,
      43.40277777777778,
      20.833333333333332,
      10.416666666666666,
      6.944444444444444,
      4.166666666666666,
      2.083333333333333,
      1.0416666666666665,
      0.5208333333333333
    ]
  });

const map = L.map('map', {
   center: homeCoords,
   zoom: 0,
   zoomControl: false,
   crs: spcPACrs,
   minZoom: 0,
   maxZoom: 8
});

// Zoom Home Control
const zoomHomeControl = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: homeCoords,
    homeZoom: 0
}).addTo(map);

// Full Screen Control
const fullscreenControl = new L.Control.Fullscreen({
  position: 'topleft'
}).addTo(map);