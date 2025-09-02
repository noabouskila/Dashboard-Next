import type {NextAuthConfig} from 'next-auth'

export const authConfig = {
    // redirection page de connection
    pages : {
        signIn: '/login',
    } ,
    // middleware de protection des routes : verification de l'authentification
    callbacks:{
        authorized({ auth , request : {nextUrl}}){
            // !! double negation : converti une valeur en boolean et inverse sa valeur
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

            // si l'utilisateur est sur une page du dashboard et qu'il a ete authentifié, il peut accéder à la page
            if(isOnDashboard){
                if(isLoggedIn) return true;
                return false;
            }
            else if (isLoggedIn){
                return Response.redirect(new URL('/dashboard', nextUrl))
            }

            return true;
        }
    },
    providers: [],
    // secret: process.env.NEXTAUTH_SECRET,


} satisfies NextAuthConfig;