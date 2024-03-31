document.addEventListener("DOMContentLoaded", () => {
    const queries = ["#application textarea", "#time textarea", "#email input", "#discord input"];
    updatePage();

    for (const query of queries) {
        const textElement = document.querySelector(query);
        const id = query.split(" ")[0];

        textElement.value = localStorage.getItem(id) || null;

        setRemainingChars(textElement.value.length);

        textElement.addEventListener("input", (text) => {
            localStorage.setItem(id, text.target.value);

            if (id == "#application" || id == "#time") {
                setRemainingChars(text.target.value.length);
            }
        })

        /**
         * @description Aktualisiert den Text der jeweiligen Box um die übrig bleibende Zeichenzahl
         * @author ItsLeMax
         * @param { String } textLength Länge des Textes
         */
        function setRemainingChars(textLength) {
            const textAreaMaxLength = textElement.maxLength;
            const span = document.querySelector(`${id} span`);
            const remainingLetters = textAreaMaxLength - textLength;

            if (!span) return;
            span.innerText = remainingLetters;
            span.style.setProperty("color", remainingLetters < 100 ? "red" : null, "important")
        }
    }

    for (const button of document.getElementsByTagName("button")) {
        if (!button.id) continue;

        document.getElementById(button.id).addEventListener("click", () => {
            switch (button.id) {
                case "cache":
                    if (!confirm("Der Cache wird gelöscht und die Textfelder werden geleert. Bist du dir sicher?")) return;
                    localStorage.clear();
                    document.location.reload();
                    break;
                case "dark":
                    updatePage(true);
                    break;
            }
        })
    }

    /**
     * @description Aktualisiert die Seite mit neuen Farben entsprechend des Dunkelmodus
     * @param { Boolean } buttonPress Wurde diese Funktion ausgeführt mit dem Klick auf den Knopf?
     * @author ItsLeMax
     */
    function updatePage(buttonPress) {
        const darkModeButton = document.getElementById("dark");
        let color, backgroundColor, grayColor, isDarkMode;

        if (buttonPress) darkModeButton.innerText = darkModeButton.innerText == "🌞" ? "🌑" : "🌞";
        else darkModeButton.innerText = localStorage.getItem("darkmode") == "true" ? "🌞" : "🌑";

        switch (darkModeButton.innerText) {
            case "🌞":
                color = "white";
                backgroundColor = "rgb(20, 20, 20)";
                grayColor = "rgb(30, 30, 30)";
                isDarkMode = true;
                break;
            case "🌑":
                color = "black";
                backgroundColor = "white";
                grayColor = "rgb(240, 240, 240)";
                isDarkMode = false;
                break;
        }

        document.body.style.color = color;
        document.body.style.backgroundColor = backgroundColor;
        document.documentElement.style.setProperty('--gray', grayColor);

        if (buttonPress) localStorage.setItem("darkmode", isDarkMode);
        for (const span of document.getElementsByTagName("span")) {
            if (span.style.getPropertyPriority('color') != "important") {
                span.style.color = color;
            }
        }

        for (const textArea of [...document.getElementsByTagName("textarea"), ...document.getElementsByTagName("input")]) {
            textArea.style.color = color;
        }

        for (const button of document.getElementsByTagName("button")) {
            button.style.color = color;
        }
    }
})