"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface WrapperProps {
    isImperial: boolean,
    setIsImperial: React.Dispatch<React.SetStateAction<boolean>>,
    isCelsius: boolean,
    setIsCelsius: React.Dispatch<React.SetStateAction<boolean>>,
    isKmh: boolean,
    setIsKmh: React.Dispatch<React.SetStateAction<boolean>>,
    isMm: boolean,
    setIsMm: React.Dispatch<React.SetStateAction<boolean>>
}

function wrapper ({isImperial, setIsImperial, isCelsius, setIsCelsius, isKmh, setIsKmh, isMm, setIsMm}:WrapperProps) {

    const switchRef = useRef<HTMLDivElement>(null);
    const tempRef_1 = useRef<HTMLDivElement>(null);
    const tempRef_2 = useRef<HTMLDivElement>(null);
    const windRef_1 = useRef<HTMLDivElement>(null);
    const windRef_2 = useRef<HTMLDivElement>(null);
    const precipitationRef_1 = useRef<HTMLDivElement>(null);
    const precipitationRef_2 = useRef<HTMLDivElement>(null);

    const toggleDropdown = ():void => {
        document.addEventListener("click", (e) => {
            const isDropdownTrigger = (e.target as HTMLElement).closest(".dropdown-trigger");
            const isDropdownContent = (e.target as HTMLElement).closest(".dropdown-content");
            if (!isDropdownTrigger && !isDropdownContent) {
                document.querySelectorAll(".dropdown").forEach((dropdown) => {
                    dropdown.classList.remove("is-open");
                });
            }
        });
        document.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                trigger?.closest(".dropdown")?.classList.toggle("is-open");
            });
        });
    };
  
    const toggleDropdownContent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        // si l'élément cliqué n'est pas un enfant de dropdown-content-child ou s'il n'est pas dropdown-content-child, ne rien faire 
        const clickedElementparent = (e.target as HTMLElement).closest(".dropdown-content-child");
        if (!clickedElementparent) return;
        
        if (clickedElementparent.classList.contains("dropdown-content-child-1")) {
            e.currentTarget.classList.toggle("bg-neutral-700");
        }
                    
        e.currentTarget.querySelectorAll(".dropdown-content-child").forEach((child) => {
            if (child === clickedElementparent) {
                child.classList.add("bg-neutral-700");
                child.querySelector("img")?.classList.remove("hidden");
            } else {
                child.classList.remove("bg-neutral-700");
                child.querySelector("img")?.classList.add("hidden");
            }
        });
    };

    const checkAllUnitsFalse = ():boolean => {
        const localIsCelsius = localStorage.getItem("isCelsius");
        const localIsKmh = localStorage.getItem("isKmh");
        const localIsMm = localStorage.getItem("isMm");
        (localIsCelsius === "false" && localIsKmh === "false" && localIsMm === "false") 
            ? localStorage.setItem("isImperial", "true")
            : localStorage.setItem("isImperial", "false");
        return (localIsCelsius === "false" && localIsKmh === "false" && localIsMm === "false");
    }
    
    const unitsImpContent = [tempRef_2, windRef_2, precipitationRef_2]; 
    const unitsMetContent = [tempRef_1, windRef_1, precipitationRef_1]; 

    useEffect(() => {
        toggleDropdown();
        ["isCelsius", "isKmh", "isMm"].forEach((unit, i)=>{
            const localUnit = localStorage.getItem(unit);
            localUnit === "false" && unitsImpContent[i].current?.click();
            localUnit === "true" && unitsMetContent[i].current?.click();
        })
        // cette boucle permet de synchroniser l'état des unités avec le localStorage au chargement de la page, en cliquant sur les éléments correspondants dans le dropdown pour appliquer les styles et les checkmarks
        // elle ne sera exécutée qu'une seule fois au chargement de la page grâce au tableau de dépendances vide, et elle garantit que les préférences de l'utilisateur sont correctement affichées dans le dropdown dès le départ
    }, []);

    // useEffect(() => {

    //     if (isImperial) {
    //         ["isCelsius", "isKmh", "isMm"].forEach((unit, i)=>{
    //             const localUnit = localStorage.getItem(unit);
    //             localUnit === "true" && unitsImpContent[i].current?.click();
    //         })
    //     } else {
    //         ["isCelsius", "isKmh", "isMm"].forEach((unit, i)=>{
    //             const localUnit = localStorage.getItem(unit);
    //             localUnit === "false" && unitsMetContent[i].current?.click();
    //         })
    //     }                 
    // }, [isImperial]);

    
  return (
    <div className="absolute top-0 left-[2.5vw] pt-2 h-11 w-[95vw] bgneutral-900 backdrop-blur-sm z-2000 flex flex-row justify-between items-center font-dm_sans ">
      <div className="cursor-pointer" 
        onClick={()=>{window.location.reload()}}
      >
        <Image
          src="/logo.svg"
          alt="Weather icon"
          width={130} // is in pixels
          height={100}
        />
      </div>

      <div className="dropdown dropdown-bottom">
        <button className="dropdown-trigger flex flex-row w-24 h-6.5 gap-2 items-center justify-between text-center text-[12px] text-neutral-0 font-light bg-neutral-800 border border-transparent focus:border-neutral-200 hover:border-neutral-200 rounded-lg px-3 py-1">
            <div>
                <Image
                src="/icon-units.svg"
                alt="Units icon"
                width={12}
                height={12}
                />
            </div>
            <div>Units</div>
            <Image
                src="/icon-dropdown.svg"
                alt="Units icon"
                width={12}
                height={12}
            />
        </button>

        <div 
            className="dropdown-content w-37.5 bg-neutral-800 rounded-lg text-left text-[14px] text-neutral-0 font-light border border-neutral-600 shadow-lg"
            
        >            
            <div
                className="dropdown-content-child dropdown-content-child-1 text-neutral-0 text-[12px] mb-0.5 border border-transparent hover:border-neutral-200 rounded-md "
                onClick={(e) => {
                    toggleDropdownContent(e);
                    localStorage.setItem("isImperial", (!isImperial).toString());
                    setIsImperial(!isImperial);
                    // la nouvelle valeur de isImperial sera affichée au prochain render, mais pas immédiatement après le setIsImperial
                    (localStorage.getItem("isImperial") === "true")
                        ? unitsImpContent.forEach((unit)=>{unit.current?.click()})
                        : unitsMetContent.forEach((unit)=>{unit.current?.click()});
                }}
                ref = {switchRef}
            >Switch to Imperial
            </div>

            <div 
                className=" text-[12px] border-b border-b-neutral-600 mb-1 "
                onClick={(e) => {
                    toggleDropdownContent(e);
                }}
            >
                <label className="text-neutral-200 text-[10px] font-light p-1.25  ">
                    Temperature
                </label>

                <div
                    className=" dropdown-content-child flex flex-row justify-between mb-1 border border-transparent hover:border-neutral-200 rounded-md"
                    ref={tempRef_1}
                    onClick={()=>{
                        if (localStorage.getItem("isCelsius") === "true" ) return
                        setIsCelsius(!isCelsius);
                        localStorage.setItem("isCelsius", (!isCelsius).toString());
                        checkAllUnitsFalse() ? switchRef.current?.classList.add("bg-neutral-700") : switchRef.current?.classList.remove("bg-neutral-700");
                    }}
                >
                    <div className="text-start cursor-pointer">
                        Celsius (°C)
                    </div>

                    <Image
                        src="/icon-checkmark.svg"
                        alt="Units icon"
                        width={12}
                        height={12}
                        className=" hidden "
                    />
                </div>

                <div
                    className=" dropdown-content-child flex flex-row justify-between border border-transparent hover:border-neutral-200 rounded-md  "
                    ref={tempRef_2}
                    onClick={()=>{
                        if (localStorage.getItem("isCelsius") === "false" ) return
                        setIsCelsius(!isCelsius);
                        localStorage.setItem("isCelsius", (!isCelsius).toString());
                        checkAllUnitsFalse() ? switchRef.current?.classList.add("bg-neutral-700") : switchRef.current?.classList.remove("bg-neutral-700");
                    }}
                >
                    <div className=" text-start cursor-pointer">
                        Fahrenheit (°F)
                    </div>
                    <Image
                        src="/icon-checkmark.svg"
                        alt="Units icon"
                        width={12}
                        height={12}
                        className="hidden"
                    />
                </div>

            </div>

            <div 
                className=" text-[12px] border-b border-b-neutral-600 mb-1 "
                onClick={(e) => {
                    toggleDropdownContent(e);
                }}
                
            >
                <label className="text-neutral-200 text-[10px] font-light p-1.25  ">
                    Wind Speed
                </label>

                <div
                    className=" dropdown-content-child flex flex-row justify-between mb-1 border border-transparent hover:border-neutral-200 rounded-md"
                    ref={windRef_1}
                    onClick={()=>{
                        if (localStorage.getItem("isKmh") === "true" ) return
                        setIsKmh(!isKmh);
                        localStorage.setItem("isKmh", (!isKmh).toString());
                        checkAllUnitsFalse() ? switchRef.current?.classList.add("bg-neutral-700") : switchRef.current?.classList.remove("bg-neutral-700");
                    }}
                >
                    <div className="text-start cursor-pointer">
                        km/h
                    </div>

                    <Image
                        src="/icon-checkmark.svg"
                        alt="Units icon"
                        width={12}
                        height={12}
                        className=" hidden "
                    />
                </div>

                <div
                    className=" dropdown-content-child flex flex-row justify-between border border-transparent hover:border-neutral-200 rounded-md  "
                    ref={windRef_2}
                    onClick={()=>{
                        if (localStorage.getItem("isKmh") === "false" ) return
                        setIsKmh(!isKmh);
                        localStorage.setItem("isKmh", (!isKmh).toString());
                        checkAllUnitsFalse() ? switchRef.current?.classList.add("bg-neutral-700") : switchRef.current?.classList.remove("bg-neutral-700");
                    }}
                >
                    <div className=" text-start cursor-pointer">
                        mph
                    </div>
                    <Image
                        src="/icon-checkmark.svg"
                        alt="Units icon"
                        width={12}
                        height={12}
                        className="hidden"
                    />
                </div>

          </div>

            <div 
                className=" text-[12px] mb-0.5 "
                onClick={(e) => {toggleDropdownContent(e);}}
            >
                <label className="text-neutral-200 text-[10px] font-light p-1.25  ">
                    Precipitation
                </label>

                <div
                    className=" dropdown-content-child flex flex-row justify-between mb-1 border border-transparent hover:border-neutral-200 rounded-md"
                    ref={precipitationRef_1} 
                    onClick={()=>{
                        if (localStorage.getItem("isMm") === "true" ) return
                        setIsMm(!isMm);
                        localStorage.setItem("isMm", (!isMm).toString());
                        checkAllUnitsFalse() ? switchRef.current?.classList.add("bg-neutral-700") : switchRef.current?.classList.remove("bg-neutral-700");
                    }}
                >
                    <div className="text-start cursor-pointer">
                        Millimeters (mm)
                    </div>

                    <Image
                        src="/icon-checkmark.svg"
                        alt="Units icon"
                        width={12}
                        height={12}
                        className=" hidden "
                    />
                </div>

                <div
                    className=" dropdown-content-child flex flex-row justify-between border border-transparent hover:border-neutral-200 rounded-md  "
                    ref={precipitationRef_2}
                    onClick={()=>{
                        if (localStorage.getItem("isMm") === "false" ) return
                        setIsMm(!isMm);
                        localStorage.setItem("isMm", (!isMm).toString());
                        checkAllUnitsFalse() ? switchRef.current?.classList.add("bg-neutral-700") : switchRef.current?.classList.remove("bg-neutral-700");
                    }}
                >
                    <div className=" text-start cursor-pointer">
                        Inches (in)
                    </div>
                    <Image
                        src="/icon-checkmark.svg"
                        alt="Units icon"
                        width={12}
                        height={12}
                        className="hidden"
                    />
                </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default wrapper;
