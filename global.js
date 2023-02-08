const commuteListSh = new CommuteSheet( "出社管理" );

const todayObject = IS_RELEASED ? new Date() : DATE_DUMMY;
if ( DEBUG ) {
  log( "global", todayObject, { label: "todayObject", } );
}
const yearToday = todayObject.getFullYear();
const monthToday = todayObject.getMonth() + 1;
const dateToday = todayObject.getDate();
const dayToday = todayObject.getDay();

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const HOLIDAYS = [
  [ 1, 2, 3, ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [ 29, 30, 31, ],
];
