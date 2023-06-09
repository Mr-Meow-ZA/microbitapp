/******************************************************************
 * Extension for Chop Chop microbit App. 
 * App by Nick Bradley and Extension by Rapha Pretorius
 * Author: Rapha Pretorius
 * Email: raphapretorius@gmail.com
******************************************************************/

enum ButtonOption {
    Up,Right,Down,Left
}
enum CompassButtonOption {
    N,NE,E,SE,S,SW,W,NW
}
enum LightOption {
    Light1,Light2,Light3
}

enum LightState {
    On,Off
}
enum ToggleOption {
    Toggle1,Toggle2,Toggle3
}

enum SliderValue {
    X,
    Y,
    Z
}

//% weight=40 color=#226025 icon="\uf10b" block="microbit App"
//% groups=['4 Button Navigation', 'Compass Navigation', 'Slider and Rx Values', 'Send and Display on App', 'Set Light Icon', 'Toggle State', 'Custom Receive then Do block']
namespace microbitApp {

    // define global variables
    let optionStrings: string[] = ["BF", "BR", "BB", "BL"];
    let compassOptionStrings: string[] = ["BF", "BFR", "BR", "BBR", "BB", "BBL", "BL", "BFL"]
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
            } else if (rx1 === "T1") {
                stateToggleOne = parseInt(rx2);
            } else if (rx1 === "T2") {
                stateToggleTwo = parseInt(rx2);
            } else if (rx1 === "T3") {
                stateToggleThree = parseInt(rx2);
            }

            // Write values to the serial monitor for testing purpose
            serial.writeLine("rx1: " + rx1);
            serial.writeLine("rx2: " + rx2);
        }
    });
    

    /**
     * Custom block to handle different button options based on rx1 values.
     * @param option - The button option to match.
     * @param handler - The code to run when the option is matched.
     */
    //% group="4 Button Navigation"
    //% block="When button %option is pressed down"
    export function onButtonOption(option: ButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionStrings[option] && rx2 == "D") {
                handler();
            }
        });
    }
    //% group="4 Button Navigation"
    //% block="When button %option is released"
    export function onButtonUpOption(option: ButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionStrings[option] && rx2 == "U") {
                handler();
            }
        });
    }
    //% group="4 Button Navigation"
    //% block="When any Nav button is released"
    export function onButtonReleased(handler: () => void): void {
        basic.forever(function () {
            if (rx2 == "U") {
                handler();
            }
        });
    }


    /**
     * Get the value of rx1 and rx2 variable.
     */
    //% group="Slider and Rx Values"
    //% block="get rx1"
    export function getRx1(): string {
        return rx1;
    }
    //% group="Slider and Rx Values"
    //% block="get rx2"
    export function getRx2(): string {
        return rx2;
    }



    //% group="Slider and Rx Values"
    //% block="get slider value %value"
    export function getSliderValue(value: SliderValue): number {
        if (value === SliderValue.X) {
            return sliderValX;
        } else if (value === SliderValue.Y) {
            return sliderValY;
        } else if (value === SliderValue.Z) {
            return sliderValZ;
        }
        return 0; // Default value if an invalid option is selected
    }


    //% group="Slider and Rx Values"
    //% block="When Slider on App changed"
    export function onSliderUpdated(handler: () => void): void {
        basic.forever(function () {
            if (rx1 == "SX" || rx1 == "SY" || rx1 == "SZ") {
                handler();
            }
        });
    }

    //% group="Send and Display on App"
    //% block="Display number %value on App"
    export function sendValueOnceToApp(value: number): void {
        bluetooth.uartWriteString("V1#" + convertToText(value));
    }
    //% group="Send and Display on App"
    //% block="Display string $value on App"
    export function sendStringToApp(value: string): void {
        bluetooth.uartWriteString("V1#" + value);
    }

    
    //% group="Compass Navigation"
    //% block="When compass button %option is pressed down"
    export function compassButtonDown(option: CompassButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == compassOptionStrings[option] && rx2 == "D") {
                handler();
            }
        });
    }
    //% group="Compass Navigation"
    //% block="When compass button %option is released"
    export function compassButtonUp(option: CompassButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == compassOptionStrings[option] && rx2 == "U") {
                handler();
            }
        });
    }

    //% group="Custom Receive then Do block"
    //% block="Do when rx1 is $rxOne and rx2 is $rxTwo"
    export function onCustomRx1Rx2(rxOne:string, rxTwo:string, handler:() => void): void {
        basic.forever(function() {
            if (rx1 == rxOne && rx2 == rxTwo){
                handler();
            }
        });
    }

    /*
    * @param light - The light to control.
    * @param state - The state of the light (On or Off).
    */
    //% group="Set Light Icon"
    //% block="Set $light $state"
    export function setLightState(light: LightOption, state: LightState): void {
        let command = "";
        let stateVariable = 0;

        switch (light) {
            case LightOption.Light1:
                command = "L1";
                stateVariable = stateLightOne;
                break;
            case LightOption.Light2:
                command = "L2";
                stateVariable = stateLightTwo;
                break;
            case LightOption.Light3:
                command = "L3";
                stateVariable = stateLightThree;
                break;
        }
        if (state === LightState.On) {
            command += "#1";
            stateVariable = 1;
        } else {
            command += "#0";
            stateVariable = 0;
        }
        bluetooth.uartWriteString(command);
    }

    /*
     * Get the state of the specified toggle.
     * Returns the value of the toggle (0 for off, 1 for on).
     * @param toggle - The toggle to check.
     * @returns The current state of the toggle (0 for off, 1 for on).
     */
    //% group="Toggle State"
    //% block="Get state of $toggle"
    export function getToggleState(toggle: ToggleOption): number {
        let state = 0;

        switch (toggle) {
            case ToggleOption.Toggle1:
                state = stateToggleOne;
                break;
            case ToggleOption.Toggle2:
                state = stateToggleTwo;
                break;
            case ToggleOption.Toggle3:
                state = stateToggleThree;
                break;
        }
        return state;
    }

}