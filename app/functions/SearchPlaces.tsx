import React from 'react'

async function SearchPlaces (
     city:string, 
     Count:number, 
     lang:string,
     ):Promise<[{}]> {
     let data = []
     if (city) {
          try {
               const params = new URLSearchParams({
                    name: city,
                    count: Count.toString(),
                    language: lang,
                    format: 'json'
               });
               const url = `${process.env.NEXT_PUBLIC_OMAPI_SEARCH_URL}?${params.toString()}`;
               
               const response = await fetch(url, {method: 'GET'});

               const getResults = await response.json();   
               data = getResults.results;
                          
          } catch (error) {
               console.error("Error fetching city info:", error);
          } 
     }
     return data; 
}

export default SearchPlaces
