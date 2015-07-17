
var location = Geolocation.currentLocation();
Session.set('location', location);

var last_cities= Session.get('cities');

var cities = [
    'Torino,IT',
    'Rivoli,IT',
    'Borgaro,IT',
    'Settimo Torinese,IT',
    'San Vito dei Normanni,IT',
    'Leverano,IT',
    'Porto Cesareo,IT',
    'Lecce,IT',
    'Menton,FR',
    'Genova,IT',
    'Napoli,IT',
    'Firenze,IT',
    'Milano,IT',
    'Diano Marina,IT',
    'Andora,IT',
    'Livigno,IT',
    'Botricello,IT',
    'Georgioupolis,GR'
];

Session.set('loading', true);
Session.setPersistent('cities', cities); 

if(last_cities !== undefined)
{
   Session.setPersistent('cities', last_cities);  
}

Session.set('city', 'Torino,IT');
searchWeather('Torino,IT');

Session.set('showHours', false);
Session.set('showDaily', false);
Session.set('showCurrent', true);


moment.locale('it');


UI.registerHelper('formatTime', function(context, options) {
  if(context)
    return moment(context).format('LLLL');
});

UI.registerHelper('formatDay', function(context, options) {
  if(context)
    return moment(context).format('dddd LL');
});

UI.registerHelper('formatD', function(context, options) {
  if(context)
    return moment(context).format('ddd DD');
});


Template.layout.helpers({
    loading: function(){
      return Session.get('loading');  
    },
    cities: function(){
      return Session.get('cities');  
    },
    city: function(){
        return Session.get('city').replace(',IT','').replace(',FR','').replace(',GR','').toUpperCase();
    },
    dailyForecasts: function(){    
        return Session.get('dailyForecasts');     
    },
    forecasts: function(){         
        return Session.get('forecasts');     
    },
    forecast: function(){       
        return Session.get('forecast');
    },   
    location: function(){
       return Session.get('location');
    },   
    showHours: function(){
       return Session.get('showHours');
    },   
    showDaily: function(){
       return Session.get('showDaily');
    },  
    showCurrent: function(){
       return Session.get('showCurrent');
    } 
});

Template.layout.events({
    'click .addCity': function(evt,tmpl){
        var city = tmpl.find('.newCity').value;
        var cities = Session.get('cities');
           
        if (city === '')  
        {
            Alerts.add('Nome città vuoto!'); 
        }     
        else if(_.contains(cities, city) == false)
        {
            cities.unshift(city);
            Session.setPersistent('cities', cities);
            
            tmpl.find('.newCity').value = '';
            tmpl.find('.cities').value = city;
            
            Session.set('city', city);   
            searchWeather(city);
        }    
        else
        {
            Alerts.add('Città già presente nella lista!'); 
        }   
    },
    'change .cities': function(evt,tmpl){
        var city = tmpl.find('.cities').value;
        Session.set('city', city);
        
        searchWeather(city);
    },
    'click .currentLocation':function(evt,tmpl){    
        evt.preventDefault();         
        var location = Geolocation.currentLocation();
        if(location !== undefined)
        {          
            Session.set('location', location);
            HTTP.call("get", "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + location.coords.latitude + "&lon=" +   location.coords.longitude + "&addressdetails=1", 
                function(error, result) { if (!error) {   
                    if(result.data.address.city !== undefined)  
                    {        
                        var city = result.data.address.city + ',' + result.data.address.country_code;      
                        Session.set('city', city);
                        searchWeather(city);
                    }  
                    else if(result.data.address.town !== undefined)  
                    {        
                        var city = result.data.address.town + ',' + result.data.address.country_code;      
                        Session.set('city', city);
                        searchWeather(city);
                    }  
                }
                else 
                { throw new Meteor.Error("Error in reading location");
              }});
        }      
    },
    'click .showHours':function(evt,tmpl){    
        evt.preventDefault();
        Session.set('showHours', true); 
    },
    'click .showDaily':function(evt,tmpl){    
        evt.preventDefault();         
        Session.set('showDaily', true); 
    },
    'click .hideHours':function(evt,tmpl){    
        evt.preventDefault();         
        Session.set('showHours', false); 
    },
    'click .hideDaily':function(evt,tmpl){    
        evt.preventDefault();
        Session.set('showDaily', false);  
    },
    'click .currentWeather':function(evt,tmpl){    
        evt.preventDefault();

        var city= Session.get('city');
        Session.set('city', city); 
    } ,
    'click .hideCurrent':function(evt,tmpl){    
        evt.preventDefault();         
        Session.set('showCurrent', false); 
    },
    'click .showCurrent':function(evt,tmpl){    
        evt.preventDefault();
        Session.set('showCurrent', true);  
    },            
});



function searchWeather(city) {   
    Session.set('loading', true);
       
    Meteor.call('getWeather', city, function (err, results) {
        var l = JSON.parse(results.content);
        var forecast = new singleForecast(l.name, new Date(), l.weather[0].description, l.weather[0].icon, l.wind.speed, l.clouds.all, l.main.temp, l.main.temp_min, l.main.temp_max, l.main.humidity);
        Session.set('forecast', forecast);
    });
        
    var array = [];
    Meteor.call('getDailyForecast', city, function (err, results) {
        var content = JSON.parse(results.content);
        _.each(content.list, function (l) {
           array.push(new dailyForecast(content.city.name, l.dt, l.weather[0].description, l.weather[0].icon, l.temp.day, l.clouds, l.humidity, l.speed));
        });
        Session.set('dailyForecasts', array);
    });   
            
    var array2 = [];
    Meteor.call('getForecast', city, function(err,results){
        var content = JSON.parse(results.content);
        _.each(content.list, function(l){
           array2.push(new singleForecast(content.city.name, l.dt_txt, l.weather[0].description, l.weather[0].icon, l.wind.speed, l.clouds.all, l.main.temp, l.main.temp_min, l.main.temp_max, l.main.humidity));  
        });
                   
        Session.set('forecasts', array2);  
        Session.set('loading', false);  
    });          
};

function singleForecast(city, date, weather, icon, wind, clouds, temp, temp_min, temp_max, humidity){
  var self = this;  
  self.f_city = city;
  self.f_date = date;
  self.f_weather = weather.toUpperCase();
  self.f_icon = icon;
  self.f_wind = wind;
  self.f_clouds = clouds;
  self.f_temp = temp;
  self.f_temp_min = temp_min;
  self.f_temp_max = temp_max;
  self.f_humidity = humidity;
};

function dailyForecast(city, dt, weather, icon, temp, clouds, humidity, wind){
  var self = this;  
  
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(dt);

  self.d_city = city;
  self.d_date = d;
  self.d_weather = weather.toUpperCase();
  self.d_icon = icon;
  self.d_wind = wind;
  self.d_clouds = clouds;
  self.d_temp = temp;
  self.d_humidity = humidity;
};