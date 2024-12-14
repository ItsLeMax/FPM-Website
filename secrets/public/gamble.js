const hash = window.location.hash.split("-");

const TEST = {
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

    if (TEST.ENABLED) {
        /**
         * @description
         * Sucht den passenden Ausdruck, je nach dem, ob `TEST.ROLL_SPEED_MULTIPLIER` positiv oder negativ ist
         *
         * looks for the fitting expression, depending on whether `TEST.ROLL_SPEED_MULTIPLIER` is positive or negative
         *
         * @author ItsLeMax
         *
         * @param { Number } time
         * Zeit aus dem `defaultTiming`-Objekt
         *
         * time from the `defaultTiming` object
         *
         * @returns { Number }
         * Nummer mit Rechnung
         *
         * number with calculation
         */
        const express = (time) => eval(time + " " + (TEST.ROLL_SPEED_MULTIPLIER < 0 ? "*" : "/") + Math.abs(TEST.ROLL_SPEED_MULTIPLIER));

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

    for (const navigator of document.querySelectorAll("#gamble-navigator button")) {
        navigator.addEventListener("click", () => {
            for (const page of document.querySelectorAll("body>div")) {
                if (page.id || !navigator.className) continue;
                if (navigator.className == page.className) {
                    page.style.display = "flex";
                    continue;
                }

                page.style.display = "none";
            }
        })
    }

    for (const button of cashSelection) {
        button.addEventListener("click", async () => {
            await udpateCash(parseFloat(cash.innerText) + parseFloat(button.innerText));
            new Audio("../hidden-media/audio/cash_register.mp3").play();
            buttonAvailability(cash, cashSelection, gamePlayButton);
        })
    }

    gamePlayButton.addEventListener("click", async () => {
        const selectedChest = document.getElementById("chests");
        const selectedChestPrice = parseInt(selectedChest.value);

        await udpateCash(parseFloat(cash.innerText) - selectedChestPrice, TEST.ENABLED);
        buttonAvailability(cash, cashSelection, gamePlayButton);
        toggleNavigator(true);

        const gambleAudio = new Audio("../hidden-media/audio/csgo_gamble.mp3");

        if ((Math.abs(TEST.ROLL_SPEED_MULTIPLIER) >= .5 && TEST.ROLL_SPEED_MULTIPLIER <= 4)) {
            if (TEST.ENABLED) {
                gambleAudio.playbackRate = Math.abs(TEST.ROLL_SPEED_MULTIPLIER);
            }

            gambleAudio.play();
        }

        gamePlayButton.style.setProperty("display", "none");

        const spinner = document.createElement("div");
        spinner.className = "spinner";

        const drops = new Array;
        for (const rarity of Object.values(inventory)) {
            drops.push(...rarity.drops);
        }

        for (let item = 0; item < 59; item++) {
            const image = document.createElement("img");
            image.className = "image";

            image.addEventListener("error", () => {
                image.src = "../hidden-media/img/gambling/misc/placeholder.png";
                console.warn(
                    `Fehlendes Bild! ItsLeMax ist wahrscheinlich zu Faul gewesen, das ` +
                    "entsprechende Bild zu erstellen. Schande!"
                );
            });

            if (item != 57) image.src = `../hidden-media/img/gambling/loot/${toFileName(drops[Math.floor(Math.random() * drops.length)].title)}.webp`;
            else {
                const probability = Math.floor(Math.random() * 100);

                for (const rarity of Object.keys(inventory).reverse()) {
                    if (TEST.ENABLED) {
                        logger(probability, rarity, selectedChest.options[selectedChest.selectedIndex].text, selectedChestPrice);
                    }

                    if (probability > inventory[rarity].chance[selectedChestPrice]) continue;

                    const rarityDrops = inventory[rarity].drops;
                    const random = rarityDrops[Math.floor(Math.random() * rarityDrops.length)];
                    image.src = `../hidden-media/img/gambling/loot/${toFileName(random.title)}.webp`;

                    cache = {
                        random: random,
                        rarity: rarity,
                        float: float[Math.floor(Math.random() * float.length)]
                    };
                    break;
                }
            }

            spinner.appendChild(image);
        }

        document.getElementById("game").appendChild(spinner);
        spinner.animate([{
            right: "0rem"
        }, {
            right: (parseFloat(getComputedStyle(document.body).getPropertyValue('--endpoint')) + Math.floor(Math.random() * 20)) + "rem"
        }], {
            duration: defaultTiming.revealTime,
            easing: "ease-out",
            fill: "forwards"
        });

        setTimeout(async () => {
            if (TEST.ROLL_SPEED_MULTIPLIER < 1) {
                gambleAudio.pause();
                gambleAudio.currentTime = 0;
            }

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

            dialog.appendChild(info);
            document.getElementsByClassName("gamble")[1].prepend(dialog);
            dialog.showModal();

            dialog.querySelector("button").addEventListener("click", () => {
                dialog.close();
            });

            if (TEST.ENABLED) {
                dialog.close();
            }

            dialog.addEventListener("close", () => {
                const itemAmount = document.getElementById("itemAmount");
                itemAmount.innerText = parseInt(itemAmount.innerText) + 1;

                const history = document.querySelectorAll(".inventory div");
                if (history[maximumItems - 1]) {
                    sellItem(history[0].querySelector("button"), cash);
                }

                const image = dialog.querySelector("img");
                image.className = "";
                info.appendChild(image);

                const deleteButton = document.createElement("button");
                deleteButton.innerText = "♻";
                deleteButton.addEventListener("click", () => {
                    sellItem(deleteButton, cash);
                })
                info.prepend(deleteButton);

                document.getElementsByClassName("inventory")[1].append(info);

                dialog.remove();

                toggleNavigator();
            })

            if (cache.random.title.endsWith("€")) {
                udpateCash(parseFloat(cash.innerText) + parseFloat(cache.random.title), true);
                buttonAvailability(cash, cashSelection, gamePlayButton);
            }

            if (cache.rarity == "legendär" && !TEST.ENABLED) {
                new Audio("../hidden-media/audio/jackpot.mp3").play();
            }
        }, defaultTiming.revealTime + defaultTiming.additionalTime);
    })
})

/**
 * @description
 * Verkauft einen Gegenstand aus dem Inventar
 *
 * sells an item from the inventory
 *
 * @author ItsLeMax
 *
 * @param { HTMLButtonElement } deleteButton
 * Löschknopf des Items
 *
 * delete button of the item 
 *
 * @param { Element } cash
 * besagte Variable, mit der Geldbeträge aktualisiert werden
 *
 * said variable, with which monetary values will be updated
 */
function sellItem(deleteButton, cash) {
    deleteButton.parentElement.remove();
    new Audio("../hidden-media/audio/cash_register.mp3").play();

    const itemAmount = document.getElementById("itemAmount");
    itemAmount.innerText = parseInt(itemAmount.innerText) - 1;

    for (const historyElement of deleteButton.parentElement.querySelectorAll("*")) {
        if (historyElement.innerText.startsWith("Verkaufswert")) {
            udpateCash(parseFloat(cash.innerText) + parseFloat(historyElement.innerText.split(" ")[1].replace("€", "")), true);
            break;
        }
    }

    if (!document.querySelectorAll(".inventory div").length) {
        document.querySelector(".inventory").disabled = true;
    }
}

/**
 * @description
 * Aktiviert oder deaktiviert den Navigator
 *
 * activates or deactives the navigator
 *
 * @author ItsLeMax
 *
 * @param { Boolean } toggle
 * Sollen die Buttons deaktiviert werden?
 *
 * should the buttons get deactivated?
 */
function toggleNavigator(toggle) {
    for (const navigator of document.querySelectorAll("#gamble-navigator button")) {
        navigator.disabled = toggle;
    }
}

/**
 * @description
 * Aktiviert oder deaktiviert das Aufladen von Guthaben, je nach Summe des Eigenen
 *
 * activates or deactivates the topping up of credits, depending on the sum of the own
 * 
 * @author ItsLeMax
 *
 * @param { Element } cash
 * Geldelement, dessen Inhalt zur Validation benötigt wird
 *
 * cash element, whose content is needed for validation
 *
 * @param { NodeListOf<Element> } cashSelection
 * Geldauswahl, e.g. alle Geldaufladeknöpfe
 * 
 * cash selection, i.e. all cash up buttons
 *
 * @param { Element } gamePlayButton
 * Spieleknopf für den Fall, zu sehr im Negativ zu sein
 * 
 * game play button for the case of being too much in the negatives
 */
function buttonAvailability(cash, cashSelection, gamePlayButton) {
    for (const balance of cashSelection) {
        balance.disabled = parseFloat(cash.innerText) >= 100000;
    }

    const balanceTooLow = parseFloat(cash.innerText) <= -800;

    gamePlayButton.style.setProperty("font-size", balanceTooLow ? "0rem" : null, "important");
    document.querySelector("#gamble-navigator b").style.color = balanceTooLow ? "var(--danger)" : null;
}

/**
 * @description
 * Gibt einen `console.log()` aus mit Fokus auf das determinierte Objekt beim Glücksspiel
 *
 * puts out a `console.log()` with focus on the determined object from gambling
 *
 * @author ItsLeMax
 *
 * @param { Number } probability
 * Wahrscheinlichkeit, zufällig determiniert
 *
 * probability, randomly determined
 *
 * @param { String } rarity
 * Rarität von der Variable `inventory`, optimalerweise aus einem Loop
 *
 * rarity of the variable `inventory`, optimally from a loop
 *
 * @param { String } selectedChestName
 * Name der ausgewählten Kiste
 *
 * name of the selected chest
 * @param { Number } selectedChestPrice
 * Preis der ausgewählten Kiste
 *
 * price of the selected chest
 *
 * @summary
 * Vorgesehen zum Platzieren in einem Loop der Variable `inventory`
 *
 * supposed to be placed in a loop of the variable `inventory`
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
 * @description
 * Ersetzt ein Zeichen an einem spezifischen Index
 *
 * replaces a character at a specific index
 *
 * @author StackOverflow
 *
 * @param { Number } index
 * Index des zu ersetzenden Zeichens
 *
 * index of the character to be replaced
 *
 * @param { String } replacement
 * Ersatz des Index-Zeichens
 *
 * replacement of the index character
 * @returns
 * String mit Ersatz
 *
 * string with replacement
 *
 * @see [StackOverflow](https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-specific-index-in-javascript)
 */
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

/**
 * @description
 * Aktualisiert den eigenen Geldbetrag
 * 
 * updates the owned money

 * @author ItsLeMax

 * @param { Number } newCash
 * Neuer Geldwert des Benutzers
 * 
 * new cash value of the user
 *
 * @param { Boolean } skipWindow
 * Soll das Pseudofenster übersprungen werden?
 *
 * should the pseudo window be skipped?
 */
async function udpateCash(newCash, skipWindow) {
    if (!skipWindow) {
        const pseudotransfer = window.open("../hidden-media/web/gamble-transaction.html");
        await sleep(250);
        pseudotransfer?.close();
    }

    const balanceElement = document.querySelector("#gamble-navigator b");
    const balance = parseFloat(balanceElement.innerText.split("€")[0]);
    const profit = newCash > balance;

    const iterationCount = 10;
    const timePerIteration = 50;

    let count = (balance - newCash) / iterationCount;

    for (const button of document.getElementsByTagName("button")) {
        button.disabled = true;
    }

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

        if (!TEST.ENABLED) {
            await sleep(timePerIteration);
        }
    }

    for (const button of document.getElementsByTagName("button")) {
        button.disabled = false;
    }
}

/**
 * @description
 * Verursacht eine Verzögerung
 *
 * causes a delay
 *
 * @author StackOverflow
 *
 * @param { Number } milliseconds
 * Millisekunden der Verzögerung
 *
 * milliseconds of the delay
 *
 * @see [StackOverflow](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
 */
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * @description
 * Ändert einen Text zu einem Dateinamen
 *
 * changes a text to a file name
 *
 * @author ItsLeMax
 *
 * @param { String } name
 * Name der vorgesehenen Datei
 *
 * name of the planned file
 * @returns
 * Dateiname
 *
 * file name
 */
function toFileName(name) {
    return name.replaceAll(" ", "_").toLowerCase();
}