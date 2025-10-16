document.addEventListener("DOMContentLoaded", () => {

    // Convert written birth date to age automatically

    for (const birthdayElement of document.getElementsByClassName("bday")) {

        const bday = birthdayElement.textContent.split(".");
        const bdate = new Date(bday[2], parseInt(bday[1]) - 1, bday[0]);
        const today = new Date();

        let age = today.getFullYear() - bdate.getFullYear();
        const month = today.getMonth() - bdate.getMonth();

        if (month < 0 || (month == 0 && today.getDate() < bdate.getDate()))
            age--;

        birthdayElement.textContent = age;

    }

})