document.addEventListener("DOMContentLoaded", () => {
    async function connectToPolar() {
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ["heart_rate", "battery_service", "device_information"]
            });

            const server = await device.gatt.connect();
            const deviceInfoService = await server.getPrimaryService("device_information");

            for (const char of [
                { uuid: "manufacturer_name_string", label: "Hersteller" },
                { uuid: "model_number_string", label: "Modellnummer" },
                { uuid: "serial_number_string", label: "Seriennummer" },
                { uuid: "hardware_revision_string", label: "Hardware-Version" },
                { uuid: "firmware_revision_string", label: "Firmware-Version" },
                { uuid: "software_revision_string", label: "Software-Version" }
            ]) {
                try {
                    const characteristic = await deviceInfoService.getCharacteristic(char.uuid);
                    const decodedValue = new TextDecoder().decode(await characteristic.readValue());

                    document.getElementById("device").innerText += "\n" + `${char.label}: ${decodedValue}`;
                } catch (error) {
                    console.warn(`Eigenschaft ${char.label} (${char.uuid}) konnte nicht gelesen werden.`);
                }
            }

            const heartRateService = await server.getPrimaryService("heart_rate");
            const heartRateCharacteristic = await heartRateService.getCharacteristic("heart_rate_measurement");

            heartRateCharacteristic.addEventListener("characteristicvaluechanged", async (event) => {
                document.getElementById("bpm").innerText = `${event.target.value.getUint8(1)} bpm`;

                const batteryService = await server.getPrimaryService("battery_service");
                const batteryLevelCharacteristic = await batteryService.getCharacteristic("battery_level");
                const batteryPercentage = (await batteryLevelCharacteristic.readValue()).getUint8(0);

                document.querySelector("span").style.background = `linear-gradient(to right, #3fffa2 ${batteryPercentage}%, gray ${batteryPercentage}%)`;
                document.querySelector("span p").innerText = `${batteryPercentage}%`;
            });

            await heartRateCharacteristic.startNotifications();
        } catch (error) {
            console.error("Fehler beim Verbinden:", error);
        }
    }

    document.querySelector("button").addEventListener("click", connectToPolar);
});