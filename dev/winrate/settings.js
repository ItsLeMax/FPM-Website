document.addEventListener("DOMContentLoaded", () => {

    // Target Win/Loss inputs

    for (const query of ["#wl-wins input", "#wl-losses input"]) {

        const element = document.querySelector(query);

        // Add event listener to them

        element.addEventListener("input", () => {

            // Set limits to prevent unrealistic values

            if (parseInt(element.value) < 0 || !element.value)
                element.value = 0;

            if (parseInt(element.value) > 999)
                element.value = 999;

            // Get picked wins and losses

            const wins = parseInt(document.querySelector("#wl-wins input").value);
            const losses = parseInt(document.querySelector("#wl-losses input").value);

            // Calculate win/loss percentage

            const winLossPercentage = (((wins / (wins + losses)) * 100) || 0).toFixed();
            const winColor = "rgb(255, 153, 51)";
            const lossColor = "rgb(51, 153, 255)";

            // Apply two color gradient with calculated values

            document.querySelector("#wl-average b").innerText = `${winLossPercentage}%`;
            document.querySelector("#wl-average span").style.background = (!wins && !losses) ? "gray" : `linear-gradient(to right, ${winColor} 0%, ${winColor} ${winLossPercentage}%, ${lossColor} ${winLossPercentage}%, ${lossColor} 100%`

        })

    }

})