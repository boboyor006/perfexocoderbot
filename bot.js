// .env faylini yuklash
require('dotenv').config();
const { Telegraf } = require('telegraf');

// Bot tokenini .env faylidan olish
const bot = new Telegraf(process.env.BOT_TOKEN);

// Asosiy menyu handleri
function mainMenu(ctx) {
    ctx.reply('Quyidagi menyudan tanlang:', {
        reply_markup: {
            keyboard: [
                [{ text: "📚 Kurslar haqida ma'lumot" }],
    
                [{ text: "🕒 Kurs jadvali" }],
                [{ text: "💬 Savollar va javoblar" }],
                [{ text: "📞 Bog'lanish" }]
            ],
            resize_keyboard: true
        }
    });
}

// Start komandasi
bot.start((ctx) => {
    ctx.reply("Assalomu alaykum! Perfexo_coders  xush kelibsiz!");
    mainMenu(ctx);
});

// Ma'lumotlarni saqlash uchun vaqtinchalik ob'ekt
let registrationData = {};

// Kursga yozilish boshlanishi
// bot.hears("📝 Kursga yozilish", (ctx) => {
//     registrationData[ctx.chat.id] = {}; // Yangi foydalanuvchini ro'yxatga olish
//     ctx.reply("Ismingizni kiriting:");
//     bot.on("text", (ctx) => {
//         const chatId = ctx.chat.id;
//         if (!registrationData[chatId].name) {
//             registrationData[chatId].name = ctx.message.text;
//             ctx.reply("Familiyangizni kiriting:");
//         } else if (!registrationData[chatId].surname) {
//             registrationData[chatId].surname = ctx.message.text;
//             ctx.reply("Soat nechidan nechigacha qatnashmoqchisiz?");
//         } else if (!registrationData[chatId].time) {
//             registrationData[chatId].time = ctx.message.text;
//             ctx.reply("Telefon raqamingizni kiriting:");
//         } else if (!registrationData[chatId].phone) {
//             registrationData[chatId].phone = ctx.message.text;
//             ctx.reply("Qaysi kursga yozilmoqchisiz?");
//         } else if (!registrationData[chatId].course) {
//             registrationData[chatId].course = ctx.message.text;

//             // Yuborish tugmasini taklif qilish
//             ctx.reply("Barcha ma'lumotlar to'ldirildi. Yuborish tugmasini bosing:", {
//                 reply_markup: {
//                     inline_keyboard: [
//                         [{ text: "Yuborish", callback_data: "submit" }]
//                     ]
//                 }
//             });
//         }
//     });
// });

// Yuborish tugmasi bosilganda


// Boshqa menyu bo'limlari
bot.hears("📚 Kurslar haqida ma'lumot", (ctx) => {
    const courses = `🎓 Kurs: Frontend Dasturlash\n📅 Boshlanish: vaqtga moslab beriladi\n⏳ Davomiylik: 7 oy\n💰 Narx: 350,000 so'm\n🧑‍🏫 O'qituvchi: Boboyor Po'latov\n\n🎓 Kurs: Kompyuter Savodxonligi\n📅 Boshlanish: vaqtga moslab beriladi\n⏳ Davomiylik: 3 oy\n💰 Narx: 300,000 so'm\n🧑‍🏫 O'qituvchi: Boboyor Po'latov`;
    ctx.reply(courses);
});

bot.hears("🕒 Kurs jadvali", (ctx) => {
    const schedule = `🗓 Frontend Dasturlash darslari:\nDushanba va Payshanba\n⏰ 18:00–20:00\n📍 Chilonzor, 10-maktab\n\n🗓 Graphic Design darslari:\nSeshanba va Juma\n⏰ 16:00–18:00\n📍 Chilonzor, 10-maktab`;
    ctx.reply(schedule);
});

bot.hears("💬 Savollar va javoblar", (ctx) => {
    const faq = `❓ Savol: Kurslar qanday formatda o'tkaziladi?\n✅ Javob: Kurslar oflayn va onlayn formatlarda o'tkaziladi.\n\n❓ Savol: To'lovni qanday amalga oshirish mumkin?\n✅ Javob: Payme, Click yoki naqd pul orqali to'lov qilishingiz mumkin.`;
    ctx.reply(faq);
});

bot.hears("📞 Bog'lanish", (ctx) => {
    const contactInfo = `📞 Aloqa uchun:\nTelefon: +998902251022\nTelegram: @Polatov0555`;
    ctx.reply(contactInfo);
});

// Botni ishga tushirish
bot.launch();

console.log('Bot ishga tushdi...');
