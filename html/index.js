document.addEventListener("DOMContentLoaded", () => {
    for (const year of document.getElementsByClassName("year")) {
        year.textContent = new Date().getFullYear() - year.textContent;
    }
})