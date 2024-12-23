const questions = [
    { id: 1, question: "HTMLda asosiy sarlavha uchun qaysi teg ishlatiladi?", options: ["<h1>", "<p>", "<div>", "<span>"], correct: "<h1>" },
    { id: 2, question: "CSSda rangni o'zgartirish uchun qaysi xususiyat ishlatiladi?", options: ["color", "font-size", "background", "margin"], correct: "color" },
    { id: 3, question: "HTMLda linkni qaysi teg bilan yaratamiz?", options: ["<a>", "<link>", "<url>", "<href>"], correct: "<a>" },
    { id: 4, question: "a tegida href atributida telifon raqam  to'g'ri yozilgan elementni ko'rsating", options: ["href='tel/+998941234567'", "href='https://+998941234567", "href='tell:+998941234567", "href='tel:+998941234567'"], correct: "href='tel:+998941234567'" },
    { id: 5, question: "CSSda harflarni katta harf yoki kichkina harfga o'tkazish uchun qaysi hususiyat ishlatiladi?", options: ["text-align", "text-transform", "text-decoration", "list-style"], correct: "text-transform" },
    { id: 6, question: "div qanday teg", options: ["inline", "inline-block", "block", "Hamma javob to'g'ri"], correct: "block" },
    { id: 7, question: "O'ziga ichkarida joy ajratish uchun CSSda qaysi hususiyat ishlatiladi", options: ["margin", "padding", "margin-top", "<br>"], correct: "padding" },
    { id: 8, question: "HTMLda qo'shtirnoq ichida alohida ajratib ko'satish uchun qaysi tegdan foydalaniladi", options: ["<p>", "<blockquote> ", "<q>", "<ins>"], correct: "<q>" },
    { id: 9, question: "CSSda rang berishning necha xil usuli bor?", options: ["2", "4", "5", "3"], correct: "4" },
    { id: 10, question: "HTMLda ro'yxatni yaratish uchun qaysi teg ishlatiladi?", options: ["<ul>", "<ol>", "<li>", "Ikki javob to'g'ri"], correct: "Ikki javob to'g'ri" },
    {id: 11, question: "CSSda display flex bo'lsa malumotlarni ustun shaklida qilish uchun qaysi hususiyat ishlatiladi?", options: [ "flex-direction", "flex-wrap", "align-items", "justify-content" ], correct: "flex-direction"},
    {id: 12, question: "CSSda displayni qaysi hassosi moshlashuvchan qiladi?", options: ["block", "inline", "inline-block", "flex"], correct: "flex"},
];

const quizContainer = document.getElementById('quiz');
const finishButton = document.getElementById('finish-btn');
const resultContainer = document.getElementById('result');
const usernameInput = document.getElementById('username');

const YOUR_BOT_TOKEN = "7273767488:AAGBFGEZCkTVcpaT0VEVDNYEkbvB5uHMPSY"
const YOUR_CHAT_ID = 954540465

questions.forEach(q => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    const questionTitle = document.createElement('h3');
    questionTitle.textContent = q.id + ". " + q.question;
    questionDiv.appendChild(questionTitle);

    q.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => {
            const buttons = questionDiv.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
            button.dataset.selected = option;
        };
        questionDiv.appendChild(button);
    });

    quizContainer.appendChild(questionDiv);
});

// toast
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');

    // Yangi toast elementi yaratish
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // Xabar turiga mos klass qo'shish
    toast.textContent = message;

    // Toastni konteynerga qo'shish
    toastContainer.appendChild(toast);

    // Ko'rinadigan qilish
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Bir necha soniyadan keyin yo'q qilish
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300); // Animatsiya vaqtiga teng
    }, 3000); // 3 soniya davomiylik
}

finishButton.onclick = async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        showToast('Iltimos, ismingizni kiriting!', 'error'); // Xato rang bilan
        return;
    }

    let correctCount = 0;
    let incorrectCount = 0;

    document.querySelectorAll('.question').forEach((questionDiv, index) => {
        const selectedButton = questionDiv.querySelector('button.selected');
        if (selectedButton) {
            const selectedAnswer = selectedButton.dataset.selected;
            if (selectedAnswer === questions[index].correct) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        } else {
            incorrectCount++;
        }
    });

    resultContainer.innerHTML = `Ism: ${username} <br> To'g'ri javoblar: ${correctCount} <br> Noto'g'ri javoblar: ${incorrectCount}`;

    // Telegramga yuborish
    try {
        await fetch(`https://api.telegram.org/bot${YOUR_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: YOUR_CHAT_ID,
                text: `Ism: ${username}\nTo'g'ri javoblar: ${correctCount}\nNoto'g'ri javoblar: ${incorrectCount}`
            })
        });
        showToast('Natijalar Telegramga yuborildi!', 'success'); // Muvaffaqiyat rang bilan
    } catch (error) {
        showToast('Natijalarni Telegramga yuborishda xatolik yuz berdi!', 'error'); // Xato rang bilan
        console.error(error);
    }

    usernameInput.value = ""
};
