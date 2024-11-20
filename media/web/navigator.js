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
        const navigatorContainer = document.createElement("div");
        navigatorContainer.className = "navigator";

        const navigatorButton = document.createElement("a");
        const navigatorButtonInitial = "☰"
        navigatorButton.innerText = navigatorButtonInitial;
        navigatorButton.className = "navigator-button";
        navigatorButton.setAttribute("open", false);

        navigatorContainer.append(navigatorButton);

        const navigatorPageHolder = document.createElement("div");
        const navigatorPages = new Array;

        switch (subdomain) {
            case "FPM":
                for (let element = 0; element < 7; element++) {
                    navigatorPages.push(document.createElement("a"));
                }

                navigatorPages[0].innerText = "Homepage";
                navigatorPages[0].href = "https://fpm-studio.de/";

                navigatorPages[1].innerText = "Team";
                navigatorPages[1].href = "https://team.fpm-studio.de/";

                navigatorPages[2].innerText = "Bibliothek";
                navigatorPages[2].href = "https://library.fpm-studio.de/";

                navigatorPages[3].innerText = "Extras";
                navigatorPages[3].href = "https://extras.fpm-studio.de/";

                navigatorPages[4].innerText = "Geheimnisse";
                navigatorPages[4].href = "https://secrets.fpm-studio.de/";

                navigatorPages[5].innerText = "Code-Entwicklung";
                navigatorPages[5].href = "https://dev.fpm-studio.de/";

                navigatorPages[6].innerText = "Turniere";
                navigatorPages[6].href = "https://tournaments.fpm-studio.de/";
                break;
            case "Tournaments":
                for (let element = 0; element < 5; element++) {
                    navigatorPages.push(document.createElement("a"));
                }

                navigatorPages[0].innerText = "Homepage";
                navigatorPages[0].href = "index.html";

                navigatorPages[1].innerText = "Informationen";
                navigatorPages[1].href = "information.html";

                navigatorPages[2].innerText = "Verwaltung";
                navigatorPages[2].href = "manage.html";

                navigatorPages[3].innerText = "Facecam in Streams";
                navigatorPages[3].href = "facecam.html";

                navigatorPages[4].innerText = "Datenschutz";
                navigatorPages[4].href = "privacy-policy.html";
                break;
        }

        for (const navigatorPage of navigatorPages) {
            navigatorPage.className = "navigator-page";
            navigatorPage.style.pointerEvents = "none";
            navigatorPage.setAttribute("open", false);

            navigatorPageHolder.append(navigatorPage);
        }

        navigatorContainer.append(navigatorPageHolder);
        document.body.prepend(navigatorContainer);

        const navigatorPagesReversed = navigatorPages.slice().reverse();

        navigatorButton.addEventListener("click", async () => {
            navigatorOpen = !navigatorOpen;

            if (!navigatorOpen) {
                navigatorButton.innerText = navigatorButtonInitial;
                for (const navigatorPage of navigatorPagesReversed) {
                    await setNaviAttributes(navigatorPage);
                }

                return;
            }

            navigatorButton.innerText = "✖";
            for (const navigatorPage of navigatorPages) {
                await setNaviAttributes(navigatorPage);
            }
        })

        /**
         * Aktiviert oder deaktiviert die einzelnen Navigatorseiten
         *
         * activates or deactivates the single navigator pages
         *
         * @author ItsLeMax
         *
         * @param { HTMLAnchorElement } navigatorPage
         *
         * einzelne Seite des Navigators
         *
         * single page of the navigator
         */
        async function setNaviAttributes(navigatorPage) {
            navigatorPage.style.pointerEvents = navigatorOpen ? null : "none";

            navigatorPage.setAttribute("open", navigatorOpen);
            navigatorButton.setAttribute("open", navigatorOpen);

            await new Promise(resolve => setTimeout(resolve, 35));
        }
    })
}