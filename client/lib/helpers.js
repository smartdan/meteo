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

