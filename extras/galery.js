document.addEventListener("DOMContentLoaded", () => {
    const select = document.querySelector("select");

    const image = document.getElementById("image");
    const loading = document.getElementById("loading");
    const caption = document.getElementById("caption");

    select.addEventListener("change", () => {
        updateButtons((button) => {
            if (button.disabled) {
                caption.style.display = "block";
            }
        });

        document.getElementById("index").style.display = "block";
        const pageNumbers = getPageCount().pageNumbers;
        pageNumbers[0] = 1;

        updatePageCount(pageNumbers);
        updateImage();

        XMLHttpRequests({
            readystate: (xhr) => {
                const response = JSON.parse(xhr.responseText);
                if (!response) return;

                const pageNumbers = getPageCount().pageNumbers;
                pageNumbers[1] = response.length;

                updatePageCount(pageNumbers);
            }
        }, {
            subdomain: "extras",
            sentData: getSelectId().toLowerCase()
        });
    })

    updateButtons((button) => {
        button.addEventListener("click", () => {
            const pageNumbers = getPageCount().pageNumbers;

            if (pageNumbers[0] == 1 && button.id == "previous") return;
            if (pageNumbers[0] == pageNumbers[1] && button.id == "next") return;
            pageNumbers[0] = button.id == "next" ? pageNumbers[0] += 1 : pageNumbers[0] -= 1;
            updatePageCount(pageNumbers);

            if (!select.value) return;
            updateImage();
        })
    });

    image.addEventListener("load", () => {
        caption.innerText = eval(getSelectId())[getPageCount().pageNumbers[0]] || "";
        updateButtons((button) => {
            button.disabled = false;
            image.style.filter = "unset";
            loading.style.display = "none";
        });
    })

    /**
     * @description
     * Führt eine Funktion für alle Knöpfe aus
     *
     * Executes a function for all buttons
     *
     * @author ItsLeMax
     *
     * @param { Function } fn
     * Funktion zum Ausführen
     *
     * Function to execute
     */
    function updateButtons(fn) {
        for (const buttonId of ["next", "previous"]) {
            fn(document.getElementById(buttonId));
        }
    }

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
    function getPageCount() {
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
    function updatePageCount(pageNumbers) {
        pageNumbers[0] = pageNumbers[0].toString();
        getPageCount().pageElement.innerText = pageNumbers.join("/");
    };

    /**
     * @description
     * Aktualisiert das Bild, entsprechend des Indexes
     * 
     * Updates the image, according to the index

     * @author ItsLeMax
     */
    function updateImage() {
        image.setAttribute("src", "https://media.fpm-studio.de/movies/" + getSelectId().toLowerCase() + "/" + getPageCount().pageNumbers[0] + ".png");
        updateButtons((button) => {
            button.disabled = true;
            image.style.filter = "brightness(33%) blur(.1rem)";
            loading.style.display = "block";
        });
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