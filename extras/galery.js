document.addEventListener("DOMContentLoaded", () => {

    const select = document.querySelector("select");

    const image = document.getElementById("image");
    const loading = document.getElementById("loading");
    const caption = document.getElementById("caption");

    // Gets and sets the movies to choose from

    XMLHttpRequests({
        readystate: (xhr) => {

            const response = JSON.parse(xhr.responseText);

            for (const movie of response) {
                const text = movie.split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
                select.add(new Option(text));
            }

        },

    }, {
        subdomain: "extras",
        sentData: null
    });

    // Change of project

    select.addEventListener("change", () => {

        // Shows the text block (caption) if a movie is selected

        updateButtons((button) => {
            if (button.disabled) {
                caption.style.display = "block";
            }
        });

        // Load page count and image

        document.getElementById("index").style.display = "block";
        const pageNumbers = getPageCount().pageNumbers;
        pageNumbers[0] = 1;

        updatePageCount(pageNumbers);
        updateImage();

        XMLHttpRequests({
            readystate: (xhr) => {

                // Set maximum page count

                const response = JSON.parse(xhr.responseText);

                if (!response)
                    return;

                const pageNumbers = getPageCount().pageNumbers;
                pageNumbers[1] = response.length;

                updatePageCount(pageNumbers);

            }
        }, {
            subdomain: "extras",
            sentData: getSelectId().toLowerCase()
        });
    })

    // Image switcher logic

    updateButtons((button) => {

        button.addEventListener("click", () => {

            const pageNumbers = getPageCount().pageNumbers;

            // Disallow going to page 0 or lower

            if (pageNumbers[0] == 1 && button.id == "previous")
                return;

            // Disallow going to page higher than maximum

            if (pageNumbers[0] == pageNumbers[1] && button.id == "next")
                return;

            // Increment or decrement page number depending on the clicked button

            pageNumbers[0] = button.id == "next" ? pageNumbers[0] += 1 : pageNumbers[0] -= 1;
            updatePageCount(pageNumbers);

            if (!select.value)
                return;

            updateImage();

        })

    });

    // Change of image

    image.addEventListener("load", () => {

        // Update image description text content

        caption.innerText = eval(getSelectId())[getPageCount().pageNumbers[0]] || "";

        updateButtons((button) => {

            // Allow page switching again after image is loaded

            button.disabled = false;
            image.style.filter = "unset";

            // Remove loading animation

            loading.style.display = "none";

        });

    })

    /**
     * @description Executes a function for all buttons
     * @author ItsLeMax
     * @param { Function } fn Function to execute
     */
    function updateButtons(fn) {
        for (const buttonId of ["next", "previous"]) {
            fn(document.getElementById(buttonId));
        }
    }

    /**
     * @description Retrieves the text on the top left, which shows the progress
     * @author ItsLeMax
     * @returns Object with element and array with both numbers, current number and total number or element, unedited
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
     * @description Overwrites the text on the top left
     * @author ItsLeMax
     * @param { Array<String> } pageNumbers Splitted index inside the array from the object of the function `pageCount`
     */
    function updatePageCount(pageNumbers) {
        pageNumbers[0] = pageNumbers[0].toString();
        getPageCount().pageElement.innerText = pageNumbers.join("/");
    };

    /**
     * @description Updates the image, according to the index
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
     * @description Takes out the select id
     * @author ItsLeMax
     * @returns { String } String with select id
     */
    function getSelectId() {
        return select.value.replaceAll(" ", "_");
    }

})