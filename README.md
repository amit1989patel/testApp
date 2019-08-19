# TestApp 
Builds using  Express + knex + Bookself + sqlite3 using ES6 syntax. 

1. How do I get set up and running? 

Step 1: 
npm install knex -g   (not required if already globally present)
npm install babel-cli -g

Step 2: 
npm install  (On root directory of folder to install third party dependency)

Step 3: 
npm run migrate   (Setup database with model defined to change anythings create another migration file with change and run the following command )

Step 4: 
npm start  (Start the application)

*****Application can be access on the following Url:   http://localhost/serverIp:3000 


HERE IS THE API LIST AND ITS URL: 
(A)User
    3. POST /registerUser  (public)
        http://localhost:3000/api/v1/users/registerUser
    3. POST /login           (public)
        http://localhost:3000/api/v1/users/login
    3. GET /getUser           (private)
        http://localhost:3000/api/v1/users/getUsers


##Database

dev.sqlite3




USER 

##Migration script

knex migrate:make {create_user}