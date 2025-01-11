window.addEventListener("DOMContentLoaded", () => {
    const countdownElement = document.querySelector("b");
    const countdownInitial = countdownElement.innerText;

    window.addEventListener("storage", () => {
        const update = JSON.parse(localStorage.getItem("update"));

        if (update) {
            countdownElement.style.color = `#${update.color}`;
            countdownElement.style.fontFamily = update.font == "Standard" ? null : update.font;
            document.body.style.textAlign = update.align;
            localStorage.removeItem("update");
            return;
        }

        const toggle = JSON.parse(localStorage.getItem("toggle"));
        if (localStorage.getItem("interval") && toggle.init) return;
        localStorage.removeItem("toggle");

        if (toggle.init) {
            const countdownDate = new Date().addMinutes(toggle.time || 10).getTime();

            /**
             * @description
             * Aktualisiert den Countdown
             * 
             * Updates the countdown

             * @author ItsLeMax
            */
            const updateCountdown = () => {
                const distance = countdownDate - new Date().getTime();
                const distanceMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const distanceSeconds = Math.floor((distance % (1000 * 60)) / 1000);

                const countdown = [distanceMinutes, ":", distanceSeconds];
                if (distanceSeconds < 10) countdown.splice(2, 0, "0");
                countdownElement.innerText = countdown.join("");

                if (distance < 0) {
                    clearAndDeleteInterval();
                }
            }

            updateCountdown();
            localStorage.setItem("interval", setInterval(() => updateCountdown(), 1000));
            return;
        }

        clearAndDeleteInterval();
    }, 100)

    /**
     * @description
     * Beendet und löscht den Intervall
     * 
     * Ends and deletes the interval

     * @author ItsLeMax
     */
    function clearAndDeleteInterval() {
        clearInterval(localStorage.getItem("interval"));
        localStorage.removeItem("interval");
        countdownElement.innerText = countdownInitial;
    }
    /**
     * @description
     * Fügt einem Datum Minuten hinzu
     * 
     * Adds minutes to a date

     * @author StackOverflow

     * @param { Number } minutes
     * Minuten, welche hinzugefügt werden soll
     * 
     * Minutes to add

     * @returns { Date }
     * Datum, welches in der Zukunft liegt
     * 
     * Date, which lies in the future

     * @see [StackOverflow](https://stackoverflow.com/)
     */
    Date.prototype.addMinutes = function (minutes) {
        this.setTime(this.getTime() + (minutes * 1000 * 60) + 500);
        return this;
    }
})