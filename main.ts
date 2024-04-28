mkc.onReceivedData(function (receivedBuffer) {
    if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenJostick)) {
        if (mkc.receivedBuffer_Contains()) {
            mkc.servo_set(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b1_Servo))
            mkc.motorA255(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b0_Motor))
        } else {
            motors.dualMotorPower(Motor.M0, 0)
        }
    }
})
mkc.beimStart(240, 90)
loops.everyInterval(1000, function () {
    if (mkc.bluetooth_timeout()) {
    	
    }
})
