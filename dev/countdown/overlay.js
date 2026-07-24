window.addEventListener("DOMContentLoaded", () => {

    const countdownElement = document.querySelector("b");
    const countdownInitial = countdownElement.innerText;

    window.addEventListener("storage", () => handleCountdown(countdownElement, countdownInitial));
});

/**
 * @description Handles the countdown, triggering countdown related functions in the process if applicable
 * @author ItsLeMax
 * @param { HTMLElement } countdownElement
 * @param { String } countdownInitial
 */
function handleCountdown(countdownElement, countdownInitial) {

    const updateData = localStorage.getItem("update");
    const update = JSON.parse(updateData);

    // Update countdown if the settings have changed

    if (update) {
        updateElements(countdownElement, update);
        localStorage.removeItem("update");
        return;
    }

    // Start or stop countdown if applicable

    const toggleData = localStorage.getItem("toggle");
    const toggle = JSON.parse(toggleData);

    if (toggle.init) {
        initializeCountdown(countdownElement, countdownInitial, toggle);
        return;
    }

    stopCountdown(countdownElement, countdownInitial);

}

/**
 * @description Updates the elements of the countdown, e.g. when settings of the countdown have changed
 * @author ItsLeMax
 * @param { HTMLElement } countdownElement
 * @param { JSON } update
 */
function updateElements(countdownElement, update) {

    countdownElement.style.color = `#${update.color}`;
    countdownElement.style.fontFamily = update.font == "Standard" ? null : update.font;

    document.body.style.textAlign = update.align;

}

/**
 * @description Contains the logic of the countdown process
 * @author ItsLeMax
 * @param { HTMLElement } countdownElement
 * @param { String } countdownInitial
 * @param { JSON } toggle
 */
function initializeCountdown(countdownElement, countdownInitial, toggle) {

    const countdownDate = new Date().addMinutes(toggle.time || 10).getTime();

    // Update every second

    updateCountdown(countdownElement, countdownInitial, countdownDate);

    const intervalId = setInterval(() => updateCountdown(countdownElement, countdownInitial, countdownDate));
    localStorage.setItem("interval", intervalId, 1000);

}

/**
 * @description Updates the countdown content
 * @author ItsLeMax
 * @param { HTMLElement } countdownElement
 * @param { String } countdownInitial
 * @param { Number } countdownDate
*/
function updateCountdown(countdownElement, countdownInitial, countdownDate) {

    const distance = countdownDate - new Date().getTime();
    const distanceMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const distanceSeconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdown = [distanceMinutes, ":", distanceSeconds];

    // Prepend zero if the seconds number is below 10

    if (distanceSeconds < 10)
        countdown.splice(2, 0, "0");

    countdownElement.innerText = countdown.join("");

    if (distance < 0)
        stopCountdown(countdownElement, countdownInitial);

}

/**
 * @description Ends and deletes the interval
 * @author ItsLeMax
 * @param { HTMLElement } countdownElement
 * @param { String } countdownInitial 
*/
function stopCountdown(countdownElement, countdownInitial) {

    const intervalData = localStorage.getItem("interval");
    clearInterval(intervalData);

    localStorage.clear();
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