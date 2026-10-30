/**
 * Service de normalisation des données OpenStreetMap (Issue #14).
 * 
 * this issue takes the openstreet tags comming from overpass api and clean that and 
 * assoiate with good tags
 */

/**
 * Normalise un élément brut d'Overpass (node, way ou relation).
 * @param {Object} element - Élément brut Overpass
 * @returns {Object|null} - Activité normalisée ou null si invalide
 */

function normalizeActivity(element) {
    if (!element || !element.type || !element.id){
        return null;
    }

    let latitude = element.lat;
    let longitude = element.lon;

    if ((latitude === undefined || longitude === undefined) && element.center){
        latitude = element.center.lat;
        longitude = element.center.lon;
    }

    if (latitude === undefined || longitude === undefined){
        return null;
    }








 }