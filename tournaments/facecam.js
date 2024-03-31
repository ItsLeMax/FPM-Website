document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementsByTagName("button")[0];
    const init = button.innerText;

    button.addEventListener("click", () => {
        const isDisabled = button.innerText == init;
        button.innerText = isDisabled ? "Übertragung beenden" : init;
        button.style.backgroundColor = isDisabled ? "var(--danger)" : "var(--success)"
    })

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            document.getElementsByTagName("video")[0].srcObject = stream;
        });
    }
})