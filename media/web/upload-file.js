document.addEventListener("DOMContentLoaded", () => {

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

    formContainer.addEventListener("submit", (event) => {

        event.preventDefault();

        // Prepare files for upload

        const files = formContainer.querySelector("input").files;

        if (!files || !files.length)
            return;

        xhr = new XMLHttpRequest();
        const formData = new FormData();

        for (const file of files)
            formData.append("files", file);

        let startTime = Date.now();

        xhr.upload.addEventListener("progress", (event) => {

            if (event.lengthComputable) {

                // Update page content on upload

                const elapsedTime = (Date.now() - startTime) / 1000;
                const uploadProgress = Math.round((event.loaded / event.total) * 100);
                const uploadSpeed = (event.loaded / 1024 / 1024 / elapsedTime).toFixed(2);

                infoContainer.style.display = "block";
                progressBarContainer.style.display = "block";

                infoStatus.textContent = "Daten werden hochgeladen...";
                infoProgress.textContent = `Fortschritt: ${uploadProgress}%`;
                infoSpeed.textContent = `Beanspruchte Bandbreite: ${uploadSpeed} MB/s`;

                progressBarElement.style.width = uploadProgress + "%";

                formUpload.disabled = true;
                formAbort.disabled = false;

            }

        });

        xhr.onreadystatechange = () => {

            if (xhr.readyState != XMLHttpRequest.DONE)
                return;

            // Finalize upload

            infoStatus.textContent = xhr.status == 200
                ? "Upload erfolgreich: " + JSON.parse(xhr.responseText).join(", ")
                : "Fehler beim Upload: " + xhr.status + " " + xhr.statusText;

            resetUi();

        };

        xhr.open("POST", "/private/upload");
        xhr.send(formData);

    });

    formAbort.addEventListener("click", () => {

        // Manual cancellation handling

        if (xhr) {

            xhr.abort();
            resetUi();

            infoStatus.textContent = "Upload abgebrochen";

        }

    });

    /**
     * Finishes the upload process by resetting the UI elements
     *
     * @author ItsLeMax
     * @since 10.09.2025
     */
    function resetUi() {

        progressBarElement.style.width = null;

        infoContainer.style.display = null;
        progressBarContainer.style.display = null;

        infoSpeed.textContent = null;
        infoProgress.textContent = null;

        formUpload.disabled = false;
        formAbort.disabled = true;

    }

});