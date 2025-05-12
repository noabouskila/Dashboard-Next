import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { defaultOverrides } from "next/dist/server/require-hook";
import { lusitana } from "./fonts";


export default function AcmeLogo(){
    return(
        <div  className={` ${lusitana.className} flex flex-row items-center loading-none text-white`}>
            <GlobeAltIcon className="h-12 w-12 rotate-[15deg]"/>
            <p className="text-[44px]">Acme</p>

        </div>
    )
}