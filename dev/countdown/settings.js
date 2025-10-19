document.addEventListener("DOMContentLoaded", () => {

    const time = document.getElementById("minutes");
    const start = document.querySelector("button");

    const initialText = start.innerText;
    const initialColor = start.style.backgroundColor;

    time.addEventListener("input", () => {

        // Disallow negative numbers

        if (time.value < 0)
            time.value = 0;

        // Disallow beyond 99 minutes (Who tf needs that shit)

        if (time.value == 100)
            time.value = 99;

        // Disallow adding a third number (restricted to two digits)

        if (time.value.length > 2)
            time.value = time.value.slice(0, 2);

        // Disallow beyond 60 and 0 minutes but highlight text in that case instead of restricting it

        const exceedsLimit = time.value > 60 || time.value < 1;

        time.style.color = exceedsLimit ? "red" : "black";
        start.disabled = time.value ? exceedsLimit : false;

    })

    const alignments = ["left", "center", "right"];

    for (const alignment_a of alignments) {

        // Add click listener for each alignment checkbox

        document.getElementById(alignment_a).addEventListener("click", () => {

            // If the checkbox is not checked: check the first checkbox (left) as default

            if (!document.getElementById(alignment_a).checked) {
                document.getElementById(alignments[0]).checked = true;
                return;
            }

            // Uncheck all other checkboxes

            for (const alignment_b of alignments) {

                if (alignment_a != alignment_b)
                    document.getElementById(alignment_b).checked = false;

            }

        })

    }

    start.addEventListener("click", () => {

        // Update start button depending on state

        start.style.backgroundColor = start.innerText == initialText ? "rgb(255, 110, 110)" : initialColor;
        start.innerText = start.innerText == initialText ? "Stop" : initialText;

        // Cache settings to use in the separate overlay

        localStorage.setItem("toggle", JSON.stringify({
            init: start.innerText != initialText,
            time: parseInt(time.value) || 10,
        }));

    })

    document.getElementById("update").addEventListener("click", () => {

        // Click on "update" will update the cache
        // 'align' executes an inlined function immediately to look for and return the checked alignment as value

        localStorage.setItem("update", JSON.stringify({
            color: document.getElementById("picker").value,
            align: (() => {
                for (const alignment of alignments) {
                    if (document.getElementById(alignment).checked) {
                        return alignment;
                    }
                }
            })(),
            font: document.getElementsByTagName("select")[0].value
        }));

    })

})