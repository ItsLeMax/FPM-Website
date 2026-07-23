document.addEventListener("DOMContentLoaded", () => {

    const checkboxes = document.querySelectorAll("input");
    const createButton = document.querySelector("button");

    createButton.addEventListener("click", () => {
        const mailTemplate = createMail(checkboxes);
        window.open(mailTemplate);
    });

    document.getElementById("jobs").addEventListener("click", () => toggleMailButton(checkboxes, createButton));

});

/**
 * @description Creates a template E-Mail for the application
 * @author ItsLeMax
 * @param { NodeListOf<HTMLInputElement> } checkboxes
 * @returns String with E-Mail content
 */
function createMail(checkboxes) {

    let mail = (
        "mailto:" + "itslemax.media@gmail.com" +
        "?subject=" + ("FPM-Bewerbung" + "%20" + "als" + "%20" + "%SELECTION%") +
        "&body=" + "-----------" +
        "%0D%0A" + ("%C3%9Cber" + "%20" + "mich") + "%3A%0D%0A%0D%0A%0D%0A" +
        "---------------------------------------" +
        "%0D%0A" + ("Beschreibung" + "%20" + "der" + "%20" + "verf%C3%BCgbaren" + "%20" + "Zeit") + "%3A%0D%0A%0D%0A%0D%0A" +
        "---------------------" +
        "%0D%0A" + ("Discord" + "%20" + "%40-Handle") + "%3A%0D%0A@"
    );

    // Gather selected jobs from checkboxes

    const jobs = [];

    for (const checkbox of checkboxes) {

        if (!checkbox.checked)
            continue;

        const job = checkbox.id;
        jobs.push(job.charAt(0).toUpperCase() + job.slice(1));

    }

    // Make jobs readable and add them to the mail

    return mail.replace("%SELECTION%", jobs.join("%20%26%20"));
}

/**
 * @description Toggles the create button depending on whether any checkboxes are selected
 * @author ItsLeMax
 * @param { NodeListOf<HTMLInputElement> } checkboxes
 * @param { HTMLButtonElement } createButton
 */
function toggleMailButton(checkboxes, createButton) {

    for (const checkbox of checkboxes) {

        if (checkbox.checked) {
            create.disabled = false;
            break;
        }

        create.disabled = true;

    }

}