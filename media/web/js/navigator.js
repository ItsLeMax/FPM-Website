let navigatorOpen = false;

/**
 * @description Generates a prefabricated navigator
 * @author ItsLeMax
 */
function generateNavigator() {

    document.addEventListener("DOMContentLoaded", () => {

        const navigator = document.createElement("div");
        navigator.id = "navigator";

        const navigatorButton = document.createElement("a");
        const navigatorButtonInitial = "☰"
        navigatorButton.innerText = navigatorButtonInitial;
        navigatorButton.setAttribute("open", false);

        navigator.append(navigatorButton);

        const navigatorPages = new Array;
        navigatorPages.push(navigatorButton);

        let selectedPage = 0;

        while (selectedPage !== false) {

            const navigatorPage = document.createElement("div");
            const navigatorPageImage = document.createElement("img");
            const navigatorPageButton = document.createElement("a");

            selectedPage++;

            switch (selectedPage) {

                case 1:
                    navigatorPageImage.src = "https://media.fpm-studio.de/assets/icons/home.webp";
                    navigatorPageButton.innerText = "Homepage";
                    navigatorPageButton.href = "https://fpm-studio.de/";
                    break;

                case 2:
                    navigatorPageImage.src = "https://media.fpm-studio.de/assets/icons/group.webp";
                    navigatorPageButton.innerText = "Team";
                    navigatorPageButton.href = "https://team.fpm-studio.de/";
                    break;

                case 3:
                    navigatorPageImage.src = "https://media.fpm-studio.de/assets/icons/book.webp";
                    navigatorPageButton.innerText = "Bibliothek";
                    navigatorPageButton.href = "https://library.fpm-studio.de/";
                    break;

                case 4:
                    navigatorPageImage.src = "https://media.fpm-studio.de/assets/icons/plus.webp";
                    navigatorPageButton.innerText = "Extras";
                    navigatorPageButton.href = "https://extras.fpm-studio.de/";
                    break;

                case 5:
                    navigatorPageImage.src = "https://media.fpm-studio.de/assets/icons/incognito.webp";
                    navigatorPageButton.innerText = "Geheimnisse";
                    navigatorPageButton.href = "https://secrets.fpm-studio.de/";
                    break;

                case 6:
                    navigatorPageImage.src = "https://media.fpm-studio.de/assets/icons/web_programming.webp";
                    navigatorPageButton.innerText = "Code-Entwicklung";
                    navigatorPageButton.href = "https://dev.fpm-studio.de/";
                    break;

                default:
                    selectedPage = false;
                    break;

            }

            if (!selectedPage)
                break;

            navigatorPage.append(navigatorPageImage);
            navigatorPage.append(navigatorPageButton);

            navigatorPage.setAttribute("open", false);
            navigatorPages.push(navigatorPage);

            navigator.append(navigatorPage);

        }

        document.body.prepend(navigator);

        const navigatorPagesReversed = navigatorPages.slice().reverse();

        navigatorButton.addEventListener("click", async () => {

            navigatorOpen = !navigatorOpen;

            if (!navigatorOpen) {

                navigatorButton.innerText = navigatorButtonInitial;

                for (const navigatorPage of navigatorPagesReversed)
                    await setNaviAttributes(navigatorPage);

                return;

            }

            navigatorButton.innerText = "✖";

            for (const navigatorPage of navigatorPages)
                await setNaviAttributes(navigatorPage);

        })

        /**
         * @description Activates or deactivates the single navigator pages
         * @author ItsLeMax
         * @param { HTMLAnchorElement } navigatorPage Navigator page to update
         */
        async function setNaviAttributes(navigatorPage) {
            navigatorPage.setAttribute("open", navigatorOpen);
            await new Promise(resolve => setTimeout(resolve, 35));
        }

    })

}