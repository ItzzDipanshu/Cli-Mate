const apiKey = `a245db8684dc638c7145426200da99c2`;

const searchBtn = document.querySelector("#searchBtn");

const fetchCitySuggestions = async () => {
  const api = `http://api.openweathermap.org/geo/1.0/direct?q=`;
  const input = document.querySelector("#search-input").value.trim();
  const suggestionList = document.querySelector(".citySuggestions");

  suggestionList.innerHTML = "";

  if (input.length < 3) {
    return;
  }

  try {
    const response = await fetch(`${api}${input}&limit=5&appid=${apiKey}`);
    const data = await response.json();

    // console.log(data);

    if (data.length > 0) {
      data.forEach((city) => {
        const li = document.createElement("li");
        li.textContent = `${city.name}, ${city.state} (${city.country})`;
        li.onclick = () => {
          checkWeather(city.name);
          suggestionList.innerHTML = "";
        };
        suggestionList.appendChild(li);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const checkWeather = async (city) => {
  const apiURL =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const cityName = document.querySelector("#cityName");
  const weatherIcon = document.querySelector("#weatherIcon");
  const temp = document.querySelector("#temp");
  const feelsLike = document.querySelector(".feelsLike");
  const weatherDesc = document.querySelector(".weatherDesc");
  const windSpeed = document.querySelector(".windSpeed");
  const atmoPressure = document.querySelector(".atmoPressure");
  const humidity = document.querySelector(".humidity");
  const visibility = document.querySelector(".visibility");
  const sunrise = document.querySelector(".sunrise");
  const sunset = document.querySelector(".sunset");

  const response = await fetch(apiURL + city + `&appid=${apiKey}`);

  const data = await response.json();

//   console.log(data);

  cityName.textContent = `${data.name}, ${data.sys.country}`;

  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "./images/clouds.png";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "./images/clear.png";
  } else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "./images/rain.png";
  } else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "./images/drizzle.png";
  } else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "./images/mist.png";
  } else if (data.weather[0].main == "Snow") {
    weatherIcon.src = "./images/snow.png";
  } else if (data.weather[0].main == "Fog") {
    weatherIcon.src = "./images/fog.png";
  }

  temp.textContent = `${data.main.temp.toFixed()}°C`;
  feelsLike.textContent = `${data.main.feels_like.toFixed()}°C`;

  weatherDesc.textContent = data.weather[0].description;
  windSpeed.textContent = `${data.wind.speed}`;
  atmoPressure.textContent = `${data.main.pressure}`;
  humidity.textContent = `${data.main.humidity}`;
  visibility.textContent = `${data.visibility / 1000}`;

  const sunriseTimestamp = data.sys.sunrise;
  const sunriseTime = new Date(sunriseTimestamp * 1000);

  const hoursSR = sunriseTime.getHours().toString().padStart(2, "0");
  const minutesSR = sunriseTime.getMinutes().toString().padStart(2, "0");

  sunrise.textContent = `${hoursSR}:${minutesSR}`;

  const sunsetTimestamp = data.sys.sunset;
  const sunsetTime = new Date(sunsetTimestamp * 1000);

  const hoursSS = sunsetTime.getHours().toString().padStart(2, "0");
  const minutesSS = sunsetTime.getMinutes().toString().padStart(2, "0");

  sunset.textContent = `${hoursSS}:${minutesSS}`;

  const lat = data.coord.lat;
  const lon =  data.coord.lon;

  fourDaysForecast(lat, lon);



};

const fourDaysForecast = async(lat, lon)=>{
    const apiURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`


    const btns = document.querySelectorAll(".btn");

    const response= await fetch(apiURL);
    const data = await response.json();
    // console.log(data);


    const fiveDays = [];
    const fiveDaysForecast = data.list.filter(forecast=>{
        const forecastDate = new Date(forecast.dt_txt).getDate();

        if(!fiveDays.includes(forecastDate)){
            return fiveDays.push(forecastDate);
        }
    });

    fiveDaysForecast.shift();
    // console.log(fiveDaysForecast);

    btns.forEach((btn, index)=>{
        btn.textContent = (fiveDaysForecast[index].dt_txt).split(' ')[0];

        btn.addEventListener("click",()=>{
            forecastInfo(fiveDaysForecast[index]);
        })
    })

}

const forecastInfo = (obj) => {
    // console.log(obj);
    const weatherIconFDF = document.querySelector("#weatherIconFDF");
    const descFDF = document.querySelector("#descFDF");
    const tmax = document.querySelector("#tmax");
    const tmin = document.querySelector("#tmin");
    const windSpeed = document.querySelector("#wspeed");
    const atmoPressure = document.querySelector("#atmoPressureFDF");
    const humidity = document.querySelector("#humidityFDF");
    const visibilityFDF = document.querySelector("#visibilityFDF");

    if (obj.weather[0].main == "Clouds") {
        weatherIconFDF.src = "./images/clouds.png";
      } else if (obj.weather[0].main == "Clear") {
        weatherIconFDF.src = "./images/clear.png";
      } else if (obj.weather[0].main == "Rain") {
        weatherIconFDF.src = "./images/rain.png";
      } else if (obj.weather[0].main == "Drizzle") {
        weatherIconFDF.src = "./images/drizzle.png";
      } else if (obj.weather[0].main == "Mist") {
        weatherIconFDF.src = "./images/mist.png";
      } else if (obj.weather[0].main == "Snow") {
        weatherIconFDF.src = "./images/snow.png";
      } else if (obj.weather[0].main == "Fog") {
        weatherIconFDF.src = "./images/fog.png";
      }

      descFDF.textContent = obj.weather[0].description;
      tmax.textContent = (obj.main.temp_max - 273.15).toFixed(1);
      tmin.textContent = (obj.main.temp_min - 273.15).toFixed(1);
      windSpeed.textContent = obj.wind.speed;
      atmoPressure.textContent = obj.main.pressure;
      humidity.textContent = obj.main.humidity;
      visibilityFDF.textContent = obj.visibility / 1000;
}

const btnClick = () => {
  const searchInput = document.querySelector("#search-input");
  const suggestionList = document.querySelector(".citySuggestions");
  const input = document.querySelector("#search-input");

  checkWeather(searchInput.value);
  suggestionList.innerHTML = "";
  input.value = "";
};

const displayCurrentDate = () => {
  const dateElement = document.getElementById("current-date");

  // Get the current date
  const today = new Date();

  // Format the date (e.g., 'August 19, 2024')
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Display the formatted date in the designated element
  dateElement.textContent = formattedDate;
};
displayCurrentDate();
