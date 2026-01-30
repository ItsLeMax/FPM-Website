window.addEventListener("DOMContentLoaded", () => {

    const countdownElement = document.querySelector("b");
    const countdownInitial = countdownElement.innerText;

    window.addEventListener("storage", () => {

        const update = JSON.parse(localStorage.getItem("update"));

        // Update countdown if the settings have changed

        if (update) {

            countdownElement.style.color = `#${update.color}`;
            countdownElement.style.fontFamily = update.font == "Standard" ? null : update.font;

            document.body.style.textAlign = update.align;
            localStorage.removeItem("update");

            return;

        }

        const toggle = JSON.parse(localStorage.getItem("toggle"));

        if (localStorage.getItem("interval") && toggle.init)
            return;

        localStorage.removeItem("toggle");

        // Start countdown

        if (toggle.init) {

            const countdownDate = new Date().addMinutes(toggle.time || 10).getTime();

            /**
             * @description Updates the countdown
             * @author ItsLeMax
            */
            const updateCountdown = () => {

                const distance = countdownDate - new Date().getTime();
                const distanceMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const distanceSeconds = Math.floor((distance % (1000 * 60)) / 1000);

                const countdown = [distanceMinutes, ":", distanceSeconds];

                // Prepend zero if the seconds number is below 10

                if (distanceSeconds < 10)
                    countdown.splice(2, 0, "0");

                countdownElement.innerText = countdown.join("");

                if (distance < 0)
                    clearAndDeleteInterval();

            }

            // Update every second

            updateCountdown();
            localStorage.setItem("interval", setInterval(() => updateCountdown(), 1000));

            return;

        }

        clearAndDeleteInterval();

    }, 100)

    /**
     * @description Ends and deletes the interval
     * @author ItsLeMax
     */
    function clearAndDeleteInterval() {

        clearInterval(localStorage.getItem("interval"));

        localStorage.removeItem("interval");
        countdownElement.innerText = countdownInitial;

    }

    /**
     * @description Adds minutes to a date
     * @author StackOverflow
     * @param { Number } minutes Minutes to add
     * @returns { Date } Date, which lies in the future
     * @see [StackOverflow](https://stackoverflow.com/)
     */
    Date.prototype.addMinutes = function (minutes) {
        this.setTime(this.getTime() + (minutes * 1000 * 60) + 500);
        return this;
    }

})