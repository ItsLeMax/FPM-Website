let navigatorOpen = false;

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
        navigator.id = "navigator";

        const navigatorButton = document.createElement("a");
        const navigatorButtonInitial = "☰"
        navigatorButton.innerText = navigatorButtonInitial;
        navigatorButton.setAttribute("open", false);

        navigator.append(navigatorButton);

        let pageAmount;
        switch (subdomain) {
            case "FPM":
                pageAmount = 7;
                break;
            case "Tournaments":
                pageAmount = 5;
                break;
        }

        const navigatorPageButtons = new Array;

        for (let element = 0; element < pageAmount; element++) {
            const navigatorPage = document.createElement("div");
            const navigatorPageImage = document.createElement("img");
            const navigatorPageButton = document.createElement("a");

            if (subdomain == "FPM") {
                switch (element) {
                    case 0:
                        navigatorPageButton.innerText = "Homepage";
                        navigatorPageButton.href = "https://fpm-studio.de/";
                        break;
                    case 1:
                        navigatorPageButton.innerText = "Team";
                        navigatorPageButton.href = "https://team.fpm-studio.de/";
                        break;
                    case 2:
                        navigatorPageButton.innerText = "Bibliothek";
                        navigatorPageButton.href = "https://library.fpm-studio.de/";
                        break;
                    case 3:
                        navigatorPageButton.innerText = "Extras";
                        navigatorPageButton.href = "https://extras.fpm-studio.de/";
                        break;
                    case 4:
                        navigatorPageButton.innerText = "Geheimnisse";
                        navigatorPageButton.href = "https://secrets.fpm-studio.de/";
                        break;
                    case 5:
                        navigatorPageButton.innerText = "Code-Entwicklung";
                        navigatorPageButton.href = "https://dev.fpm-studio.de/";
                        break;
                    case 6:
                        navigatorPageButton.innerText = "Turniere";
                        navigatorPageButton.href = "https://tournaments.fpm-studio.de/";
                        break;
                }
            }

            if (subdomain == "Tournaments") {
                switch (element) {
                    case 0:
                        navigatorPageButton.innerText = "Homepage";
                        navigatorPageButton.href = "index.html";
                        break;
                    case 1:
                        navigatorPageButton.innerText = "Informationen";
                        navigatorPageButton.href = "information.html";
                        break;
                    case 2:
                        navigatorPageButton.innerText = "Verwaltung";
                        navigatorPageButton.href = "manage.html";
                        break;
                    case 3:
                        navigatorPageButton.innerText = "Facecam in Streams";
                        navigatorPageButton.href = "facecam.html";
                        break;
                    case 4:
                        navigatorPageButton.innerText = "Datenschutz";
                        navigatorPageButton.href = "privacy-policy.html";
                        break;
                }
            }

            navigatorPageButton.className = "navigator-page-button";
            navigatorPageButton.setAttribute("open", false);

            navigatorPage.append(navigatorPageImage);
            navigatorPage.append(navigatorPageButton);
            navigator.append(navigatorPage);

            navigatorPageButtons.push(navigatorPageButton);
        }

        document.body.prepend(navigator);

        const navigatorPageButtonsReversed = navigatorPageButtons.slice().reverse();

        navigatorButton.addEventListener("click", async () => {
            navigatorOpen = !navigatorOpen;
            navigatorButton.setAttribute("open", navigatorOpen);

            if (!navigatorOpen) {
                navigatorButton.innerText = navigatorButtonInitial;
                for (const navigatorPageButton of navigatorPageButtonsReversed) {
                    await setNaviAttributes(navigatorPageButton);
                }

                return;
            }

            navigatorButton.innerText = "✖";
            for (const navigatorPageButton of navigatorPageButtons) {
                await setNaviAttributes(navigatorPageButton);
            }
        })

        /**
         * Aktiviert oder deaktiviert die einzelnen Navigatorseiten
         *
         * activates or deactivates the single navigator pages
         *
         * @author ItsLeMax
         *
         * @param { HTMLAnchorElement } navigatorPageButton
         *
         * einzelne Seite des Navigators
         *
         * single page of the navigator
         */
        async function setNaviAttributes(navigatorPageButton) {
            navigatorPageButton.setAttribute("open", navigatorOpen);

            await new Promise(resolve => setTimeout(resolve, 35));
        }
    })
}