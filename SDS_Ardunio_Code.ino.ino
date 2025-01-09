int noiseSensorPin = A0;          // Pin where the noise sensor is connected
int threshold = 0;                // Variable to store threshold value
int noiseLevel = 0;               // Variable to store the current noise level
bool deviceState = false;         // Device state (On/Off)

void setup() {
  Serial.begin(9600);    // Initialize serial communication with HC-05 (RX = 0, TX = 1)
  pinMode(noiseSensorPin, INPUT); // Set noise sensor pin as input
  pinMode(13, OUTPUT);    // Pin 13 for controlling buzzer/LED
  digitalWrite(13, LOW);  // Turn off buzzer/LED initially
}

void loop() {
  // Check if data is available from the Bluetooth
  if (Serial.available()) {
    char command = Serial.read(); // Read the incoming data

    if (command == 'T') {
      // If the command starts with 'T', read the threshold value
      threshold = Serial.parseInt(); // Read the threshold value as an integer
      Serial.print("Threshold set to: ");
      Serial.println(threshold);
    } else if (command == '1') {
      // Command to turn on the system (buzzer/LED)
      deviceState = true;
      Serial.println("Device turned ON");
    } else if (command == '0') {
      // Command to turn off the system (buzzer/LED)
      deviceState = false;
      digitalWrite(13, LOW);  // Turn off buzzer/LED
      Serial.println("Device turned OFF");
    }
  }

  // Read the current noise level from the noise sensor
  noiseLevel = analogRead(noiseSensorPin);
  Serial.print("Noise Level: ");
  Serial.println(noiseLevel);

  // If the device is on and the noise level exceeds the threshold
  if (deviceState && noiseLevel > threshold) {
    digitalWrite(13, HIGH);  // Turn on buzzer/LED
    Serial.println("Noise level exceeded threshold! Buzzer ON");
  } else {
    digitalWrite(13, LOW);   // Turn off buzzer/LED
  }

  delay(500); // Small delay for stability
}
