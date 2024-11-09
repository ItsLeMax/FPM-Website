/**
 * @description
 * Sendet eine Anfrage an den Webserver
 * 
 * Sends a request to the webserver
 
 * @author Kurty00, ItsLeMax

 * @param { Object } callbacks
 * Callback-Code bei Rückmeldung des Webservers
 * 
 * Callback code on callback of the webserver

 * @param { Function } callbacks.readystate
 * ReadyStateChange-Code, welcher ausgeführt werden soll
 * 
 * ReadyStateChange code, that is supposed to be executed

 * @param { Function | undefined | null } callbacks.error
 * Error-Code im Falle eines Fehlers
 * 
 * Error code in the case of an error

 * @param { Object } url
 * URL-Daten für die Domäne
 * 
 * URL data for the domain

 * @param { String } url.subdomain
 * Subdomäne der betroffenen Website
 * 
 * Subdomain of the targeted website

 * @param { String } url.sentData
 * Gesendete Daten an jene Domäne (API-Pfad bzw. Unterordner)
 * 
 * Sent Data to said domain (API path or sub directory)
 */
function XMLHttpRequests(callbacks, url) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState != XMLHttpRequest.DONE || !xhr.responseText.length) return;
        callbacks.readystate(xhr);
    };

    if (callbacks.error) {
        xhr.onerror = () => {
            callbacks.error();
        }
    }

    xhr.open("GET", (window.location.protocol.includes("file") ? "http://localhost:3000" : `https://${url.subdomain}.fpm-studio.de`) + `/api/${url.subdomain}/${url.sentData}`, true);
    xhr.send(null);
}