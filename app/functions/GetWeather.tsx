import { fetchWeatherApi } from "openmeteo";

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
     city:string, 
     isCelsius:boolean, 
     isKmh:boolean, isMm:boolean,
     setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
     lang:string, 
     setErrorOccurs: React.Dispatch<React.SetStateAction<boolean>>,
     setNoCityFound: React.Dispatch<React.SetStateAction<boolean>>
     ): Promise<WeatherData> {

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

     if (city) {
          try {
               const params = new URLSearchParams({
                    name: city,
                    count: '1',
                    language: lang,
                    format: 'json'
               });
               const url = `${process.env.NEXT_PUBLIC_OMAPI_SEARCH_URL}?${params.toString()}`;
               
               const response = await fetch(url, {method: 'GET'});

               if (!response.ok) {
                    setErrorOccurs(true);
                    setIsSearching(false);
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();        
               if (data.results && data.results.length > 0) {
                    cityInfo = data.results[0];
                    setNoCityFound(false);
               } else {
                    setNoCityFound(true);
                    setIsSearching(false);
               }               
          } catch (error) {
               console.error("Error fetching city info:", error);
               setIsSearching(false);
               setErrorOccurs(true);
          } 
     }

     
     const fectchWeather = async ()=>{
          const imperialParams = {
               ...( !isKmh && {wind_speed_unit:"mph"} ), 
               ...( !isCelsius && {temperature_unit:"fahrenheit"} ), 
               ...( !isMm && {precipitation_unit:"inch"} ),
          }; 
          const params = {
               latitude: cityInfo?.latitude || 0,
               longitude: cityInfo?.longitude || 0,
               daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
               hourly: ["temperature_2m", "weather_code"],
               current: ["temperature_2m", "apparent_temperature", "wind_speed_10m", "is_day", "weather_code", "precipitation", "relative_humidity_2m"],
               timezone: cityInfo?.timezone || "Australia/Sydney",
               imperialParams
          };
          
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
               cityNameCountry: `${cityInfo?.name}_${cityInfo?.country}` || "",
               current: {
                    time: String(new Date((Number(current.time()) + utcOffsetSeconds) * 1000)),
                    apparent_temperature: current.variables(0)!.value(),
                    temperature_2m: current.variables(1)!.value(),
                    weather_code: current.variables(2)!.value(),
                    is_day: current.variables(3)!.value(),
                    wind_speed_10m: current.variables(4)!.value(),
                    precipitation: current.variables(5)!.value(),
                    relative_humidity_2m: current.variables(6)!.value(),
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
     }

     if (city && cityInfo) {
          await fectchWeather();          
     }
     setIsSearching(false);
     return weatherData;
}

export default GetWeather
