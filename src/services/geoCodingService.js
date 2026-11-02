import { request } from "express"

function apiUrlFreeForm(address) {
    try {
        let addressFinal = String(address).replaceAll(" ", "+")
        console.log('adreese final', addressFinal)
        return 'https://nominatim.openstreetmap.org/search?q=' + address + '&format=jsonv2&addressdetails=1'

    } catch (error) {
        throw new Error("pb function apiUrlFreeForm")
    } finally {
        console.log("end apiUrlFreeForm")
    }


}

export async function geoCodeAdress(address) {
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
            throw new Error(`problem in geoCodeAdress:${rep.status}`)
        }
        let result = await rep.json();
        console.log(result);
    } catch (error) {
        console.error(error)
        throw new Error(error.Error)
    } finally {
        console.log("end of geoCodeAddress")
    }

}

console.log(geoCodeAdress('10 rue du bel air fosses 95470'))