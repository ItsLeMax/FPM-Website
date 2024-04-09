window.addEventListener("DOMContentLoaded", () => {
    const countdownElement = document.getElementsByTagName("b")[0];
    const countdownInitial = countdownElement.innerText;

    window.addEventListener("storage", () => {
        const update = JSON.parse(localStorage.getItem("update"));
        if (update) {
            countdownElement.style.color = update.color;
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

                countdownElement.innerText = ("Die Übertragung startet in" + "\n" +
                    `${distanceMinutes} ${distanceMinutes == 1 ? "Minute" : "Minuten"} und ` +
                    `${distanceSeconds} ${distanceSeconds == 1 ? "Sekunde" : "Sekunden"}.`
                );

                if (distance < 0) {
                    clearAndDeleteInterval();
                    countdownElement.innerText = "Die Übertragung beginnt nun.";
                }
            }

            updateCountdown();
            localStorage.setItem("interval", setInterval(() => updateCountdown(), 1000));
            return;
        }

        clearAndDeleteInterval();
        countdownElement.innerText = countdownInitial;
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
    }
    /**
     * @description
     * Fügt einem Datum Minuten hinzu
     * 
     * Adds minutes to a date

     * @author StackOverflow

     * @see [StackOverflow](https://stackoverflow.com/)
     * @returns { Date }
     * Datum, welches in der Zukunft liegt
     * 
     * Date, which lies in the future
     */
    Date.prototype.addMinutes = function (minutes) {
        this.setTime(this.getTime() + (minutes * 1000 * 60) + 500);
        return this;
    }
})