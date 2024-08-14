document.addEventListener("DOMContentLoaded", () => {
    const login = document.getElementById("login");
    const register = document.getElementById("register");
    const toggleSwitch = document.querySelector(".switch input");

    const button = document.querySelector("button");
    const buttonText = document.querySelector("button").innerText;

    const hidePasswordEye = document.querySelector("div>img");
    const hidePasswordEyeSource = hidePasswordEye.src;
    const hidePasswordEyeType = hidePasswordEye.type;

    let toggle = false;

    toggleSwitch.addEventListener("click", () => {
        toggle = !toggle;

        button.innerText = button.innerText == buttonText ? "Registrieren" : buttonText;

        if (toggle) {
            register.style.color = "var(--selected)";
            login.style.color = "whitesmoke";
            return;
        }

        login.style.color = "var(--selected)";
        register.style.color = "whitesmoke";
    })

    button.addEventListener("click", () => {
        button.disabled = true;
        toggleSwitch.disabled = true;
    })

    hidePasswordEye.addEventListener("click", () => {
        const passwordHidden = hidePasswordEye.src == hidePasswordEyeSource;

        console.log(document.getElementById("password").type);

        hidePasswordEye.src = passwordHidden
            ? "https://media.fpm-studio.de/assets/icons/eye_open.webp"
            : hidePasswordEyeSource;

        document.getElementById("password").type = passwordHidden
            ? "input"
            : hidePasswordEyeType
    })
})