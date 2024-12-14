document.addEventListener("DOMContentLoaded", () => {
    const select = document.querySelector("select");
    const image = document.querySelector("img");
    const captionElement = document.getElementById("caption");
    const buttonIDs = ["next", "previous"];

    for (const buttonID of buttonIDs) {
        document.getElementById(buttonID).addEventListener("click", () => {
            const pageNumbers = pageCount().pageNumbers;

            if (pageNumbers[0] == 1 && buttonID == "previous") return;
            if (pageNumbers[0] == pageNumbers[1] && buttonID == "next") return;
            pageNumbers[0] = buttonID == "next" ? pageNumbers[0] += 1 : pageNumbers[0] -= 1;
            updateText(pageNumbers);

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
        const pageNumbers = pageCount().pageNumbers;
        pageNumbers[0] = 1;

        updateText(pageNumbers);
        updateImage();

        XMLHttpRequests({
            readystate: (xhr) => {
                const response = JSON.parse(xhr.responseText);
                if (!response) return;

                const pageNumbers = pageCount().pageNumbers;
                pageNumbers[1] = response.length;

                updateText(pageNumbers);
            }
        }, {
            subdomain: "extras",
            sentData: getSelectId().toLowerCase()
        });
    })

    /**
     * @description
     * Entnimmt den Text oben links, welcher den Fortschritt darstellt
     * 
     * Retrieves the text on the top left, which shows the progress

     * @author ItsLeMax

     * @returns
     * Objekt mit Element und Array mit beiden Zahlen, aktuelle Nummer und Nummer insgesamt oder Element, unbearbeitet
     * 
     * Object with element and array with both numbers, current number and total number or element, unedited
     */
    function pageCount() {
        const pageElement = document.getElementById("index");

        const pageNumbers = pageElement.innerText.split("/");
        pageNumbers[0] = parseInt(pageNumbers[0]);

        return {
            pageNumbers: pageNumbers,
            pageElement: pageElement
        };
    };

    /**
     * @description
     * Überschreibt den Text oben links
     * 
     * Overwrites the text on the top left

     * @author ItsLeMax

     * @param { Array<String> } pageNumbers
     * geteilter Index im Array aus dem Objekt der Funktion `pageCount`
     * 
     * splitted index inside the array from the object of the function `pageCount`
     */
    function updateText(pageNumbers) {
        pageNumbers[0] = pageNumbers[0].toString();
        pageCount().pageElement.innerText = pageNumbers.join("/");
    };

    /**
     * @description
     * Aktualisiert das Bild, entsprechend des Indexes
     * 
     * Updates the image, according to the index

     * @author ItsLeMax
     */
    function updateImage() {
        image.setAttribute("src", "https://media.fpm-studio.de/movies/" + getSelectId().toLowerCase() + "/" + pageCount().pageNumbers[0] + ".png");
        captionElement.innerText = eval(getSelectId())[pageCount().pageNumbers[0]] || "";
    };

    /**
     * @description
     * Entnimmt die Select-ID
     * 
     * Takes out the select id

     * @author ItsLeMax

     * @returns { String }
     * String mit Select-ID
     * 
     * String with select id
     */
    function getSelectId() {
        return select.value.replaceAll(" ", "_");
    }
})