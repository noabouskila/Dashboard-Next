import NextAuth from "next-auth";
import  { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import {z} from 'zod';
import type { User } from "@/app/lib/definitions";
import { sql } from '@vercel/postgres'
import bcrypt from 'bcrypt';


async function getUser(email : string) : Promise<User | undefined>{

    try {
        const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
        return user.rows[0];

    } catch (error) {
        console.error("Echec de la récupération de l'utilisateur:", error);
        throw new Error("Echec de la récupération de l'utilisateur:");
    }

}


export const {auth , signIn , signOut} =   NextAuth({
    ...authConfig,

    // repertorie les differentes options de connexion
    providers : [
        Credentials({
           async authorize(credentials){

            const parsedCredentials =z.object({
                email : z.string().email() , 
                password : z.string().min(6)}).safeParse(credentials);

            if(parsedCredentials.success){
                const {email , password} = parsedCredentials.data;
                const user = await getUser(email);
                if(!user) return null;

                //comparer le mdp passé  et celui de la bdd avec bcrypt
                const passwordMatch = await bcrypt.compare(password , user.password)

                if(passwordMatch) return user;
            }

            console.log('identifiants invalides');
            return null;

           }})
    ]
})