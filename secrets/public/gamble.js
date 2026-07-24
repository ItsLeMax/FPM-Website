const CASH_REGISTER_AUDIO = new Audio("../hidden-media/audio/cash_register.mp3");
const CSGO_GAMBLE_AUDIO = new Audio("../hidden-media/audio/csgo_gamble.mp3");
const JACKPOT_AUDIO = new Audio("../hidden-media/audio/jackpot.mp3");

const MAXIMUM_ITEMS = 50;

const DEFAULT_SPIN_TIME = 5000;
const DEFAULT_HOLD_TIME = 1000;

const DEV_ENV = {
    test_enabled: window.location.hash == "#test"
};

let cache = {};

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("itemTotal").innerText = MAXIMUM_ITEMS;

    const cashSelection = document.querySelectorAll(".balance button");
    const gamePlayButton = document.querySelector("#game button");
    const navigatorButtons = document.querySelectorAll("#gamble-navigator button");
    const cash = document.querySelector("#gamble-navigator b");

    // Register listener for navigator, cash and gambling button press

    for (const navigator of navigatorButtons)
        navigator.addEventListener("click", () => handleNavigatorPress(navigator));

    for (const button of cashSelection)
        button.addEventListener("click", async () => await handleCashButtonPress(button, cashSelection, gamePlayButton, cash));

    gamePlayButton.addEventListener("click", async () => await handleGamblingProcess(cashSelection, gamePlayButton, cash));

});

/**
 * @description Acts on a navigator page button press
 * @author ItsLeMax
 * @param { Element } navigator
 */
function handleNavigatorPress(navigator) {

    for (const page of document.querySelectorAll("body>div")) {

        if (page.id || !navigator.className)
            continue;

        if (navigator.className == page.className) {
            page.style.display = "flex";
            continue;
        }

        page.style.display = "none";

    }

}

/**
 * @description Acts on pressing any +cash button
 * @author ItsLeMax
 * @param { Element } button
 * @param { NodeListOf<Element> } cashSelection
 * @param { Element } gamePlayButton
 * @param { Element } cash
 */
async function handleCashButtonPress(button, cashSelection, gamePlayButton, cash) {

    const updatedCash = parseFloat(cash.innerText) + parseFloat(button.innerText);

    await updateCash(updatedCash);
    CASH_REGISTER_AUDIO.play();

    toggleButtons(cash, cashSelection, gamePlayButton);

}

/**
 * @description Handles the gambling from start to finish
 * @author ItsLeMax
 * @param { NodeListOf<Element> } cashSelection
 * @param { Element } gamePlayButton
 * @param { Element } cash
 */
async function handleGamblingProcess(cashSelection, gamePlayButton, cash) {

    const selectedChest = document.getElementById("chests");
    const selectedChestPrice = parseInt(selectedChest.value);

    // Update UI elements

    await updateCash(parseFloat(cash.innerText) - selectedChestPrice);
    toggleButtons(cash, cashSelection, gamePlayButton);
    toggleNavigator(true);

    gamePlayButton.style.setProperty("display", "none");

    const spinner = document.createElement("div");
    spinner.className = "spinner";

    // Initialize prizes

    const prizes = [];

    for (const rarity of Object.values(INVENTORY))
        prizes.push(...rarity.drops);

    // Add 60 possible prizes to the gambling pool

    for (let prize = 0; prize < 59; prize++) {

        const image = document.createElement("img");
        image.className = "image";

        // In case the image doesn't load

        image.addEventListener("error", () => {
            image.src = "../hidden-media/img/gambling/misc/placeholder.png";
            console.warn(
                `Fehlendes Bild! ItsLeMax ist wahrscheinlich zu Faul gewesen, das ` +
                "entsprechende Bild zu erstellen. Schande!"
            );
        });

        // Every prize is random except the one that you win (pre-determined; the last index after is the last item you see on the right)

        if (prize != 57) {
            image.src = `../hidden-media/img/gambling/loot/${toFileName(prizes[Math.floor(Math.random() * prizes.length)].title)}.webp`;
        } else {

            // The prize will be set here; Probability/Rarity check first

            const probability = Math.floor(Math.random() * 100);

            for (const rarity of Object.keys(INVENTORY).reverse()) {

                // Debug on test

                if (DEV_ENV.test_enabled)
                    logger(probability, rarity, selectedChest.options[selectedChest.selectedIndex].text, selectedChestPrice);

                // Allow only the closest/best rarity

                if (probability > INVENTORY[rarity].chance[selectedChestPrice])
                    continue;

                // Determine prize

                const pricesOfRarity = INVENTORY[rarity].drops;
                const prize = pricesOfRarity[Math.floor(Math.random() * pricesOfRarity.length)];
                image.src = `../hidden-media/img/gambling/loot/${toFileName(prize.title)}.webp`;

                // Store temporarily for later

                cache = {
                    prize: prize,
                    rarity: rarity,
                    float: FLOAT[Math.floor(Math.random() * FLOAT.length)]
                };

                break;

            }

        }

        spinner.appendChild(image);

    }

    // Trigger spinner animation

    document.getElementById("game").appendChild(spinner);

    const animationEndPoint = parseFloat(getComputedStyle(document.body).getPropertyValue("--endpoint"));
    const nearMissIllusion = Math.floor(Math.random() * 20);

    const animationOptions = {
        duration: DEFAULT_SPIN_TIME,
        easing: "ease-out",
        fill: "forwards"
    };

    const firstKeyframe = { right: "0rem" };
    const lastKeyframe = { right: animationEndPoint + nearMissIllusion + "rem" };

    spinner.animate([firstKeyframe, lastKeyframe], animationOptions);
    CSGO_GAMBLE_AUDIO.play();

    setTimeout(async () => {

        // Create default prize popup

        gamePlayButton.style.display = null;
        document.querySelector(".spinner")?.remove();

        const popup = spinner.getElementsByTagName("img")[57];

        const dialog = document.createElement("dialog");
        dialog.appendChild(popup);

        const button = document.createElement("button");
        button.innerText = "✅";
        dialog.appendChild(button);

        const info = document.createElement("div");

        const title = document.createElement("b");
        title.innerText = cache.prize.title;
        info.appendChild(title);

        const description = document.createElement("p");
        description.innerText = cache.prize.description;
        info.appendChild(description);

        // Special descriptions for certain items

        if (cache.rarity != "niete" && !cache.prize.title.endsWith("€")) {

            const rarity = document.createElement("p");
            rarity.innerText = `Rarität: ${cache.rarity.toUpperCase()}`;
            info.appendChild(rarity);

            const floatValue = document.createElement("p");
            floatValue.innerText = `Qualität: ${cache.float.type}`;
            info.appendChild(floatValue);

            const sellValue = document.createElement("p");
            sellValue.innerText = `Verkaufswert: ${(cache.prize.sellValue * cache.float.sellValueMultiplier).toFixed(2)}€`;
            info.appendChild(sellValue);

        }

        // Dialog logic

        dialog.appendChild(info);
        document.getElementsByClassName("gamble")[1].prepend(dialog);
        dialog.showModal();

        // Close button

        dialog.querySelector("button").addEventListener("click", () => {
            dialog.close();
        });

        if (DEV_ENV.test_enabled)
            dialog.close();

        // Update history page here

        dialog.addEventListener("close", () => {

            // Increase total prize amount

            const itemAmount = document.getElementById("itemAmount");
            itemAmount.innerText = parseInt(itemAmount.innerText) + 1;

            // If you have too many prizes, the first one will be sold

            const history = document.querySelectorAll(".inventory div");

            if (history[MAXIMUM_ITEMS - 1])
                sellPrize(history[0].querySelector("button"), cash);

            // Add image and sell button to the history page

            const image = dialog.querySelector("img");
            image.className = "";
            info.appendChild(image);

            const sellButton = document.createElement("button");
            sellButton.innerText = "♻";
            sellButton.addEventListener("click", () => {
                sellPrize(sellButton, cash);
            })
            info.prepend(sellButton);

            document.getElementsByClassName("inventory")[1].append(info);

            // Unlock again

            dialog.remove();
            toggleNavigator();

        })

        // Update cash on cash prizes

        if (cache.prize.title.endsWith("€")) {
            updateCash(parseFloat(cash.innerText) + parseFloat(cache.prize.title), true);
            toggleButtons(cash, cashSelection, gamePlayButton);
        }

        // Special sound for legendary prizes

        if (cache.rarity == "legendär" && !DEV_ENV.test_enabled)
            JACKPOT_AUDIO.play();

    }, DEFAULT_SPIN_TIME + DEFAULT_HOLD_TIME);

}

/**
 * @description Sells a prize from the inventory
 * @author ItsLeMax
 * @param { HTMLButtonElement } deleteButton Delete button of the prize 
 * @param { Element } cash Cash variable, with which monetary values will be updated
 */
function sellPrize(deleteButton, cash) {

    deleteButton.parentElement.remove();
    CASH_REGISTER_AUDIO.play();

    // Update total prize amount

    const prizeAmount = document.getElementById("itemAmount");
    prizeAmount.innerText = parseInt(prizeAmount.innerText) - 1;

    for (const historyElement of deleteButton.parentElement.querySelectorAll("*")) {

        // Give money if the prize has monetary value

        if (historyElement.innerText.startsWith("Verkaufswert")) {

            const currentCash = parseFloat(cash.innerText);
            const additionalCash = parseFloat(historyElement.innerText.split(" ")[1].replace("€", ""));

            updateCash(currentCash + additionalCash, true);
            break;

        }

    }

    // Close inventory if empty

    if (!document.querySelectorAll(".inventory div").length)
        document.querySelector(".inventory").disabled = true;

}

/**
 * @description Activates or deactives the navigator
 * @author ItsLeMax
 * @param { Boolean } toggle Should the buttons get deactivated?
 */
function toggleNavigator(toggle) {
    for (const navigator of document.querySelectorAll("#gamble-navigator button")) {
        navigator.disabled = toggle;
    }
}

/**
 * @description Activates or deactivates buttons depending on your money, taking debt into account (haha)
 * @author ItsLeMax
 * @param { Element } cash Cash element, whose content is needed for validation
 * @param { NodeListOf<Element> } cashSelection Cash selection, i.e. all cash up buttons
 * @param { Element } gamePlayButton Game play button for the case of being too much in the negatives
 */
function toggleButtons(cash, cashSelection, gamePlayButton) {

    // Disallow balance increase if the money is over 100.000 bucks

    for (const balance of cashSelection)
        balance.disabled = parseFloat(cash.innerText) >= 100000;

    // Disallow gamble if you have debt

    const balanceTooLow = parseFloat(cash.innerText) <= -800;

    gamePlayButton.style.setProperty("font-size", balanceTooLow ? "0rem" : null, "important");
    document.querySelector("#gamble-navigator b").style.color = balanceTooLow ? "var(--danger)" : null;

}

/**
 * @description Creates a `console.log()` with focus on the determined object from gambling
 * @author ItsLeMax
 * @param { Number } probability Probability, randomly determined
 * @param { String } rarity Rarity of the variable `inventory`, optimally from a loop
 * @param { String } selectedChestName Name of the selected chest
 * @param { Number } selectedChestPrice Price of the selected chest
 * @summary Supposed to be placed in a loop of the variable `inventory`
 */
function logger(probability, rarity, selectedChestName, selectedChestPrice) {

    console.log(
        `Vergleich: ${rarity.toUpperCase()}` + "\n" +
        `Rarität (${selectedChestName}): ${INVENTORY[rarity].chance[selectedChestPrice]}%` + "\n" +
        `Zufallswert: ${probability}%` + "\n" +
        "Gut 0 >-----------< 100 Schlecht".replaceAt(7 + (Math.floor(probability / 10)), "*")
    );

}

/**
 * @description Replaces a character at a specific index
 * @author StackOverflow
 * @param { Number } index Index of the character to be replaced
 * @param { String } replacement Replacement of the index character
 * @returns String with replacement
 * @see [StackOverflow](https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-specific-index-in-javascript)
 */
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

/**
 * @description Updates the owned money
 * @author ItsLeMax
 * @param { Number } newCash New cash value of the user
 * @param { Boolean } skipWindow Should the pseudo pay window be skipped?
 */
async function updateCash(newCash, skipWindow) {

    // Shortly visible transaction window

    if (!skipWindow) {

        const pseudotransfer = window.open("../hidden-media/web/gamble-transaction.html");

        await sleep(250);
        pseudotransfer?.close();

    }

    // Set variables, also for a fancy animation

    const balanceElement = document.querySelector("#gamble-navigator b");
    const balance = parseFloat(balanceElement.innerText.split("€")[0]);
    const profit = newCash > balance;

    const iterationCount = 10;
    const timePerIteration = 50;

    let count = (balance - newCash) / iterationCount;

    // Disable buttons temporarily

    for (const button of document.getElementsByTagName("button"))
        button.disabled = true;

    // Money increase animation

    for (let iteration = 0; iteration <= iterationCount; iteration++) {

        balanceElement.innerText = `${(balance - count * iteration).toFixed(2)}€ Guthaben`;
        balanceElement.animate([{
            transform: "scale(1.1)",
            color: profit ? "var(--success)" : "var(--danger)"
        }, {
            transform: "unset",
            color: profit ? "lime" : "darkred"
        }], {
            duration: timePerIteration,
        });

        if (!DEV_ENV.test_enabled)
            await sleep(timePerIteration);

    }

    for (const button of document.getElementsByTagName("button"))
        button.disabled = false;

}

/**
 * @description Causes a delay
 * @author StackOverflow
 * @param { Number } milliseconds Milliseconds of the delay
 * @see [StackOverflow](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
 */
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * @description Changes a text to a file name
 * @author ItsLeMax
 * @param { String } name Name of the planned file
 * @returns String with file name
 */
function toFileName(name) {
    return name.replaceAll(" ", "_").toLowerCase();
}