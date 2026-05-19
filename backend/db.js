const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const usersJsonPath = path.join(__dirname, 'users.json');
const db = new sqlite3.Database(dbPath);

function initializeDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        expertise TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    if (fs.existsSync(usersJsonPath)) {
      try {
        const data = fs.readFileSync(usersJsonPath, 'utf8');
        const json = JSON.parse(data);
        const users = json.users || [];

        db.get('SELECT COUNT(1) AS count FROM users', (err, row) => {
          if (!err && row && row.count === 0 && users.length > 0) {
            const stmt = db.prepare(`
              INSERT OR IGNORE INTO users (id, fullName, email, password, expertise, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            users.forEach((user) => {
              stmt.run(
                user.id || Date.now().toString(),
                user.fullName || '',
                user.email || '',
                user.password || '',
                user.expertise || '',
                user.createdAt || new Date().toISOString(),
                user.updatedAt || new Date().toISOString()
              );
            });

            stmt.finalize();
            console.log(`✅ Migrated ${users.length} user(s) from users.json into SQLite database.`);
          }
        });
      } catch (error) {
        console.warn('⚠️ Could not migrate users.json to SQLite:', error.message);
      }
    }
  });
}

function loadUsers() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, fullName, email, expertise, createdAt, updatedAt FROM users',
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, fullName, email, password, expertise, createdAt, updatedAt FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

function createUser(userData) {
  return new Promise((resolve, reject) => {
    const user = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      expertise: userData.expertise,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.run(
      `INSERT INTO users (id, fullName, email, password, expertise, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.fullName,
        user.email,
        user.password,
        user.expertise,
        user.createdAt,
        user.updatedAt,
      ],
      function (err) {
        if (err) return reject(err);
        resolve(user);
      }
    );
  });
}

function updateUser(email, updates) {
  return new Promise((resolve, reject) => {
    findUserByEmail(email)
      .then((existingUser) => {
        if (!existingUser) return resolve(null);

        const updatedUser = {
          ...existingUser,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        db.run(
          `UPDATE users SET fullName = ?, password = ?, expertise = ?, updatedAt = ? WHERE email = ?`,
          [
            updatedUser.fullName,
            updatedUser.password,
            updatedUser.expertise,
            updatedUser.updatedAt,
            email,
          ],
          function (err) {
            if (err) return reject(err);
            resolve(updatedUser);
          }
        );
      })
      .catch(reject);
  });
}

function deleteUser(email) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE email = ?', [email], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = {
  initializeDb,
  loadUsers,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  dbPath,
};
