document.addEventListener("DOMContentLoaded", () => {
    const time = document.getElementById("minutes");
    const start = document.getElementsByTagName("button")[0];
    const initialText = start.innerText;
    const initialColor = start.style.backgroundColor;

    time.addEventListener("input", () => {
        if (time.value < 0) {
            time.value = 0;
        }

        if (time.value == 100) {
            time.value = 99;
        }

        if (time.value.length > 2) {
            time.value = time.value.slice(0, 2);
        }

        const exceedsLimit = time.value > 45 || time.value < 1;
        time.style.color = exceedsLimit ? "red" : "black";
        start.disabled = time.value ? exceedsLimit : false;
    })

    const alignments = ["left", "center", "right"];
    for (const alignment_a of alignments) {
        document.getElementById(alignment_a).addEventListener("click", () => {
            if (!document.getElementById(alignment_a).checked) {
                document.getElementById(alignments[0]).checked = true;
                return;
            }
            for (const alignment_b of alignments) {
                if (alignment_a != alignment_b) {
                    document.getElementById(alignment_b).checked = false;
                }
            }
        })
    }

    start.addEventListener("click", () => {
        start.style.backgroundColor = start.innerText == initialText ? "rgb(255, 110, 110)" : initialColor;
        start.innerText = start.innerText == initialText ? "Stop" : initialText;

        localStorage.setItem("toggle", JSON.stringify({
            init: start.innerText != initialText,
            time: parseInt(time.value) || 10,
        }));
    })

    document.getElementById("update").addEventListener("click", () => {
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
        }))
    })
})