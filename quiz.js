const API = "https://6915b3cd84e8bd126afb0eca.mockapi.io/api/v1/quiz";
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const prevBtn = document.getElementById("prev-btn");
const submitBtn = document.getElementById("fbtn");
const skipBtn = document.getElementById("sbtn");
const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");

let questions = [];
let currentIndex = 0;
let userAnswers = [];
let timer;
let totalTime = 100;
let selectedCategory = localStorage.getItem("selectedCategory") || "Programming";

async function fetchQuestions() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        const categoryObj = data.find((c) => c.category === selectedCategory);
        if (!categoryObj || !categoryObj.quiz.length) {
            questionText.textContent = "No questions found.";
            return;
        }

        questions = categoryObj.quiz;
        showQuestion();
        startTimer();
    } catch (err) {
        questionText.textContent = "Failed to load questions.";
    }
}

function renderProgressBar() {
    progressBar.innerHTML = "";

    const fill = document.createElement("div");
    fill.className = "progress-fill";

    const progressPercent =
        (currentIndex) / (questions.length - 1) * 90; 

    fill.style.width = progressPercent + "%";
    progressBar.appendChild(fill);
    
    for (let i = 0; i < questions.length; i++) {
        const step = document.createElement("div");
        step.className = "progress-step" + (i === currentIndex ? " active" : "");
        step.textContent = i + 1;
        progressBar.appendChild(step);
    }
}

function startTimer() {
    let timeLeft = totalTime;
    timerEl.innerHTML = `<img src="image/Time.svg" alt=""><h1>${timeLeft}</h1>`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerHTML = `<img src="image/Time.svg" alt=""><h1>${timeLeft}</h1>`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            calculateScore();
        }
    }, 1000);
}

function showQuestion() {
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= questions.length) return;

    const q = questions[currentIndex];
    questionText.textContent = q.question;

    renderProgressBar();

    optionsContainer.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const div = document.createElement("div");
        div.textContent = String.fromCharCode(65 + idx) + ". " + opt;
        if (userAnswers[currentIndex] === idx) div.classList.add("selected");

        div.addEventListener("click", () => {
            userAnswers[currentIndex] = idx;
            document.querySelectorAll(".option div")
                .forEach((o, i) => o.classList.toggle("selected", i === idx));
        });

        optionsContainer.appendChild(div);
    });
}

function nextQuestion() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        calculateScore();
    }
}

function skipQuestion() {
    currentIndex++;
    if (currentIndex >= questions.length) {
        calculateScore();
    } else {
        showQuestion();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

function calculateScore() {
    clearInterval(timer);
    let score = 0;
    questions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) score++;
    });
    scoreEl.textContent = score;
    overlay.style.display = "flex";
}

function cancel() {
    window.location.href = "index.html";
}

prevBtn.addEventListener("click", prevQuestion);
submitBtn.addEventListener("click", nextQuestion);
skipBtn.addEventListener("click", skipQuestion);

fetchQuestions();

window.addEventListener("beforeunload", () => {
    localStorage.removeItem("selectedCategory");
});