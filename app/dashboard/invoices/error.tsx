// error pour  gerer toutes les erreurs generales dans le dossier invoices ; alors que notFound pour les erreurs 404 quand l'id n'existe pas

// error.tsx doit etre  un composant client obligatoirement 
"use client";

export default function Error(
    { error, reset }
    : 
    { error: Error & {digest?:string} ;
     reset: () => void 
    }) 
{

  return (
    <main className="flex h-full  flex-col items-center justify-center ">
      <h2 className="text-center ">Oups ! Une erreur est survenue !</h2>
      <p className="text-sm text-red-700">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm transition-colors text-white hover:bg-blue-400"
      >
        Réessayer
      </button>
    </main>
  );
}