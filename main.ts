input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    pins.servoWritePin(AnalogPin.P2, 180)
})
mkc.onReceivedData(function (receivedBuffer) {
    if (mkc.receivedBuffer_getBit(mkc.eBufferBit.fahrenJostick)) {
        if (mkc.receivedBuffer_Contains()) {
            mkc.servo_set(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b1_Servo))
            motors.dualMotorPower(Motor.M0, Math.map(mkc.receivedBuffer_getUint8(mkc.eBufferOffset.b0_Motor), 0, 255, -100, 100))
        } else {
            motors.dualMotorPower(Motor.M0, 0)
        }
    }
})
mkc.bluetooth_beimStart(240, 90)
loops.everyInterval(1000, function () {
    if (mkc.bluetooth_timeout()) {
    	
    }
})
