# Subdivision & Land Development Plans Review App

## Summary
This is an interactive web map developed for the [Cumberland County Planning Commission](https://www.ccpa.net/120/Planning-Department).  Its purpose is the show the location and details for subdivision and land development plans that are submitted to the Planning Department for review and comment.

The map features mulitple widgets that allow users to filter plans by a date range, a single year, or multiple years.  There are also widgets/tools that allow users to zoom to a selected municipality (subdivision of County government), or search for a street address.

Our Planning staff edit the plans layer in ArcGIS Enterprise.  The dataset is housed in an enterprise geodatabase.  The dataset is published as an editable feature service, as well as a non-editable map service.

## Purpose
My goal in putting this project on GitHub is to provide other government agencies a sample app, from which they can build their own solutions.  This project uses the Leaflet.js library (and various plugins), a Bootstrap "theme," and Esri REST map services (including a custom tiling scheme).

As enhancements are added to the app, I'll do my best to push those changes to this repository.

[Live Web App Link](https://gis.ccpa.net/sld/activity/)

## Libraries
#### Web Mapping
- [Leaflet.js](https://github.com/Leaflet/Leaflet): base platform for interactive web map
- [Esri Leaflet](https://github.com/Esri/esri-leaflet): utilize Esri REST services
- [Esri Leaflet Renderers](https://github.com/esri/esri-leaflet-renderers): use defined symbology in feature layers (map/feature service)
- [Esri Leaflet Geocoder](https://github.com/esri/esri-leaflet-geocoder): search for addresses against a geocoding service (geocode service)
- [Esri Leaflet Legend](https://github.com/w8r/esri-leaflet-legend): generate a legend from a dynamic map layer (map service)
- [Leaflet Zoom Home](https://github.com/torfsen/leaflet.zoomhome): add a full map extent button to map zoom control
- [Leaflet Locate Control](https://github.com/domoritz/leaflet-locatecontrol): find my location map control
- [Proj4JS](https://github.com/proj4js/proj4js): transform coordinates from one coordinate system to another, including datum transformations
- [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet): use tile map service with custom tiling scheme and non-standard projection

#### Framework
- [Bootstrap](https://github.com/twbs/bootstrap): generate a good looking app across browsers and devices
- [Esri Calcite Maps](https://github.com/Esri/calcite-maps): Bootstrap theme for web map apps
- [jQuery](https://github.com/jquery/jquery): Bootstrap requires it, so I might as well use it!
- [jQuery UI](https://github.com/jquery/jquery-ui): date selector for feature layer filter widget
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome): Various icons used for UI elements.
