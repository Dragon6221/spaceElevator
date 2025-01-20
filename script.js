// Constants
const MAX_ALTITUDE = 36000; // km
const ANIMATION_INTERVAL = 100; // ms

// State
let currentState = {
  altitude: 0,
  speed: 200,
  power: 100,
  integrity: 98,
  signal: 95,
  isEmergencyStop: false,
  passengers: [
    { id: 1, name: "John Smith", seat: "A1" },
    { id: 2, name: "Emma Johnson", seat: "A2" },
    { id: 3, name: "Michael Chen", seat: "B1" }
  ]
};

// DOM Elements
const elevatorCar = document.getElementById('elevator-car');
const currentAltitude = document.getElementById('current-altitude');
const currentSpeed = document.getElementById('current-speed');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const emergencyStop = document.getElementById('emergency-stop');
const powerLevel = document.getElementById('power-level');
const integrityLevel = document.getElementById('integrity-level');
const signalLevel = document.getElementById('signal-level');
const powerPercentage = document.getElementById('power-percentage');
const integrityPercentage = document.getElementById('integrity-percentage');
const signalPercentage = document.getElementById('signal-percentage');
const alertsContainer = document.getElementById('alerts');
const passengersList = document.getElementById('passengers');
const basePrice = document.getElementById('base-price');
const premiumMarkup = document.getElementById('premium-markup');
const updatePricing = document.getElementById('update-pricing');
const standardRate = document.getElementById('standard-rate');
const premiumRate = document.getElementById('premium-rate');

// Initialize Camera View
function initializeCameraView() {
  const svg = document.getElementById('camera-view');
  const passengers = currentState.passengers.length;
  
  // Clear existing content
  svg.innerHTML = '';
  
  // Create cabin outline
  const cabin = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  cabin.setAttribute("x", "50");
  cabin.setAttribute("y", "50");
  cabin.setAttribute("width", "300");
  cabin.setAttribute("height", "200");
  cabin.setAttribute("fill", "none");
  cabin.setAttribute("stroke", "#2962ff");
  cabin.setAttribute("stroke-width", "2");
  svg.appendChild(cabin);
  
  // Add passenger representations
  currentState.passengers.forEach((passenger, index) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", 100 + (index * 80));
    circle.setAttribute("cy", "150");
    circle.setAttribute("r", "20");
    circle.setAttribute("fill", "#4caf50");
    svg.appendChild(circle);
  });
}

// Update passenger list
function updatePassengersList() {
  passengersList.innerHTML = currentState.passengers
    .map(passenger => `<li>${passenger.name} - Seat ${passenger.seat}</li>`)
    .join('');
}

// Update elevator position
function updateElevatorPosition() {
  if (currentState.isEmergencyStop) return;
  
  const percentageComplete = (currentState.altitude / MAX_ALTITUDE) * 100;
  elevatorCar.style.bottom = `${percentageComplete}%`;
  currentAltitude.textContent = Math.round(currentState.altitude);
  currentSpeed.textContent = currentState.speed;
}

// Update system status
function updateSystemStatus() {
  // Update progress bars
  powerLevel.style.width = `${currentState.power}%`;
  integrityLevel.style.width = `${currentState.integrity}%`;
  signalLevel.style.width = `${currentState.signal}%`;
  
  // Update percentage text
  powerPercentage.textContent = `${currentState.power}%`;
  integrityPercentage.textContent = `${currentState.integrity}%`;
  signalPercentage.textContent = `${currentState.signal}%`;
  
  // Check for alerts
  if (currentState.power < 20) {
    addAlert("WARNING: Low power levels!");
  }
  if (currentState.integrity < 80) {
    addAlert("CAUTION: Structure integrity compromised!");
  }
  if (currentState.signal < 60) {
    addAlert("NOTICE: Weak communication signal");
  }
}

// Add alert message
function addAlert(message) {
  const alert = document.createElement('div');
  alert.textContent = message;
  alert.classList.add('alert');
  alertsContainer.prepend(alert);
  
  // Remove alert after 5 seconds
  setTimeout(() => alert.remove(), 5000);
}

// Update pricing
function updatePricingDisplay() {
  const base = parseFloat(basePrice.value);
  const markup = parseFloat(premiumMarkup.value);
  standardRate.textContent = base.toLocaleString();
  premiumRate.textContent = (base * (1 + markup / 100)).toLocaleString();
}

// Event Listeners
speedSlider.addEventListener('input', (e) => {
  currentState.speed = parseInt(e.target.value);
  speedValue.textContent = currentState.speed;
});

emergencyStop.addEventListener('click', () => {
  currentState.isEmergencyStop = !currentState.isEmergencyStop;
  emergencyStop.textContent = currentState.isEmergencyStop ? 'RESUME OPERATION' : 'EMERGENCY STOP';
  emergencyStop.style.background = currentState.isEmergencyStop ? 'var(--success-color)' : 'var(--warning-color)';
  if (currentState.isEmergencyStop) {
    addAlert("EMERGENCY STOP ACTIVATED");
  } else {
    addAlert("Operations resumed");
  }
});

updatePricing.addEventListener('click', updatePricingDisplay);

// Simulation loop
function simulate() {
  if (!currentState.isEmergencyStop) {
    // Update altitude based on speed
    currentState.altitude += (currentState.speed / 3600) * (ANIMATION_INTERVAL / 1000);
    if (currentState.altitude > MAX_ALTITUDE) currentState.altitude = 0;
    
    // Simulate power consumption
    currentState.power -= 0.01;
    if (currentState.power < 0) currentState.power = 100;
    
    // Simulate signal fluctuation
    currentState.signal = 95 + Math.sin(Date.now() / 1000) * 5;
    
    updateElevatorPosition();
    updateSystemStatus();
  }
}

// Initialize
initializeCameraView();
updatePassengersList();
updatePricingDisplay();
setInterval(simulate, ANIMATION_INTERVAL);