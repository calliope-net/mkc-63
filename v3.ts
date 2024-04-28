
namespace mkc { // v3.ts

    let n_Licht = false

    //% group="Licht" subcategory="Aktoren"
    //% block="Licht %pON || blinken %pBlink" weight=6
    //% pON.shadow="toggleOnOff" pBlink.shadow="toggleOnOff"
    export function licht(pON: boolean, pBlink = false) {
        if (pON && pBlink)
            n_Licht = !n_Licht
        else
            n_Licht = pON
            
        basic.setLedColor(n_Licht ? 0x009ff00 : 0x0000ff)
        //pins.digitalWritePin(pinLicht, n_Licht ? 0 : 1) // an bei digitalem Wert 0
    }



} // v3.ts
