const sqlite3 = require('sqlite3').verbose();
const fsp = require('fs').promises; // Node.js file system promises module 
const path = require('path'); // Node.js directories and file paths module
const snacksDB = new sqlite3.Database('./snacksDB.sqlite'); 

async function load() 
{
    console.log('calling load');
    const buffer = await fsp.readFile('./restaurants.json'); //call the readFile method from the fsp module and wait for that to load before the next step
    const restaurants = (JSON.parse(String(buffer))); //Make the content JS and save in a variable
    console.log(restaurants);

    try 
    {
        snacksDB.serialize(function ()
        {
            /*Insert rows for the restaurants table */

            let stmt;
            
            try 
            {
                stmt = snacksDB.prepare(`INSERT INTO Restaurants (name, imagelink) VALUES (?, ?)`);

                for (let i=0; i < restaurants.length; i++)
                {
                    console.log("Hello banana");
                    stmt.run(restaurants[i].name, restaurants[i].image);
                }

            } finally //runs regardless of whether there was an error above
            { 
                stmt.finalize(); //closes the statement and releases resources
            };

            
            // /*Insert rows for Menu table */

            let stmt2 = snacksDB.prepare("INSERT INTO Menus_ATW (restaurant_id, title) VALUES (?,?)");

            for (let i = 0; i < restaurants.length; i++)
            {
                let R_index = i+1;

                for (let j=0; j < restaurants[i].menus.length; j++)
                {
                    stmt2.run(R_index, restaurants[i].menus[j].title);
                }
            }

            stmt2.finalize();

            // /*Insert rows for the Menu Items table */

            let stmt3 = snacksDB.prepare('INSERT INTO Menu_Items (menu_id, name, price) VALUES (?, ?, ?)');

            for (let i=0; i < restaurants.length; i++)
            {
                for (let j=0; j < restaurants[i].menus.length; j++)
                {
                    M_index = j+1; 
                    for (let k=0; k < restaurants[i].menus[j].items.length; k++)
                    {
                        stmt3.run(M_index, restaurants[i].menus[j].items[k].name, restaurants[i].menus[j].items[k].price);
                    }
                }
            }

            stmt3.finalize();

            // /*Join the menus and restaurants tables */

            // snacksDB.each("SELECT * FROM Restaurants JOIN Menus_ATW ON Restaurants.id = Menus_ATW.restaurant_id"),
            //     function (err, rows) {  // this is a callback function
            //         console.log(rows);  // rows contains the matching rows
            //     }
            
        });

    } finally 
    { 
        console.log("Populating the DB worked!");
        snacksDB.close((err) => 
        {
            if (err) {
            return console.error(err.message);
            }
            console.log('Closed the database connection.');
        });

    }

}

load();




