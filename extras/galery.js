document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementsByTagName("select")[0];
    const image = document.getElementsByTagName("img")[0];
    const captionElement = document.getElementById("caption");
    const buttonIDs = ["next", "previous"];

    for (const buttonID of buttonIDs) {
        document.getElementById(buttonID).addEventListener("click", () => {
            const split = indexVariations().splittedIndex;

            if (split[0] == 1 && buttonID == "previous") return;
            if (split[0] == split[1] && buttonID == "next") return;
            split[0] = buttonID == "next" ? split[0] += 1 : split[0] -= 1;
            updateText(split);

            if (!select.value) return;
            updateImage();
        })
    }

    select.addEventListener("change", () => {
        for (const buttonID of buttonIDs) {
            const button = document.getElementById(buttonID);
            if (button.disabled) {
                button.disabled = false;
                captionElement.style.display = "block";
            }
        }
        document.getElementById("index").style.display = "block";

        updateImage();
        XMLHttpRequests({
            readystate: (xhr) => {
                const response = JSON.parse(xhr.responseText);
                if (!response) return;

                const split = indexVariations().splittedIndex;
                split[1] = response.length;

                updateText(split);
            }
        }, {
            subdomain: "extras",
            apiPath: `extras/${getSelectId().toLowerCase()}`
        });
    })

    /**
     * @description Entnimmt den Text oben Links, welcher den Progress darstellt
     * @author ItsLeMax
     * @returns Objekt mit Element und Array mit beiden Zahlen, aktuelle Nummer und Nummer insgesamt oder Element, unbearbeitet
     */
    function indexVariations() {
        const index = document.getElementById("index");
        const splittedIndex = index.innerText.split("/");
        splittedIndex[0] = parseInt(splittedIndex[0]);
        return {
            splittedIndex: splittedIndex,
            index: index
        };
    };

    /**
     * @description Überschreibt den Text oben links
     * @author ItsLeMax
     * @param { Array } splittedIndex In Array geteilter Index aus dem Objekt der Funktion `indexVariations`
     */
    function updateText(splittedIndex) {
        splittedIndex[0] = splittedIndex[0].toString();
        indexVariations().index.innerText = splittedIndex.join("/");
    };

    /**
     * @description Aktualisiert das Bild, entsprechend des Indexes
     * @author ItsLeMax
     */
    function updateImage() {
        image.setAttribute("src", "https://media.fpm-studio.de/movies/" + getSelectId().toLowerCase() + "/" + indexVariations().splittedIndex[0] + ".png");
        captionElement.innerText = eval(getSelectId())[indexVariations().splittedIndex[0]] || "(Kein Text vorhanden)";
    };

    /**
     * @description Entnimmt die Select-ID
     * @author ItsLeMax
     * @returns { String } String mit Select-ID
     */
    function getSelectId() {
        return select.value.replaceAll(" ", "_");
    }
})