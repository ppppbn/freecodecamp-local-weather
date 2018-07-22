const weather = ['drizzle', 'clouds', 'rain', 'snow', 'clear', 'thunderstom'];
var unit = "c";
var degreeInCelcius = 0;
var degreeInFahrenheit = 0;
const APP_ID = "030bd2c5e874b35251001c10b023f1eb";
const API_URL = "http://api.openweathermap.org/data/2.5/weather";
const DEFAULT_UNIT = "metric"
const DEFAULT_COUNTRY = "Hanoi";

window.onload = function(){ 
  $(".cover-bg").fadeOut(500);  
  getLocation();
}

$(document).ready(function(){
  $("#unit").click(function(){
    toggleUnit();
  })

  $('#search-form').submit(function(e){
    e.preventDefault();
    const input = $('#search-input').val();
    if (input) {
      getWeather(null, input);
    } else {
      return;
    }
  })
})

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeather, () => getWeather(null, null));
  } else {
    getWeather(null, null);
    $("#loading").fadeOut(200);
  }
}

function getWeather(position, country) {
  const data = country ? {
    q: country,
    appid: APP_ID,
    units: DEFAULT_UNIT
  } : position ? {
    lat : position.coords.latitude.toFixed(8),
    lon : position.coords.longitude.toFixed(8),
    appid: APP_ID,
    units: DEFAULT_UNIT
  } : {
    q: DEFAULT_COUNTRY,
    appid: APP_ID,
    units: DEFAULT_UNIT
  }
  
  loading(function(){
    $.ajax({
      url : API_URL,
      data,
      type : "GET",
      success: function(data){
        degreeInCelcius = Math.floor(data.main.temp);
        degreeInFahrenheit = convertFromCToF(degreeInCelcius);
        $("#loading").fadeOut(300);
        $("#country").html(data.name + ", " + data.sys.country);
        $("#temp").html(Math.floor(data.main.temp) + " °");
        $("#main").html(data.weather[0].main);
        $("#unit").html(unit);
        generateIcon(data.weather[0].main);
        $(".info-container").fadeIn(400);
      },
      error: function(err){
        $("#loading").fadeOut(300, function(){
          if(err.responseJSON && err.responseJSON.cod === '404'){
            $("#error-message").html("City not found!");
          } else {
            $("#error-message").html("Something went wrong. Please try again.");
          }
        })
      }
    }) 
  });
}

function loading(cb){
  $("#error-message").html("");
  $(".info-container").fadeOut(200, function(){
    $("#loading").fadeIn(200, cb);
  });
}

function generateIcon(desc) {
  desc = desc.toLowerCase();
  if(desc){
    if(weather.indexOf(desc) >= 0) $('#' + desc).removeClass('hide');
    else $('#clouds').removeClass('hide');
  }
}

function toggleUnit(){
  unit = unit.toLowerCase() === 'c' ? 'f' : 'c';
  $("#unit").html(unit);
  if(unit === 'c') {
    $("#temp").html(Math.floor(degreeInCelcius) + " °");
  }
  else {
    $("#temp").html(Math.floor(degreeInFahrenheit) + " °");
  }
}

function convertFromCToF(degree){
  degree = Number(degree);
  return Math.floor((degree*9 + 160)/5);
}