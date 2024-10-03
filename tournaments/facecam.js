document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
    const buttonInitialText = button.innerText;

    button.addEventListener("click", () => {
        const isDisabled = button.innerText == buttonInitialText;
        button.innerText = isDisabled ? "Übertragung beenden" : buttonInitialText;
        button.style.backgroundColor = isDisabled ? "var(--danger)" : null;
    })

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            document.getElementsByTagName("video")[0].srcObject = stream;
            button.disabled = false;
        });
    }
})