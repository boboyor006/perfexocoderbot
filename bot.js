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
                [{ text: "📝 Kursga yozilish" }],
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
    ctx.reply("Assalomu alaykum! Perfexo_coders botiga xush kelibsiz!");
    mainMenu(ctx);
});

// Menyudagi har bir amal uchun handlerlar
bot.hears("📚 Kurslar haqida ma'lumot", (ctx) => {
    sendCoursesInfo(ctx);
});

bot.hears("📝 Kursga yozilish", (ctx) => {
    sendRegistrationForm(ctx);
});

bot.hears("🕒 Kurs jadvali", (ctx) => {
    sendSchedule(ctx);
});

bot.hears("💬 Savollar va javoblar", (ctx) => {
    sendFAQ(ctx);
});

bot.hears("📞 Bog'lanish", (ctx) => {
    sendContactInfo(ctx);
});

// Kurslar haqida ma'lumot
function sendCoursesInfo(ctx) {
    const courses = `🎓 Kurs: Frontend Dasturlash\n📅 Boshlanish: vaqtizga moslab beriladi\n⏳ Davomiylik: 7 oy\n💰 Narx: 350,000 so'm\n🧑‍🏫 O'qituvchi: Boboyor Po'latov\n\n🎓 Kurs: Kompyuter Savodxonliki \n📅 Boshlanish: vaqtga qarab moslashtrib beradi \n⏳ Davomiylik: 3oy\n💰 Narx: 300,000 so'm\n🧑‍🏫 O'qituvchi: Boboyor Po'latov\n`;
    ctx.reply(courses);
}

// Kursga yozilish
function sendRegistrationForm(ctx) {
    ctx.reply("Iltimos, quyidagi ma'lumotlarni kiriting:\n1. Ismingiz\n2. Telefon raqamingiz\n3. Tanlangan kurs nomi");
}

// Kurs jadvali
function sendSchedule(ctx) {
    const schedule = `🗓 Frontend Dasturlash darslari:\nDushanba va Payshanba\n⏰ 18:00–20:00\n📍 Chilonzor, 10-maktab\n\n🗓 Graphic Design darslari:\nSeshanba va Juma\n⏰ 16:00–18:00\n📍 Chilonzor, 10-maktab`;
    ctx.reply(schedule);
}

// Savollar va javoblar
function sendFAQ(ctx) {
    const faq = `❓ Savol: Kurslar qanday formatda o'tkaziladi?\n✅ Javob: Kurslar oflayn va onlayn formatlarda o'tkaziladi.\n\n❓ Savol: To'lovni qanday amalga oshirish mumkin?\n✅ Javob: Payme, Click yoki naqd pul orqali to'lov qilishingiz mumkin.`;
    ctx.reply(faq);
}

// Bog'lanish
function sendContactInfo(ctx) {
    const contactInfo = `📞 Aloqa uchun:\nTelefon: +998902251022\nTelegram: @Polatov0555`;
    ctx.reply(contactInfo);
}

// Botni ishga tushirish
bot.launch();

console.log('Bot ish tushdi ...');
