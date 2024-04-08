document.addEventListener('DOMContentLoaded', () => {
    const codeURL = document.location.hash.substring(1);
    if (codeURL) document.querySelector("input").value = codeURL;

    document.getElementsByTagName("button")[0].addEventListener("click", () => {
        validateInput();
    })
    document.addEventListener("keypress", (e) => {
        if (e.key != "Enter") return;
        validateInput();
    })

    /**
     * @description
     * Überprüft nach einer Interaktion mit dem Button, ob der Code im Input valide ist
     * 
     * Checks after an interaction with the button whether the code of the input is valid

     * @author ItsLeMax
     */
    function validateInput() {
        const code = document.querySelector("input").value;
        if (!code) return;

        XMLHttpRequests({
            readystate: (xhr) => {
                if (JSON.parse(xhr.responseText)) {
                    window.location.href = `./results/${code}.html`;
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
                button.innerText = "Der Server ist down!";
                button.style.fontSize = "2.25vmin";
                button.style.backgroundColor = "rgb(255, 95, 60)";

                document.querySelector("input").disabled = true;
            }
        }, {
            subdomain: "secrets",
            apiPath: code
        });
    }
})