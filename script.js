const apiKey = "21f5091dee152ecca7e78717761cbcd2";
const searchBox = document.querySelector(".bar");
const searchBtn = document.querySelector(".icon");
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}&q=`;
const apiUrlCoords = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;
const weatherIcon = document.querySelector(".container");

async function checkWeatherByCity(city) {
    const response = await fetch(apiUrl + city);

    if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        setDefaultValues();
        return;
    }

    const data = await response.json();
    updateWeatherUI(data);
}

async function checkWeatherByCoords(lat, lon) {
    const response = await fetch(`${apiUrlCoords}&lat=${lat}&lon=${lon}`);

    if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        setDefaultValues();
        return;
    }

    const data = await response.json();
    updateWeatherUI(data);
}

function updateWeatherUI(data) {
    if (data.main && data.name && data.weather && data.weather.length > 0) {
        const weatherCondition = data.weather[0].main; // Get weather condition
        document.querySelector(".weather").innerHTML = weatherCondition; // Display weather condition
        document.querySelector(".location").innerHTML = data.name;
        document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".feels_like").innerHTML = Math.round(data.main.feels_like) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";

        // Set background image based on weather condition
        switch (weatherCondition) {
            case 'Clear':
                document.querySelector(".container").style.backgroundImage = 'url(sunny.jpg)';
                break;
            case 'Clouds':
                document.querySelector(".container").style.backgroundImage = 'url(cloudy.jpg)';
                break;
            case 'Rain':
                document.querySelector(".container").style.backgroundImage = 'url(rainy.jpg)';
                break;
            case 'Snow':
                document.querySelector(".container").style.backgroundImage = 'url(snowy.jpg)';
                break;
            default:
                document.querySelector(".container").style.backgroundImage = 'url(sunny.jpg)';
                break;
        }
    } else {
        setDefaultValues();
        console.error('Unexpected data format:', data);
    }
}


function setDefaultValues() {
    document.querySelector(".location").innerHTML = '-';
    document.querySelector(".temperature").innerHTML = '-/-';
    document.querySelector(".feels_like").innerHTML = '-/-';
    document.querySelector(".humidity").innerHTML = '-%';
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
        checkWeatherByCity(city);
    }
});

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                checkWeatherByCoords(lat, lon);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setDefaultValues();
            }
        );
    } else {
        setDefaultValues();
    }
});
