import React from 'react'
import Image from "next/image";
interface SelectProps {
     values: any[],
     value:string,
     setValue: React.Dispatch<React.SetStateAction<string>>,
     dropdownClassName?:string
     triggerClassName?:string
     ulClassName?:string
     liClassName?:string
}
const Select:React.FC<SelectProps> = ({values, value, setValue, dropdownClassName, triggerClassName, ulClassName, liClassName}) => {
     const [open, setOpen] = React.useState<boolean>(false);
     const [isloading, setIsLoading] = React.useState<boolean>(true);
     const toggleSelectDropdown = ():void => {
          document.addEventListener("click", (e) => {
               const isDropdownTrigger = (e.target as HTMLElement).closest(".select-dropdown");
               if (!isDropdownTrigger) {
                    setOpen(false);
               }
          });
     };
     React.useEffect(() => {toggleSelectDropdown(); setIsLoading(false)}, []);
     return (
          <div className={`select-dropdown relative ${dropdownClassName}`}>
          {/* Trigger */}
               <button
                   onClick={() => setOpen(!open)}
                   className={`${triggerClassName}`}
               >
                   <div>{isloading? "_" : value}</div>
                   <Image
                     src="/assets/icon-dropdown.svg"
                     alt="Units icon"
                     width={12}
                     height={12}
                   />
               </button>
     
               {/* Options */}
               {open && (
                    <ul className={`absolute sinp z-50 mt-1 overflow-hidden ${ulClassName}`}>
                    {values.map((v) => (
                         <li
                              key={v}
                              onClick={() => {
                                   setValue(v);
                                   setOpen(false);
                              }}
                              className={`cursor-pointer ${liClassName}`}
                         >
                              {v}
                         </li>
                    ))}
                    </ul>
               )}
          </div>
     )
}

export default Select
