const template = () => {
  return { rows: {}, cols: {}, ranges: {}, values: {}, numbers: {}, indexes: {}, };
};

class SheetInfo {
  constructor( sheetName ) {
    this.sheetName = sheetName;
    this.className = this.constructor.name;
    this.sheet = SS.getSheetByName( this.sheetName );
    this.input = template();
  }

  fetchLastColumn() {
    this.input.cols.last = this.sheet ? this.sheet.getLastColumn() : null;
    return this.input.cols.last;
  }

  getLastColumn() {
    if ( this.input.cols.last ) {
      return this.input.cols.last;
    }
    return this.fetchLastColumn();
  }
}

class CommuteSheet extends SheetInfo {
  constructor( sheetName ) {
    super( sheetName );
    this.input.rows.first = 3;
    this.input.cols.first = 1;
    this.flag = template();
    this.flag.rows.firstInput = this.input.rows.first;
    this.flag.rows.label = this.flag.rows.firstInput - 1;
    this.flag.cols.first = this.input.cols.first;
    this.flag.cols.firstInput = this.flag.cols.first;
    this.flag.cols.last = this.flag.cols.first;
    this.flag.numbers.col = this.flag.cols.last - this.flag.cols.first + 1;
    this.member = template();
    this.member.rows.first = 1;
    this.member.rows.accountId = this.member.rows.first;
    this.member.rows.name = this.member.rows.accountId + 1;
    this.member.rows.lastLabel = this.member.rows.name;
    this.member.rows.inputFirst = this.member.rows.name + 1;
    this.member.cols.firstInput = this.flag.cols.last + 1;
    this.member.numbers.label = this.member.rows.lastLabel - this.member.rows.first + 1;
  }

  fetchLastMemberCol() {
    this.member.cols.last = this.sheet
      .getRange( this.member.rows.name, this.flag.cols.last )
      .getNextDataCell( SpreadsheetApp.Direction.NEXT )
      .getColumn();
    return this.member.cols.last;
  }

  getLastMemberCol() {
    const col = this.member.cols.last;
    if ( col ) {
      return col;
    }
    return this.fetchLastMemberCol();
  }

  fetchMembersNum () {
    const lastCol = this.getLastMemberCol();
    if ( lastCol < this.member.cols.firstInput || lastCol > 10 ) {
      return 0;
    }
    this.member.numbers.member = lastCol - this.flag.cols.last;
    return this.member.numbers.member;
  }

  getMembersNum() {
    const num = this.member.numbers.member;
    if ( num ) {
      return num;
    }
    return this.fetchMembersNum();
  }

  fetchPatternsNum() {
    const memberNum = this.getMembersNum();
    this.member.numbers.pattern = memberNum * ( memberNum - 1 ) / 2;
    return this.member.numbers.pattern;
  }

  getPatternsNum() {
    const pattenNum = this.member.numbers.pattern;
    if ( pattenNum ) {
      return pattenNum;
    }
    return this.fetchPatternsNum();
  }

  fetchMembersRange() {
    const funcName = `${ this.className }.fetchMembersRange()`;
    const rowNum = this.member.numbers.label + this.getPatternsNum();
    const colNum = this.getMembersNum();
    if ( !rowNum || rowNum < 1 ) {
      throw log(
        funcName,
        `rowNum is invalid. [ rowNum: ${ rowNum } ]`,
        { output: "return", type: "error", }
      );
    }
    if ( !colNum || colNum < 1 ) {
      throw log(
        funcName,
        `colNum is invalid. [ colNum: ${ colNum } ]`,
        { output: "return", type: "error", }
      );
    }
    this.member.ranges.all = this.sheet.getRange(
      this.member.rows.first,
      this.member.cols.firstInput,
      rowNum,
      colNum
    );
    return this.member.ranges.all;
  }

  getMembersRange() {
    const range = this.member.ranges.all;
    if ( range ) {
      return range;
    }
    return this.fetchMembersRange();
  }

  fetchMembers() {
    const range = this.getMembersRange();
    this.member.values.all = range.getValues();
    return this.member.values.all;
  }

  getMembers() {
    const values = this.member.values.all;
    if ( values ) {
      return values;
    }
    return this.fetchMembers();
  }

  fetchFlagsRange() {
    const numRow = this.getPatternsNum();
    const numCol = this.flag.numbers.col;
    if ( !numRow || numRow < 1 ) {
      throw log(
        funcName,
        `numRow is invalid. [ numRow: ${ numRow } ]`,
        { output: "return", type: "error", }
      );
    }
    if ( !numCol || numCol < 1 ) {
      throw log(
        funcName,
        `numCol is invalid. [ numCol: ${ numCol } ]`,
        { output: "return", type: "error", }
      );
    }
    this.flag.ranges.all = this.sheet.getRange(
      this.flag.rows.firstInput,
      this.flag.cols.firstInput,
      numRow,
      numCol
    );
    return this.flag.ranges.all;
  }

  getFlagsRange() {
    const range = this.flag.ranges.all;
    if ( range ) {
      return range;
    }
    return this.fetchFlagsRange();
  }

  fetchFlags() {
    const range = this.getFlagsRange();
    this.flag.values.all = range.getValues();
    return this.flag.values.all;
  }

  getFlags() {
    const flags = this.flag.values.all;
    if ( flags ) {
      return flags;
    }
    return this.fetchFlags();
  }

  fetchCurrentPattenIndex() {
    const flags = this.getFlags();
    for ( let i = 0; i < flags.length; i++ ) {
      if ( flags[ i ][ 0 ] != 'on' ) {
        continue;
      }
      this.flag.indexes.current = i;
      return this.flag.indexes.current;
    }
  }

  getCurrentPattenIndex() {
    const index = this.flag.indexes.current;
    if ( index > -1 ) {
      return index;
    }
    return this.fetchCurrentPattenIndex();
  }

  fetchFlagOnIndexes() {
    const members = this.getMembers();
    const index = this.getCurrentPattenIndex();
    const currentPattern = members[ index + this.flag.rows.label ];
    let indexes = [];
    for ( let i = 0; i < currentPattern.length; i++ ) {
      if ( currentPattern[ i ] != "出社" ) {
        continue;
      }
      indexes.push( i );
    }
    this.member.indexes.on = indexes;
    return this.member.indexes.on;
  }

  getFlagOnIndexes() {
    const indexes = this.member.indexes.on;
    if ( indexes && indexes.length > 0 ) {
      return indexes;
    }
    return this.fetchFlagOnIndexes();
  }

  fetchFlagOnMembers() {
    const indexes = this.getFlagOnIndexes();
    const members = this.getMembers();
    const accountIds = members[ 0 ];
    const names = members[ 1 ];
    let values = [];
    for( let i = 0; i < indexes.length; i++ ) {
      const index = indexes[ i ];
      values.push( { accountId: accountIds[ index ], name: names[ index ] } );
    }
    this.member.values.on = values;
    return this.member.values.on;
  }

  getFlagOnMembers() {
    const funcName = `${ this.className }.getFlagOnMembers()`;
    const members = this.member.values.on;
    if ( members && members.length > 0 ) {
      return members;
    }
    return this.fetchFlagOnMembers();
  }

  switchFlag() {
    const funcName = this.className + ".switchFlag()";
    const flags = this.getFlags();
    const index = this.getCurrentPattenIndex();
    const lastIndex = this.getPatternsNum() - 1;
    flags[ index ][ 0 ] = "";
    if ( index + 1 > lastIndex ) {
      flags[ 0 ][ 0 ] = "on";
    } else {
      flags[ index + 1 ][ 0 ] = "on";
    }
    log( funcName, flags, { label: "flags", type: "debug" } );
    this.setFlags( flags );
    this.putFlags();
  }

  setFlags( flags ) {
    this.flag.values.all = flags;
  }

  putFlags() {
    const range = this.getFlagsRange();
    range.setValues( this.flag.values.all );
  }
}
