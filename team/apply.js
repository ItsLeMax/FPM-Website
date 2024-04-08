document.addEventListener("DOMContentLoaded", () => {
    updatePage();

    for (const query of ["#application textarea", "#time textarea", "#email input", "#discord input", "#builder input", "#editor input"]) {
        const input = document.querySelector(query);
        const divID = query.split(" ")[0];
        const isCheck = (divID == "#builder" || divID == "#editor");

        input[isCheck ? "checked" : "value"] = isCheck ? localStorage.getItem(divID) == "true" : localStorage.getItem(divID);
        setRemainingChars(input, divID);

        input.addEventListener("input", (input) => {
            localStorage.setItem(divID, isCheck ? input.target.checked : input.target.value);
            setRemainingChars(input.target, divID);
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
    function setRemainingChars(textElement, divId) {
        const textAreaMaxLength = textElement.maxLength;
        const span = document.querySelector(`${divId} span`);
        const remainingLetters = textAreaMaxLength - textElement.value.length;

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
        let textColor, backgroundColor, slightlyDarker, isDarkMode;

        if (buttonPressed) darkModeButton.innerText = darkModeButton.innerText == "🌞" ? "🌑" : "🌞";
        else darkModeButton.innerText = localStorage.getItem("darkmode") == "true" ? "🌞" : "🌑";

        switch (darkModeButton.innerText) {
            case "🌞":
                textColor = "white";
                backgroundColor = "var(--gray20)";
                slightlyDarker = "brightness(50%)";
                isDarkMode = true;
                break;
            case "🌑":
                textColor = "black";
                backgroundColor = "white";
                slightlyDarker = "brightness(90%)";
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
            if (textArea.type == "checkbox") continue;
            textArea.style.color = textColor;
            textArea.style.filter = slightlyDarker;
        }

        for (const button of document.getElementsByTagName("button")) {
            if (button.id == "dark") continue;
            button.style.color = textColor;
            button.style.filter = slightlyDarker;
        }
    }
})