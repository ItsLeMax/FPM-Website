document.addEventListener("DOMContentLoaded", () => {

    const create = document.querySelector("button");
    const checkboxes = document.querySelectorAll("input");

    // E-Mail creation process

    create.addEventListener("click", () => {

        let mailTo = (
            "mailto:" + "itslemax.media@gmail.com" +
            "?subject=" + ("FPM-Bewerbung" + "%20" + "als" + "%20" + "%SELECTION%") +
            "&body=" + "-----------" +
            "%0D%0A" + ("%C3%9Cber" + "%20" + "mich") + "%3A%0D%0A%0D%0A%0D%0A" +
            "---------------------------------------" +
            "%0D%0A" + ("Beschreibung" + "%20" + "der" + "%20" + "verf%C3%BCgbaren" + "%20" + "Zeit") + "%3A%0D%0A%0D%0A%0D%0A" +
            "---------------------" +
            "%0D%0A" + ("Discord" + "%20" + "%40-Handle") + "%3A%0D%0A@"
        );

        const jobs = new Array;

        for (const checkbox of checkboxes) {

            if (!checkbox.checked)
                continue;

            const job = checkbox.id;
            jobs.push(job.charAt(0).toUpperCase() + job.slice(1));

        }

        mailTo = mailTo.replace("%SELECTION%", jobs.join("%20%26%20"));

        window.open(mailTo);

    })

    document.getElementById("jobs").addEventListener("click", () => {

        for (const checkbox of checkboxes) {

            if (checkbox.checked) {
                create.disabled = false;
                break;
            }

            create.disabled = true;

        }

    })

})