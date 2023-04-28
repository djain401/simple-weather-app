//Fetching DOM elements for location, temperature, unit and description
const locationTimezone = document.querySelector(".location-timezone");
const temperatureDegree = document.querySelector(".temperature-degree");
const temperatureDesc = document.querySelector(".temperature-desc");
const degreeContainer = document.querySelector(".degree-container");
const degreeUnit = document.querySelector(".degree-container span");
// api key from openweathermap.org
const apiKey = "INPUT_YOUR_API_KEY_HERE";
let temperatureFromApiCall;

//listener function to toggle between celicus and fahreinheit values when user clicks on the block
function celciusToFahrenheitToggle() {
  // temperature unit from api is in Kelvin
  console.log(temperatureFromApiCall);
  if (degreeUnit.textContent === "F") {
    temperatureDegree.textContent = Math.floor(temperatureFromApiCall - 273.15);
    degreeUnit.textContent = "C";
  } else {
    temperatureDegree.textContent = Math.floor(
      ((temperatureFromApiCall - 273.15) * 9) / 5 + 32
    );
    degreeUnit.textContent = "F";
  }
}

//Function to get weather data from api calls by passing latitude and longitude.
async function getWeatherData(latitude, longitude) {
  document.getElementById("error").innerText = "";
  //removeEventListener used to remove multiple Events created when function is called more than once
  degreeContainer.removeEventListener("click", celciusToFahrenheitToggle);
  //api calls
  let apiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  let apiCallForCity = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
  //waiting for url to return some response only then it moves forward
  response = await fetch(apiCall);
  data = await response.json();
  cityResponse = await fetch(apiCallForCity);
  cityData = await cityResponse.json();

  const { country } = data.sys;
  temperatureFromApiCall = data.main.temp;
  const { description } = data.weather[0];
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });
  const iconCode = data.weather[0].icon;
  console.log(iconCode);
  // To get weather icon based on icon code.
  const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
  //To get country name in English from country code
  locationTimezone.textContent = `${
    cityData[0].name
  }, ${regionNamesInEnglish.of(country)}`;
  //Kelvin to celcius conversion for temperature
  temperatureDegree.textContent = Math.floor(temperatureFromApiCall - 273.15);
  degreeUnit.textContent = "C";
  temperatureDesc.textContent = description;
  document.querySelector("#icon").src = iconUrl;

  //Event for celcius and fahrenheit toggle
  degreeContainer.addEventListener("click", celciusToFahrenheitToggle);

  document.querySelector(".location").style.display = "flex";
  document.querySelector(".temperature").style.display = "flex";
  document.querySelector("#city").value = "";
}

// window.addEventListener("load",()=> {

let latitude;
let longitude;

document.querySelector("#search-button").addEventListener("click", async () => {
  //search weather data by city name
  const searchValue = document.querySelector("#city").value;
  if (!searchValue) {
    document.getElementById("error").innerText =
      "Please provide a value for city";
    return;
  } else {
    document.getElementById("error").innerText = "";
  }
  let apiCallByUserInput = `https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&appid=${apiKey}`;
  try {
    coordResponse = await fetch(apiCallByUserInput);
    coordData = await coordResponse.json();
    if (coordData.length <= 0) {
      document.getElementById("error").innerText = "Invalid name for city";

      return;
    } else {
      document.getElementById("error").innerText = "";
    }
  } catch (err) {
    console.log(err);
  }
  console.log(coordData);
  latitude = coordData[0].lat;
  console.log(latitude);
  longitude = coordData[0].lon;
  console.log(longitude);
  getWeatherData(latitude, longitude);
});

//search weather data by device location
const deviceLocation = document.querySelector("#device-location");
deviceLocation.addEventListener("click", () => {
  console.log(navigator.geolocation);
  if (navigator.geolocation) {
    document.getElementById("error-location").innerText = "";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(error);
        console.log(position);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        if (latitude && longitude) {
          getWeatherData(latitude, longitude);
        }
      },
      () => {
        document.getElementById("error-location").innerText =
          "Please allow location access";
      }
    );
  }
});

// })
