document.addEventListener("DOMContentLoaded", () => {
    const create = document.getElementsByTagName("button")[0];

    create.addEventListener("click", () => {
        let mailTo = "mailto:itslemax.media@gmail.com?subject=FPM-Bewerbung%20als%20SELECTED_JOBS&body=-----------%0D%0A%C3%9Cber%20dich%3A%0D%0A%0D%0A%0D%0A---------------------------------------%0D%0ABeschreibung%20der%20verf%C3%BCgbaren%20Zeit%3A%0D%0A%0D%0A%0D%0A---------------------%0D%0ADiscord%20%40-Handle%3A%0D%0A";

        const job = new Array;
        if (document.getElementById("builder").checked) job.push("Builder");
        if (document.getElementById("editor").checked) job.push("Editor");

        mailTo = mailTo.replace("SELECTED_JOBS", job.join("%20%26%20"));

        window.open(mailTo);
    })

    document.addEventListener("click", () => {
        create.disabled = !document.getElementById("builder").checked && !document.getElementById("editor").checked;
    })
})