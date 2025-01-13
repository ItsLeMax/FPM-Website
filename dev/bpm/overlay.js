document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        let color;
        const bpm = randomHeartBeat(40, 160);

        if ((bpm >= 55 && bpm <= 110)) {
            color = "var(--low)";
        }

        if ((bpm >= 111 && bpm <= 130) || (bpm >= 50 && bpm <= 54)) {
            color = "var(--medium)";
        }

        if ((bpm >= 131 && bpm <= 150) || (bpm >= 45 && bpm <= 49)) {
            color = "var(--high)";
        }

        if (bpm > 150 || bpm < 45) {
            color = "var(--extreme)";
        }

        document.querySelector("p").innerText = bpm;
        document.querySelector("p").style.color = color;
    }, 1000);
})

/**
 * @description
 * Generiert zufällige Herzschlagwerte in einer gewählten Spanne
 *
 * Generates random heart beat values in a chosen range
 *
 * @author StackOverflow
 *
 * @param { Number } minimumBPM
 * Minimale Schläge pro Minute
 *
 * Minimum beats per minute
 * @param { Number } maximumBPM
 * Maximale Schläge pro Minute
 *
 * Maximum beats per minute
 *
 * @returns
 * Herzschlagwert
 *
 * Heart beat value
 *
 * @see [StackOverflow](https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range)
 */
function randomHeartBeat(minimumBPM, maximumBPM) {
    minimumBPM = Math.ceil(minimumBPM);
    return Math.floor(Math.random() * (Math.floor(maximumBPM) - minimumBPM + 1)) + minimumBPM;
}