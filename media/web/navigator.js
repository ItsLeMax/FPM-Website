let navigatorEnabled = false;

/**
 * @description
 * Generiert einen vorgefertigten Navigator
 *
 * Generates a prefabricated navigator
 *
 * @author ItsLeMax
 *
 * @param { "FPM"|"Tournaments" } subdomain
 * Subdomäne des Navigators
 *
 * subdomain of the navigator
 */
function generateNavigator(subdomain) {
    document.addEventListener("DOMContentLoaded", () => {
        const navigator = document.createElement("div");
        navigator.style.position = "fixed";
        navigator.style.display = "flex";
        navigator.style.flexDirection = "row-reverse";
        navigator.style.width = "100%";
        navigator.style.justifyContent = "space-between";
        navigator.style.top = "0";
        navigator.style.left = "0";

        const menuButton = document.createElement("a");
        menuButton.innerText = "☰";
        menuButton.style.cursor = "pointer";
        menuButton.style.userSelect = "none";
        menuButton.style.color = "white";
        navigator.append(menuButton);

        const menu = document.createElement("div");
        let first, second, third, fourth, fifth, sixth, seventh;

        switch (subdomain) {
            case "FPM":
                first = document.createElement("a");
                first.innerText = "Homepage";
                first.href = "https://fpm-studio.de/";

                second = document.createElement("a");
                second.innerText = "Team";
                second.href = "https://team.fpm-studio.de/";

                third = document.createElement("a");
                third.innerText = "Bibliothek";
                third.href = "https://library.fpm-studio.de/";

                fourth = document.createElement("a");
                fourth.innerText = "Extras";
                fourth.href = "https://extras.fpm-studio.de/";

                fifth = document.createElement("a");
                fifth.innerText = "Geheimnisse";
                fifth.href = "https://secrets.fpm-studio.de/";

                sixth = document.createElement("a");
                sixth.innerText = "Code-Entwicklung";
                sixth.href = "https://dev.fpm-studio.de/";

                seventh = document.createElement("a");
                seventh.innerText = "Turniere";
                seventh.href = "https://tournaments.fpm-studio.de/";
                break;
            case "Tournaments":
                first = document.createElement("a");
                first.innerText = "Homepage";
                first.href = "index.html";

                second = document.createElement("a");
                second.innerText = "Informationen";
                second.href = "information.html";

                third = document.createElement("a");
                third.innerText = "Verwaltung";
                third.href = "manage.html";

                fourth = document.createElement("a");
                fourth.innerText = "Facecam in Streams";
                fourth.href = "facecam.html";
                break;
        }

        const navigatorElements = [first, second, third, fourth, fifth, sixth, seventh].filter(Boolean);

        for (const href of navigatorElements) {
            href.style.color = "white";
            href.style.textDecoration = "none";
            href.style.userSelect = "none";
            href.style.padding = "0 .5rem";

            href.style.position = "relative";
            href.style.top = "-4rem";
        }

        for (const navigatorElement of navigatorElements) {
            menu.append(navigatorElement);
        }

        navigator.append(menu);
        document.body.prepend(navigator);

        menuButton.addEventListener("click", () => {
            if (!navigatorEnabled) {
                animateNavigator(navigatorElements, true);
                navigatorEnabled = true;
                return;
            }

            navigatorEnabled = false;
            animateNavigator(navigatorElements, false);
        })
    })
}

/**
 * @description
 * Fügt mithilfe einer Prämisse eine Verzögerung im Code hinzu
 *
 * Adds with the help of a promise a delay inside the code
 *
 * @author StackOverflow
 *
 * @see [StackOverflow](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
 *
 * @param { Number } milliseconds
 * Zeit in Millisekunden
 *
 * time in milliseconds
 */
const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * @description
 * Animiert den Ein- und Auszug des Navigators
 *
 * Animates the in and out movement of the navigator
 *
 * @author ItsLeMax
 *
 * @param { Array<HTMLAnchorElement> } navigatorElements
 * Alle Navigator-Elemente
 *
 * all navigator elements
 *
 * @param { String } naviActivated
 * Wurde der Navigator aktiviert?
 *
 * Was the navigator activated?
 */
async function animateNavigator(navigatorElements, naviActivated) {
    const moveIn = [{
        top: "-4rem"
    }, {
        top: "0"
    }];

    if (!naviActivated) {
        moveIn.reverse();
    }

    for (const href of navigatorElements) {
        href.animate(moveIn, {
            duration: 250,
            fill: "forwards",
            easing: "ease-in-out"
        });

        await delay(35);
    }
}