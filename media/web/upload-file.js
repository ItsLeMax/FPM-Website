document.addEventListener("DOMContentLoaded", () => {

    const UPLOAD_ABORTED = "Upload abgebrochen.";

    const formContainer = document.querySelector("form");
    const formUpload = document.querySelector("form button");
    const formAbort = document.getElementById("abort");

    const infoContainer = document.getElementById("info");
    const infoStatus = document.getElementById("status");
    const infoProgress = document.getElementById("progress");
    const infoSpeed = document.getElementById("speed");

    const progressBarContainer = document.getElementById("progress-bar");
    const progressBarElement = progressBarContainer.firstElementChild;

    let xhr;

    formContainer.addEventListener("submit", (e) => {

        e.preventDefault();

        const file = formContainer.datei.files[0];

        if (!file)
            return;

        xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append("datei", file);

        let startTime = Date.now();

        xhr.upload.addEventListener("progress", (event) => {

            if (event.lengthComputable) {

                const elapsedTime = (Date.now() - startTime) / 1000;
                const uploadProgress = Math.round((event.loaded / event.total) * 100);
                const uploadSpeed = (event.loaded / 1024 / 1024 / elapsedTime).toFixed(2);

                infoContainer.style.display = "block";
                progressBarContainer.style.display = "block";

                infoStatus.textContent = "Datei wird hochgeladen...";
                infoProgress.textContent = `Fortschritt: ${uploadProgress}%`;
                infoSpeed.textContent = `Geschwindigkeit: ${uploadSpeed} MB/s`;

                progressBarElement.style.width = uploadProgress + "%";

                formUpload.disabled = true;
                formAbort.disabled = false;

            }

        });

        xhr.onreadystatechange = () => {

            if (xhr.readyState === XMLHttpRequest.DONE)
                infoStatus.textContent = xhr.status === 200 ? `${xhr.responseText}` : `Fehler beim Upload: ${xhr.statusText}`;
            else
                infoStatus.textContent = null;

            finishUpload();

        };

        xhr.open("POST", "/upload");
        xhr.send(formData);

    });

    formAbort.addEventListener("click", () => {

        if (xhr) {

            xhr.abort();
            finishUpload();

            infoStatus.textContent = UPLOAD_ABORTED;

        }

    });

    /**
     * Finishes the upload process by resetting the UI elements
     *
     * @author ItsLeMax
     * @since 10.09.2025
     */
    function finishUpload() {

        progressBarElement.style.width = null;

        infoContainer.style.display = null;
        progressBarContainer.style.display = null;

        infoSpeed.textContent = null;
        infoProgress.textContent = null;

        formUpload.disabled = false;
        formAbort.disabled = true;

    }

});