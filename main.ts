input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    pins.servoWritePin(AnalogPin.P3, 180)
})
basic.forever(function () {
	
})
