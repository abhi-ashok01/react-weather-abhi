const url2 = 'https://ipapi.co/json';

export default async function GetIpLocation() {
    const res = await fetch(url2);
    return await res.json();
}