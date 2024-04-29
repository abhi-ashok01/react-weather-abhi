const url = "https://geocoding-api.open-meteo.com/v1"

export default async function GetLocationData(query) {
    const queryString = `${url}/search?name=${query}&count=2&language=en&format=json`
    const res = await fetch(queryString, {method: 'GET'})
    return await res.json();
}