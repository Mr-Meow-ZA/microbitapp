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

            // Write values to the serial monitor
            serial.writeLine("rx1: " + rx1);
            serial.writeLine("rx2: " + rx2);
        }
    });

    /**
     * Get the value of rx1 variable.
     */
    //% block="get rx1"
    export function getRx1(): string {
        return rx1;
    }

    /**
     * Get the value of rx2 variable.
     */
    //% block="get rx2"
    export function getRx2(): string {
        return rx2;
    }

    /**
     * Get the state of the button.
     */
    //% block="button is pressed"
    export function isButtonPressed(): boolean {
        return stateButtonDown === 1;
    }

    /**
     * Set the state of the button.
     * @param state - The state of the button (pressed: true, released: false).
     */
    //% block="set button state to $state"
    export function setButtonState(state: boolean): void {
        stateButtonDown = state ? 1 : 0;
    }

    /**
     * Get the X-axis value of the slider.
     */
    //% block="slider X value"
    export function getSliderX(): number {
        return sliderValX;
    }

    /**
     * Get the Y-axis value of the slider.
     */
    //% block="slider Y value"
    export function getSliderY(): number {
        return sliderValY;
    }

    /**
     * Get the Z-axis value of the slider.
     */
    //% block="slider Z value"
    export function getSliderZ(): number {
        return sliderValZ;
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


}