document.addEventListener("DOMContentLoaded", () => {
    const slightlyDarker = "brightness(90%)";
    updatePage();

    for (const query of ["#application textarea", "#time textarea", "#email input", "#discord input"]) {
        const textElement = document.querySelector(query);
        const divID = query.split(" ")[0];

        textElement.value = localStorage.getItem(divID) || null;

        setRemainingChars(textElement, textElement.value.length, divID);

        textElement.addEventListener("input", (text) => {
            localStorage.setItem(divID, text.target.value);

            if (divID == "#application" || divID == "#time") {
                setRemainingChars(textElement, text.target.value.length, divID);
            }
        })
    }

    document.getElementById("dark").addEventListener("click", () => {
        updatePage(true);
    })

    /**
     * @description
     * Aktualisiert den Text der jeweiligen Box um die übrig bleibende Zeichenzahl
     * 
     * Updates the text of its box with the remaining letter amount

     * @param { String } divId
     * ID der Div mit der Span, welche die Restzeichen beinhaltet

     * Div ID with the span, that contains the remaining amount

     * @author ItsLeMax
     */
    function setRemainingChars(textElement, textLength, divId) {
        const textAreaMaxLength = textElement.maxLength;
        const span = document.querySelector(`${divId} span`);
        const remainingLetters = textAreaMaxLength - textLength;

        if (!span) return;
        span.innerText = remainingLetters;
        span.style.setProperty("color", remainingLetters < 100 ? "red" : null, "important")
    }

    /**
     * @description
     * Aktualisiert die Seite entsprechend des Dunkelmodus
     * 
     * Updates the page according to dark mode

     * @param { Boolean } buttonPressed
     * Wurde diese Funktion ausgeführt mit dem Klick auf den Knopf?
     * 
     * Did this function get executed with a click on the button?

     * @author ItsLeMax
     */
    function updatePage(buttonPressed) {
        const darkModeButton = document.getElementById("dark");
        let textColor, backgroundColor, isDarkMode;

        if (buttonPressed) darkModeButton.innerText = darkModeButton.innerText == "🌞" ? "🌑" : "🌞";
        else darkModeButton.innerText = localStorage.getItem("darkmode") == "true" ? "🌞" : "🌑";

        switch (darkModeButton.innerText) {
            case "🌞":
                textColor = "white";
                backgroundColor = "var(--gray20)";
                isDarkMode = true;
                break;
            case "🌑":
                textColor = "black";
                backgroundColor = "white";
                isDarkMode = false;
                break;
        }

        document.documentElement.style.setProperty('--text', textColor);
        document.documentElement.style.setProperty('--background', backgroundColor);
        if (buttonPressed) localStorage.setItem("darkmode", isDarkMode);

        for (const span of document.getElementsByTagName("span")) {
            if (span.style.getPropertyPriority('color') != "important") {
                span.style.color = textColor;
                span.style.filter = slightlyDarker;
            }
        }

        for (const textArea of [...document.getElementsByTagName("textarea"), ...document.getElementsByTagName("input")]) {
            textArea.style.color = textColor;
            textArea.style.filter = slightlyDarker;
        }

        for (const button of document.getElementsByTagName("button")) {
            button.style.color = textColor;
            button.style.filter = slightlyDarker;
        }
    }
})