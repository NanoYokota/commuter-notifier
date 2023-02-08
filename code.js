function isHoliday( date ) {
  if ( isWeekend( date ) ) {
    return true;
  }
  if ( isSpecialHoliday( date ) ) {
    return true;
  }
  return false;
}

function isWeekend( date ) {
  const weekInt = date.getDay();
  return weekInt <= 0 || 6 <= weekInt;
}

function isSpecialHoliday( date ) {
  const calendarId = "ja.japanese#holiday@group.v.calendar.google.com";
  const calendar = CalendarApp.getCalendarById( calendarId );
  const events = calendar.getEventsForDay( date );
  if ( events.length > 0 ) {
    return true;
  }
  if ( HOLIDAYS[ date.getMonth() ] ) {
    for ( let i = 0; i < HOLIDAYS[ date.getMonth() ].length; i++ ) {
      const holiday = HOLIDAYS[ date.getMonth() ][ i ];
      if ( holiday == date.getDate() ) {
        return true;
      }
    }
  }
  return false;
}

function isTodayFriday() {
  return dayToday == 5;
}

function isObject( value ) {
  return value !== null && typeof value === 'object'
}
