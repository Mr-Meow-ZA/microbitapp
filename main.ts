enum ButtonOption {
    Up,
    Right,
    Down,
    Left
}
let optionStrings: string[] = ["BF", "BR", "BB", "BL"];

//% weight=40 color=#226025 icon="\uf110" block="microbitAPP"
namespace microbitAPP {
    let stateToggleOne = 0;
    let stateToggleTwo = 0;
    let stateToggleThree = 0;
    let stateLightOne = 0;
    let stateLightTwo = 0;
    let stateLightThree = 0;
    let stateButtonDown = 0;
    let sliderValX = 0;
    let sliderValY = 0;
    let sliderValZ = 0;
    let rx1 = "";
    let rx2 = "";

    bluetooth.startUartService();
 

    bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Comma), function () {
        let data = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Comma));
        let values = data.split("#");
        if (values.length === 2) {
            rx1 = values[0];
            rx2 = values[1];

            if (rx2 == "D") {
                stateButtonDown = 1;
            } else if (rx2 == "U") {
                stateButtonDown = 0;
            }

            // Check if rx1 is "SX", "SY", or "SZ" and store rx2 value accordingly
            if (rx1 == "SX") {
                sliderValX = parseInt(rx2);
            } else if (rx1 == "SY") {
                sliderValY = parseInt(rx2);
            } else if (rx1 == "SZ") {
                sliderValZ = parseInt(rx2);
            }

            // Write values to the serial monitor
            serial.writeLine("rx1: " + rx1);
            serial.writeLine("rx2: " + rx2);
        }
    });

    /**
     * Get the state of the button.
     */
    //% block="button is pressed"
    export function isButtonPressed(): boolean {
        return stateButtonDown === 1;
    }

    /**
     * Get the value of rx1 and rx2 variable.
     */
    //% block="get rx1"
    export function getRx1(): string {
        return rx1;
    }
    //% block="get rx2"
    export function getRx2(): string {
        return rx2;
    }
    //% block="slider X value"
    export function getSliderX(): number {
        return sliderValX;
    }
    //% block="slider Y value"
    export function getSliderY(): number {
        return sliderValY;
    }
    //% block="slider Z value"
    export function getSliderZ(): number {
        return sliderValZ;
    }

    /**
     * Send a custom value to the app once.
     * @param value - The value to send.
     */
    //% block="send value %value once to App"
    export function sendValueOnceToApp(value: number): void {
        bluetooth.uartWriteString("V1#" + convertToText(value));
    }


    /**
     * Custom block to handle different button options based on rx1 values.
     * @param option - The button option to match.
     * @param handler - The code to run when the option is matched.
     */
    //% block="on button option %option"
    export function onButtonOption(option: ButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionStrings[option]) {
                handler();
            }
        });
    }

    //% block="Do when rx1 is $rxOne and rx2 is $rxTwo"
    export function onCustomRx1Rx2(rxOne:string, rxTwo:string, handler:() => void): void {
        basic.forever(function() {
            if (rx1 == rxOne && rx2 == rxTwo){
                handler();
            }
        });
    }
    /**
     * Send a string to the app.
     * @param message - The string to send.
     */
    //% block="send string %message to App"
    export function sendStringToApp(message: string): void {
        bluetooth.uartWriteString(message);
    }


}