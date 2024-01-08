/******************************************************************
 * Extension for Chopchop Micro:bit Controller Mobile App. 
 * App by Nic Bradley and Extension by Rapha Pretorius
 * Author: Rapha Pretorius
 * Email: raphapretorius@gmail.com
******************************************************************/

enum ButtonOption {
   F, FR, R, BR, B, BL, L, FL, 
}

enum SliderOption {
    SliderX, SliderY, SliderZ, 
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

//% weight=40 color=#226025 icon="\uf10b" block="Microbit App"
//% groups=['Buttons', 'Toggles', 'Sliders', 'Lights']
namespace microbitApp {
    // define global variables
    let optionStrings: string[] = ["BF", "BFR", "BR", "BBR", "BB", "BBL", "BL", "BFL"]
    let optionToggleStrings: string[] = ["T1", "T2", "T3",]
    let optionSliderStrings: string[] = ["SX", "SY", "SZ",]
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
    //% group="Buttons"
    //% block="When button %option is pressed down"
    export function onButtonOption(option: ButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionStrings[option] && rx2 == "D") {
                handler();
            }
        });
    }
    //% group="Buttons"
    //% block="When button %option is released"
    export function onButtonUpOption(option: ButtonOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionStrings[option] && rx2 == "U") {
                handler();
            }
        });
    }
    //% group="Buttons"
    //% block="When any button is released"
    export function onButtonReleased(handler: () => void): void {
        basic.forever(function () {
            if (rx2 == "U") {
                handler();
            }
        });
    }


    
    /**
     * Custom block to handle different toggle options based on rx1 values.
     * @param option - The toggle option to match.
     * @param handler - The code to run when the option is matched.
     */
    //% group="Toggles"
    //% block="When toggle %option is switched on"
    export function onToggleOnOption(option: ToggleOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionToggleStrings[option] && rx2 == "1") {
                handler();
            }
        });
    }
   
     //% group="Toggles"
    //% block="When toggle %option is switched off"
    export function onToggleOffOption(option: ToggleOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionToggleStrings[option] && rx2 == "0") {
                handler();
            }
        });
    }


    
    /**
     * Custom block to handle different slider options based on rx1 values.
     * @param option - The slider option to match.
     * @param handler - The code to run when the option is matched.
     */
    //% group="Sliders"
    //% block="When slider %option value updated"
    export function onSliderOption(option: SliderOption, handler: () => void): void {
        basic.forever(function () {
            if (rx1 == optionSliderStrings[option]) {
                handler();
            }
        });
    }

    /**
     * Get Slider Values.
     */
    
    //% group="Sliders"
    //% block="slider X value"
    export function getSliderX(): number {
        return sliderValX;
    }
    //% group="Sliders"
    //% block="slider Y value"
    export function getSliderY(): number {
        return sliderValY;
    }
    //% group="Sliders"
    //% block="slider Z value"
    export function getSliderZ(): number {
        return sliderValZ;
    }


    /*
    * @param light - The light to control.
    * @param state - The state of the light (On or Off).
    */
    //% group="Lights"
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
    //% group="Toggle"
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