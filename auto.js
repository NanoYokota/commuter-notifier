function notifyTomorrowCommute() {
  const funcName = "notifyTomorrowCommute";
  let message = "";
  if ( isHoliday( todayObject ) ) {
    log( funcName, "Today is holiday.", { type: "info", } );
    return;
  }
  try {
    if ( !IS_RELEASED ) {
      message += "【テスト実行】\n";
    }
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
