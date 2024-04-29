import { ArrowDown, ArrowUp, CalendarDays, Clock, CloudFog, Droplet, Droplets, MapPin, Moon, Sun, Sunrise, Sunset, ThermometerSun } from "lucide-react";
import SearchBar from "../components/app/searchBar";
import GetIpLocation from "../services/ipLocationService";
import { useEffect, useState } from "react";
import GetWeatherData from "../services/weatherService";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const HomePage = () => {

    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState('Loading');
    const [selectedLocation, setSelectedLocation] = useState();
    const [currentData, setCurrentData] = useState();

    useEffect(() => {
        getDefaultWeatherData();
    }, [])

    useEffect(() => {
        if(selectedLocation) {
            getSelectedWeatherData(selectedLocation.latitude, selectedLocation.longitude);
            setLocationName(`${selectedLocation.name} ,${selectedLocation.country}`)
        }
    }, [selectedLocation])

    async function getDefaultWeatherData() {
        const location = await GetIpLocation();
        if(!location) {
            alert('no location')
        } else {
            setLocationName(`${location.city}, ${location.country}`)
            try {
                const w_data = await GetWeatherData(location.lat, location.lon);
                setCurrentData(w_data);
            } catch (e) {
                alert(e)
            }
            
        }
        setLoading(false);
    }
    async function getSelectedWeatherData(lat,lon) {
        try {
            const w_data = await GetWeatherData(lat,lon);
            setCurrentData(w_data);
        } catch (e) {
            alert(e)
        }
    }

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    function isDay(date) {
        const hours = (new Date(date)).getHours();
        return (hours >= 6 && hours < 18);
    }

    if(loading) {
        return(
            <div className="h-screen bg-background text-foreground flex items-center justify-center text-center">Loading</div>
        )
    }

    if(!loading)return(
        <div className="p-4 sm:p-6 md:p-10 lg:p-14 xl:p-20 min-h-screen bg-black space-y-10">

            {/* hero card */}
            <div className="min-h-[50vh] rounded rounded-2xl bg-cover flex flex-col justify-between" style={{background: `url('/images/night.jpg')`}}>
                {/* header */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4 p-4 md:p-8">
                    <div className="text-foreground">
                        <div className="select-none text-xl md:text-4xl uppercase font-thin">World Wide<br/>Weather</div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <SearchBar setSelected={setSelectedLocation} />
                    </div>
                </div>

                {/* weather data */}
                <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-4 lg:items-end md:justify-between">
                    <div className="text-foreground space-y-4">
                        <div className="flex items-center">
                            {
                                isDay(currentData.current.time) ? 
                                <Sun className="h-20 w-20 lg:h-26 lg:w-26 xl:h-32 xl:w-32 mr-4" />
                                :
                                <Moon className="h-20 w-20 lg:h-26 lg:w-26 xl:h-32 xl:w-32 mr-4" />
                            }
                            
                            <div className="text-7xl lg:text-8xl xl:text-9xl">{Math.round(currentData.current.temperature2m)}&deg;C</div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-foreground md:px-2">
                            <div className="flex items-center gap-4">
                                <MapPin className="h-6 w-6 md:h-10 md:w-10"/>
                                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mr-6">{locationName}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-light"><ArrowDown className="h-6 w-6 md:h-10 md:w-10 text-blue-400"/> {Math.round(currentData.daily.temperature2mMin[0])} &deg;C</div>
                                <div className="flex items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-light"><ArrowUp className="h-6 w-6 md:h-10 md:w-10 text-red-400"/> {Math.round(currentData.daily.temperature2mMax[0])} &deg;C</div>    
                            </div>
                        </div>
                    </div>
                    <div className="md:text-end">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl uppercase text-foreground font-light">{weekday[new Date(currentData.current.time).getDay()]}</div>
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl uppercase text-foreground font-light">{new Intl.DateTimeFormat("en-US", {year: "numeric", month: "long", day: "2-digit"}).format(new Date(currentData.current.time))}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="grid grid-cols-2 col-span-2 md:col-span-1 gap-4 md:grid-cols-1">
                    <Card className="p-4 bg-foreground text-background flex-1">
                        <div className="flex flex-col items-center justify-center">
                            <Droplets className="h-8 w-8 text-red-400"/>
                            <h2 className="text-2xl">Humidity</h2>
                            <p className="text-4xl font-light">{currentData.current.relativeHumidity2m}%</p>
                        </div>
                    </Card>
                    <Card className="p-4 bg-foreground text-background flex-1">
                        <div className="flex flex-col items-center justify-center">
                            <Droplet className="text-blue-400 h-8 w-8"/>
                            <h2 className="text-2xl">Precipitation</h2>
                            <p className="text-4xl font-light">{currentData.current.precipitation}%</p>
                        </div>
                    </Card>
                </div>
                <div className="col-span-2">
                    
                    <Card className="p-4 bg-foreground text-background h-full">
                        <Tabs defaultValue="Hourly" className="w-full">
                            <TabsList>
                                <TabsTrigger value="Hourly">Hourly</TabsTrigger>
                                <TabsTrigger value="Daily">Daily</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Hourly">
                                <div className="flex gap-14 py-4 text-sm overflow-x-auto">
                                {
                                    currentData.hourly.time.map((item,i) => {
                                        return(
                                            <div key={i} className="space-y-4">
                                                <div className="flex gap-2 items-center border-b pb-4">
                                                    <Clock />
                                                    {new Date(currentData.hourly.time[i]).getHours()}:00 hrs
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <ThermometerSun className="text-yellow-600" />
                                                    {Math.round(currentData.hourly.temperature2m[i])} &deg;C
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Droplets className="text-red-400" />
                                                    {Math.round(currentData.hourly.relativeHumidity2m[i])}%
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Droplet className="text-blue-400" />
                                                    {Math.round(currentData.hourly.precipitation[i])}%
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <CloudFog className="text-zinc-400"/>
                                                    {Math.round(currentData.hourly.cloudCover[i])}%
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </TabsContent>
                            <TabsContent value="Daily">
                                <div className="flex gap-4 justify-between py-4 text-sm overflow-x-auto">
                                    {
                                        currentData.daily.time.map((item,i) => {
                                            return(
                                                <div key={i} className="space-y-4">
                                                    <div className="flex gap-2 items-center border-b pb-4">
                                                        <CalendarDays />
                                                        {new Date(currentData.daily.time[i]).getDate()} &nbsp;
                                                        {new Date(currentData.daily.time[i]).toLocaleString('default', { month: 'short' })}
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <ThermometerSun className="text-sky-400" />
                                                        {Math.round(currentData.daily.temperature2mMin[i])} &deg;C
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <ThermometerSun className="text-red-400" />
                                                        {Math.round(currentData.daily.temperature2mMax[i])} &deg;C
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <Droplet className="text-blue-400" />
                                                        {Math.round(currentData.daily.rainSum[i])}%
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default HomePage;