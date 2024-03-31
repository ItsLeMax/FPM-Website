/**
 * @description Sendet eine Anfrage an den Webserver
 * @author Kurty00, ItsLeMax
 * @param { Object } callback Callback-Code bei Rückmeldung des Webservers
 * @param { Function } callback.readystate ReadyStateChange-Code 
 * @param { Function? } callback.error Error-Code 
 * @param { Object } url URL-Objekt
 * @param { String } url.subdomain Subdomäne der betroffenen Website
 * @param { String } url.apiPath API-Pfad bzw. Unterordner
 */
function XMLHttpRequests(callback, url) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState != XMLHttpRequest.DONE || !xhr.responseText.length) return;
        callback.readystate(xhr);
    };

    if (callback.error) xhr.onerror = () => callback.error();

    xhr.open("GET", (window.location.protocol.includes("file") ? "http://localhost:3000" : `https://${url.subdomain}.fpm-studio.de`) + `/api/${url.apiPath}`, true);
    xhr.send(null);
}