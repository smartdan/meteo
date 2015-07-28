Meteor.startup(function() {
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
    
    Session.set('showHours', false);
    Session.set('showDaily', false);
    Session.set('showCurrent', true);
       
    moment.locale('it');
});