"use client"
import React from 'react'
import Image from "next/image";
import Wrapper from "./wrapper";
import Header from "./Header";
import Body from "./Body";
import GetWeather from "../functions/GetWeather";

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

const HomeClient = () => {

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [searchText, setSearchText] = React.useState<{name:string, latitude:number, longitude:number, timezone:string}>({name:timeZone.split("/")[1], latitude:0, longitude:0, timezone:timeZone});
  const [lang, setLang] = React.useState<string>("en");
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [isCelsius, setIsCelsius] = React.useState<boolean>(true);
  const [isKmh, setIsKmh] = React.useState<boolean>(true);
  const [isMm, setIsMm] = React.useState<boolean>(true);
  const [isImperial, setIsImperial] = React.useState<boolean>(false);
  const [errorOccurs, setErrorOccurs] = React.useState<boolean>(false);
  const [noCityFound, setNoCityFound] = React.useState<boolean>(false);

  const [weatherData, setWeatherData] = React.useState<WeatherData>({} as WeatherData);

  const checkLocalStorageUnits = (unit:string):void => {
    const localUnit = localStorage.getItem(unit);
    if (localUnit === null || (localUnit !== "true" && localUnit !== "false") || localUnit === undefined) {

      switch(unit) {
        case "isImperial":
          localStorage.setItem(unit, "false");
          break;
        case "isCelsius":
          localStorage.setItem(unit, "true");
          break;
        case "isKmh":
          localStorage.setItem(unit, "true");
          break;
        case "isMm":
          localStorage.setItem(unit, "true");
          break;
      }
    }else {
        switch(unit) {
            case "isImperial":
                setIsImperial(localUnit === "true");
                break;
            case "isCelsius":
                setIsCelsius(localUnit === "true");
                break;
            case "isKmh":
                setIsKmh(localUnit === "true");
                break;
            case "isMm":
                setIsMm(localUnit === "true");
                break;
        }
    }
  }

  React.useEffect(()=>{    
    ["isImperial", "isCelsius", "isKmh", "isMm"].forEach((unit) => {
      checkLocalStorageUnits(unit);
    });
  }, [])

  React.useEffect(()=>{
    
    setErrorOccurs(false);
    // setNoCityFound(false);
    GetWeather(lang, isKmh, isCelsius, isMm, setIsSearching, searchText.name, setErrorOccurs, undefined, searchText.latitude !== 0 ? searchText.latitude : undefined, searchText.longitude !== 0 ? searchText.longitude : undefined, searchText.timezone, setNoCityFound)
    .then(([weather, locationData]) => {
      setIsSearching(false);
      setWeatherData(weather);
      
      // Only update searchText if coordinates differ (new search, not unit change)
      if (locationData && (locationData[1] !== searchText.latitude || locationData[2] !== searchText.longitude)) {
        setSearchText({name:locationData[0], latitude:locationData[1], longitude:locationData[2], timezone:locationData[3]})
      }
    });
    // then signifie une fois que la promesse est résolue, on peut accéder à la valeur de retour de la fonction asynchrone    
  }, [isCelsius, isKmh, isMm, searchText])

  return (
    <div className="flex flex-col w-screen h-screen max-md:px-3 md:px-15 pt-11 pb-4 justify-start items-center overflow-auto scroll-auto ">
      <Wrapper 
        isImperial={isImperial}
        setIsImperial={setIsImperial}
        isCelsius={isCelsius}
        setIsCelsius={setIsCelsius}
        isKmh={isKmh}
        setIsKmh={setIsKmh}
        isMm={isMm}
        setIsMm={setIsMm}
      /> 
      {
        errorOccurs 
          ? <div className="flex flex-col justify-center items-center mt-5">
              <Image
                src="/assets/icon-error.svg"
                alt="Error Icon"
                width={60}
                height={60}
              />
              <div className="text-center align-middle text-3xl font-bold font-bricolage_grotesque m-4 text-neutral-0">
                Something went wrong
              </div>
              <div className='text-center align-middle text-[14px] text-neutral-200 font-medium font-dm_sans'>
                We couldn't connect to the server (API error). Please try again in a few moments.
              </div>
              <button 
                className='flex flex-row w-fit h-fit items-center gap-2 mt-6 p-4 bg-neutral-800 rounded-lg text-[14px] text-neutral-0 font-medium font-dm_sans hover:bg-neutral-700'
                onClick={(e)=>{
                  setErrorOccurs(false);
                  // setSearchText("");
                  setIsSearching(false);
                  setIsImperial(false);
                  window.location.reload();
                }}
              >
                <Image
                  src="/assets/icon-retry.svg"
                  alt="Refresh Icon"
                  width={15}
                  height={15}
                />
                <div>Retry</div>
              </button>
            </div>

          : <div>
              <Header
                searchText={searchText}
                setSearchText={setSearchText}
                setIsSearching={setIsSearching}
                isSearching={isSearching}
                isKmh={isKmh}
                isCelsius={isCelsius}
                isMm={isMm}
                lang={lang}
                setWeatherData={setWeatherData}
                setErrorOccurs={setErrorOccurs}
                setNoCityFound={setNoCityFound}
              />
              { noCityFound
                  ? <div className="text-center text-neutral-0 font-dm_sans font-semibold text-[18px] mt-10">No search result found!</div>
                  :
                    <Body
                      isSearching={isSearching}
                      noCityFound={noCityFound}
                      isCelsius={isCelsius}
                      isKmh={isKmh}
                      isMm={isMm}
                      weatherData={weatherData}
                    />
              }
            </div>            
      }      
    </div>
  )
}

export default HomeClient
