/**
 * @description
 * Sendet eine Anfrage an den Webserver
 * 
 * Sends a request to the webserver
 
 * @author Kurty00, ItsLeMax

 * @param { Object } callback
 * Callback-Code bei Rückmeldung des Webservers
 * 
 * Callback code on callback of the webserver

 * @param { Function } callback.readystate
 * ReadyStateChange-Code

 * @param { Function? } callback.error
 * Error-Code

 * @param { Object } url
 * URL-Objekt
 * 
 * URL Object

 * @param { String } url.subdomain
 * Subdomäne der betroffenen Website
 * 
 * Subdomain of the targeted website

 * @param { String } url.apiPath
 * API-Pfad bzw. Unterordner
 * 
 * API path or sub directory
 */
function XMLHttpRequests(callback, url) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState != XMLHttpRequest.DONE || !xhr.responseText.length) return;
        callback.readystate(xhr);
    };

    if (callback.error) xhr.onerror = () => callback.error();

    xhr.open("GET", (window.location.protocol.includes("file") ? "http://localhost:3000" : `https://${url.subdomain}.fpm-studio.de`) + `/api/${url.subdomain}/${url.apiPath}`, true);
    xhr.send(null);
}