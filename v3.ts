
namespace mkc { // v3.ts

    let n_rgbled = [0, 0, 0]
    export enum eRGBled { a, b, c }

    //let n_Licht = false


    // group="Licht" subcategory="Aktoren"
    // block="Licht %pON || blinken %pBlink" weight=6
    // pON.shadow="toggleOnOff" pBlink.shadow="toggleOnOff"
    /* function licht(pON: boolean, pBlink = false) {
        if (pON && pBlink)
            n_Licht = !n_Licht
        else
            n_Licht = pON

        basic.setLedColor(n_Licht ? 0x009ff00 : 0x0000ff)
        //pins.digitalWritePin(pinLicht, n_Licht ? 0 : 1) // an bei digitalem Wert 0
    } */


    //% group="Licht"
    //% block="RGB LEDs %led %color %on" weight=6
    //% color.shadow="colorNumberPicker"
    //% on.shadow="toggleOnOff"
    export function rgbLEDon(led: eRGBled, color: number, on: boolean) {
        rgbLEDs(led, (on ? color : 0), false)
    }

    //% group="Licht"
    //% block="RGB LEDs %led %color blinken %blinken" weight=5
    //% color.shadow="colorNumberPicker"
    //% blinken.shadow="toggleYesNo"
    export function rgbLEDs(led: eRGBled, color: number, blinken: boolean) {
        if (blinken && n_rgbled[led] != 0)
            n_rgbled[led] = 0
        else
            n_rgbled[led] = color

        basic.setLedColors(n_rgbled[0], n_rgbled[1], n_rgbled[2])
    }


} // v3.ts
