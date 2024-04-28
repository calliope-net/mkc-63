mkc.onReceivedData(function (receivedBuffer) {
    if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenJostick)) {
        if (mkc.receivedBuffer_Contains()) {
            mkc.servo_set(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b1_Servo))
            mkc.motorON(mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
            mkc.motor255(Motor.M0, mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b0_Motor))
        } else {
            mkc.motor255(Motor.M0, 128)
        }
    } else if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenStrecke)) {
        mkc.motorON(mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
        mkc.fahreBuffer19()
    }
})
mkc.beimStart(240, 90)
basic.showIcon(IconNames.Yes)
loops.everyInterval(700, function () {
    if (mkc.bluetooth_timeout(1, 60)) {
        mkc.rgbLEDs(mkc.eRGBled.b, 0xff0000, true)
    }
})
