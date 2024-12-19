const questions = [
    { id: 1, question: "HTMLda asosiy sarlavha uchun qaysi teg ishlatiladi?", options: ["<h1>", "<p>", "<div>", "<span>"], correct: "<h1>" },
    { id: 2, question: "CSSda rangni o'zgartirish uchun qaysi xususiyat ishlatiladi?", options: ["color", "font-size", "background", "margin"], correct: "color" },
    { id: 3, question: "JavaScriptda funksiyani qanday e'lon qilasiz?", options: ["function myFunc()", "let myFunc = ()", "myFunc() => {}", "Barchasi to'g'ri"], correct: "Barchasi to'g'ri" },
    { id: 4, question: "HTMLda linkni qaysi teg bilan yaratamiz?", options: ["<a>", "<link>", "<url>", "<href>"], correct: "<a>" },
    { id: 5, question: "CSSda font o'lchamini o'zgartirish uchun qaysi xususiyat ishlatiladi?", options: ["font-size", "font-family", "text-align", "color"], correct: "font-size" },
    { id: 6, question: "JavaScriptda massivni qanday e'lon qilamiz?", options: ["[]", "{}", "new Array()", "Ikki javob to'g'ri"], correct: "Ikki javob to'g'ri" },
    { id: 7, question: "HTML form elementlari ichida qaysi teg matnli kiritish uchun ishlatiladi?", options: ["<input>", "<textarea>", "<button>", "<select>"], correct: "<input>" },
    { id: 8, question: "CSSda bo'sh joy qo'shish uchun qaysi xususiyat ishlatiladi?", options: ["padding", "margin", "space", "border"], correct: "padding" },
    { id: 9, question: "JavaScriptda qiymatlarni solishtirish uchun qaysi operator ishlatiladi?", options: ["==", "===", "!=", "Barchasi"], correct: "Barchasi" },
    { id: 10, question: "HTMLda ro'yxatni yaratish uchun qaysi teg ishlatiladi?", options: ["<ul>", "<ol>", "<li>", "Ikki javob to'g'ri"], correct: "Ikki javob to'g'ri" },
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

finishButton.onclick = async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert('Iltimos, ismingizni kiriting!');
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

    resultContainer.style.display = 'block';
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
        alert('Natijalar Telegramga yuborildi!');
    } catch (error) {
        alert('Natijalarni Telegramga yuborishda xatolik yuz berdi!');
        console.error(error);
    }
};