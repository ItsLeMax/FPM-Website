let navigatorOpen = false;

/**
 * @description Generates a prefabricated navigator
 * @author ItsLeMax
 */
function generateNavigator() {

    document.addEventListener("DOMContentLoaded", () => {

        // Navi container

        const navigator = document.createElement("div");
        navigator.id = "navigator";

        // Navi button

        const navigatorButton = document.createElement("a");
        const navigatorButtonInitial = "☰";

        navigatorButton.innerText = navigatorButtonInitial;
        navigatorButton.setAttribute("open", false);

        // Merge

        navigator.append(navigatorButton);

        const navigatorPages = new Array;
        navigatorPages.push(navigatorButton);

        let selectedPage = 0;

        // Loop with a new page each iteration

        while (selectedPage !== false) {

            const navigatorPage = document.createElement("div");
            const navigatorPageImage = document.createElement("img");
            const navigatorPageButton = document.createElement("a");

            // Create pages until there are no more pages left to create (see default case)

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

            // Assemble page

            navigatorPage.append(navigatorPageImage);
            navigatorPage.append(navigatorPageButton);

            navigatorPage.setAttribute("open", false);
            navigatorPages.push(navigatorPage);

            navigator.append(navigatorPage);

        }

        // Add to body if done

        document.body.prepend(navigator);

        const navigatorPagesReversed = navigatorPages.slice().reverse();

        // Toggle navigator on or off

        navigatorButton.addEventListener("click", async () => {

            navigatorOpen = !navigatorOpen;

            // Toggle navigator off

            if (!navigatorOpen) {

                navigatorButton.innerText = navigatorButtonInitial;

                // Close pages in reverse order by updating its boolean

                for (const navigatorPage of navigatorPagesReversed)
                    await setNaviAttributes(navigatorPage);

                return;

            }

            // Toggle navigator on

            navigatorButton.innerText = "✖";

            // Open pages in normal order by updating its boolean

            for (const navigatorPage of navigatorPages)
                await setNaviAttributes(navigatorPage);

        })

        /**
         * @description Activates or deactivates the single navigator pages
         * @author ItsLeMax
         * @param { HTMLAnchorElement } navigatorPage Navigator page to update
         * @summary Uses a small delay to create a smooth animation effect
         */
        async function setNaviAttributes(navigatorPage) {
            navigatorPage.setAttribute("open", navigatorOpen);
            await new Promise(resolve => setTimeout(resolve, 35));
        }

    })

}