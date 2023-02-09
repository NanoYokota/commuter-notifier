function sendMessageCw( message = "", roomID = roomId_test ) {
  if ( !IS_RELEASED ) {
    roomID = roomId_test;
  }
  if ( !IS_RELEASED ) {
    message = "【テスト実行　※※無視してください※※】\n\n" + message;
  }
  const url = `${ CW_ENDPOINT_URL }/rooms/${ roomID }/messages`;
  let options = {
    'method' : 'POST',
    'accept' : 'application/json',
    'headers' : {
      "x-chatworktoken" : CW_API_TOKEN,
      "content-type": "application/x-www-form-urlencoded",
    },
    "muteHttpExceptions" : true,
    'payload' : {
      'body': message,
    },
  };
  let response;
  try {
    response = UrlFetchApp.fetch( url, options );
  } catch( e ) {
    response = e;
  }
  return response;
}

function contactsList() {
  const url = `${ CW_ENDPOINT_URL }/contacts`;
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'x-chatworktoken': CW_API_TOKEN,
    },
  };
  let response;
  try {
    response = UrlFetchApp.fetch( url, options );
  } catch( e ) {
    response = e;
  }
  if ( DEBUG ) {
    console.log( JSON.parse( response ) );
  }
  return response;
}

function roomId( accountId ) {
  const response = contactsList( accountId );
  const data = JSON.parse( response );
  for ( let i = 0; i < data.length; i++ ) {
    const contact = data[ i ];
    if ( DEBUG ) {
      console.log( contact );
    }
    if ( contact.account_id == accountId ) {
      return contact.room_id;
    }
  }
  return false;
}

function mention( id, name ) {
  return `[To:${ id }] ${ name }さん`;
}
