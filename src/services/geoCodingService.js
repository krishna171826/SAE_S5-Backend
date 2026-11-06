/**
 * @file Module de géocodage utilisant l'API Nominatim (OpenStreetMap).
 * Ce fichier gère la transformation d'une adresse textuelle en coordonnées GPS.
 */

/**
 * Construit l'URL formatée et encodée pour l'API Nominatim.
 * 
 * @param {string} address - L'adresse brute saisie par l'utilisateur.
 * @returns {string} L'URL prête à être appelée.
 * @throws {Error} Si l'encodage ou la création de l'URL échoue.
 */
function apiUrlFreeForm(address) {
    try {
        let addressFinal = encodeURIComponent(address)
        console.log('adreese final', addressFinal)
        return 'https://nominatim.openstreetmap.org/search?q=' + addressFinal + '&format=jsonv2&addressdetails=1'

    } catch (error) {
        throw new Error("pb function apiUrlFreeForm")
    } finally {
        console.log("end apiUrlFreeForm")
    }
}

/**
 * Lance la requête HTTP vers l'API Nominatim avec le bon User-Agent.
 * 
 * @param {string} address - L'adresse à rechercher.
 * @returns {Promise<Array>} Un tableau contenant les résultats de l'API (peut être vide).
 * @throws {Error} Si la requête HTTP échoue (ex: erreur 500, pas de réseau).
 */
async function fetchLocation(address) {
    try {
        let url = apiUrlFreeForm(address)
        let rep = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "SAE_S5 (https://github.com/krishna171826/SAE_S5)"
            }
        })
        if (!rep.ok) {
            console.error("not ok", rep.status)
            throw new Error(`problem in fetchLocation:${rep.status}`)
        }
        let result = await rep.json();
        console.log(result);
        return result
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    } finally {
        console.log("end of fetchLocation")
    }
}

/**
 * Fonction principale exportée pour géocoder une adresse.
 * Sépare les erreurs métiers (adresse introuvable) des erreurs techniques (crash API).
 * 
 * @param {string} address - L'adresse complète à géocoder (ex: "10 rue du bel air fosses 95470").
 * @returns {Promise<Object>} Un objet indiquant le succès et les coordonnées, ou le message d'erreur.
 * @example
 * // Exemple de succès : { success: true, latitude: "49.095", longitude: "2.503" }
 * // Exemple d'échec : { success: false, message: "Adresse introuvable..." }
 * @throws {Error} Fait remonter l'erreur en cas de problème technique critique.
 */
export async function geoCodeAdress(address) {
    try {
        let addressJson = await fetchLocation(address)

        if (!addressJson || addressJson.length === 0) {
            return {
                success: false,
                message: "Adresse introuvable. Veuillez vérifier votre saisie."
            };
        }

        let result = {
            success: true,
            latitude: addressJson[0]["lat"],
            longitude: addressJson[0]["lon"]
        };
        return result;

    } catch (error) {
        throw new Error(error.message);

    } finally {
        console.log('end of geoCodeAddress')
    }
}