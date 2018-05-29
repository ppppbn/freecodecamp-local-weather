const weather = ['drizzle', 'clouds', 'rain', 'snow', 'clear', 'thunderstom'];
var unit = "c";
var degreeInCelcius = 0;
var degreeInFahrenheit = 0;
$(document).ready(function(){
  getLocation();

  $("#unit").click(function(){
    toggleUnit();
  })


  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, displayError);
    } else {
        $("#geolocation-info").html("Geolocation is not supported by this browser.");
        $("#loading").fadeOut(200);
    }
  }

  function getWeather(position) {
    $.ajax({
      url : "https://fcc-weather-api.glitch.me/api/current/",
      data : {
        lat : position.coords.latitude,
        lon : position.coords.longitude
      },
      type : "GET",
      success: function(data){
        degreeInCelcius = Math.floor(data.main.temp);
        degreeInFahrenheit = convertFromCToF(degreeInCelcius);
        $("#loading").fadeOut(200);
        $("#country").html(data.name + ", " + data.sys.country);
        $("#temp").html(Math.floor(data.main.temp) + " °");
        $("#main").html(data.weather[0].main);
        $("#unit").html(unit);
        generateIcon(data.weather[0].description);
        $(".info-container").fadeIn(400);
      },
      error: function(err){
        console.log(err);
      }
    }) 
  }

  function displayError(error){
    if (error.code == error.PERMISSION_DENIED)
      $("#geolocation-info").html("You need to enable location services to see your local weather. Reload and try again!");
      $("#loading").fadeOut(200);
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

})