const hash = window.location.hash.split("-");

// Preload audio

const cashRegisterAudio = new Audio("../hidden-media/audio/cash_register.mp3");
const csgoGambleAudio = new Audio("../hidden-media/audio/csgo_gamble.mp3");
const jackpotAudio = new Audio("../hidden-media/audio/jackpot.mp3");

// Some dev shit

const DEV_ENV = {
    ENABLED: hash[0] == "#test",
    ROLL_SPEED_MULTIPLIER: hash[1] == "slow" ? .5 : hash[1] == "fast" ? 10000 : 2
};

document.addEventListener("DOMContentLoaded", () => {

    const maximumItems = 50;
    document.getElementById("itemTotal").innerText = maximumItems;

    let defaultTiming = {
        revealTime: 5000,
        additionalTime: 1000
    };

    if (DEV_ENV.ENABLED) {

        /**
         * @description Looks for the fitting mathematical expression, depending on whether `TEST.ROLL_SPEED_MULTIPLIER` is positive or negative
         * @author ItsLeMax
         * @param { Number } time time from the `defaultTiming` object
         * @returns { Number } Number with calculation
         */
        const express = (time) => eval(
            time + " "
            + (DEV_ENV.ROLL_SPEED_MULTIPLIER < 0 ? "*" : "/")
            + Math.abs(DEV_ENV.ROLL_SPEED_MULTIPLIER)
        );

        defaultTiming = {
            revealTime: express(defaultTiming.revealTime),
            additionalTime: express(defaultTiming.additionalTime)
        }

        udpateCash(10000, true);

    }

    let cache = new Object;

    const cashSelection = document.querySelectorAll(".balance button");
    const cash = document.querySelector("#gamble-navigator b");

    const gamePlayButton = document.querySelector("#game button");

    // Navigator logic

    for (const navigator of document.querySelectorAll("#gamble-navigator button")) {

        navigator.addEventListener("click", () => {

            for (const page of document.querySelectorAll("body>div")) {

                if (page.id || !navigator.className)
                    continue;

                if (navigator.className == page.className) {
                    page.style.display = "flex";
                    continue;
                }

                page.style.display = "none";
            }

        })

    }

    // Click registration of cash buttons

    for (const button of cashSelection) {

        button.addEventListener("click", async () => {

            await udpateCash(parseFloat(cash.innerText) + parseFloat(button.innerText));
            cashRegisterAudio.play();

            buttonAvailability(cash, cashSelection, gamePlayButton);

        });

    }

    // "Gambling" process

    gamePlayButton.addEventListener("click", async () => {

        const selectedChest = document.getElementById("chests");
        const selectedChestPrice = parseInt(selectedChest.value);

        // Update UI elements

        await udpateCash(parseFloat(cash.innerText) - selectedChestPrice, DEV_ENV.ENABLED);
        buttonAvailability(cash, cashSelection, gamePlayButton);
        toggleNavigator(true);

        // Audio changes when testing

        if ((Math.abs(DEV_ENV.ROLL_SPEED_MULTIPLIER) >= .5 && DEV_ENV.ROLL_SPEED_MULTIPLIER <= 4)) {

            if (DEV_ENV.ENABLED)
                csgoGambleAudio.playbackRate = Math.abs(DEV_ENV.ROLL_SPEED_MULTIPLIER);

            csgoGambleAudio.play();

        }

        gamePlayButton.style.setProperty("display", "none");

        const spinner = document.createElement("div");
        spinner.className = "spinner";

        // Initialize prizes

        const prizes = new Array;

        for (const rarity of Object.values(inventory))
            prizes.push(...rarity.drops);

        // Add prizes to the gambling pool

        for (let prize = 0; prize < 59; prize++) {

            const image = document.createElement("img");
            image.className = "image";

            // In case the image does not load

            image.addEventListener("error", () => {
                image.src = "../hidden-media/img/gambling/misc/placeholder.png";
                console.warn(
                    `Fehlendes Bild! ItsLeMax ist wahrscheinlich zu Faul gewesen, das ` +
                    "entsprechende Bild zu erstellen. Schande!"
                );
            });

            // Every prize is random except the one that you win (pre-determined)

            if (prize != 57) {
                image.src = `../hidden-media/img/gambling/loot/${toFileName(prizes[Math.floor(Math.random() * prizes.length)].title)}.webp`;
            } else {

                // The prize will be set here; Probability/Rarity check first

                const probability = Math.floor(Math.random() * 100);

                for (const rarity of Object.keys(inventory).reverse()) {

                    // Debug on test

                    if (DEV_ENV.ENABLED)
                        logger(probability, rarity, selectedChest.options[selectedChest.selectedIndex].text, selectedChestPrice);

                    // Allow only the closest/best rarity

                    if (probability > inventory[rarity].chance[selectedChestPrice])
                        continue;

                    // Determine prize

                    const pricesOfRarity = inventory[rarity].drops;
                    const prize = pricesOfRarity[Math.floor(Math.random() * pricesOfRarity.length)];
                    image.src = `../hidden-media/img/gambling/loot/${toFileName(prize.title)}.webp`;

                    // Store temporarily for later

                    cache = {
                        prize: prize,
                        rarity: rarity,
                        float: float[Math.floor(Math.random() * float.length)]
                    };

                    break;

                }

            }

            spinner.appendChild(image);

        }

        // trigger spinner animation

        document.getElementById("game").appendChild(spinner);
        spinner.animate([{
            right: "0rem"
        }, {
            right: (parseFloat(getComputedStyle(document.body).getPropertyValue("--endpoint")) + Math.floor(Math.random() * 20)) + "rem"
        }], {
            duration: defaultTiming.revealTime,
            easing: "ease-out",
            fill: "forwards"
        });

        setTimeout(async () => {

            // Don't play slowed audio on tests

            if (DEV_ENV.ROLL_SPEED_MULTIPLIER < 1) {
                csgoGambleAudio.pause();
                csgoGambleAudio.currentTime = 0;
            }

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
            title.innerText = cache.random.title;
            info.appendChild(title);

            const description = document.createElement("p");
            description.innerText = cache.random.description;
            info.appendChild(description);

            // Special descriptions for certain items

            if (cache.rarity != "niete" && !cache.random.title.endsWith("€")) {
                const rarity = document.createElement("p");
                rarity.innerText = `Rarität: ${cache.rarity.toUpperCase()}`;
                info.appendChild(rarity);

                const floatValue = document.createElement("p");
                floatValue.innerText = `Qualität: ${cache.float.type}`;
                info.appendChild(floatValue);

                const sellValue = document.createElement("p");
                sellValue.innerText = `Verkaufswert: ${(cache.random.sellValue * cache.float.sellValueMultiplier).toFixed(2)}€`;
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

            if (DEV_ENV.ENABLED)
                dialog.close();

            // Update history page here

            dialog.addEventListener("close", () => {

                // Increase total prize amount

                const itemAmount = document.getElementById("itemAmount");
                itemAmount.innerText = parseInt(itemAmount.innerText) + 1;

                // If you have too many prizes, the first one will be sold

                const history = document.querySelectorAll(".inventory div");

                if (history[maximumItems - 1])
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

            if (cache.random.title.endsWith("€")) {
                udpateCash(parseFloat(cash.innerText) + parseFloat(cache.random.title), true);
                buttonAvailability(cash, cashSelection, gamePlayButton);
            }

            // Special sound for legendary prizes

            if (cache.rarity == "legendär" && !DEV_ENV.ENABLED)
                jackpotAudio.play();

        }, defaultTiming.revealTime + defaultTiming.additionalTime);

    })

})

/**
 * @description Sells a prize from the inventory
 * @author ItsLeMax
 * @param { HTMLButtonElement } deleteButton Delete button of the prize 
 * @param { Element } cash Cash variable, with which monetary values will be updated
 */
function sellPrize(deleteButton, cash) {

    deleteButton.parentElement.remove();
    cashRegisterAudio.play();

    // Update total prize amount

    const prizeAmount = document.getElementById("itemAmount");
    prizeAmount.innerText = parseInt(prizeAmount.innerText) - 1;

    for (const historyElement of deleteButton.parentElement.querySelectorAll("*")) {

        // Give money if the prize has monetary value

        if (historyElement.innerText.startsWith("Verkaufswert")) {
            udpateCash(parseFloat(cash.innerText) + parseFloat(historyElement.innerText.split(" ")[1].replace("€", "")), true);
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
 * @description Activates or deactivates the topping up of credits, depending on the sum of the own
 * @author ItsLeMax
 * @param { Element } cash Cash element, whose content is needed for validation
 * @param { NodeListOf<Element> } cashSelection Cash selection, i.e. all cash up buttons
 * @param { Element } gamePlayButton Game play button for the case of being too much in the negatives
 */
function buttonAvailability(cash, cashSelection, gamePlayButton) {

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
        `Rarität (${selectedChestName}): ${inventory[rarity].chance[selectedChestPrice]}%` + "\n" +
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
 * @param { Boolean } skipWindow Should the pseudo window be skipped?
 */
async function udpateCash(newCash, skipWindow) {

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

        if (!DEV_ENV.ENABLED)
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