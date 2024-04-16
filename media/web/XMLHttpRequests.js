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
 * ReadyStateChange-Code

 * @param { Function? } callbacks.error
 * Error-Code

 * @param { Object } url
 * URL-Objekt
 * 
 * URL Object

 * @param { String } url.subdomain
 * Subdomäne der betroffenen Website
 * 
 * Subdomain of the targeted website

 * @param { String } url.sentData
 * Gesendete Daten (API-Pfad bzw. Unterordner)
 * 
 * Sent Data (API path or sub directory)
 */
function XMLHttpRequests(callbacks, url) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState != XMLHttpRequest.DONE || !xhr.responseText.length) return;
        callbacks.readystate(xhr);
    };

    if (callbacks.error) xhr.onerror = () => callbacks.error();

    xhr.open("GET", (window.location.protocol.includes("file") ? "http://localhost:3000" : `https://${url.subdomain}.fpm-studio.de`) + `/api/${url.subdomain}/${url.sentData}`, true);
    xhr.send(null);
}