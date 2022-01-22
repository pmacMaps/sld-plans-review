import { homeCoords } from './constants.js';

// Zoom Home Control
export const zoomHomeControl = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: homeCoords,
    homeZoom: 0
});

// Full Screen Control
export const fullscreenControl = new L.Control.Fullscreen({
  position: 'topleft'
});