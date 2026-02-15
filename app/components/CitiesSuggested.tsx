import React from 'react'
import GetWeather from '../functions/GetWeather';
import SearchPlaces from '../functions/SearchPlaces';

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

interface CitiesSuggestedProps {
     lang:string,
     searchText: string,
     setSearchText: React.Dispatch<React.SetStateAction<{name:string, latitude:number, longitude:number, timezone:string}>>,
     setPlaceholder: React.Dispatch<React.SetStateAction<string>>,
     isKmh:boolean, 
     isCelsius:boolean, 
     isMm:boolean,
     setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,     
     setWeatherData: React.Dispatch<React.SetStateAction<WeatherData>>,     
     setErrorOccurs: React.Dispatch<React.SetStateAction<boolean>>,
     setNoCityFound: React.Dispatch<React.SetStateAction<boolean>>,
     className?: string,
}


function CitiesSuggested(props: CitiesSuggestedProps) {
     const [citiesData, setCitiesData ]= React.useState<any[]>([]);
     const citiesContainer= React.useRef<HTMLDivElement>(null);
     const [open, setOpen] = React.useState<boolean>(false);

     const searchPotentialCities = async (city:string, Count:number=5, lang:string) =>{
          
          SearchPlaces(city, 5, lang).then((city)=>{
               setCitiesData(city);
          })
     }

     const toggleCitiesContainer = ():void => {
          document.addEventListener("click", (e) => {
               const clickedElementParent = (e.target as HTMLElement).closest(".citiesContainer");
               if (!clickedElementParent) {
                    setOpen(false);
               }
          });
     };

     React.useEffect(() => {
          toggleCitiesContainer()
     }, [])

     React.useEffect(() => {
          setOpen(true);
          props.setErrorOccurs(false);          
          searchPotentialCities(props.searchText, 5, props.lang);
     }, [props.searchText])

     return (
          <div className={`citiesContainer absolute top-full z-50 sinp ${props.className}`}>
               {open && ( 
                    <div className='flex flex-col gap-1 w-full items-center justify-center p-2 bg-neutral-700 rounded-lg border border-neutral-600 shadow-neutral-900 shadow-xl/35 '>
                         <div className='text-center text-[14px] font-medium font-bricolage_grotesque italic text-neutral-300'>
                              Did you mean: 
                         </div>
                         <div 
                              className='flex flex-col gap-0.5 w-full items-center justify-center'
                              ref={citiesContainer}
                         >
                              {props.searchText && citiesData?.map((cityData, i)=>(
                                   <div 
                                        key={`${cityData?.latitude}_${cityData?.longitude}-${cityData?.id},${i}`}
                                        className='cursor-pointer w-full px-1 py-0.75 align-middle text-start text-[15px] text-neutral-200 hover:text-neutral-0 hover:bg-neutral-600 rounded-lg font-normal font-dm_sans '
                                        onClick={(e)=>{
                                             e.preventDefault();
                                             props.setIsSearching(true);
                                             props.setPlaceholder(`${cityData?.name}, ${cityData?.country}`);
                                             GetWeather(props.lang, props.isKmh, props.isCelsius, props.isMm, props?.setIsSearching, cityData?.name, props.setErrorOccurs, cityData?.country || cityData?.timezone.split("/")[0], cityData?.latitude, cityData?.longitude, cityData?.timezone, props.setNoCityFound)
                                             .then(([weather, locationData])=>{
                                                  props.setWeatherData(weather);
                                                  setOpen(false);
                                                  props.setIsSearching(false); 
                                                  props.setSearchText({name:locationData[0], latitude:locationData[1], longitude:locationData[2], timezone:locationData[3]})
                                             });                                       
                                        }}
                                   >
                                        {cityData?.name}, {cityData?.admin1 || cityData?.admin3}, {cityData?.country || cityData?.timezone.split("/")[0]}
                                   </div>
                                   )                         
                              )}   
                         </div>
                    </div> 
               )}
          </div>
     )
}

export default CitiesSuggested
