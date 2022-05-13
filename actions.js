const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoText = inputPart.querySelector(".info-text"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    wIcon = document.querySelector(".weather-part img"),
    arrowBack = document.querySelector("header i");

const apiKey = "a2a1e56dc005af853eec7424d3eb8497";
let api;

inputField.addEventListener("keyup", e => {
    // console.log(e);
    if (e.key == "Enter" && inputField.value != "") {
        // console.log(inputField.value)
        requestApi(inputField.value);
    }
})

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
    // console.log(position);
}

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add("error");
    // console.log(error);
}

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) { // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your borwser not support geolocation api");
    }
})

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
    // console.log(city);
}

function fetchData() {
    infoText.innerText = "Getting weather details...";
    infoText.classList.add("pending");

    // getting api response and returning it with parsing into js obj and in another
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    infoText.classList.replace("pending", "error");
    if (info.cod == "404") {
        infoText.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        // let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            wIcon.src = "./icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "./icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "./icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "./icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "./icons/cloud.svg";
        } else if (id >= 300 && id <= 321) {
            wIcon.src = "./icons/rain.svg";
        }

        // let's pass these values to a particular html element
        wrapper.querySelector(".temp .num").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city},${country}`;
        wrapper.querySelector(".temp .num-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}% `;


        infoText.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
    // console.log(info);
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
})
