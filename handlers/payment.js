function processPayment(bot, msg) {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'To‘lov uchun quyidagi havoladan foydalaning:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Payme orqali to‘lov qilish', url: 'https://payme.uz/example' }],
                [{ text: 'Click orqali to‘lov qilish', url: 'https://click.uz/example' }],
            ],
        },
    });

    bot.on('message', (responseMsg) => {
        if (responseMsg.text === 'To‘lov qilindi') {
            bot.sendMessage(chatId, 'To‘lov tasdiqlandi! Sizga kerakli darslarni yuboryapmiz.');
        } else {
            bot.sendMessage(chatId, 'To‘lov tasdiqlanmagan.');
        }
    });
}

module.exports = { processPayment };
