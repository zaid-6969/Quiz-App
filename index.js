const overlay = document.getElementById("overlay");
const closeBtn = document.querySelector("#overlay #x img");
const forwardBtn = document.getElementById("forward");
const container = document.querySelector(".container");
const Xs = document.querySelectorAll(".X");

Xs.forEach((X) => {
    X.addEventListener("click", (e) => {
        e.stopPropagation();
        X.style.display = "none";
        topics.forEach((t) => {
            t.classList.remove("selected");
        });
        selectedCategory = null;
    });
});
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
        topics.forEach((t) => {
            t.classList.remove("selected")
            t.querySelector(".X").style.display = "none";
    });
        topic.classList.add("selected");
        topic.querySelector(".X").style.display = "inline";
        selectedCategory = topic.textContent;

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