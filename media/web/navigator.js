let navigatorActive = false;

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
    window.matchMedia("(max-width: 1280px)").addEventListener("change", () => {
        const navigator = document.getElementsByClassName("navigator")[0];

        navigator.style.opacity = 0;
        navigator.style.transition = "unset";

        setTimeout(() => {
            navigator.style.opacity = 1;
            navigator.style.transition = "opacity 0.5s ease-in-out";
        }, 100);
    });

    document.addEventListener("DOMContentLoaded", () => {
        const navigator = document.createElement("div");
        navigator.className = "navigator";

        const navigatorButton = document.createElement("a");
        navigatorButton.innerText = "☰";
        navigatorButton.className = "navigator-button";

        navigator.append(navigatorButton);

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

                fifth = document.createElement("a");
                fifth.innerText = "Datenschutz";
                fifth.href = "privacy-policy.html";
                break;
        }

        const navigatorPages = [first, second, third, fourth, fifth, sixth, seventh].filter(Boolean);

        for (const navigatorPage of navigatorPages) {
            navigatorPage.className = "navigator-page";
            navigatorPage.setAttribute("active", false);
            menu.append(navigatorPage);
        }

        navigator.append(menu);
        document.body.prepend(navigator);

        navigatorButton.addEventListener("click", async () => {
            navigatorActive = !navigatorActive;

            for (const href of navigatorPages) {
                href.setAttribute("active", navigatorActive);
                href.style.pointerEvents = !navigatorActive ? "none" : null;

                await new Promise(resolve => setTimeout(resolve, 35));
            }
        })
    })
}