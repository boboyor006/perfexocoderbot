const { getUser } = require('../database/db');

async function listLessons(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = getUser(userId);
    if (!user) {
        bot.sendMessage(chatId, 'Siz botga ro‘yxatdan o‘tmagansiz. Avval /start buyrug‘ini kiriting.');
        return;
    }

    const frontendLessons = [
        { name: 'HTML/CSS', locked: false, link: 'https://youtu.be/example1' },
        { name: 'JavaScript', locked: false, link: 'https://youtu.be/example2' },
        { name: 'Bootstrap/UI', locked: true, link: 'https://youtu.be/example3' },
        { name: 'React.js', locked: true, link: 'https://youtu.be/example4' },
    ];

    const computerLessons = [
        { name: 'Word', locked: false, link: 'https://youtu.be/example5' },
        { name: 'PowerPoint', locked: false, link: 'https://youtu.be/example6' },
        { name: 'Excel', locked: true, link: 'https://youtu.be/example7' },
    ];

    bot.sendMessage(chatId, 'Darslarni tanlang:', {
        reply_markup: {
            inline_keyboard: [
                frontendLessons.map((lesson) => ({
                    text: `${lesson.name} ${lesson.locked ? '🔒' : ''}`,
                    callback_data: `lesson_frontend_${lesson.name}`,
                })),
                computerLessons.map((lesson) => ({
                    text: `${lesson.name} ${lesson.locked ? '🔒' : ''}`,
                    callback_data: `lesson_computer_${lesson.name}`,
                })),
            ],
        },
    });

    bot.on('callback_query', async (callbackQuery) => {
        const data = callbackQuery.data;
        const selectedLesson = [...frontendLessons, ...computerLessons].find(
            (lesson) => `lesson_${lesson.name}` === data.split('_').slice(1).join('_')
        );

        if (selectedLesson) {
            if (selectedLesson.locked) {
                bot.sendMessage(chatId, 'Bu dars hozircha qulflangan.');
            } else {
                bot.sendMessage(chatId, `Dars havolasi: ${selectedLesson.link}`);
            }
        } else {
            bot.sendMessage(chatId, 'Dars topilmadi.');
        }
    });
}

module.exports = { listLessons };
