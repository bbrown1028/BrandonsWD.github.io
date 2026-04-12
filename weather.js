const apiKey = '2be061a4ced00468587c3e76a7b52b7e'; //Replace with your OpenWeatherMap API key

const cityInput = document.getElementById('cityInput');//What user enters the city name in the input field

const searchButton = document.getElementById('searchButton');//The button that the user clicks to search for the weather

const weatherResult = document.getElementById('weatherResult'); //The div where the weather result will be displayed

const forecastContainer = document.getElementById('forecastContainer'); //The div where the forecast result will be displayed

const savedCitiesContainer = document.getElementById('savedCities'); //The div where the saved cities will be displayed

const clearCitiesButton = document.getElementById('clearCitiesButton'); //The button that the user clicks to clear all saved cities from local storage and the UI

window.addEventListener('DOMContentLoaded', () => { loadSavedCities(); }); //This means that when the DOM content or the HTML document has been fully loaded and parsed, the loadSavedCities function will be called to retrieve and display any previously saved cities from local storage in the UI. This ensures that users can see their saved cities as soon as they open the weather app. 

searchButton.addEventListener('click', handleSearch); //This adds an event listener to the search button that listens for a click event. When the button is clicked, it calls the handleSearch function to perform the search for the weather information based on the city name entered by the user.

clearCitiesButton.addEventListener('click', clearAllCities); //This adds an event listener to the clear cities button that listens for a click event. When the button is clicked, it calls the clearAllCities function to remove all saved cities from local storage and update the UI accordingly.


cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim(); 

    if (city === '') {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
        forecastContainer.innerHTML = ''; // Clear the forecast container if the city name is empty
        return;
    }

    document.getElementById('forecastSection').style.display = 'block'; // block-level means that the element will take up the full width available and start on a new line. This is used to ensure that the forecast section is displayed properly when a valid city name is entered.


    getWeather(city); // Call getWeather to fetch and display the current weather for the entered city

    getForecast(city); // Call getForecast to fetch and display the NEXT 5-days.
}
//This is called when the user presses the 'Enter' key in the city input field. It performs the same checks as the click event listener for the search button and calls the getWeather function if the city name is valid. Additionally, if the city name is empty, it also clears the forecast container to ensure that no old forecast data is displayed.





async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;// This builds the URL for the OpenWeatherMap API request using the city name, API key, and units (imperial for Fahrenheit).

    try { //try is a type of error handling in JavaScript that allows you to test a block of code for errors. If an error occurs in the try block, it will be caught and handled in the catch block.

        const response = await fetch(url); //Makes an asynchronous request to the OpenWeatherMap API using the fetch function and waits for the response

        if (!response.ok) { //Checks if the response is not successful

        throw new Error('City not found'); //Throw new means that if the response is not successful, it creates a new error with the message 'City not found' and throws it, which will be caught in the catch block below
        }

        const data = await response.json(); //This waits and parses or converts the response from the API into a JavaScript object using the json() method.

        displayWeather(data); //Sends the weather data to the displayWeather function to update the UI with the current weather information for the specified city.

        saveCity(city); //This calls the saveCity function to save the city name to local storage and update the list of saved cities in the UI. This allows users to easily access the weather information for their previously searched cities by clicking on the corresponding buttons in the saved cities section of the UI.
    } 
    
    catch (error) { //Catch means that if any error occurs in the try block, it will be caught and handled in this catch block. The error object contains information about the error that occurred.

        weatherResult.innerHTML = `<p>${error.message}</p>`; //If an error occurs, it updates the weatherResult <div> to display the error message
    }
    
}
//This function makes an API request to get the weather data for the specified city, handles any errors that may occur during the request, and updates the UI with the weather information or error message.


async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;// This builds the URL for the OpenWeatherMap API request to get the 5-day forecast using the city name, API key, and units (imperial for Fahrenheit).
    try {
        const response = await fetch(url); //Makes an asynchronous request to the OpenWeatherMap API using the fetch function and waits for the response
        if (!response.ok) { //Checks if the response is not successful

        throw new Error('City not found'); //Throw new means that if the response is not successful, it creates a new error with the message 'City not found' and throws it, which will be caught in the catch block below
        }
        const data = await response.json(); //This waits and parses or converts the response from the API into a JavaScript object using the json() method.

        displayForecast(data); //Sends the forecast data to the displayForecast function to update the UI with the 5-day forecast information for the specified city.
    } catch (error) {
        forecastContainer.innerHTML = `<p>${error.message}</p>`;
    }
}

//This function makes an API request to get the 5-day forecast data for the specified city and updates the UI with the forecast information. It does not include error handling, so if the API request fails, it will not display an error message to the user.




function displayWeather(data) {

    const temp = data.main.temp; //Gets the temperature(temp) from the weather data from openweathermap API

        const feelsLike = data.main.feels_like; //Gets the "feels like" temperature from the weather data from openweathermap API

        const highTemp = data.main.temp_max; //Gets the high temperature from the weather data from openweathermap API

        const lowTemp = data.main.temp_min; //Gets the low temperature from the weather data from openweathermap API

    const city = data.name; //Gets the city name(city) from the weather data from openweathermap API

    const humidity = data.main.humidity; //Gets the humidity from the weather data from openweathermap API

    const wind = data.wind.speed; //Gets the wind speed from the weather data from openweathermap API

    const condition = data.weather[0].description; //Gets the weather condition[0] description from the weather data using the weather array

    const iconCode = data.weather[0].icon; //Gets the weather icon code from the weather data using the weather array 

    

    setBackground(condition); //This calls the setBackground function with the weather condition as an argument to update the background image of the webpage based on the current weather condition.

    weatherResult.innerHTML = `
        <div class="weather-card">
            <h2>${city}</h2>
            <p>Temperature: ${temp} °F</p>
                <p>Feels Like: ${feelsLike} °F</p>
                <p>High: ${highTemp} °F</p>
                <p>Low: ${lowTemp} °F</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${condition}">
            <p>Condition: ${condition}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind} mph</p>
        </div>
        `;
     //This sets the inner HTML of the weatherResult <div> to display the city name, temperature, weather condition, humidity, and wind speed in a structured format using a div with the class "weather-card" for styling purposes.       

}

//This function takes the weather data as input, extracts the relevant information (temperature, city name, weather condition, humidity, and wind speed), and updates the UI to display this information in a structured format.


function displayForecast(data) {


    forecastContainer.innerHTML = ''; //Clears the forecast container before displaying new forecast data

    const dailyForecast = data.list.filter(item => item.dt_txt.includes('12:00:00')); //Filters the forecast data to get only the entries for 12:00 PM each day.

dailyForecast.slice(0, 5).forEach(day => { 
    const date = new Date(day.dt_txt).toLocaleDateString(); //This converts the date and time string from the forecast data into a more readable date format using the Date object and toLocaleDateString method.
    
     const temp = day.main.temp; //Gets the temperature for the day from the forecast data

     const condition = day.weather[0].description; //Gets the weather condition description for the day from the forecast data using the firsyt entry in the weather array from the forecast data

     const iconCode = day.weather[0].icon; //Gets the weather icon code for the day from the forecast data using the first entry in the weather array

     const forecastCard = document.createElement('div'); //This creates a new div element to represent a forecast card for the day that will display the date, temperature, and weather condition.

     forecastCard.classList.add('forecast-card'); //This styles the forecast card by adding a CSS class called 'forecast-card' to the newly created div element. This allows you to apply specific styles to the forecast cards in your CSS file.

    forecastCard.innerHTML = `
        <h3>${date}</h3>

        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${condition}">

        <p>Temp: ${temp} °F</p>
        <p>Condition: ${condition}</p>
    `; //This sets the inner HTML of the forecast card to display the date, temperature, and weather condition for the day. It also includes an image element to display the corresponding weather icon based on the condition.

    forecastContainer.appendChild(forecastCard);
    //This adds the newly created forecast card to the forecast container in the UI, allowing it to be displayed on the webpage. Each forecast card will show the date, temperature, and weather condition for one of the next 5 days at 12:00 PM.

}); //This iterates over the first 5 entries in the daily forecast array, creates a forecast card for each day, and appends it to the forecast container in the UI.
}

//This function takes the forecast data as input, filters it to get the daily forecast for 12:00 PM, and updates the UI to display the date, temperature, and weather condition for each of the next 5 days in a structured format.


function setBackground(condition) {
    const weatherMain=condition.toLowerCase(); //This converts the weather condition string to lowercase to ensure that the background image is set correctly regardless of the case of the input.

    if (weatherMain.includes('clear')) {
        document.body.style.backgroundImage = "linear-gradient(to right, #56ccf2, #2f80ed)"; //Sets a clear sky background gradient
    } else if (weatherMain.includes('clouds')) {
        document.body.style.backgroundImage = "linear-gradient(to right, #bdc3c7, #2c3e50)"; //Sets a cloudy sky background gradient
    } else if (weatherMain.includes('rain')||weatherMain.includes('drizzle')) {
        document.body.style.backgroundImage = "linear-gradient(to right, #4b79a1, #283e51)"; //Sets a rainy sky background gradient
    } else if (weatherMain.includes('thunderstorm')) {
        document.body.style.backgroundImage = "linear-gradient(to right, #141e30, #243b55)"; //Sets a thunderstorm background gradient
    } else if (weatherMain.includes('snow')) {
        document.body.style.backgroundImage = "linear-gradient(to right, #e6dada, #274046)"; //Sets a snowy sky background gradient
    } else {
        document.body.style.backgroundImage = "linear-gradient(to right, #74ebd5, #9face6)"; //Sets a default background gradient for other weather conditions
    }

}
//This function takes the weather condition as input, checks for specific keywords in the condition string, and sets the background image of the webpage to a corresponding gradient based on the weather condition. This enhances the visual appeal of the weather app by providing a dynamic background that reflects the current weather conditions.

function saveCity(city) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || []; //This retrieves the saved cities from local storage, parses it from a JSON string into a JavaScript array, and assigns it to the savedCities variable. If there are no saved cities in local storage, it initializes savedCities as an empty array.

    if (!savedCities.includes(city)) { //This checks if the city is not already in the list of saved cities. If the city is not already saved, it proceeds to save it.

        savedCities.push(city); //This adds the city to the savedCities array.Push is a method that adds a new element to the end of an array.

        localStorage.setItem('savedCities', JSON.stringify(savedCities)); //This saves the updated savedCities array back to local storage as a JSON string. This allows the list of saved cities to persist across page reloads.

        renderSavedCities(savedCities); //This calls the renderSavedCities function to update the UI with the new list of saved cities after a city has been added.
    }
}
//This function takes a city name as input, checks if it is already saved in local storage, and if not(!savedCities.includes(city)), it adds the city to the list of saved cities and updates local storage. It also calls the renderSavedCities function to update the UI with the new list of saved cities.


function clearAllCities() {
    localStorage.removeItem('savedCities'); //This removes the 'savedCities' item from local storage, effectively clearing all saved cities from local storage.

    savedCitiesContainer.innerHTML = ''; //This clears the inner HTML of the saved cities container in the UI, effectively removing all saved city buttons from the UI after they have been cleared from local storage.
}


function renderSavedCities(cities) {
    savedCitiesContainer.innerHTML = '';

    cities.forEach(city => {
        const cityWrapper = document.createElement('div');
        cityWrapper.classList.add('saved-city-wrapper');//This creates a new div element to wrap each saved city button and its corresponding delete button. The class 'saved-city-wrapper' is added to this div for styling purposes, allowing you to apply specific styles to the wrapper that contains both the city button and the delete button in the UI.

        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.classList.add('saved-city-button');//This creates a new button element for each saved city, sets its text content to the city name, and adds a CSS class called 'saved-city-button' for styling purposes. This button allows users to click on it to view the weather information for that specific city.

        cityButton.addEventListener('click', () => {
            cityInput.value = city;
            handleSearch();
        });//This adds a click event listener to each city button. When a city button is clicked, it sets the value of the city input field to the corresponding city name and calls the handleSearch function to fetch and display the weather information for that city.

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-city-button');//This creates a new button element for deleting a saved city, sets its text content to 'X', and adds a CSS class called 'delete-city-button' for styling purposes. This button allows users to remove a city from their list of saved cities.

        deleteButton.addEventListener('click', () => {
            deleteCity(city);
        });//This adds a click event listener to each delete button. When a delete button is clicked, it calls the deleteCity function and deletes the city from the list of saved cities in local storage and updates the UI accordingly.

        cityWrapper.appendChild(cityButton);//This adds the city button to the city wrapper div, allowing both the city button and the delete button to be displayed together in the UI for each saved city.

        cityWrapper.appendChild(deleteButton);//This adds the delete button to the city wrapper div, allowing both the city button and the delete button to be displayed together in the UI for each saved city.
        savedCitiesContainer.appendChild(cityWrapper);//This adds the city wrapper div, which contains both the city button and the delete button, to the saved cities container in the UI. This allows each saved city to be displayed with its corresponding buttons for viewing weather information and deleting the city from the list of saved cities.
    });

    //This part of the function goes through each city in the list of saved cities, creates a button for the city and a delete button, and appends them to the saved cities container in the UI. It also adds event listeners to the buttons to handle viewing weather information and deleting cities from the saved list.
}

//This renders or updates the list of saved cities in the UI by creating buttons for each saved city and corresponding delete buttons, allowing users to view weather information for their saved cities and remove cities from the list as needed.





function deleteCity(cityToDelete) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || []; //This retrieves the saved cities from local storage, parses it from a JSON string into a JavaScript array, and assigns it to the savedCities variable. If there are no saved cities in local storage, it initializes savedCities as an empty array.

    savedCities = savedCities.filter(city => city !== cityToDelete); //What this does is it creates a new array of saved cities that includes only the cities that are not equal to the cityToDelete. This effectively removes the specified city from the list of saved cities.
    localStorage.setItem('savedCities', JSON.stringify(savedCities)); //What this does is it saves the updated list of saved cities back to local storage as a JSON string. This ensures that the deleted city is removed from local storage and will not be displayed in the UI when the page is reloaded.

    renderSavedCities(savedCities); //What this does is it calls the renderSavedCities function to update the UI with the new list of saved cities after a city has been deleted. This ensures that the deleted city is removed from the displayed list of saved cities in the UI.

}
//This function takes a city name as input, removes it from the list of saved cities in local storage, and updates the UI to reflect the change by calling the renderSavedCities function with the updated list of saved cities.

function loadSavedCities() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || []; //This retrieves the saved cities from local storage, parses it from a JSON string into a JavaScript array, and assigns it to the savedCities variable. If there are no saved cities in local storage, it initializes savedCities as an empty array.

    renderSavedCities(savedCities); //This calls the renderSavedCities function with the list of saved cities as an argument to update the UI with the saved cities when the page loads.
}