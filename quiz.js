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
const resultsListEl = document.getElementById("results-list");

let questions = [];
let currentIndex = 0;
let userAnswers = [];
let timer;
let totalTime = 100;
let selectedCategory =
  localStorage.getItem("selectedCategory") || "Programming";

async function fetchQuestions() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Network response not ok");
    const data = await res.json();

    const categoryObj = data.find((c) => c.category === selectedCategory);
    if (
      !categoryObj ||
      !Array.isArray(categoryObj.quiz) ||
      categoryObj.quiz.length === 0
    ) {
      questionText.textContent = "No questions found.";
      return;
    }

    questions = categoryObj.quiz;
    userAnswers = new Array(questions.length);
    showQuestion();
    startTimer();
  } catch (err) {
    console.error(err);
    questionText.textContent = "Failed to load questions.";
  }
}

function renderProgressBar() {
  if (!progressBar) return;
  progressBar.innerHTML = "";

  const fill = document.createElement("div");
  fill.className = "progress-fill";

  let progressPercent = 0;
  if (questions.length > 1) {
    progressPercent = (currentIndex / (questions.length - 1)) * 95;
  } else {
    progressPercent = 100;
  }
  fill.style.width = progressPercent + "%";
  progressBar.appendChild(fill);

  for (let i = 0; i < questions.length; i++) {
    const step = document.createElement("div");

    let className = "progress-step";
    if (i < currentIndex) {
      className += " completed";
    } else if (i === currentIndex) {
      className += " active";
    }

    step.className = className;
    step.textContent = i + 1;
    progressBar.appendChild(step);
  }
}

function startTimer() {
  clearInterval(timer);
  let timeLeft = totalTime;
  updateTimerDisplay(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      calculateScore();
    }
  }, 1000);
}

function updateTimerDisplay(timeLeft) {
  if (!timerEl) return;
  timerEl.innerHTML = `<img src="image/Time.svg" alt=""><h1>${timeLeft}</h1>`;
}

function showQuestion() {
  if (!questions || questions.length === 0) {
    questionText.textContent = "No questions available.";
    return;
  }

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= questions.length) currentIndex = questions.length - 1;

  const q = questions[currentIndex];
  questionText.textContent = q.question || "";

  renderProgressBar();

  optionsContainer.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option-item";
    div.dataset.index = idx;
    div.textContent = String.fromCharCode(65 + idx) + ". " + opt;

    if (userAnswers[currentIndex] === idx) {
      div.classList.add("selected");
    }

    div.addEventListener("click", () => {
      userAnswers[currentIndex] = idx;
      Array.from(optionsContainer.children).forEach((child) => {
        child.classList.toggle("selected", child === div);
      });
    });

    optionsContainer.appendChild(div);
  });

  if (currentIndex === questions.length - 1) {
    submitBtn.textContent = "Submit";
    skipBtn.style.display = "none";
  } else {
    submitBtn.textContent = "Next";
    skipBtn.style.display = "inline-block";
  }
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    if (userAnswers[currentIndex] === undefined) {
      alert("Please select an answer before proceeding.");
      return;
    }
    currentIndex++;
    showQuestion();
  } else {
    calculateScore();
  }
}

function skipQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    calculateScore();
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
    if (!questions || questions.length === 0) {
        scoreEl.textContent = 0;
        overlay.style.display = "flex";
        return;
    }


    let resultsHTML = "";
    questions.forEach((q, i) => {
        const userAnswerIndex = typeof userAnswers[i] === "number" ? userAnswers[i] : null;
        const correctAnswerIndex = q.answer;

        if (userAnswerIndex !== null && userAnswerIndex === correctAnswerIndex) {
            score++;
        }

        const userAnswerText = userAnswerIndex !== null ? q.options[userAnswerIndex] : "Not Answered";
        const correctAnswerText = (typeof correctAnswerIndex === "number" && q.options[correctAnswerIndex]) ? q.options[correctAnswerIndex] : "N/A";
        const isCorrect = userAnswerIndex === correctAnswerIndex;

        resultsHTML += `
            <div class="result-item">
                <p><strong>Q${i + 1}:</strong> ${escapeHtml(q.question || "")}</p>
                <p>Your answer: <span class="user-answer ${isCorrect ? "correct" : "wrong"}">${escapeHtml(userAnswerText)}</span></p>
                <p>Correct answer: <strong>${escapeHtml(correctAnswerText)}</strong></p>
                <hr>
            </div>
        `;
    });

    scoreEl.textContent = score;
    if (resultsListEl) {
        resultsListEl.innerHTML = resultsHTML;
    }
    overlay.style.display = "flex";
}

function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
