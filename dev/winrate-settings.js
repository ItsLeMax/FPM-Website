document.addEventListener("DOMContentLoaded", () => {
    for (const query of ["#wl-wins input", "#wl-losses input"]) {
        const element = document.querySelector(query);

        element.addEventListener("input", () => {
            if (parseInt(element.value) < 0 || !element.value) {
                element.value = 0;
            }

            if (parseInt(element.value) > 999) {
                element.value = 999;
            }

            const wins = parseInt(document.querySelector("#wl-wins input").value);
            const losses = parseInt(document.querySelector("#wl-losses input").value);

            const winLossPercentage = (((wins / (wins + losses)) * 100) || 0).toFixed();
            const winColor = "rgb(255, 153, 51)";
            const lossColor = "rgb(51, 153, 255)";

            document.querySelector("#wl-average b").innerText = `${winLossPercentage}%`;
            document.querySelector("#wl-average span").style.background = (!wins && !losses) ? "gray" : `linear-gradient(to right, ${winColor} 0%, ${winColor} ${winLossPercentage}%, ${lossColor} ${winLossPercentage}%, ${lossColor} 100%`
        })
    }
})