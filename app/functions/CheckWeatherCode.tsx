import React from 'react'

function CheckWeatherCode(weather_code:number):string {
     const src = weather_code < 2
                    ? "/assets/icon-sunny.webp"
                    : weather_code < 3
                         ? "/assets/icon-partly-cloudy.webp"
                         : weather_code < 45
                              ? "/assets/icon-overcast.webp"
                              : weather_code < 51
                                  ? "/assets/icon-fog.webp"
                                  : (weather_code < 56 || (weather_code >= 80 && weather_code < 85))
                                        ? "/assets/icon-drizzle.webp"
                                        : weather_code >= 61 && weather_code < 66
                                             ? "/assets/icon-rain.webp"
                                             : (weather_code >= 70 && weather_code < 78) || (weather_code >= 85 && weather_code < 87)
                                                  ? "/assets/icon-snow.webp"
                                                  : "/assets/icon-storm.webp"
     return src
}

export default CheckWeatherCode
