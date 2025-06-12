const { db }    = require('@vercel/postgres');



// import fake data
const {
    users,
    customers,
    invoices,
    revenue
} = require('../lib/placeholder-data.js');


// fonction pour gestion  table users
async function seedUsers(client) {
    //   creation de la table users
   try {
       
        // uuid cle specifique pour chaque utilisateur
        await client.sql`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `;
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `;

        console.log("Table users créée avec succès.");

        // insertion des données dans la table users
        // On utilise Promise.all pour insérer tous les utilisateurs en parallèle
        const insertdUsers = await Promise.all(
            users.map(user => {
                return client.sql`
                    INSERT INTO users (name, email, password)
                    VALUES (${user.name}, ${user.email}, ${user.password})
                    ON CONFLICT (email) DO NOTHING;
                `;
            })
        ).then(() => {
            console.log("Données insérées dans la table users avec succès.");
        }).catch((error) => {
            console.error("Erreur lors de l'insertion des données dans la table users:", error);
        });


    } catch (error) {
        console.error("Erreur lors de la création de la table users:", error);
        throw error;
    }
}

// gestion connection bdd 
async function main() {

    // connexion bdd
    const client = await db.connect();
    console.log(client);


    //   lancer la requete de creation de la table users + injection data
    await seedUsers(client);


    // terminer connexion a bdd quand toutes les requetes sont faites
    await client.end();
}


// en cas d'erreur 
main().catch((err) => {
  console.error("une erreur s'est produite:", err);
//   process.exit(1);
});