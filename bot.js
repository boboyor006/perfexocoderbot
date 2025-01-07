const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { BOT_TOKEN, CHANNEL_USERNAME, ID_EXPIRATION_DAYS } = require('./config');

// Botni ishga tushirish
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Foydalanuvchi ma'lumotlarini o‘qish/yozish funksiyalari
const usersFilePath = './data/users.json';
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

// Kurslar ma'lumotlarini o‘qish
const courses = require('./data/courses.json');

// 6 xonali ID yaratish funksiyasi
const generateUserID = () => Math.floor(100000 + Math.random() * 900000).toString();

// Kanalga a'zo bo‘lganini tekshirish funksiyasi
const checkChannelMembership = async (userId) => {
  try {
    const member = await bot.getChatMember(CHANNEL_USERNAME, userId);
    return member.status === 'member' || member.status === 'administrator' || member.status === 'creator';
  } catch (error) {
    return false;
  }
};

// Start komandasini ishlash
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Foydalanuvchini kanalga a'zo bo‘lishini tekshirish
  const isMember = await checkChannelMembership(userId);
  if (!isMember) {
    bot.sendMessage(chatId, `Iltimos, kanalimga a'zo bo‘ling: ${CHANNEL_USERNAME}`, {
      reply_markup: {
        inline_keyboard: [[{ text: "A'zo bo‘ldim", callback_data: 'check_membership' }]],
      },
    });
    return;
  }

  // Foydalanuvchiga kurslar tanlash uchun tugmalarni ko‘rsatish
  bot.sendMessage(chatId, 'Quyidagi kurslardan birini tanlang:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Kompyuter Savodxonligi', callback_data: 'computer_literacy' }],
        [{ text: 'Frontend', callback_data: 'frontend' }],
        [{ text: 'Barcha Kurslar', callback_data: 'all_courses' }], // Qo'shildi
      ],
    },
  });
});

// Callback tugmalarni ishlash
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'check_membership') {
    checkChannelMembership(query.from.id).then((isMember) => {
      if (isMember) {
        bot.sendMessage(chatId, 'Rahmat! Endi davom etishingiz mumkin.');
        bot.sendMessage(chatId, 'Quyidagi kurslardan birini tanlang:', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Kompyuter Savodxonligi', callback_data: 'computer_literacy' }],
              [{ text: 'Frontend', callback_data: 'frontend' }],
              [{ text: 'Barcha Kurslar', callback_data: 'all_courses' }], // Qo'shildi
            ],
          },
        });
      } else {
        bot.sendMessage(chatId, `Hali kanalimga a'zo bo‘lmabsiz: ${CHANNEL_USERNAME}`);
      }
    });
  } else if (data === 'computer_literacy' || data === 'frontend') {
    const course = courses[data];
    if (!course) {
      bot.sendMessage(chatId, 'Kechirasiz, bu kurs hozircha mavjud emas.');
      return;
    }
    const lessons = Object.keys(course).map((lessonNumber) => [
      { text: `${lessonNumber}-dars`, callback_data: `${data}_lesson_${lessonNumber}` },
    ]);

    bot.sendMessage(chatId, `${data === 'computer_literacy' ? 'Kompyuter Savodxonligi' : 'Frontend'} kursi darslari:`, {
      reply_markup: {
        inline_keyboard: lessons,
      },
    });
  } else if (data.startsWith('computer_literacy_lesson_') || data.startsWith('frontend_lesson_')) {
    const [courseKey, _, lessonNumber] = data.split('_');
    const course = courses[courseKey];
    if (!course || !course[lessonNumber]) {
      bot.sendMessage(chatId, 'Kechirasiz, bu dars mavjud emas.');
      return;
    }

    const lesson = course[lessonNumber];
    const videoPath = lesson.video; // Video yo‘lini olamiz
    const title = lesson.title || 'Dars'; // Dars nomi
    if (fs.existsSync(videoPath)) {
      bot.sendVideo(chatId, videoPath, { caption: title }); // Dars nomi bilan birga yuboramiz
    } else {
      bot.sendMessage(chatId, 'Kechirasiz, bu dars uchun video mavjud emas.');
    }
  } else if (data === 'all_courses') { // Qo'shildi
    const allCourses = Object.keys(courses).map((key) => ({
      text: courses[key].name, callback_data: key,
    }));

    const courseButtons = allCourses.map((course) => [course]);
    bot.sendMessage(chatId, 'Barcha mavjud kurslar:', {
      reply_markup: {
        inline_keyboard: courseButtons,
      },
    });
  }
});

// Foydalanuvchiga ID berish
bot.onText(/\/getid/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!users[userId]) {
    const userIdGenerated = generateUserID();
    users[userId] = { id: userIdGenerated, courses: [], createdAt: new Date() };
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    bot.sendMessage(chatId, `Sizning ID: ${userIdGenerated}`);
  } else {
    bot.sendMessage(chatId, `Sizning ID: ${users[userId].id}`);
  }
});
