const sqlite3 = require('sqlite3').verbose();

let customerDB = new sqlite3.Database('./customerDB.sqlite', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });


customerDB.serialize(function()
{
    customerDB.run =('CREATE TABLE Customers(CustomerID INTEGER, CustomerName TEXT, ContactName TEXT, Address TEXT, City TEXT, PostalCode INTEGER, Country TEXT)');

    let stmt = db.prepare(`INSERT INTO Customers VALUES
                        ('1', 'Alfreds Futterkiste', 'Maria Anders', 'Obere Str. 57	Berlin', '12209', 'Germany')
                        ('2', 'Ana Trujillo Emparedados y helados', 'Ana Trujillo', 'Avda. de la Constitución 2222 México D.F.', '05021', 'Mexico')
                        ('3', 'Antonio Moreno Taquería', 'Antonio Moreno', 'Mataderos 2312	México D.F.'. '05023',	'Mexico')
                        ('4', 'Around the Horn', 'Thomas Hardy', '120 Hanover Sq. London',	'WA1 1DP', 'UK')
                        ('5', 'Berglunds snabbköp', 'Christina Berglund', 'Berguvsvägen 8 Luleå', 'S-958 22', Sweden)
                        `);
})

customerDB.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });