import { fetchWeatherApi } from 'openmeteo';
	

const url = "https://api.open-meteo.com/v1/forecast";

export default async function GetWeatherData(lat, long) {
    if(!lat || !long) throw new Error("Invalid Location Data");
    const params = {
        "latitude": lat,
        "longitude": long,
        "current": ["temperature_2m", "relative_humidity_2m", "precipitation"],
        "hourly": ["temperature_2m", "relative_humidity_2m", "precipitation", "rain", "showers", "snowfall", "cloud_cover", "is_day"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "precipitation_sum", "rain_sum", "showers_sum", "snowfall_sum", "precipitation_probability_max"],
        "past_hours": 1,
        "forecast_hours": 1
    };
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    // Note: The order of weather variables in the URL query and the indices below need to match
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0).value(),
            relativeHumidity2m: current.variables(1).value(),
            precipitation: current.variables(2).value(),
        },
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0).valuesArray(),
            relativeHumidity2m: hourly.variables(1).valuesArray(),
            precipitation: hourly.variables(2).valuesArray(),
            rain: hourly.variables(3).valuesArray(),
            showers: hourly.variables(4).valuesArray(),
            snowfall: hourly.variables(5).valuesArray(),
            cloudCover: hourly.variables(6).valuesArray(),
            isDay: hourly.variables(7).valuesArray(),
        },
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(0).valuesArray(),
            temperature2mMin: daily.variables(1).valuesArray(),
            sunrise: daily.variables(2).valuesArray(),
            sunset: daily.variables(3).valuesArray(),
            precipitationSum: daily.variables(4).valuesArray(),
            rainSum: daily.variables(5).valuesArray(),
            showersSum: daily.variables(6).valuesArray(),
            snowfallSum: daily.variables(7).valuesArray(),
            precipitationProbabilityMax: daily.variables(8).valuesArray(),
        },
    
    };

    return weatherData;
}


// Helper function to form time ranges
const range = (start, stop, step) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);



// `weatherData` now contains a simple structure with arrays for datetime and weather data
// for (let i = 0; i < weatherData.hourly.time.length; i++) {
// 	console.log(
// 		weatherData.hourly.time[i].toISOString(),
// 		weatherData.hourly.temperature2m[i],
// 		weatherData.hourly.relativeHumidity2m[i],
// 		weatherData.hourly.precipitation[i],
// 		weatherData.hourly.rain[i],
// 		weatherData.hourly.showers[i],
// 		weatherData.hourly.snowfall[i],
// 		weatherData.hourly.cloudCover[i],
// 		weatherData.hourly.isDay[i]
// 	);
// }
// for (let i = 0; i < weatherData.daily.time.length; i++) {
// 	console.log(
// 		weatherData.daily.time[i].toISOString(),
// 		weatherData.daily.temperature2mMax[i],
// 		weatherData.daily.temperature2mMin[i],
// 		weatherData.daily.sunrise[i],
// 		weatherData.daily.sunset[i],
// 		weatherData.daily.precipitationSum[i],
// 		weatherData.daily.rainSum[i],
// 		weatherData.daily.showersSum[i],
// 		weatherData.daily.snowfallSum[i],
// 		weatherData.daily.precipitationProbabilityMax[i]
// 	);
// }