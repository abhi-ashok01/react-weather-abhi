const url = 'http://ip-api.com/json/';

export default async function GetIpLocation() {
    const res = await fetch(url);
    return await res.json();
}