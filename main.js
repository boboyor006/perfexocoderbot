require('dotenv').config(); // .env faylni yuklash
const TelegramBot = require('node-telegram-bot-api');
const { checkSubscription } = require('./handlers/subscribe');
const { listLessons } = require('./handlers/lessons');

// Bot tokenini .env fayldan olish
const token = process.env.BOT_TOKEN;

// Botni ishga tushirish
const bot = new TelegramBot(token, { polling: true });

// Start buyrug‘i
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Assalomu alaykum! Perfexo Coders botiga xush kelibsiz! Davom etishdan oldin kanalga obuna bo‘ling.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Obuna bo‘lish', url: 'https://t.me/perfexo_coders' }],
                [{ text: 'Obunani tekshirish', callback_data: 'check_subscription' }],
            ],
        },
    });
});

// Callback uchun
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'check_subscription') {
        await checkSubscription(bot, query.message);
    } else if (data === 'lessons') {
        await listLessons(bot, query.message);
    } else if (data.startsWith('lesson_')) {
        const lessonName = data.split('_')[1];
        bot.sendMessage(chatId, `Siz ${lessonName}ni tanladingiz!`);
        // Bu yerda darsni ochish yoki qulflanganligini tekshirish lozim
    } else if (data === 'computer') {
        bot.sendMessage(chatId, 'Kompyuter savodxonligi darslari:');
        // Kompyuter savodxonligi darslarini qo‘shish uchun
    }
});

// Botni ishlayotganini tekshirish uchun
console.log('Bot ishga tushdi!');
