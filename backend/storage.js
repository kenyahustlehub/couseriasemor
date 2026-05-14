const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const json = JSON.parse(data);
    return json.users || [];
  } catch (error) {
    console.warn('⚠️ Could not read users.json. Starting with empty users array.');
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('❌ Failed to save users.json:', error.message);
    return false;
  }
}

function findUserByEmail(email) {
  const users = loadUsers();
  return users.find((u) => u.email === email);
}

function createUser(userData) {
  const users = loadUsers();
  const user = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

function updateUser(email, updates) {
  const users = loadUsers();
  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveUsers(users);
  return users[userIndex];
}

function deleteUser(email) {
  const users = loadUsers();
  const filtered = users.filter((u) => u.email !== email);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

module.exports = {
  loadUsers,
  saveUsers,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
