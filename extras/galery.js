document.addEventListener("DOMContentLoaded", () => {

    const select = document.querySelector("select");

    const image = document.getElementById("image");
    const loading = document.getElementById("loading");
    const caption = document.getElementById("caption");

    requestMovies(select);

    // Listener and handling for changing the movie inside the dropdown and switching images

    select.addEventListener("change", () => changeMovie(image, loading, caption, select));
    image.addEventListener("load", () => handleImageLoad(select, caption, image, loading));

    updateButtons((button) => {
        button.addEventListener("click", () => switchImage(button, select, image, loading));
    });

});

/**
 * @description Gets and sets the movies to choose from
 * @author ItsLeMax
 * @param { HTMLSelectElement } select
 */
function requestMovies(select) {

    const readystate = (xhr) => {

        const response = JSON.parse(xhr.responseText);

        for (const movie of response) {
            const text = movie.split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
            select.add(new Option(text));
        }

    };

    new RequestToFPM({ subdomain: Subdomain.EXTRAS }, { readystate });

}

/**
 * @description Acts if the movie was changed inside the dropdown selection menu
 * @param { HTMLElement } image
 * @param { HTMLElement } loading
 * @param { HTMLElement } caption
 * @param { HTMLSelectElement } select 
 */
function changeMovie(image, loading, caption, select) {

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
    updateImage(image, loading, select);

    const readystate = (xhr) => {

        // Set maximum page count

        const response = JSON.parse(xhr.responseText);

        if (!response)
            return;

        const pageNumbers = getPageCount().pageNumbers;
        pageNumbers[1] = response.length;

        updatePageCount(pageNumbers);

    };

    new RequestToFPM({ subdomain: Subdomain.EXTRAS, sentData: getSelectId(select).toLowerCase() }, { readystate });

}

/**
 * @param { HTMLSelectElement } select
 * @param { HTMLSelectElement } caption 
 * @param { HTMLElement } image
 * @param { HTMLElement } loading
 */
function handleImageLoad(select, caption, image, loading) {

    // Update image description text content

    const selectId = getSelectId(select);
    const currentPage = getPageCount().pageNumbers[0];

    caption.innerText = eval(selectId)[currentPage] || "";

    updateButtons((button) => {

        // Allow page switching again after image is loaded

        button.disabled = false;
        image.style.filter = "unset";

        // Remove loading animation

        loading.style.display = "none";

    });

}

/**
 * @description Switches the image after pressing any image switch button
 * @author ItsLeMax
 * @param { HTMLButtonElement } button 
 * @param { HTMLSelectElement } select
 * @param { HTMLElement } image
 * @param { HTMLElement } loading
 */
function switchImage(button, select, image, loading) {

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

    updateImage(image, loading, select);

}

/**
 * @description Executes a function for all buttons
 * @author ItsLeMax
 * @param { Function } callback Callback function to execute
 */
function updateButtons(callback) {
    for (const buttonId of ["next", "previous"]) {
        callback(document.getElementById(buttonId));
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
 * @param { Array<String> } pageNumbers Page number indexes splitted inside an array from the object of the function `pageCount`
 */
function updatePageCount(pageNumbers) {
    pageNumbers[0] = pageNumbers[0].toString();
    getPageCount().pageElement.innerText = pageNumbers.join("/");
};

/**
 * @description Updates the image, according to the index
 * @author ItsLeMax
 * @param { HTMLElement } image
 * @param { HTMLElement } loading
 * @param { HTMLSelectElement } select
 */
function updateImage(image, loading, select) {

    const selection = getSelectId(select).toLowerCase();
    const currentPage = getPageCount().pageNumbers[0];

    image.setAttribute("src", `https://media.fpm-studio.de/movies/${selection}/${currentPage}.png`);

    updateButtons((button) => {
        button.disabled = true;
        image.style.filter = "brightness(33%) blur(.1rem)";
        loading.style.display = "block";
    });

};

/**
 * @description Takes out the select id
 * @author ItsLeMax
 * @param { HTMLSelectElement } select
 * @returns { String } String with select id
 */
function getSelectId(select) {
    return select.value.replaceAll(" ", "_");
}