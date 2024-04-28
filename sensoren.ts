// Gib deinen Code hier ein
namespace mkc { // sensoren.ts

    // ========== group="Encoder" subcategory="Sensoren"
 export   const c_MotorEncoder= Motor.M0

    let n_EncoderCounter: number = 0 // Impuls Zähler
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
    //let n_EncoderStrecke_cm: number = 0 // löst Event aus bei Zähler in cm
    let n_EncoderStrecke_impulse: number = 0
    export let n_EncoderAutoStop = false // true während der Fahrt, false bei Stop nach Ende der Strecke

    // Event Handler
    pins.onPulsed(pinEncoder, PulseValue.Low, function () {
        // Encoder 63.3 Impulse pro U/Motorwelle
        if (motor_get(c_MotorEncoder) >= c_MotorStop)
            n_EncoderCounter += 1 // vorwärts
        else
            n_EncoderCounter -= 1 // rückwärts

        if (n_EncoderStrecke_impulse > 0 && Math.abs(n_EncoderCounter) >= n_EncoderStrecke_impulse) {
            n_EncoderStrecke_impulse = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_start

            //n_EncoderStopEvent = true
            if (n_EncoderAutoStop) {
                motorA255(c_MotorEncoder, c_MotorStop)
                n_EncoderAutoStop = false
            }

            if (onEncoderStopHandler)
                onEncoderStopHandler(n_EncoderCounter / n_EncoderFaktor)
        }
    })

    let onEncoderStopHandler: (v: number) => void

    //% block="wenn Ziel erreicht" subcategory="Sensoren"
    //% draggableParameters=reporter
    export function onEncoderStop(cb: (v: number) => void) {
        onEncoderStopHandler = cb
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder Start, Stop Ereignis bei %streckecm cm || AutoStop %autostop" weight=9
    //% streckecm.min=1 streckecm.max=255 streckecm.defl=20
    //% autostop.shadow="toggleYesNo" autostop.defl=1
    export function encoder_start(streckecm: number, autostop = true) {
        n_EncoderCounter = 0 // Impuls Zähler zurück setzen

        if (streckecm > 0) {
            n_EncoderStrecke_impulse = Math.round(streckecm * n_EncoderFaktor)
            n_EncoderAutoStop = autostop
            n_lastconnectedTime = input.runningTime() // Connection-Timeout Zähler zurück setzen
        } else {
            n_EncoderStrecke_impulse = 0
        }
    }
} // sensoren.ts
