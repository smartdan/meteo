Meteor.methods({
    'getWeather':function(city){        
        return HTTP.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&lang=it&units=metric');
    },
    'getForecast':function(city){        
        return HTTP.get('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&lang=it&units=metric');
    },
    'getDailyForecast':function(city){        
        return HTTP.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&cnt=7&lang=it&units=metric');
    }
})