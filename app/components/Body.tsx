"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CheckWeatherCode from "../functions/CheckWeatherCode";
import Select from "./Select";

type BodyProps = {
  isCelsius: boolean;
  isKmh: boolean;
  isMm: boolean;
  isSearching: boolean;

  weatherData: {
    cityNameCountry: string;
    current: {
      time: string;
      apparent_temperature: number | null;
      temperature_2m: number | null;
      weather_code: number | null;
      is_day: number | null;
      wind_speed_10m: number | null;
      precipitation: number | null;
      relative_humidity_2m: number | null;
    };
    hourly: {
      time: string[];
      temperature_2m: (number | null)[];
      weather_code: (number | null)[];
    };
    daily: {
      time: string[];
      temperature_2m_max: (number | null)[];
      temperature_2m_min: (number | null)[];
      weather_code: (number | null)[];
    };
  };
};

function Body({isCelsius, isKmh, isMm, isSearching, weatherData }: BodyProps) {
  const [selectday, setSelectday] = useState<string>("Monday");
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (weatherData?.hourly?.time?.length > 0) {

      setSelectday( (prevday:string):string =>{
        const day:string = (prevday.slice(0,3) === weatherData?.hourly?.time[0].split(" ")[0])
          ? prevday
          : days.find((d:string)=>
              d.slice(0,3) === weatherData?.hourly?.time[0].split(" ")[0]
            ) || "Monday"
        return day
      });
    }
  }, [weatherData]);

  useEffect(() => {
    setIsLoading(!isloading);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return (
    <div className="md:grid md:grid-cols-3 max-md:grid-cols-1 gap-4 w-[85vw] min-[1000px]:w-[70vw] md:flex-1 max-md:mt-0.5">
      <div className="body-left col-start-1 md:col-span-2 flex flex-col items-start justify-start rounded-lg ">
        
        <div
          className="body-left-top opacity-0 flex max-md:flex-col md:flex-row justify-between items-center w-full h-[45%] bg-cover bg-no-repeat bg-center rounded-lg p-5"
          style={
            isloading
              ?  { backgroundColor: "hsl(243, 23%, 24%)" }
              : isMobile
                  ? { backgroundImage: "url('/bg-today-small.svg')" }
                  : { backgroundImage: "url('/bg-today-large.svg')" }
          }
        >
          {isloading ? (
            <div className="flex w-full justify-center items-center text-[8px] text-neutral-200 font-dm_sans font-medium relative ">
              <Image
                src="/icon-loading.svg"
                alt="Loading"
                width={50}
                height={50}
                className="animate-spin duration-1000 ease absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
              <div>Loading...</div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start justify-start font-dm_sans">
                {weatherData?.current && weatherData?.cityNameCountry &&(
                    <>
                      <div className="text-[18px] text-neutral-0 font-semibold ">
                        {weatherData?.cityNameCountry.split("_")[0]}{", "}
                          {weatherData?.cityNameCountry.split("_")[1]}
                      </div>

                      <div className="flex flex-row items-center text-[12px] text-neutral-200 font-medium ">
                        {weatherData?.current?.time?.split(" ")[0]}, {weatherData?.current?.time.split(" ").slice(1, 3).join(" ")}, {weatherData?.current?.time?.split(" ")[3]}
                        <Image
                          src={weatherData?.current?.is_day === 1
                            ?"/icon-morning.png"
                            :"/icon-night.png"
                          }
                          alt="Sun or Moon Icon"
                          width={15}
                          height={15}
                          className="mx-1"
                        />
                      </div>
                    </>                   
                  )}                
              </div>

              <div className="flex flex-row items-center align-text-top max-md:w-full max-[426px]:justify-around justify-center min-[426px]:gap-3 text-6xl text-neutral-0 font-semibold font-bricolage_grotesque italic">
                {weatherData?.current?.weather_code && (
                  <>
                    <Image
                      src={CheckWeatherCode(
                        weatherData?.current?.weather_code ?? 0
                      )}
                      alt="Current Weather Icon"
                      width={90}
                      height={100}
                    />
                  
                  <div>
                    {weatherData?.current?.temperature_2m?.toFixed(0)}°
                  </div>
                  </>
                  
              )}
              </div>
            </>
          )}
        </div>

        <div className="body-left-center opacity-0 mt-4 mb-4.25 flex flex-col items-start w-full h-[20%] justify-start gap-1 font-dm_sans ">
          
          <div className="grid md:grid-cols-4 max-md:grid-cols-2 gap-4 w-full h-full text-start">
            <div className=" p-1.5 bg-neutral-800 rounded-lg border border-neutral-600 w-full h-full flex flex-col justify-between ">
              <label className=" text-[12px] text-neutral-300 ">
                Feels like
              </label>
              <div className="text-[18px] text-neutral-200 font-normal">
                {isloading 
                  ? "__" 
                  : !weatherData?.current?.apparent_temperature 
                    ? "__" 
                    : weatherData?.current?.apparent_temperature?.toFixed(0)}{weatherData?.current?.temperature_2m !== null && !isloading && "°"}
              </div>
            </div>

            <div className=" p-1.5 bg-neutral-800 rounded-lg border border-neutral-600 w-full h-full flex flex-col justify-between ">
              <label className=" text-[12px] text-neutral-300 ">
                Humidity
              </label>
              <div className="text-[18px] text-neutral-200 font-normal">
                {isloading 
                  ? "__" 
                  : weatherData?.current?.relative_humidity_2m === null || weatherData?.current?.relative_humidity_2m < 0
                    ? "__" 
                    : weatherData?.current?.relative_humidity_2m?.toFixed(0)}{weatherData?.current?.relative_humidity_2m !== null && !isloading && "%"}
              </div>
            </div>

            <div className=" p-1.5 bg-neutral-800 rounded-lg border border-neutral-600 w-full h-full flex flex-col justify-between ">
              <label className=" text-[12px] text-neutral-300 ">
                Wind
              </label>
              <div className="text-[18px] text-neutral-200 font-normal">
                {isloading 
                  ? "__" 
                  : weatherData?.current?.wind_speed_10m === null || weatherData?.current?.wind_speed_10m < 0
                    ? "__" 
                    : weatherData?.current?.wind_speed_10m?.toFixed(0)}{weatherData.current?.wind_speed_10m !== null && !isloading ? !isKmh ? " mph" : " km/h" : ""}
              </div>
            </div>

            <div className=" p-1.5 bg-neutral-800 rounded-lg border border-neutral-600 w-full h-full flex flex-col justify-between ">
              <label className=" text-[12px] text-neutral-300 ">
                Precipitation
              </label>
              <div className="text-[18px] text-neutral-200 font-normal">
                {isloading 
                  ? "__" 
                  : weatherData?.current?.precipitation === null || weatherData?.current?.precipitation < 0
                    ? "__" 
                    : weatherData?.current?.precipitation?.toFixed(0)}{weatherData?.current?.precipitation !== null && !isloading ? !isMm ? " inch" : " mm" : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="body-left-bottom opacity-0 flex flex-col items-start w-full h-[35%] justify-start gap-1 font-dm_sans ">
          <label className="text-[14px] text-neutral-200">Daily forecast</label>

          <div className="daily-forecast md:grid md:grid-cols-7 max-md:flex max-md:flex-row max-md:flex-wrap max-md:gap-2 max-md:justify-center md:gap-3 w-full h-full text-center">
            {!weatherData?.daily?.time?.length &&  (
              <>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-18 max-md:h-24 md:max-[1100px]:w-15 h-full"></div>
                
              </> 
            )}

            {weatherData?.daily?.time
              ?.map((today: string, i) => (
              <div
                key={`${today}-${i}`}
                className=" p-1.5 bg-neutral-800 rounded-lg border border-neutral-600 max-md:w-20.5 md:w-[95%] h-full flex flex-col justify-between items-center"
              >
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <label className="text-center text-[14px] text-neutral-0 ">
                      {today.split(" ")[0]}
                    </label>

                    <Image
                      src={CheckWeatherCode(
                        weatherData?.daily?.weather_code[i] ?? 0,
                      )}
                      alt="Sun Icon"
                      width={45}
                      height={45}
                    />

                    <div className="flex flex-row w-full items-center justify-between">
                      <div className="text-[13px] text-neutral-0 font-normal">
                        {weatherData?.daily?.temperature_2m_max[i]?.toFixed(0)}°
                      </div>
                      <div className="text-[12px] text-neutral-200 font-normal">
                        {weatherData?.daily?.temperature_2m_min[i]?.toFixed(0)}°
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="body-right opacity-0 md:col-end-4 max-md:mt-8 w-full h-[64vh] flex flex-col justify-start items-start p-2.5 rounded-lg bg-neutral-800 ">
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="text-[14px] text-neutral-200 font-medium">
            Hourly forecast
          </div>

          <Select 
            values={days}
            value={selectday}
            setValue={setSelectday}
            dropdownClassName={"w-25"}
            triggerClassName={" w-full h-fit flex flex-row justify-between items-center text-start text-[12px] text-neutral-200 font-medium bg-neutral-600 border border-neutral-700 focus:border-neutral-200 hover:border-neutral-200 rounded-lg px-3 py-1 cursor-pointer transition duration-300 ease"}
            ulClassName={" w-full bg-neutral-600  shadow-lg"}
            liClassName={" border px-3 py-1.5 text-[12px] text-neutral-200 border-neutral-700 hover:border-neutral-200 transition duration-300 esae"}
          />
        </div>

        <div className="flex flex-col w-full scroll mt-3">
         {
            weatherData?.hourly?.time?.map((td:string, i)=> (
              td.split(" ")[0] === selectday.slice(0,3) &&(
                <div key={`${td}__${i}`} className="flex flex-row w-full mb-1.5 bg-neutral-700 rounded-lg border border-neutral-600 justify-between items-center text-center align-middle py-px px-3 font-bricolage_grotesque ">
                  <div className="flex flex-row items-center align-middle gap-1">
                    <Image
                      src={CheckWeatherCode(
                        weatherData?.hourly?.weather_code[
                          weatherData.hourly.time.indexOf(td)
                        ] ?? 0,
                      )}
                      alt="Hour weather Icon"
                      width={45}
                      height={45}
                    />
                    <div className="text-[14px] font-medium ">
                      {Number(td.split(" ")[4].split(":")[0]) <= 12 && Number(td.split(" ")[4].split(":")[0]) > 0 
                        ? Number(td.split(" ")[4].split(":")[0])
                        : Number(td.split(" ")[4].split(":")[0]) === 0
                          ? Number(td.split(" ")[4].split(":")[0]) + 12
                          : Number(td.split(" ")[4].split(":")[0]) - 12
                      }
                      {(weatherData?.current?.is_day === 1 ) 
                          ? (Number(td.split(" ")[4].split(":")[0]) < 12) 
                            ? " AM" 
                            : " PM"
                          : (Number(td.split(" ")[4].split(":")[0]) <= 23 && Number(td.split(" ")[4].split(":")[0]) >= 12)
                            ?" PM"
                            :" AM"
                        }
                    </div>
                  </div>

                  <div className="text-[12px] text-neutral-200 ">
                          {weatherData?.hourly?.temperature_2m[
                            weatherData.hourly.time.indexOf(td)
                          ]?.toFixed(0) ?? 0}°
                  </div>
                </div>
              )
            ))
          }

          {!weatherData?.daily?.time?.length && (
            <>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
              <div className="h-8 w-full bg-neutral-700 mb-2"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Body;
