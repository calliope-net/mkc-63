
namespace mkc { // bluetooth.ts


    let n_receivedBuffer19: Buffer


    export enum eBufferPointer {
        //% block="1-2-3"
        p0 = 1,
        //% block="4-5-6"
        p1 = 4,
        //% block="7-8-9"
        p2 = 7,
        //% block="10-11-12"
        p3 = 10,
        //% block="13-14-15"
        p4 = 13,
        //% block="16-17-18"
        p5 = 16
    }
    let n_BufferPointer: eBufferPointer = eBufferPointer.p0 // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16

    export let n_lastconnectedTime: number // ms seit Start
    let n_connected: boolean // Bluetooth connected

    export enum eBufferOffset { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        b0_Motor = 0, // 0..128..255
        b1_Servo = 1, // Bit 4-0 (0..31)
        b2_Fahrstrecke = 2, // Encoder in cm max. 255cm
        b1_Bits = 3 // Bit 7-6-5
    }

    export function bluetooth_beimStart(funkgruppe: number) {
        radio.setGroup(funkgruppe)
        n_connected = false
        n_lastconnectedTime = input.runningTime() // Laufzeit
    }

    // ========== Bluetooth Event ==========

    let onReceivedBufferHandler: (receivedBuffer: Buffer) => void

    // Event-Handler (aus radio) wenn Buffer empfangen
    radio.onReceivedBuffer(function (receivedBuffer) {
        n_receivedBuffer19 = receivedBuffer

        if (carReady()) { // beim ersten Mal warten bis Motor bereit
            if (!n_connected) {
                //licht(false, false) //  Licht aus und Blinken beenden
                //   n_MotorChipReady = false
                n_connected = true // wenn Start und Motor bereit, setze auch Bluetooth connected
            }
            n_lastconnectedTime = input.runningTime() // Connection-Timeout Zähler zurück setzen

            if (onReceivedBufferHandler)
                onReceivedBufferHandler(receivedBuffer) // Ereignis Block auslösen, nur wenn benutzt
        }
    })

    // ========== group="Bluetooth Verbindung" subcategory="Bluetooth"

    // Event-Block

    //% group="Bluetooth Verbindung" color=#007F7F
    //% block="wenn bereit und Datenpaket empfangen" weight=9
    //% draggableParameters=reporter
    export function onReceivedData(cb: (receivedBuffer: Buffer) => void) {
        onReceivedBufferHandler = cb
    }



    //% group="Bluetooth Verbindung" color=#007F7F
    //% block="Bluetooth Timeout nach %timeout s ||, ausschalten nach %ausschalten s" weight=8
    //% timeout.defl=1 ausschalten.defl=60 
    // inlineInputMode=inline expandableArgumentMode=toggle
    export function bluetooth_timeout(timeout: number, ausschalten = 60) {

        if (carReady()) { // beim ersten Mal warten bis Motor bereit
            if (lastConnected(ausschalten))
                relay(false) // nach 60 s ohne Bluetooth Relais aus schalten
            else if (n_connected && lastConnected(timeout)) {
                n_connected = false // nach 1 s disconnected
                motorPower(false)
            }
            //else if (!n_connected)
            //    licht(true, true)
            return !n_connected // true wenn disconnected, also timeout eingetreten
        } else
            return false // kein timeout kurz nach dem Einschalten
    }



    // group="Bluetooth Verbindung" subcategory="Bluetooth" color=#007F7F
    // block="letztes Datenpaket vor > %sekunden Sekunden" weight=4
    // sekunden.shadow=mkc_ePause
    function lastConnected(sekunden: number) {
        return (input.runningTime() - n_lastconnectedTime) / 1000 > sekunden
    }
    /* 
        // group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
        // block="Bluetooth connected %connected" weight=3
        // connected.shadow="toggleYesNo"
        export function setConnected(connected: boolean) { n_connected = connected }
    
    
        // group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
        // block="Bluetooth connected" weight=2
        export function isConnected() { return n_connected }
    
     */
    export function receivedBuffer_hex(pBufferPointer?: eBufferPointer) {
        // wenn optionaler Parameter fehlt
        if (!pBufferPointer) pBufferPointer = n_BufferPointer // 1, 4, 7, 10, 13, 16
        if (n_receivedBuffer19)
            return n_receivedBuffer19.slice(0, 1).toHex() + n_receivedBuffer19.slice(pBufferPointer, 3).toHex()
        else return "-Buffer-"
    }



    // ========== group="Bluetooth empfangen" subcategory="Bluetooth"


    export enum eBufferBit {
        //% block="Motor Power"
        x80_MotorPower,
        //% block="Hupe"
        x40_Hupe,
        //% block="connected & fahren Joystick"
        fahrenJostick,
        //% block="connected & fahren Strecke"
        fahrenStrecke
    }

    //% group="Bluetooth empfangen" color=#007F7F
    //% block="Bluetooth Steuer-Byte 0 %pBit" weight=9
    export function receivedBuffer_getBit(pBit: eBufferBit) {
        let byte0 = n_receivedBuffer19.getUint8(0)
        switch (pBit) {
            //case eBit.b2_Joystick: return receivedBuffer_getUint8(eBuffer.b2_Fahrstrecke) == 0
            //case eBit.b2_Encoder: return receivedBuffer_getUint8(eBuffer.b2_Fahrstrecke) > 0
            case eBufferBit.x80_MotorPower: return (byte0 & 0x80) == 0x80
            case eBufferBit.x40_Hupe: return (byte0 & 0x40) == 0x40

            case eBufferBit.fahrenJostick: return n_connected && (byte0 & 0x03) == 0x00 // 000
            case eBufferBit.fahrenStrecke: return n_connected && (byte0 & 0x03) != 0x00 // 001 010 111
            default: return false
        }
    }

    // group="Bluetooth empfangen" subcategory="Bluetooth"
    // block="BufferPointer" weight=9
    //export function receivedBuffer_Pointer() { return n_BufferPointer }



    //% group="Bluetooth empfangen" color=#007F7F
    //% block="Bluetooth Datenpaket gültig || %pBufferPointer | " weight=7
    export function receivedBuffer_Contains(pBufferPointer?: eBufferPointer): boolean {
        // wenn optionaler Parameter fehlt
        if (!pBufferPointer) pBufferPointer = n_BufferPointer // 1, 4, 7, 10, 13, 16
        return (n_receivedBuffer19 && (n_receivedBuffer19.length > (pBufferPointer + 2))) // max 18
    }

    //% group="Bluetooth empfangen" color=#007F7F
    //% block="Bluetooth Byte lesen %pOffset || %pBufferPointer " weight=6
    export function receivedBuffer_getUint8(pBufferOffset: eBufferOffset, pBufferPointer?: eBufferPointer) {
        //basic.showNumber(pBufferPointer)

        if (!pBufferPointer) pBufferPointer = n_BufferPointer // wenn nicht angegeben internen Wert nehmen
        if (receivedBuffer_Contains(pBufferPointer)) {
            let r = n_receivedBuffer19.getUint8(pBufferPointer + pBufferOffset)
            switch (pBufferOffset) {
                case eBufferOffset.b1_Servo: {  // Servo 1..31 +14 15..45 *3 45..135
                    return ((r & 0b00011111) + 14) * 3
                }
                case eBufferOffset.b1_Bits: return r >>> 5 // r & 0b11100000 // Bits 0..7
                default: return r // b0_Motor und b2_Fahrstrecke 0..255
            }
        } else return 0
    }



    /* 
        // ========== group="Bluetooth senden" subcategory="Bluetooth"
     
        // group="Bluetooth senden" subcategory="Bluetooth"
        // block="sende Buffer" weight=2
        export function sendBuffer() {
            radio.sendBuffer(n_sendBuffer19)
        }
     */


    // ========== enums
    /* 
        export enum ePause {
            //% block="0.5"
            p05 = 5,
            //% block="1"
            p1 = 10,
            //% block="2"
            p2 = 20,
            //% block="3"
            p3 = 30,
            //% block="4"
            p4 = 40,
            //% block="5"
            p5 = 50,
            //% block="10"
            p10 = 100,
            //% block="15"
            p15 = 150,
            //% block="20"
            p20 = 200,
            //% block="30"
            p30 = 300,
            //% block="45"
            p45 = 450,
            //% block="60"
            p60 = 600
        }
        //% blockId=mkc_ePause block="%pPause" blockHidden=true
        export function mkc_ePause(pPause: ePause): number { return pPause / 10 }
     */


    //% group="Relais" subcategory="Aktoren"
    //% block="Relais %pON"
    //% pON.shadow="toggleOnOff"
 export   function relay(pON: boolean) { }

} // bluetooth.ts
