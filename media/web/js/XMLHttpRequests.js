/**
 * @description Sends a request to the webserver
 * @author Kurty00, ItsLeMax
 * @param { Object } callbacks Callback code on callback of the webserver
 * @param { Function } callbacks.readystate ReadyStateChange code, that is supposed to be executed
 * @param { Function | undefined | null } callbacks.error Error code in the case of an error
 * @param { Object } url URL data for the domain
 * @param { String } url.subdomain Subdomain of the targeted website
 * @param { String } url.sentData Sent Data to said domain (API path or sub directory)
 */
function XMLHttpRequests(callbacks, url) {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {

        if (xhr.readyState != XMLHttpRequest.DONE || !xhr.responseText.length)
            return;

        // Execute the given readystate function

        callbacks.readystate(xhr);

    };

    if (callbacks.error)
        xhr.onerror = () => { callbacks.error(); }

    // Localhost for testing purposes, else the real domain

    const target = window.location.protocol.includes("file") ? "http://localhost:3000" : `https://${url.subdomain}.fpm-studio.de`;

    xhr.open("GET", target + `/api/${url.subdomain}/${url.sentData}`, true);
    xhr.send(null);

}