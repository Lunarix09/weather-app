import { fetchWeatherApi } from "openmeteo";
import SearchPlaces from "./SearchPlaces";

interface WeatherData {
    cityNameCountry: string,
    current: {
      time: string,
      apparent_temperature: number | null,
      temperature_2m: number | null,
      weather_code: number | null,
      is_day: number | null,
      wind_speed_10m: number | null,
      precipitation: number | null,
      relative_humidity_2m: number | null,
      wind_gusts_10m: number | null
    },
    hourly: {
      time: string[],
      temperature_2m: (number | null)[],
      weather_code: (number | null)[],
    },
    daily: {
      time: string[],
      temperature_2m_max: (number | null)[],
      temperature_2m_min: (number | null)[],
      weather_code: (number | null)[],
    }
}

async function GetWeather(
     lang:string,
     isKmh:boolean, 
     isCelsius:boolean, 
     isMm:boolean,
     setIsSearching: React.Dispatch<React.SetStateAction<boolean>>, 
     cityName: string,
     setErrorOccurs: React.Dispatch<React.SetStateAction<boolean>>,
     cityCountry?:string,
     citylatitude?: number,
     citylongitude?: number,
     citytimeZone?: string, 
     setNoCityFound?: React.Dispatch<React.SetStateAction<boolean>>
     ): Promise<[WeatherData, any[]]> {
     setErrorOccurs(false);
     setNoCityFound && setNoCityFound(false);
     
     let cityInfo: any = {};
     // const faApiUrl = process.env.NEXT_PUBLIC_FAAPI_URL!;
     // const faApiKey = process.env.NEXT_PUBLIC_FAAPI_KEY!;
     
     // if (city){ 
     //      try {
     //           const request = await fetch(faApiUrl,
     //                {
     //                     method: 'POST',
     //                     headers: {
     //                          'Content-Type': 'application/json',
     //                          'x-api-key': faApiKey,
     //                     },
     //                     body: JSON.stringify({location: city})
     //                }
     //           );
     //           const res = await request.json();
     //           cityInfo = res[0]; 
                     
     //      } catch (error) {
     //           setIsSearching(false);
     //           console.error(error);
     //           return {};
     //      }
     // }


     let weatherData: WeatherData= {} as WeatherData;
     let gwList: any = [];

     // If no explicit coordinates were passed, try to look up the city
     if (!cityCountry && (citylatitude == null || citylongitude == null)) {
          const city = await SearchPlaces(cityName, 1, lang);
          // If SearchPlaces returns no result, stop and mark "noCityFound"
          if (!city || Array.isArray(city) && city === null as unknown as [{}] ) {
               setIsSearching(false);
               setNoCityFound && setNoCityFound(true);
               return [{} as WeatherData, []];
          }
          cityInfo = city[0];
     }

     const fectchWeather = async ()=>{
          const params: Record<string, any> = {
               latitude: citylatitude ?? cityInfo?.latitude,
               longitude: citylongitude ?? cityInfo?.longitude,
               daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
               hourly: ["temperature_2m", "weather_code"],
               current: ["temperature_2m", "apparent_temperature", "wind_speed_10m", "is_day", "weather_code", "precipitation", "relative_humidity_2m", "wind_gusts_10m"],
               timezone: citytimeZone ?? cityInfo?.timezone,
               
          };
          if (!isKmh) params.wind_speed_unit="mph";
          if (!isCelsius) params.temperature_unit="fahrenheit";
          if (!isMm) params.precipitation_unit="inch";
          
          const oMurl = process.env.NEXT_PUBLIC_OMAPI_URL!;
          const responses = await fetchWeatherApi(oMurl, params);
          
          // Process first location. Add a for-loop for multiple locations or weather models
          const response = responses[0];
               
          // Attributes for timezone and location
          const latitude = response?.latitude();
          const longitude = response?.longitude();
          const elevation = response?.elevation();
          const timezone = response?.timezone();
          const timezoneAbbreviation = response?.timezoneAbbreviation();
          const utcOffsetSeconds = response?.utcOffsetSeconds();

          const current = response?.current()!;
          const hourly = response?.hourly()!;
          const daily = response?.daily()!;

          // Note: The order of weather variables in the URL query and the indices below need to match!  
          weatherData = {
               cityNameCountry: cityCountry ? `${cityName}_${cityCountry}` : cityInfo.country ? `${cityName}_${cityInfo.country}`: `${cityName}_none`,
               current: {
                    time: String(new Date((Number(current.time()) + utcOffsetSeconds) * 1000)),
                    apparent_temperature: current.variables(0)!.value(),
                    temperature_2m: current.variables(1)!.value(),
                    weather_code: current.variables(2)!.value(),
                    is_day: current.variables(3)!.value(),
                    wind_speed_10m: current.variables(4)!.value(),
                    precipitation: current.variables(5)!.value(),
                    relative_humidity_2m: current.variables(6)!.value(),
                    wind_gusts_10m: current.variables(7)!.value(),
               },
               hourly: {
                    time: Array.from(
                         { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
                         (_, i) => String(new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000))
                    ),
                    // Convert to Float32Array and replace any null/undefined by  (null/Number)[]
                    temperature_2m: Array.from(
                         (hourly.variables(0)!.valuesArray() as unknown as Array<number | null>).map(v => v == null ? null : Number(v))
                    ),
                    weather_code: Array.from(
                         (hourly.variables(1)!.valuesArray() as unknown as Array<number | null>).map(v => v == null ? null : Number(v))
                    ),
               },
               daily: {
                    time: Array.from(
                         { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, 
                         (_, i) => String(new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000))
                    ),
                    temperature_2m_max: Array.from(
                         (daily.variables(0)!.valuesArray() as unknown as Array<number | null>).map(v => v == null ? null : Number(v))
                    ),
                    temperature_2m_min: Array.from(
                         (daily.variables(1)!.valuesArray() as unknown as Array<number | null>).map(v => v == null ? null : Number(v))
                    ),
                    weather_code: Array.from(
                         (daily.variables(2)!.valuesArray() as unknown as Array<number | null>).map(v => v == null ? null : Number(v))
                    ) ,
               },
          }; 

          gwList = [weatherData.cityNameCountry, latitude, longitude, timezone || ""]
     }; 

     // Call fetch only when we have coordinates (either passed in or from SearchPlaces)
     const hasCoordsFromArgs = citylatitude && citylongitude && citytimeZone;
     const hasCoordsFromFoundCity = cityInfo && cityInfo.latitude && cityInfo.longitude && cityInfo.timezone;
     if (hasCoordsFromArgs || hasCoordsFromFoundCity) {
          await fectchWeather();
     } else {
          setIsSearching(false);
          return [{} as WeatherData, []];
     }
     setIsSearching(false);
     return [weatherData, gwList];
}

export default GetWeather
