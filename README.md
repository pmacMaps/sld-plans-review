# Subdivision & Land Development Plans Review App

## Summary
This is an interactive web map developed for the [Cumberland County Planning Commission](https://www.ccpa.net/120/Planning-Department).  Its purpose is the show the location and details for subdivision and land development plans that are submitted to the Planning Department for review and comment.

The map features a widget that allows users to filter plans by the month the plan was received.  There are also widgets/tools that allow users to zoom to a selected municipality (subdivision of County government), or search for a street address.

Our Planning staff update the layer feeding the map service on a file geodatabase on their shared network drive.  We have a weekly scheduled task that runs a Python script to copy the dataset from their network drive to a file geodatabase on our ArcGIS Server machine.

Another workflow would be to have the layer published as a feature service (ArcGIS Online or ArcGIS Server), and have the people edit the layer directly through a desktop client (ArcGIS Pro).

## Purpose
My goal in putting this project on GitHub is to provide other government agencies a sample app, from which they can build their own solutions.  This project uses the Leaflet.js library (and various plugins), a Bootstrap "theme," and Esri REST map services using a custom tiling scheme.

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
