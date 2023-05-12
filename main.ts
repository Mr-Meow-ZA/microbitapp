/*
* Test Extension for the Chop Chop Microbit APP
* Goal is to package everything into an easy to use block extension.
*/

//% weight=40 color=#226025 icon="\uf10b" block="microbitAPP"

namespace microbitAPP {
    // set global variables
    let stateToggleOne = 0
    let stateToggleTwo = 0
    let stateToggleThree = 0
    let stateLightOne = 0
    let stateLightTwo = 0
    let stateLightThree = 0
    let stateButtonDown = 0
    let sliderValX = 0
    let sliderValY = 0
    let sliderValZ = 0
    let rx1 = ""
    let rx2 = ""

    bluetooth.startUartService()
    basic.showIcon(IconNames.House)

    
    bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Comma), function () {
        let data = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Comma))
        let values = data.split("#")
        if (values.length === 2) {
            let rx1 = values[0]
            let rx2 = values[1]

            if (rx2 == "D"){
                stateButtonDown = 1
            }
            else if (rx2 == "U"){
            stateButtonDown = 0
            }
        }
    })

}