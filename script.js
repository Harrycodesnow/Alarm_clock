const currentTimeElement = document.querySelector("#current-time");
const hoursDropdown = document.querySelector("#hours");
const minutesDropdown = document.querySelector("#minutes");
const secondsDropdown = document.querySelector("#seconds");
const amPmDropdown = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmsContainer = document.querySelector("#alarms-container");
const ringtoneAudio = new Audio('./media/ringtone.mp3');

const currentDate = new Date();

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentWeekDay = weekDays[currentDate.getDay()];
const currentMonth = months[currentDate.getMonth()];
const currentDay = currentDate.getDate();
const currentYear = currentDate.getFullYear();

document.getElementById('week').textContent = currentWeekDay;
document.getElementById('month').textContent = currentMonth;
document.getElementById('date').textContent = currentDay;
document.getElementById('year').textContent = currentYear;

window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, hoursDropdown);
  dropDownMenu(0, 59, minutesDropdown);
  dropDownMenu(0, 59, secondsDropdown);
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

setAlarmButton.addEventListener("click", getInput);

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

function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i;
    option.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(option);
  }
}

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

function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

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

function checkAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);
  return alarms;
}

function saveAlarm(time) {
  const alarms = checkAlarms();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function fetchAlarm() {
  const alarms = checkAlarms();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

function deleteAlarm(event, time, intervalId) {
  const self = event.target;
  clearInterval(intervalId);
  const alarm = self.parentElement;
  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarms();
  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function stopAlarm() {
  ringtoneAudio.pause();
}
