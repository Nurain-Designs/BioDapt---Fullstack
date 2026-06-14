const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./backend/data/data.db');
const seedSql = fs.readFileSync('./backend/data/seed.sql', 'utf8');

db.exec(seedSql, (err) => {
  if (err) {
    console.error('Error seeding database:', err.message);
  } else {
    console.log('Database seeded successfully.');
  }
  db.close();
});
