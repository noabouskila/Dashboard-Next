'use client';
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {generatePagination} from "@/app/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { ArrowLeftIcon  , ArrowRightIcon } from "@heroicons/react/24/outline";


export default function Pagination({totalPages} : {totalPages:number}) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const allPages = generatePagination(currentPage , totalPages) ?? [];
    // console.log(allPages)


    // fonction pour generer l'url de chaque numero de page avec la query existante
    const createPageUrl = (pageNumber : number | string ) => {

      // urlsearchparams sert a manipuler les parametres de l'url
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNumber.toString());

      // retourne la chaine de requete complete
      return `${pathname}?${params.toString()}`;
    }

  return (
    <>
      {/* left arrow */}
      <div className="inline-flex">
        <PaginationArrow
          href={createPageUrl(currentPage - 1)}
          direction="left"
          isDisabled={currentPage <= 1}
        />

        {/* pagination number */}
        <div className="flex -space-x-px ">
          {allPages.map((page, index) => {
            // definir la position du numero de page
            let position: "first" | "middle" | "last" | "single" | undefined;
            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={page}
                page={page}
                href={createPageUrl(page)}
                isActive={currentPage === page}
                position={position}
              />
            );
          })}
        </div>
      </div>

        {/* right arrow */}
        <PaginationArrow
            href={createPageUrl(currentPage + 1)}
            direction="right"
            isDisabled={currentPage >= totalPages}
        />
    </>
  );
}


function PaginationNumber(
    {page , href , isActive , position } : 
    {   page:number  | string ;
        href:string ; 
        isActive:boolean ; 
        position? : "first" | "middle" | "last" | "single"
    })
    {

        const className = clsx(
            'flex h-10 w-10 items-center justify-center text-sm border',
            {
                "rounded-l-md": position === "first" || position === "single",
                "rounded-r-md": position === "last" || position === "single",
                'z-10 bg-blue-600 border-blue-600 text-white': isActive,
                'hover:bg-gray-100': !isActive && position !== "middle",
                'text-gray-300':  position === "middle",
            }
        )

        return isActive || position === "middle" ? (
            <div className={className} >
                {page}
            </div>
        ) : (
            <Link href={href} className={className} >
                {page}  
            </Link>

        )

}

function PaginationArrow( {
    href , direction , isDisabled
    } : { 
    href  : string, 
    direction : 'left' | 'right' ,
    isDisabled?: boolean
}){

    {
        const className = clsx(
            'flex h-10 w-10 items-center justify-center rounded-md border ',
            {
                'pointer-events-none text-gray-300 ': isDisabled,
                'hover bg-gray-100' : !isDisabled, 
                'mr-2 mmd:mr-4': direction === 'left' ,
                'ml-2 mmd:ml-4': direction === 'right'  
            }
        )


    // fleche gauche ou droite
       const icon =  direction === 'left' ? (
        <ArrowLeftIcon  className="w-4"/>
        ) : (
            <ArrowRightIcon className="w-4" />
        )

        return isDisabled ? (
            <div className= {className}> { icon } </div>
        ) : (
            <Link href={href} className={className}> { icon } </Link>
        )
    }  
}
