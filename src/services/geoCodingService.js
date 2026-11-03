import { request } from "express"

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


