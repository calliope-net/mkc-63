mkc.onReceivedData(function (receivedBuffer) {
    mkc.motor255(Motor.M1, 128)
    if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenJostick)) {
        if (mkc.receivedBuffer_Contains()) {
            mkc.servo_set(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b1_Servo))
            mkc.motorPower(mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
            mkc.rgbLEDon(mkc.eRGBled.a, 0xff0000, mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
            mkc.motor255(Motor.M0, mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b0_Motor))
            mkc.buzzer(mkc.receivedBuffer_getBit(mkc.eBufferBit.x40_Hupe))
        } else {
            mkc.motor255(Motor.M0, 128)
            mkc.buzzer(false)
        }
        mkc.rgbLEDs(mkc.eRGBled.b, 0x0000ff, false)
    } else if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenStrecke)) {
        mkc.motorPower(mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
        mkc.rgbLEDon(mkc.eRGBled.a, 0xffff00, mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
        mkc.fahreBuffer19()
    }
})
radio.onReceivedValue(function (name, value) {
    mkc.motor255(Motor.M0, 128)
    mkc.buzzer(false)
    if (name == "M1") {
        mkc.bluetooth_timer()
        mkc.motor255(Motor.M1, value)
    }
})
mkc.beimStart(239, 94)
basic.showLeds(`
    . . # . .
    . # . # .
    . . # . .
    # # # # #
    # . . . #
    `)
loops.everyInterval(700, function () {
    if (mkc.bluetooth_timeout(1, 60)) {
        mkc.rgbLEDon(mkc.eRGBled.a, 0x000000, false)
        mkc.rgbLEDs(mkc.eRGBled.b, 0x0000ff, true)
    }
})
