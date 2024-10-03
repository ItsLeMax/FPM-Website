document.addEventListener("DOMContentLoaded", () => {
    const login = document.getElementById("login");
    const register = document.getElementById("register");
    const toggleSwitch = document.querySelector(".switch input");

    const button = document.querySelector("button");
    const buttonInitialText = document.querySelector("button").innerText;

    const hidePwEye = document.querySelector("div>img");
    const hidePwEyeInitialSource = hidePwEye.src;

    const password = document.querySelector("#password input");
    const passwordInitialType = password.type;

    let registerAccount = false;

    toggleSwitch.addEventListener("click", () => {
        registerAccount = !registerAccount;

        button.innerText = button.innerText == buttonInitialText ? "Registrieren" : buttonInitialText;

        if (registerAccount) {
            register.style.color = "var(--selected)";
            login.style.color = "whitesmoke";
            return;
        }

        login.style.color = null;
        register.style.color = null;
    })

    button.addEventListener("click", () => {
        button.disabled = true;
        toggleSwitch.disabled = true;
    })

    hidePwEye.addEventListener("click", () => {
        const passwordHidden = hidePwEye.src == hidePwEyeInitialSource;

        hidePwEye.src = passwordHidden
            ? "https://media.fpm-studio.de/assets/icons/eye_open.webp"
            : hidePwEyeInitialSource;

        password.type = passwordHidden
            ? "input"
            : passwordInitialType
    })
})