# surveys-api
Aplicación backend para encuesta

## Instrucciones para levantar la aplicación. 



1. instalar dependencias: 
`````
 npm install
`````

2. Modificar y agregar credenciales en el archivo .env

3. Tener instalado un contenedor de mysql server

    3.1 En el enlace oficial de docker hub https://hub.docker.com/r/microsoft/mssql-server

    3.2 ejecutar el comando: 
`````
docker pull mcr.microsoft.com/mssql/server

`````

3.3 En el archivo .env hay que colocar los valores, para la conexión a la base de datos, por defecto agregar los siguientes

`````
        - DB_PORT=1433
        - DB_USERNAME=sa
`````


3.4 Luego ejecutar el comando 


````` 
docker compuse up 
    
`````

## Creación Tablas 

- En la siguiente ruta, encontrarán los scripts, de las tablas que se crearon: 

`````
 src/Data/scripts
`````


3. Una vez ya ingresado las variables de entorno necesarias, ejecutar npm run dev


## Para ejecutar las pruebas unitarías, seguir los siguientes pasos: 

1. Ejecutar pruebas unitarías, correr el siguiente comando 


````` 
npm run test:watch 

````` 
2. Para ver covertura, ejectuar el siguiente comando: 


````` 
npm run test:coverage 

````` 