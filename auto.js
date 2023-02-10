function notifyTomorrowCommute() {
  const funcName = "notifyTomorrowCommute";
  let message = "";
  if ( isHoliday( todayObject ) ) {
    log( funcName, "Today is holiday.", { type: "info", } );
    return;
  }
  try {
    const members = commuteListSh.getFlagOnMembers();
    for ( let i = 0; i < members.length; i++ ) {
      message += mention( members[ i ].accountId, members[ i ].name ) + "\n";
    }
    message += "\n次の出社当番です。\nよろしくお願いします(bow)";
    sendMessageCw( message, roomId_four );
    commuteListSh.switchFlag();
  } catch( e ) {
    throw log( funcName, e, { type: "error", output: "return", } );
  }
}

function notifyAirExchange() {
  const funcName = "notifyAirExchange";
  let message = "";
  if ( isHoliday( todayObject ) ) {
    log( funcName, "Today is holiday.", { type: "info", } );
    return;
  }
  try {
    const members = commuteListSh.getPrevMembers();
    for ( let i = 0; i < members.length; i++ ) {
      message += mention( members[ i ].accountId, members[ i ].name ) + "\n";
    }
    message += "換気の時間になりました。\n5~10分換気を行ってください(bow)";
    sendMessageCw( message, roomId_four );
    ScriptApp.newTrigger( 'notifyAirExchangeEnd' ).timeBased().after( 5 * 60 * 1000 ).create();
  } catch( e ) {
    throw log( funcName, e, { type: "error", output: "return", } );
  }
}

function notifyAirExchangeEnd() {
  const funcName = "notifyAirExchange";
  let message = "";
  if ( isHoliday( todayObject ) ) {
    log( funcName, "Today is holiday.", { type: "info", } );
    return;
  }
  try {
    const members = commuteListSh.getPrevMembers();
    for ( let i = 0; i < members.length; i++ ) {
      message += mention( members[ i ].accountId, members[ i ].name ) + "\n";
    }
    message += "管理終了です。\nご協力ありがとうございました(bow)";
    sendMessageCw( message, roomId_four );
  } catch( e ) {
    throw log( funcName, e, { type: "error", output: "return", } );
  }
}
