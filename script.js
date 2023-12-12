//currentTimeElement and other variables are assigned references to HTML elements using document.querySelector

const currentTimeElement = document.querySelector("#current-time");
const hoursDropdown = document.querySelector("#hours");
const minutesDropdown = document.querySelector("#minutes");
const secondsDropdown = document.querySelector("#seconds");
const amPmDropdown = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmsContainer = document.querySelector("#alarms-container");
const ringtoneAudio = new Audio('./files/ringtone.mp3');

//currentDate is initialized with the current date.

const currentDate = new Date();

//Arrays weekDays and months hold names of days and months, respectively.

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentWeekDay = weekDays[currentDate.getDay()];
const currentMonth = months[currentDate.getMonth()];
const currentDay = currentDate.getDate();
const currentYear = currentDate.getFullYear();

//JavaScript updates specific HTML elements ('week', 'month', 'date', 'year') with the current day, month, date, and year.

document.getElementById('week').textContent = currentWeekDay;
document.getElementById('month').textContent = currentMonth;
document.getElementById('date').textContent = currentDay;
document.getElementById('year').textContent = currentYear;

//it initializes dropdown menus for hours, minutes, and seconds, updates the displayed time every second, and fetches saved alarms from local storage.

window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, hoursDropdown);
  dropDownMenu(0, 59, minutesDropdown);
  dropDownMenu(0, 59, secondsDropdown);
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

//It listens for a click on the 'Set Alarm' button and triggers the getInput function.

setAlarmButton.addEventListener("click", getInput);

//Obtains the current time and formats it into a string, but currently doesn't utilize this formatted time.

function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var timeString = hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');
}

setInterval(updateClock, 1000);

//Generates dropdown options for hours, minutes, and seconds within specified ranges and appends them to the provided HTML element.

function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i;
    option.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(option);
  }
}

//Retrieves the current time, formats it as a string with hour, minute, second, and AM/PM, and updates the displayed time on the page.

function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTimeElement.innerHTML = time;
  return time;
}

//Captures selected values from dropdowns for hour, minute, second, and AM/PM.
//Converts the selected values into a time string using convertToTime.
//Calls setAlarm with the generated time string as an argument.

function getInput(e) {
  e.preventDefault();
  const selectedHour = hoursDropdown.value;
  const selectedMinute = minutesDropdown.value;
  const selectedSecond = secondsDropdown.value;
  const selectedAmPm = amPmDropdown.value;

  const alarmTime = convertToTime(
    selectedHour,
    selectedMinute,
    selectedSecond,
    selectedAmPm
  );
  setAlarm(alarmTime);
}

//Constructs a time string in the format HH:MM:SS AM/PM using the selected values.

function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

//Sets an interval to check if the provided time matches the current time.
//If the time matches, triggers an alert and plays a ringtone.
//Adds the alarm to the DOM using addAlarmToDom.
//Saves the alarm to local storage unless it's in fetching mode.

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
      ringtoneAudio.play();
    }
    document.querySelector("#stopAlarm").addEventListener("click", stopAlarm);
    console.log("running");
  }, 500);

  addAlarmToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

//Creates a visual representation of the alarm within the DOM.
//Includes the time of the alarm and a 'Delete' button.
//Sets up an event listener for the delete button to trigger the deletion of the corresponding alarm.

function addAlarmToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
  alarmsContainer.prepend(alarm);
}

//Checks if there are any saved alarms in local storage.
//Retrieves and parses alarms if present; otherwise, returns an empty array.

function checkAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);
  return alarms;
}

//Saves a newly set alarm time to local storage.
//Retrieves existing alarms, adds the new alarm time to the array, and updates local storage.

function saveAlarm(time) {
  const alarms = checkAlarms();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

//Fetches saved alarm times from local storage and sets each alarm using the setAlarm function.

function fetchAlarm() {
  const alarms = checkAlarms();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

//Triggered when the 'Delete' button associated with an alarm is clicked.
//Clears the interval for the alarm, removes it from the DOM, and deletes it from local storage.

function deleteAlarm(event, time, intervalId) {
  const self = event.target;
  clearInterval(intervalId);
  const alarm = self.parentElement;
  deleteAlarmFromLocal(time);
  alarm.remove();
}

//Removes the specified alarm time from local storage.

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarms();
  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

//Pauses the ringtone audio when the 'Stop Alarm' button is clicked.

function stopAlarm() {
  ringtoneAudio.pause();
}
