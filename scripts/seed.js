const { db }    = require ('@vercel/postgres');

console.log("MON POSTGRES_URL:", process.env.POSTGRES_URL);


// import fake data
const {
    users,
    customers,
    invoices,
    revenue
} = require('../app/lib/placeholder-data');

// import du bcrypt pour crypter le mot de passe
const bcrypt = require('bcrypt');



// fonction pour gestion  table users
async function seedUsers(client) {
    // 1)  creation de la table users
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

        // 2) insertion des données dans la table users
        // On utilise Promise.all pour insérer tous les utilisateurs en parallèle
        const insertdUsers = await Promise.all(
            users.map( async user => {

                // securité mot de passe
                const hashedPassword = await bcrypt.hash(user.password, 10);

                return client.sql`
                    INSERT INTO users (id , name, email, password)
                    VALUES ( ${user.id} ,${user.name}, ${user.email}, ${hashedPassword})
                    -- ON CONFLICT permet d'ignorer les doublons basés sur l'email
                    -- Si l'email existe déjà, la ligne ne sera pas insérée à nouveau
                    ON CONFLICT (email) DO NOTHING;
                `;
            })
        );
        console.log(`seeded ${insertdUsers.length}  users` );


        // 3) retour de la fonction avec les requetes
        return {createTable,
            users :  insertdUsers};



    } catch (error) {
        console.error("Erreur seeding users:", error);
        throw error;
    }
}

// fonction pour gestion  table invoices
async function seedInvoices(client) {
    // 1)  creation de la table invoices
   try {
        
       
        // uuid cle specifique pour chaque facture
        await client.sql`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `;
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS invoices (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                customer_id UUID NOT NULL REFERENCES customers(id),
                amount INT NOT NULL,
                status VARCHAR(255) NOT NULL,   
                date DATE NOT NULL ,
                created_at TIMESTAMP DEFAULT now(),
                UNIQUE (customer_id, amount, status, date ,created_at)
            );
        `;

        console.log("Table invoices créée avec succès.");

        // 2) insertion des données dans la table invoices
        // On utilise Promise.all pour insérer tous les factures en parallèle
        const insertInvoices = await Promise.all(
            invoices.map( async invoice => {
                return client.sql`
                    INSERT INTO invoices (customer_id, amount, status, date)
                    VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})    
                    ON CONFLICT (customer_id, amount, status, date, created_at) DO NOTHING;
                `;
                
            })
        );
        console.log(`seeded ${insertInvoices.length}  invoicies` );


        // 3) retour de la fonction avec les requetes
        return {
            createTable,
            invoices :  insertInvoices
        };



    } catch (error) {
        console.error("Erreur seeding invoices:", error);
        throw error;
    }
}


// fonction pour gestion  table customers
async function seedCustomers(client) {
    // 1)  creation de la table customers
   try {
       
        // uuid cle specifique pour chaque client
        await client.sql`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `;
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS customers (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE, 
                image_url VARCHAR(255) NOT NULL
            );
        `;

        console.log("Table customers créée avec succès.");

        // 2) insertion des données dans la table customers
        // On utilise Promise.all pour insérer tous les clients en parallèle
        const insertCustomers = await Promise.all(
            customers.map( async customer => {
                return client.sql`
                    INSERT INTO customers (id, name, email, image_url)
                    VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
                    ON CONFLICT (id) DO NOTHING;
                `;
                
            })
        );
        console.log(`seeded ${insertCustomers.length}  customers` );


        // 3) retour de la fonction avec les requetes
        return {
            createTable,
            customers :  insertCustomers
        };



    } catch (error) {
        console.error("Erreur seeding customers:", error);
        throw error;
    }
}

// fonction pour gestion  table revenue
async function seedRevenue(client) {
    // 1)  creation de la table revenue
   try {
       
        // uuid cle specifique pour chaque revenue
        await client.sql`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `;
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS revenue (
                
                month VARCHAR(4) NOT NULL UNIQUE,
                revenue INT NOT NULL
            );
        `;

        console.log("Table revenue créée avec succès.");

        // 2) insertion des données dans la table revenue
        // On utilise Promise.all pour insérer tous les revenues en parallèle
        const insertRevenue = await Promise.all(
            revenue.map( async (rev) => {
                return client.sql`
                    INSERT INTO revenue (month, revenue)
                    VALUES (${rev.month}, ${rev.revenue})
                    ON CONFLICT (month) DO NOTHING;
                `;
                
            })
        );
        console.log(`seeded ${insertRevenue.length}  revenues ` );


        // 3) retour de la fonction avec les requetes
        return {
            createTable,
            revenue :  insertRevenue
        };



    } catch (error) {
        console.error("Erreur seeding revenue:", error);
        throw error;
    }
}

// gestion connection bdd 
async function main() {

    // connexion bdd
    const client = await db.connect();


    //   appels des fonctions pour creer les tables et insérer les données
    await seedUsers(client);

    await seedCustomers(client);
    await seedInvoices(client);
    
    await seedRevenue(client);

    // terminer connexion a bdd quand toutes les requetes sont faites
    await client.end();

    console.log("✅ Tous les seeds ont été exécutés avec succès !");
}


// en cas d'erreur 
main().catch((err) => {
  console.error("une erreur s'est produite:", err);
//   process.exit(1);
});

