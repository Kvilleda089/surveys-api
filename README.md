
1.228 / 5.000
# surveys-api
Backend application for survey

## Instructions to launch the application.

1. Install dependencies:
`````
npm install
`````

2. Modify and add credentials in the .env file

3. Have a mysql server container installed

3.1 In the official docker hub link https://hub.docker.com/r/microsoft/mssql-server

3.2 run the command:
`````
docker pull mcr.microsoft.com/mssql/server

`````

3.3 In the .env file you have to put the values, for the connection to the database, by default add the following

`````
- DB_PORT=1433
- DB_USERNAME=sa
`````

3.4 Then run the command

`````
docker compose up

`````

## Creating Tables

- In the following path, you will find the scripts, from the tables that were created:

`````
src/Data/scripts
`````

3. Once the tables and database have been created and the environment variables have been entered, run the command:

`````
npm run dev
`````

## To run the unit tests, follow these steps:

1. Run unit tests, run the following command

`````
npm run test:watch

`````
2. To see coverage, run the following command:

`````
npm run test:coveragev

`````