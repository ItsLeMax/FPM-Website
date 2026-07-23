document.addEventListener("DOMContentLoaded", () => {
    useHash();
    registerButtonListeners();
});

/**
 * @description Retrieves any possible code after a `#` symbol from within the url and puts it into the text input element
 * @author ItsLeMax
 */
function useHash() {
    document.querySelector("input").value = document.location.hash.substring(1) || "";
}

/**
 * @description Registers the listeners of the page buttons
 * @author ItsLeMax
 */
function registerButtonListeners() {

    document.querySelector("button").addEventListener("click", () => {
        validateInput();
    });

    document.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            validateInput();
        }
    });

}

/**
 * @description Checks after an interaction with the button whether the code of the input is valid
 * @author ItsLeMax
 */
function validateInput() {

    const code = document.querySelector("input").value;

    if (!code)
        return;

    XMLHttpRequests({
        readystate: (xhr) => {

            const response = JSON.parse(xhr.responseText);

            if (response) {
                window.location.href = `${response}/${code}.html`;
                return;
            }

            const button = document.querySelector("button");
            const input = document.querySelector("input");

            button.disabled = true;
            input.disabled = true;

            setTimeout(() => {
                button.disabled = false;
                input.disabled = false;
            }, 2000);

        },
        error: () => {

            const button = document.querySelector("button");

            button.disabled = true;
            button.innerText = "Serverfehler!";
            button.style.backgroundColor = "rgb(255, 95, 60)";

            document.querySelector("input").disabled = true;

        }
    }, {
        subdomain: "secrets",
        sentData: code
    });

}