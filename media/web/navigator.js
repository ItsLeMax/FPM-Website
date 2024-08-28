let enabled = false;

document.addEventListener("DOMContentLoaded", () => {
    const navigator = document.createElement("div");
    navigator.className = "navigator";
    navigator.style.position = "fixed";
    navigator.style.right = "0";
    navigator.style.textAlign = "right";

    const menuButton = document.createElement("a");
    menuButton.innerText = "☰";
    menuButton.style.cursor = "pointer";
    menuButton.style.userSelect = "none";
    menuButton.style.color = "white";
    navigator.append(menuButton);

    const menu = document.createElement("div");
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.gap = "1rem";

    const first = document.createElement("a");
    first.innerText = "Code-Entwicklung";
    first.href = "https://dev.fpm-studio.de/";

    const second = document.createElement("a");
    second.innerText = "Extras";
    second.href = "https://extras.fpm-studio.de/";

    const third = document.createElement("a");
    third.innerText = "Homepage";
    third.href = "https://fpm-studio.de/";

    const fourth = document.createElement("a");
    fourth.innerText = "Bibliothek";
    fourth.href = "https://library.fpm-studio.de/";

    const fifth = document.createElement("a");
    fifth.innerText = "Dateiverwaltung";
    fifth.href = "https://media.fpm-studio.de/";

    const sixth = document.createElement("a");
    sixth.innerText = "Geheime Codes";
    sixth.href = "https://secrets.fpm-studio.de/";

    const seventh = document.createElement("a");
    seventh.innerText = "Team";
    seventh.href = "https://team.fpm-studio.de/";

    const eighth = document.createElement("a");
    eighth.innerText = "Turniere";
    eighth.href = "https://tournaments.fpm-studio.de/";

    const text = [first, second, third, fourth, fifth, sixth, seventh, eighth];

    for (const href of text) {
        href.style.color = "white";
        href.style.textDecoration = "none";

        href.style.position = "relative";
        href.style.right = "-21rem";
        href.style.transform
    }

    menu.append(first);
    menu.append(second);
    menu.append(third);
    menu.append(fourth);
    menu.append(fifth);
    menu.append(sixth);
    menu.append(seventh);
    menu.append(eighth);

    navigator.append(menu);

    document.body.prepend(navigator);

    menuButton.addEventListener("click", () => {
        if (enabled) {
            enabled = false;
            document.body.style.position = "unset";
            document.body.style.right = "unset";
            animate(text, "0", "-21rem");
            return;
        }

        document.body.style.position = "absolute";
        animate(text, "-21rem", "0");
        enabled = true;
    })
})

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function animate(text, start, end) {
    for (const href of text) {
        href.animate([{
            right: start
        }, {
            right: end
        }], {
            duration: 250,
            fill: "forwards",
            easing: "ease-in-out"
        });

        await delay(35);
    }
}