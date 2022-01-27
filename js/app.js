import { homeCoords } from './constants.js';
import { spcPACrs } from './crs.js';
import { zoomHomeControl, fullscreenControl } from './map-controls.js';
import { locateControl } from './geolocate.js';
import { addressSearchControl } from './search.js';
import { imagery2020, roadsMunicipality } from './layers.js';
import { planSubmissions } from './plans-layer.js';
import { processLoadEvent } from './map-functions.js'
import { createMapLegend} from './map-legend.js';

// web map
export const map = L.map('map', {
    center: homeCoords,
    zoom: 0,
    zoomControl: false,
    crs: spcPACrs,
    minZoom: 0,
    maxZoom: 8
 });

 // map controls
zoomHomeControl.addTo(map);
fullscreenControl.addTo(map);
locateControl.addTo(map);
addressSearchControl.addTo(map);

// add layers to map
// array of map services to run loading function on
const mapServices = [imagery2020, roadsMunicipality, planSubmissions];
// call load/error events function on layers
mapServices.forEach(element => processLoadEvent(element));
// add layers to map
mapServices.forEach(element => element.addTo(map));
// add elements to map legend
// roads/municipal boundaries
createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Property_Assessment/Roads_Municipal_Boundaries/MapServer', '#map-legend-content');
// saldo plans
createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Reviewed_SALDO_Plans_Public/MapServer', '#map-legend-content');