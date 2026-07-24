/**
 * @description Lists all subdomain keys
 * @author ItsLeMax
 * @readonly
 * @enum { String }
 */
const Subdomain = Object.freeze({
    SECRETS: "secrets",
    EXTRAS: "extras"
});

class RequestToFPM extends XMLHttpRequest {

    /**
     * @typedef { Object } url URL data for the domain
     * @property { String } subdomain Subdomain of the targeted website
     * @property { String? } sentData Sent Data to said domain (API path or sub directory)
     */
    /**
     * @typedef { Object } callbacks Callback functions that should be executed
     * @property { (xhr: XMLHttpRequest) => void } readystate ReadyStateChange code, that is supposed to be executed
     * @property { (() => void)? } error Error code in the case of an error
     */
    /**
     * @param { url } param0
     * @param { callbacks } param1
     */
    constructor({ subdomain, sentData }, { readystate, error }) {

        super();

        // Execute custom code that got passed

        this.onreadystatechange = () => {

            if (this.readyState != XMLHttpRequest.DONE || !this.responseText.length)
                return;

            // Execute the given readystate function

            readystate(this);

        };

        // Add custom error listener from arguments

        if (error)
            this.onerror = () => error();

        // Localhost for testing purposes, else the real domain

        const target = window.location.protocol.includes("file") ? "http://localhost:3000" : `https://${subdomain}.fpm-studio.de`;

        this.open("GET", target + `/api/${subdomain}/${sentData}`, true);
        this.send(null);

    }

};