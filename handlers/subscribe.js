const axios = require('axios');
const { saveUser } = require('../database/db');

// 12 xonali ID yaratish
function generateUniqueId() {
    return Math.random().toString().slice(2, 14); // 12 xonali raqam
}

// Obuna tekshirish
async function checkSubscription(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const channelId = -1001234567890; // Kanal ID (o'zingiz kiriting)

    try {
        const response = await axios.get(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${channelId}&user_id=${userId}`
        );

        const status = response.data.result.status;
        if (status === 'member' || status === 'administrator' || status === 'creator') {
            let user = getUser(userId);
            if (!user) {
                const uniqueId = generateUniqueId();
                saveUser(userId, { telegramId: userId, uniqueId, paymentStatus: false });
                bot.sendMessage(chatId, `Sizning noyob ID raqamingiz: ${uniqueId}`);
            }
            bot.sendMessage(chatId, 'Obuna tasdiqlandi! Darslarni ko‘rish uchun /lessons buyrug‘ini kiriting.');
        } else {
            bot.sendMessage(chatId, 'Iltimos, avval kanalga obuna bo‘ling!');
        }
    } catch (error) {
        console.error('Obuna tekshirishda xato:', error.message);
        bot.sendMessage(chatId, 'Xatolik yuz berdi. Keyinroq urinib ko‘ring.');
    }
}

module.exports = { checkSubscription };
