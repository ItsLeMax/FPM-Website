document.addEventListener("DOMContentLoaded", () => {
    generateBracket(generateExampleTournament());
})

/**
 * @description
 * Generiert ein Beispiel-Single-Elimination-Bracket für Testeszwecke
 *
 * Generates an example single elimination bracket for testing purposes
 *
 * @author ItsLeMax
 *
 * @returns { Array<{}> }
 * Array mit Bracket-Daten
 *
 * Array with bracket data
 */
function generateExampleTournament() {
    const exampleSeries = new Array;

    for (let column = 1; column <= 3; column++) {
        for (let element = 1; element <= 4; element++) {
            exampleSeries.push({
                column: column,
                element: element,
                blue: `test-blue-${element}`,
                orange: `test-orange-${element}`
            });
        }
    }

    return exampleSeries;
}

/**
 * @description
 * Generiert ein Bracket eines Turniers
 *
 * Generates a bracket of one tournament
 *
 * @author ItsLeMax
 *
 * @param { Array<{}> } data
 * Daten in Array
 *
 * data inside Array
 */
function generateBracket(data) {
    for (const series of data) {
        console.log(series);
    }
}