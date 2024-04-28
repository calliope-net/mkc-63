mkc.onReceivedData(function (receivedBuffer) {
    if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenJostick)) {
        if (mkc.receivedBuffer_Contains()) {
            mkc.servo_set(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b1_Servo))
            mkc.motorON(mkc.receivedBuffer_getBit(mkc.eBufferBit.x80_MotorPower))
            mkc.motorA255(Motor.M0, mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b0_Motor))
        } else {
            mkc.motorA255(Motor.M0, 128)
        }
    }
})
mkc.beimStart(240, AnalogPin.P1, 90)
basic.showIcon(IconNames.Yes)
loops.everyInterval(700, function () {
    if (mkc.bluetooth_timeout(1, 60)) {
        mkc.licht(true, true)
    }
})
