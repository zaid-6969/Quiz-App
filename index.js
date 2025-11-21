const overlay = document.getElementById("overlay");
const closeBtn = document.querySelector("#overlay #x img");
const forwardBtn = document.getElementById("forward");
const container = document.querySelector(".container");
let selectedCategory = null;

start = () => {
    overlay.style.display = "flex";
    container.style.opacity = "0.5";
};
cancel = () => {
    overlay.style.display = "none";
    container.style.opacity = "1";
};

const topics = document.querySelectorAll(".topic");
topics.forEach((topic) => {
    topic.addEventListener("click", () => {
        topics.forEach((t) => t.classList.remove("selected"));
        topic.classList.add("selected");
        selectedCategory = topic.textContent.trim();
    });
});

forwardBtn.addEventListener("click", () => {
    if (!selectedCategory) {
        alert("Please select a topic!");
        return;
    }
    localStorage.setItem("selectedCategory", selectedCategory);
    window.location.href = "quiz.html";
});