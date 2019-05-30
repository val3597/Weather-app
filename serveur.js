var PORT = process.env.PORT || 3000;
var express = require('express');
const bodyParser = require('body-parser');
var http = require("http");
const translate = require('translate-api');
var app = express();
var server = http.Server(app);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  
  var request = http.get("http://api.apixu.com/v1/current.json?key=ca03e28aab2549fc84c93308192505&q=" + city, function(response){
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => { rawData += chunk; });
    response.on('end', () => {
      if(response.statusCode == 200){
          try {
              const weather = JSON.parse(rawData);
              if(weather.current == undefined){
                res.render('index', {weather: null, error: 'Error, please try again'});
              } else {
                let icon = `${weather.current.condition.icon}`;
                let date = `${weather.current.last_updated}`;
                let temp = `${weather.current.temp_c}`;
                let description = `${weather.current.condition.text}`;
                // description =translate.getText(description,{to: 'fr'});.then(function(text){
                //   console.log(text)
                // });
                let humidity = `${weather.current.humidity}`;
                let gust = `${weather.current.gust_mph}`; 
                let gust_kmh = gust * 1.61;
                let prec = `${weather.current.precip_mm}`;
                res.render('index', {weather: weather, img: icon, city: city, date: date,temp: temp,description : description,
                  humidity: humidity,gust: gust_kmh, prec: prec, error: null});
              }
          } catch (e) {
              console.log(e);
          }
      }
      else {
        res.render('index', {weather: null, error: 'Error, please try again'});
      }
    })
  })
})

app.get('/previsions', function (req, res) {
  res.render('forecast', {weather: null, error: null});
})

app.post('/previsions', function (req, res) {
  let city = req.body.city;
  var request = http.get("http://api.apixu.com/v1/forecast.json?key=ca03e28aab2549fc84c93308192505&q=" + city+ "&days=6", function(response){
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => { rawData += chunk; });
    response.on('end', () => {
      if(response.statusCode == 200){
          try {
              const weather = JSON.parse(rawData);
              if(weather.current == undefined){
                res.render('index', {weather: null, error: 'Error, please try again'});
              } else {
                // let weatherText = `Il fait ${weather.current.temp_c} degrés à ${weather.location.name}!\n 
                // L'humidité est de ${weather.current.humidity} % et la pression est de ${weather.current.pressure_mb}\n
                // ${weather.current.condition.text}`;
                // let icon = `${weather.current.condition.icon}`;
                var week = ['day1', 'day2', 'day3', 'day4', 'day5']
                let date = `${weather.current.last_updated}`;
                var day1 = weather.forecast.forecastday[1];
                var day2 = weather.forecast.forecastday[2];
                var day3 = weather.forecast.forecastday[3];
                var day4 = weather.forecast.forecastday[4];
                var day5 = weather.forecast.forecastday[5];
                res.render('forecast', {weather: weather,week: week, date: date, day1: day1, day2: day2, day3: day3, day4: day4, day5: day5, city: city, error: null});
              }
          } catch (e) {
              console.log(e);
          }
      }
      else {
        res.render('index', {weather: null, error: 'Error, please try again'});
      }
    })
  })

})


server.listen(PORT, function () {
  console.log('Example app listening on port 3000!');
})