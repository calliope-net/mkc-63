
//% color=#007F00 icon="\uf0d1" block="Maker Kit Car" weight=28
namespace mkc { // mkc.ts


    const c_Simulator: boolean = ("€".charCodeAt(0) == 8364)

    export const c_MotorStop = 128
    export let n_MotorReady = false
    let n_MotorON = false       // aktueller Wert im Chip
    let n_MotorA = c_MotorStop  // aktueller Wert im Chip

    export const c_Servo_geradeaus = 90
    let n_ServoPin = AnalogPin.P1           // 5V fischertechnik 132292 Servo
    let n_ServoGeradeaus = c_Servo_geradeaus // Winkel für geradeaus wird beim Start eingestellt
    let n_ServoWinkel = c_Servo_geradeaus // aktuell eingestellter Winkel
    let n_ready = false


    //% group="beim Start"
    //% block="beim Start Funkgruppe %funkgruppe Servo Pin %servoPin ↑ %servoGeradeaus °" weight=8
    //% funkgruppe.min=0 funkgruppe.max=255 funkgruppe.defl=240
    //% servoPin.defl=AnalogPin.P1
    //% servoGeradeaus.min=81 servoGeradeaus.max=99 servoGeradeaus.defl=90
    //% inlineInputMode=inline 
    export function beimStart(funkgruppe: number, servoPin: AnalogPin, servoGeradeaus: number) {
        n_ready = false // CaR4 ist nicht bereit: Schleifen werden nicht abgearbeitet

        // Parameter
        n_ServoPin = servoPin
        n_ServoGeradeaus = servoGeradeaus

        //servo(90) // Servo PIN PWM
        pins.servoWritePin(servoPin, n_ServoGeradeaus)

        // in bluetooth.ts:
        bluetooth_beimStart(funkgruppe)

        n_ready = true
    }


    // group="beim Start"
    // block="Car bereit" weight=6
    export function carReady() {
        return n_ready //&& motorStatus()
    }



    //% group="Motor"
    //% block="Motor %motor (0 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=4
    //% speed.min=0 speed.max=255 speed.defl=128
    export function motorA255(motor: Motor, speed: number) { // sendet nur wenn der Wert sich ändert
        if (n_MotorReady) {
            if (between(speed, 0, 255) && speed != n_MotorA) {
                n_MotorA = speed

                motors.dualMotorPower(motor, Math.map(speed, 0, 255, -100, 100))
                // pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([MA_DRIVE, n_MotorA]))
            }
        }
        else if (speed == c_MotorStop)
            n_MotorReady = true
    }



    //% group="Servo"
    //% block="Servo (135° ↖ 90° ↗ 45°) %winkel °" weight=4
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function servo_set(winkel: number) {
        // Richtung ändern: 180-winkel
        // (0+14)*3=42 keine Änderung, gültige Werte im Buffer 1-31  (1+14)*3=45  (16+14)*3=90  (31+14)*3=135
        if (between(winkel, 45, 135) && n_ServoWinkel != winkel) {
            n_ServoWinkel = winkel
            pins.servoWritePin(n_ServoPin, winkel + n_ServoGeradeaus - c_Servo_geradeaus)
        }
    }
    // group="Servo"
    // block="Servo (135° ↖ 90° ↗ 45°)" weight=2
     function servo_get() { return n_ServoWinkel }


    // ========== advanced=true ==========

    // ========== group="Logik" advanced=true

    //% group="Logik" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=1
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }


    // ========== group="Text" advanced=true

    //% group="Text" advanced=true
    //% block="// %text" weight=9
    export function comment(text: string): void { }


} // mkc.ts
