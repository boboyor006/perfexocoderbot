const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Bot tokenini kiriting
const token = '7213723785:AAGVVjOaktdPgRQGEsWcmPMgm0F57NzCG_s'; // O'zingizning bot tokeningizni kiriting
const bot = new TelegramBot(token, { polling: true });

// Kanal ID
const channelId = '@perfexo_coders'; // O'zingizning kanal ID'ingizni kiriting

// Darslar ma'lumotlarini yuklash
const lessonsData = JSON.parse(fs.readFileSync('darslar.json'));

// /start komandasini ishlovchi funksiya
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Kanalga obuna bo'lishni so'rash
    bot.sendMessage(chatId, 'Salom! Iltimos, kanalga obuna bo\'ling: ' + channelId, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Kanalga obuna bo\'lish', url: 'https://t.me/' + channelId.replace('@', '') }],
                [{ text: 'Obuna bo\'ldim', callback_data: 'subscribed' }]
            ]
        }
    });
});

// Kanalga obuna bo'lganini tekshirish
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Foydalanuvchi kanalga obuna bo'lganini tekshirish
    bot.getChatMember(channelId, chatId).then((member) => {
        if (member.status === 'member' || member.status === 'administrator') {
            // Obuna bo'lgan foydalanuvchiga darslar tanlash
            bot.sendMessage(chatId, 'Obuna bo\'lgansiz! Iltimos, dars mavzusini tanlang:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Frontend', callback_data: 'frontend' }],
                        [{ text: 'Kompyuter Savodxonligi', callback_data: 'kompyutersavodxilik' }]
                    ]
                }
            });
        } else {
            bot.sendMessage(chatId, 'Iltimos, avval kanalga obuna bo\'ling.');
        }
    });
});

// "Obuna bo'ldim" tugmasi bosilganda
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'subscribed') {
        bot.sendMessage(chatId, 'Obuna bo\'ldingiz! Iltimos, dars mavzusini tanlang:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Frontend', callback_data: 'frontend' }],
                    [{ text: 'Kompyuter Savodxonligi', callback_data: 'kompyutersavodxilik' }]
                ]
            }
        });
    } else {
        const topic = query.data;

        if (lessonsData[topic]) {
            const lessons = lessonsData[topic].lessons;
            const lessonButtons = lessons.map((lesson, index) => {
                return [{ text: lesson, callback_data: `${topic}_lesson_${index + 1}` }];
            });

            bot.sendMessage(chatId, `Tanlangan mavzu: ${lessonsData[topic].title}. Iltimos, darsni tanlang:`, {
                reply_markup: {
                    inline_keyboard: lessonButtons
                }
            });
        }
    }
});

// Dars tanlanganda
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const lessonData = query.data.split('_');

    if (lessonData.length === 3) {
        const topic = lessonData[0];
        const lessonNumber = lessonData[2];

        // Video faylini yuborish
        const videoPath = `videos/${lessonNumber}.mp4`; // Video faylini joylashuvini ko'rsating
        bot.sendVideo(chatId, videoPath, { caption: `Dars ${lessonNumber}` });
    }
});