const sqlite3 = require('sqlite3').verbose();

const snacksDB = new sqlite3.Database('./snacksDB.sqlite', (err) => 
    {
        if (err) 
        { return console.error(err.message); }
        console.log('Connected to the SQlite database.');
    });

try 
{
    snacksDB.serialize(function ()
    {
        /*Create the empty table with columns and column types*/

        snacksDB.run("DROP TABLE IF EXISTS Restaurants");
        snacksDB.run("DROP TABLE IF EXISTS MENUS_ATW");
        snacksDB.run("DROP TABLE IF EXISTS Menu_Items");

        snacksDB.run(`CREATE TABLE Restaurants (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
            name TEXT,
            imagelink TEXT)`);

        snacksDB.run(`CREATE TABLE Menus_ATW (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            restaurant_id INTEGER, 
            title TEXT,
            FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id))`);

        snacksDB.run(`CREATE TABLE Menu_Items (
            id INTEGER PRIMARY KEY, 
            menu_id INTEGER, 
            cuisine TEXT, 
            name TEXT, 
            price INTEGER, 
            vegan TEXT, 
            FOREIGN KEY (menu_id) REFERENCES Menus_ATW(id))`);
        
    });

}    finally { 
    
        console.log("Creating the databases has worked!");
        snacksDB.close((err) => {
            if (err) {
            return console.error(err.message);
            }
            console.log('Closed the database connection.');
        });

} 

