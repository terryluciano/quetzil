# Quetzil

The quest to find the greatest pretzel... and more!

The goal of this project is to create a food discovery platform that allows users to search for the highest rated food items in their area. The platform will also allow users to add their own ratings for food items they have tried.

If you have any problems setting up the project you can also visit the website [here](https://quetzil.com/) (https://quetzil.com/).

## Tech Requirements

-   [Node.js](https://nodejs.org/en/) (v18.x)
-   [PostgreSQL](https://www.postgresql.org/) (v14.x)

## Backend Installation

0. You will need to get the connection information from PostgreSQL like the port, username, host ("localhost" for local env), and password (if needed)
1. Clone the repository
2. Create a `.env` file in the root of the `server` directory. You can also reference the `.envSample` file as sample, but make sure to change the values to your own. The following is a list of the required environment variables:

```bash
# SERVER
PORT="8080"

# DB
DB_PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME="quetzil"

# SESSION
SESSION_SECRET=

# ENV
URL="http://localhost:3000" #"https://quetzil.com"
```

3. Open your terminal and navigate to the `server` directory
4. Install the server dependencies

```bash
npm install
```

Side note: you might need to change the change the uri for postgres depanding on your postgres connection info. For this you will need to update the `drizzle-kit` config in the `server/drizzle.config.ts` file.

```ts
    dbCredentials: {
        url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    },
```

5. Run the database migrations

```bash
npm run migrate
```

## Frontend Installation

6. In your terminal navigate to the `client` directory
7. Install the client dependencies

```bash
npm install
```

## Starting Dev Environment

8. Open two separate terminals
9. In the first terminal, navigate to the `server` directory and run the server

```bash
npm run dev
```

10. In the second terminal, navigate to the `client` directory and run the client

```bash
npm run dev
```

11. Open your browser and navigate to `http://localhost:3000`
12. Have fun exploring

By default there won't be anything in the database besides food items and cuisines type. those are manually added at the beginning of every server start and pulled from the `data.json` in the `server/public` directory.

You will need to create a user and login to add your own ratings and submit new restaurants.
