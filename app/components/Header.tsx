"use client";
import React from "react";
import Image from "next/image";
import CitiesSuggested from "./CitiesSuggested";
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

interface SearchProps {
  searchText: {name:string, latitude:number, longitude:number, timezone:string},
  setSearchText: React.Dispatch<React.SetStateAction<{name:string, latitude:number, longitude:number, timezone:string}>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
  isSearching: boolean;
  isCelsius: boolean,
  isKmh: boolean,
  isMm: boolean,
  lang:string,
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData>>, 
  setErrorOccurs: React.Dispatch<React.SetStateAction<boolean>>, 
  setNoCityFound: React.Dispatch<React.SetStateAction<boolean>> 
}

const Header: React.FC<SearchProps> = ({searchText, setSearchText, setIsSearching, isSearching, isCelsius, isKmh, isMm, lang, setWeatherData, setErrorOccurs, setNoCityFound})=> {
  
  const [localsearchText, setLocalSearchText] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = React.useState<string>("");

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // afficher l'indicateur de recherche
    if (localsearchText.trim() !== "") {
      setIsSearching(true);
      setPlaceholder(localsearchText)
      setLocalSearchText("");

      if (inputRef.current) {
        inputRef.current.blur();
        inputRef.current.placeholder = `Searching for ${placeholder}...`; 
      }

      await GetWeather(lang, isKmh, isCelsius, isMm, setIsSearching, localsearchText, setErrorOccurs, undefined, undefined, undefined, undefined, setNoCityFound).then(([weather, locationData])=>{
        setWeatherData(weather);
        setIsSearching(false);
        setSearchText({name:locationData[0], latitude:locationData[1], longitude:locationData[2], timezone:locationData[3]});

        if (inputRef.current) {
          inputRef.current.placeholder = "Search for a city, e.g., New York";
        };
      });
    };
  };

  React.useEffect(()=>{
    if (isSearching && inputRef.current) {
      setLocalSearchText("");
      inputRef.current.blur();
      inputRef.current.placeholder = `Searching for ${placeholder}...`; 
    } else if (inputRef.current) inputRef.current.placeholder = "Search for a city, e.g., New York";
  }, [isSearching])

  return (
    <div className="flex max-md:w-[85vw] w-full max-md:mt-4 max-md:mb-5 md:mt-1 mb-6 justify-center items-center">
      
      <div className="flex flex-col items-center justify-start md:h-[19vh] w-full">
        <div className="text-center max-[426px]:leading-10.5 max-md:text-[40px] text-[42px] max-md:font-semibold w-full font-bold max-md:mb-6 md:mb-4.25 text-neutral-0 font-bricolage_grotesque">
          How's the sky looking today?
        </div>

        <form
          className="relative flex max-md:flex-col md:flex-row gap-2.5 w-[90%] min-[426px]:max-md:w-[60%] md:w-140 justify-center items-center"
          onSubmit={(e)=>{handleSubmit(e)}}
        >
          <label className="flex items-center gap-4 max-md:w-full md:w-[65%] px-4 py-2 h-9 rounded-lg bg-neutral-800">
            <Image
              src="/assets/icon-search.svg"
              alt="Search Icon"
              width={15}
              height={15}
            />

            <input
              type="text"
              ref={inputRef}
              placeholder="Search for a city, e.g., New York"
              className="w-full h-full max-md:text-[12Px] text-[14px] text-start pb-1 focus:outline-none bg-transparent"
              value={localsearchText}
              onChange={(e) => setLocalSearchText(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="button max-md:w-full bg-neutral-blue-500 hover:bg-neutral-blue-700"
          >
            Search
          </button>

          {
            localsearchText.trim() !==""  &&(
              <CitiesSuggested 
                lang={lang}
                searchText={localsearchText}
                setSearchText={setSearchText}
                setPlaceholder={setPlaceholder}
                isKmh={isKmh}
                isCelsius={isCelsius}
                isMm={isMm}
                setIsSearching={setIsSearching}
                setWeatherData={setWeatherData}
                setErrorOccurs={setErrorOccurs}
                setNoCityFound={setNoCityFound}
                className={"md:right-[25%] mt-2 max-md:w-full md:w-[65%]  "}
              />
            )
          }

          {isSearching && (
            <div className="absolute z-80 sinp top-full md:right-[25%] mt-2 p-1.5 h-7 max-md:w-full md:w-[65%] flex items-center gap-1 bg-neutral-800 rounded-lg">
              <Image
                src="/assets/icon-loading.svg"
                alt="Loading"
                width={15}
                height={15}
                className="animate-spin"
              />
              <span className="text-[13px] align-middle pb-1 ">Search in progress</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Header;