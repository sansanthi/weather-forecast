let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function formatDate(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let timePeriod = "AM";
  if (hours >= 12) {
    timePeriod = "PM";
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let day = date.getDay();
  let todayDate = date.getDate();
  let month = date.getMonth() + 1;

  return `${days[day]} ${todayDate} ${months[month]}, ${hours}:${minutes} ${timePeriod}`;
}

let APIKey = "ea6e83a29ao1e06cfbe4d853t8aef304";
let searchform = document.querySelector("#search-form");

searchCity("Switzerland");

searchform.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-city");
  searchCity(cityInput.value.toLowerCase());
}

function searchCity(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${APIKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function displayTemperature(response) {
  //city
  let city = document.querySelector("#city");
  city.innerHTML = response.data.city;

  //temperature details
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.temperature.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${response.data.wind.speed} km/h`;

  //description
  let icon = document.querySelector(".icon-img");
  icon.setAttribute("src", `${response.data.condition.icon_url}`);

  let description = document.querySelector(".description");
  description.innerHTML = response.data.condition.description;

  //temperature
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(response.data.temperature.current);

  // date
  let date = document.querySelector(".date");
  date.innerHTML = formatDate(response.data.time * 1000);

  getNextForecast(response.data.coordinates);
}

function getNextForecast(coord) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coord.longitude}&lat=${coord.latitude}&key=${APIKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastEle = document.querySelector(".forecast");
  let forecastHTML = `<div class="row">`;
  let forecastDays = response.data.daily;
  forecastDays.forEach((forecastDay, index) => {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 text-center">
              <h5 class="day">${days[index + 1]}</h5>
              <img
                src="${forecastDay.condition.icon_url}"
                alt=""
                class="icon"
              />
              <div class="forecast-temperature">
                <span class="temperature-max">${Math.round(
                  forecastDay.temperature.maximum
                )}˚</span>
                <span class="temperature-min">${Math.round(
                  forecastDay.temperature.minimum
                )}˚</span>
              </div>
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastEle.innerHTML = forecastHTML;
}
