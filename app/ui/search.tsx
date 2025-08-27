
"use client"
import  { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams  , usePathname , useRouter} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";



export default function Search({placeholder} : {placeholder : string}){

    const searchParams = useSearchParams();
    const pathname = usePathname();

    // replace permet de definir une nouvelle url de recherche sans recharger la page
    const {replace} = useRouter();


    // useDebounce envi la requete qune seule fois apres le delai  :
    //  1er agrument : la fonction a debouncer , 2eme argument : delai en ms
    const handleSearch =  useDebouncedCallback((term : string)=> {
      // url search params sert a manipuler les parametres de l'url
      const params = new URLSearchParams(searchParams);

      // indiquer la clé page
      params.set("page", "1");

      // .set permet d'ajouter ou de mettre a jour un parametre
      if (term) {
        params.set("query", term);
      } else {
        // si le terme est vide on supprime le parametre de recherche
        params.delete("query");
      }

      replace(`${pathname}?${params.toString()}`);
    } , 300);


 


    return (
        <div className="relative flex flex-1 flex-shrink-0">
            
            <label htmlFor="search" className="sr-only">Rechercher</label>

            <input 
            id="search"
            autoComplete="off"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 "
            placeholder={placeholder}
            onChange={(e)=>{
                handleSearch(e.target.value)
            }}
            // defaultValue a la difference de value ne force pas le composant a etre controlé
            defaultValue={searchParams.get("query")?.toString()}
            />

            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
            
        </div>
        
       
    )
}