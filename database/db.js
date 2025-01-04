const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'db.json');

// Agar fayl bo‘lmasa, yangi bo‘sh bazani yaratish
if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ users: [] }, null, 2));
}

const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));

// Foydalanuvchini qo‘shish yoki yangilash
function saveUser(userId, userData) {
    const userIndex = db.users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
        db.users[userIndex] = { ...db.users[userIndex], ...userData };
    } else {
        db.users.push({ id: userId, ...userData });
    }

    fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

// Foydalanuvchini olish
function getUser(userId) {
    return db.users.find((u) => u.id === userId) || null;
}

module.exports = { saveUser, getUser };
