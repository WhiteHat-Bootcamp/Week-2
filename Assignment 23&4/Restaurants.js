const sqlite3 = require('sqlite3').verbose();

const restaurantsDB = new sqlite3.Database('./restaurantsDB.sqlite', (err) => 
    {
        if (err) 
        { return console.error(err.message); }
        console.log('Connected to the SQlite database.');
    });

try 
{
    restaurantsDB.serialize(function ()
    {
        /*Create the empty table with columns and column types*/

        //restaurantsDB.run("DROP TABLE Restaurants");

        restaurantsDB.run(`CREATE TABLE IF NOT EXISTS Restaurants (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
            name TEXT, address TEXT, 
            city TEXT, 
            imagelink TEXT)`);

        restaurantsDB.run(`CREATE TABLE IF NOT EXISTS Menus_ATW (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            restaurant_id INTEGER, 
            title TEXT,
            FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id))`);

        restaurantsDB.run(`CREATE TABLE IF NOT EXISTS Menu_Items (
            id INTEGER PRIMARY KEY, 
            menu_id INTEGER, 
            cuisine TEXT, 
            name TEXT, 
            price INTEGER, 
            vegan TEXT, 
            FOREIGN KEY (menu_id) REFERENCES Menus_ATW(id))`);


        /*Insert rows for the restaurants table */

        let stmt;

        try 
        {
            stmt = restaurantsDB.prepare(`INSERT INTO Restaurants (name, address, city, imagelink)
            VALUES 
            ('Around the World', '4501 Earth Boulevard, World', 'NY','www.ATW.com'),
            ('Christophers', '18 Wellington Street', 'London', 'www.christophers.com'),
            ('Cottons', '132 Curtain Road, Shoreditch', 'London', 'www.cottons-restaurant.co.uk'),
            ('Maceillo', '12 Exmouth Market', 'London', 'www.Maceillo.com'),
            ('Clerkenwell Grind', '2-4 Old Street', 'London', 'www.clerkenwellgrind.com'),
            ('Earls', '12 Capilano Road', 'Vancouver', 'www.earls.com');
            `)

            stmt.run();

        } finally //runs regardless of whether there was an error above
        { 
            stmt.finalize() //closes the statement and releases resources
        };

        

        /*Insert rows for Menu table */

        let stmt2 = restaurantsDB.prepare("INSERT INTO Menus_ATW (restaurant_id, title) VALUES (?,?)");

        let menuTitles = ["Japanese", "British", "American", "Indian"]

        for (let i = 0; i < 4; i++)
        {
            stmt2.run(1, menuTitles[i]);
        }

        stmt2.finalize();



        /*Insert rows for the Menu Items table */

        let stmt3 = restaurantsDB.prepare(`INSERT INTO Menu_Items (id, menu_id, cuisine, name, price, vegan) VALUES 
            (1, 1, 'Japanese', 'Edamame Beans', 3.99, 'Y'), (2, 1, 'Japanese','Miso Soup', 2.99, 'Y'),
            (3, 1, 'Japanese','Beef Teriyaki Don', 9.99, 'N'),
            (4, 1, 'Japanese','WAGYU Beef Teriyaki Don', 21.99, 'N'),
            (5, 1, 'Japanese','Tuna Tataki', 13.99, 'N'),
            (6, 1, 'Japanese','Yam Tempura Maki Roll', 5.99, 'Y'),
            (7, 1, 'Japanese','Spicy Tuna Maki Roll', 8.99, 'N'),
            (8, 1, 'Japanese','Salmon & Avocado Maki Roll', 8.99, 'N'),
            (9, 1, 'Japanese','California Roll', 6.99, 'N'),
            (10, 1, 'Japanese','Chicken Yakisoba', 7.99, 'N'),
            (11, 2, 'British','Full Roast (Chicken)', 25.99, 'N'),
            (12, 2, 'British','Full Roast (Nut)', 19.99, 'Y'),
            (13, 2, 'British','Fish & Chips', 7.99, 'N'),
            (14, 2, 'British','Full English', 10.99, 'N'),
            (15, 2, 'British','Jacket Potato with choice of filling', 8.99, 'Y'),
            (16, 2, 'British','Shepherds Pie', 12.99, 'N'),
            (17, 2, 'British','6.oz Filet Steak', 30.00, 'N'),
            (18, 2, 'British','9.oz Rump Steak', 18.00, 'N'),
            (19, 3, 'American', 'Hot Dog with Pulled Pork', 7.99, 'N'),
            (20, 3, 'American', 'Deep Dish 4 Cheese Pizza', 10.99, 'N'),
            (21, 3, 'American', '6 oz Chuck Steak Burger', 11.99, 'N'),
            (22, 3, 'American', 'Parmesan Macaroni & Cheese', 9.99, 'N'),
            (23, 3, 'American', 'Waldorf Salad', 8.99, 'Y'),
            (24, 3, 'American', 'Blueberry Milkshake', 5.99, 'N'),
            (25, 3, 'American', 'Nachos & Salsa', 3.99, 'Y'),
            (26, 4, 'Indian', 'Butter Chicken', 8.99, 'N'),
            (27, 4, 'Indian', 'Paneer', 5.99, 'Y'),
            (28, 4, 'Indian', 'Chicken Tikka', 10.00, 'N')`);
        
        stmt3.run();

        stmt3.finalize();


        /*Join the menus and restaurants tables */

        restaurantsDB.each("SELECT * FROM Restaurants JOIN Menus_ATW ON Restaurants.id = Menus_ATW.restaurant_id"),
            function (err, rows) {  // this is a callback function
                console.log(rows);  // rows contains the matching rows
            }
        

    })

} finally { 
    console.log("It worked!");
    restaurantsDB.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Closed the database connection.');
      });

} 

