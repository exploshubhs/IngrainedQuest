'use strict'

const path = require('path')
const fs = require('fs')
const SQL = require('sql.js')
const view = require(path.join(__dirname,'../views', 'common-views.js'))
const pg =   require('pg');
var pgClient=null;
//const client=null;

//const ipcRenderer = require('electron').remote.ipcRenderer;
/*
  SQL.js returns a compact object listing the columns separately from the
  values or rows of data. This function joins the column names and
  values into a single objects and collects these together by row id.
  {
    0: {first_name: "Jango", last_name: "Reinhardt", person_id: 1},
    1: {first_name: "Svend", last_name: "Asmussen", person_id: 2},
  }
  This format makes updating the markup easy when the DOM input id attribute
  is the same as the column name. See view.showPeople() for an example.
*/
    let _rowsFromSqlDataObject = function (object) {
    let data = {}
    let i = 0
    let j = 0
    for (let valueArray of object.values) {
      data[i] = {}
      j = 0
      for (let column of object.columns) {
        Object.assign(data[i], {[column]: valueArray[j]})
        j++
      }
      i++
    }
    return data
  }

  /*
  Return a string of placeholders for use in a prepared statement.
*/
    let _placeHoldersString = function (length) {
    let places = ''
    for (let i = 1; i <= length; i++) {
      places += '?, '
    }
    return /(.*),/.exec(places)[1]
  }

/*
  Populates the User List.
*/
module.exports.getUsers = function (connection) {
  // let db = SQL.dbOpen(window.model.db)
  // if (db !== null) {
  //   let query = 'SELECT * FROM `Users` ORDER BY `LastName` ASC'
  //   try {
  //     let row = db.exec(query)
  //     if (row !== undefined && row.length > 0) {
  //       row = _rowsFromSqlDataObject(row[0])
  //       view.showPeople(row)
  //     }
  //   } catch (error) {
  //     console.log('model.getUsers', error.message)
  //   } finally {
  //     SQL.dbClose(db, window.model.db)
  //   }
  // }

  console.log('connection ', connection);
  var str=this.createConnectUrl(connection);
  console.log('str ', str);
  pgClient= new pg.Client(str);

  console.log('about to connect');
  
  pgClient.connect( function( connectError ) {
  
    console.log('connected ', connectError);
  
    console.log('about to query');
  
    pgClient.query('SELECT * FROM Users ORDER BY LastName ASC', function( queryError, result ) {
  
      console.log('queried',queryError);
      if (result !== null) {
        
        try {
          let row = result.rows
          console.log('queried tows',result.rows);
          if (row !== undefined && row.length > 0) {
           // row = _rowsFromSqlDataObject(row[0])
            view.showUsers(row)
          }
        } catch (error) {
          console.log('model.getUsers', error.message)
        } finally {
         // pgClient.close();
        }

        console.log('results :'+result);
      }
  
    });
  
  });
}

/*
  Fetch a user's data from the database.
*/
module.exports.getUser = function (uid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'SELECT * FROM `Users` WHERE `ID` IS ?'
    let statement = db.prepare(query, [uid])
    try {
      if (statement.step()) {
        let values = [statement.get()]
        let columns = statement.getColumnNames()
        return _rowsFromSqlDataObject({values: values, columns: columns})
      } else {
        console.log('model.getUser', 'No data found for User ID =', uid)
      }
    } catch (error) {
      console.log('model.getUser', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}

/*
  Delete a user's data from the database.
*/
module.exports.deleteUser = function (uid, callback) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'DELETE FROM `Users` WHERE `ID` IS ?'
    let statement = db.prepare(query)
    try {
      if (statement.run([uid])) {
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        console.log('model.deleteUser', 'No data found for User ID =', uid)
      }
    } catch (error) {
      console.log('model.deleteUser', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}

/*
  Insert or update a user's data in the database.
*/
module.exports.saveFormData = function (tableName, keyValue, callback) {
  if (keyValue.columns.length > 0) {
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
      let query = 'INSERT OR REPLACE INTO `' + tableName
      query += '` (`' + keyValue.columns.join('`, `') + '`)'
      query += ' VALUES (' + _placeHoldersString(keyValue.values.length) + ')'
      let statement = db.prepare(query)
      try {
        if (statement.run(keyValue.values)) {
          $('#' + keyValue.columns.join(', #'))
          .addClass('form-control-success')
          .animate({class: 'form-control-success'}, 1500, function () {
            if (typeof callback === 'function') {
              callback()
            }
          })
        } else {
          console.log('model.saveFormData', 'Query failed for', keyValue.values)
        }
      } catch (error) {
        console.log('model.saveFormData', error.message)
      } finally {
        SQL.dbClose(db, window.model.db)
      }
    }
  }
}


//PostGreSQL
function formatFilter(filter) {
  let operator = '';
  let value = filter.get('value');
  switch (filter.get('operator')) {
    case '<':
      operator = '<';
      value = `'${value}'`;
      break;
    case '>':
      operator = '>';
      value = `'${value}'`;
      break;
    case '=':
      operator = '=';
      value = `'${value}'`;
      break;
    case '≠':
      operator = '<>';
      value = `'${value}'`;
      break;
    case '≤':
      operator = '<=';
      value = `'${value}'`;
      break;
    case '≥':
      operator = '>=';
      value = `'${value}'`;
      break;
    case 'contains':
      operator = 'LIKE';
      value = `'%${value}%'`;
      break;
    case 'does not contains':
      operator = 'NOT LIKE';
      value = `'%${value}%'`;
      break;
    case 'is exactly':
      operator = 'LIKE';
      value = `'${value}'`;
      break;
    case 'is not exactly':
      operator = 'NOT LIKE';
      value = `'${value}'`;
      break;
    case 'begins with':
      operator = 'LIKE';
      value = `'${value}%'`;
      break;
    case 'ends with':
      operator = 'LIKE';
      value = `'%${value}'`;
      break;
    case 'is':
      operator = 'IS';
      break;
    default:
      operator = 'LIKE';
      value = '\'%%\'';
  }
  return [operator, value];
}


  module.exports.createConnectUrl=function(params) {
    return `postgres://${params.user}:${params.password}@${params.address}:${params.port}/${params.database}`;
  }

  module.exports.connect=function(params, callback) {
    if (params.useSSH) {
      // ipcRenderer.send('ssh-connect', params);
      // ipcRenderer.once('ssh-connect', (sender, success, err) => {
      //   if (success) {
      //     this.connectDB(
      //       this.createConnectUrl(Object.assign({}, params, { port: 5433 })),
      //       params.useSSL,
      //       callback
      //     );
      //   } else {
      //     callback.apply(null, [false, err, true]);
      //   }
      // });
    } else {
      this.connectDB(this.createConnectUrl(params), params.useSSL, callback);
    }
  }

  module.exports.connectDB=function(connectUrl, useSSL, callback) {
    pg.defaults.ssl = useSSL;
    // pool takes the object above as parameter
    var PGconnection = {
      host: 'localhost', // server name or IP address;
      port: 5432,
      database: 'IngrainedQuest',
      user: 'postgres',
      password: 'shubham'
    };
    const pool = new pg.Pool(PGconnection);
    pool.connect( (err, client, done) => {
      let errorMessage = '';
      pgClient =  new pg.Client(connectUrl);;
      this.done = done;
      let isConnected = true;
      this.handleError(err);
      if (err) {
        isConnected = false;
        errorMessage = err.message;
        console.log('Connection Error '+err.message);
      }
     // callback.apply(null, [isConnected, errorMessage, false]);
    });
  }

  module.exports.disconnectDB=function() {
    if (this.client) {
      this.client.end();
    }
  }
  module.exports.client=function(client)
  {
      
  }
  module.exports.getTables=function() {
    return new Promise((resolve, reject) => {
      const query =
        `SELECT table_name
 FROM information_schema.tables
 WHERE table_schema='public'
 AND table_type='BASE TABLE'`;
      this.client.query(query, (err, result) => {
        this.handleError(err);
        if (err) {
          reject(err);
        }
        const tables = result.rows;
        tables.sort((a, b) => {
          if (a.table_name > b.table_name) {
            return 1;
          }
          if (b.table_name > a.table_name) {
            return -1;
          }
          return 0;
        });
        resolve(tables);
      });
    });
  }

  module.exports.getForeignKeys=function(tables) {
    return new Promise((resolve, reject) => {
      const tablesWithRefs = [...tables];
      const fKeyQuery =
        `SELECT information_schema.constraint_column_usage.constraint_name AS conname,
  information_schema.key_column_usage.column_name AS colname,
  information_schema.key_column_usage.table_name AS tablename,
  information_schema.constraint_column_usage.column_name AS refer_colname,
  information_schema.constraint_column_usage.table_name AS refer_tablename
  FROM information_schema.constraint_column_usage, information_schema.key_column_usage
  WHERE information_schema.key_column_usage.constraint_name =
  information_schema.constraint_column_usage.constraint_name AND
  information_schema.key_column_usage.table_name <>
  information_schema.constraint_column_usage.table_name`;
      this.client.query(fKeyQuery, (err, res) => {
        if (err) {
          reject(err);
        }
        tablesWithRefs.forEach((table) => {
          // eslint-disable-next-line no-param-reassign
          table.foreignKeys = res.rows.filter(row => row.tablename === table.table_name);
        });
        resolve(tablesWithRefs);
      });
    });
  }

  module.exports.getReferences=function(foreignKeys) {
    return new Promise((resolve, reject) => {
      const data = [];
      if (foreignKeys.length) {
        foreignKeys.forEach((fKey, i) => {
          const referenceQuery =
            `SELECT * FROM information_schema.key_column_usage
            WHERE constraint_name = '${fKey.name}'`;
          this.client.query(referenceQuery, (error, result) => {
            if (error) {
              reject(error);
            }
            data.push(result.rows[0]);
            if (i === foreignKeys.length - 1) {
              resolve(data);
            }
          });
        });
      } else {
        resolve([]);
      }
    });
  }

  module.exports.getPrimaryKeys=function(tableName) {
    return new Promise((resolve, reject) => {
      const primarykeyQuery = `SELECT column_name
 FROM pg_constraint, information_schema.constraint_column_usage
 WHERE contype = 'p' AND information_schema.constraint_column_usage.table_name = '${tableName}'
 AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`;
       pgClient.query(primarykeyQuery, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }

  module.exports.getTableConstraints=function(tableName) {
    return new Promise((resolve, reject) => {
      const columnConstraintQuery =
        `SELECT pg_constraint.conname AS constraintName, column_name AS columnName,
 pg_constraint.contype AS contype, pg_constraint.consrc AS consrc
 FROM information_schema.constraint_column_usage, pg_constraint
 WHERE table_name = '${tableName}'
 AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`;
      const constraints = [];
      this.client.query(columnConstraintQuery, (err, result) => {
        if (err) {
          reject(err);
        }
        if (!result.rows.length) {
          resolve([]);
        }
        result.rows.forEach((constraint, i) => {
          constraints.push({
            name: constraint.constraintname,
            column: constraint.columnname,
            type: constraint.contype,
            source: constraint.consrc,
            table: tableName,
          });
          if (i === result.rows.length - 1) {
            resolve(constraints);
          }
        });
      });
    });
  }

  module.exports.getTableIndexes=function(tableName) {
    return new Promise((resolve, reject) => {
      const query =
       `SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = '${tableName}'`;
      this.client.query(query, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

 

  module.exports.getNotNullConstraints=function(columns, oid) {
    return new Promise((resolve, reject) => {
      const constraints = [];
      if (columns) {
        const columnsIter = columns.entries();
        for (const entry of columnsIter) {
          const [i, column] = entry;
          const notNullConstraintQuery = `SELECT attnotnull as isNotNull FROM pg_attribute
WHERE attname = '${column.get('columnname')}' AND attrelid = ${oid}`;
          this.client.query(notNullConstraintQuery, (error, res) => {
            if (error) {
              reject(error);
            }
            if (res.rows[0].isnotnull) {
              constraints.push({
                name: '',
                type: 'nn',
                column: column.get('columnname')
              });
            }
            if (i === columns.size - 1) {
              resolve(constraints);
            }
          });
        }
      }
    });
  }

  module.exports.getTableContent=function(params) {
    return new Promise((resolve, reject) => {
      const page = params.page || 1;
      const offset = (page - 1) * settings.OFFSET;
      let totalCount = 0;

      //* SORTING *//
      const order = params.order || [];
      let orderQuery = '';
      if (order.length) {
        orderQuery = 'ORDER BY ';
        orderQuery += `"${order[0].index}" ${order[0].sortType}, `;
      }
      // ********* //

      //* FILTERING *//
      const filters = params.filters || new List();
      let filterQuery = '';
      if (filters.size === 1) {
        const filter = filters.get(0);
        if (filter.get('column') !== '' &&
          filter.get('operator') !== '' &&
          filter.get('value') !== '') {
          const [operator, value] = formatFilter(filter);
          const suffix = filter.get('suffix') || '';
          filterQuery = `WHERE "${filter.get('column')}"${suffix} ${operator} ${value}`;
        }
      } else if (filters.size > 1) {
        filterQuery = 'WHERE ';
        for (const filter of filters.values()) {
          if (!(filter.get('column') === '' ||
                filter.get('operator') === '' ||
                filter.get('value') === '')) {
            const [operator, value] = formatFilter(filter);
            const suffix = filter.get('suffix') || '';
            filterQuery += `"${filter.get('column')}"${suffix} ${operator} ${value} \n\t AND `;
          }
        }
        filterQuery = filterQuery.slice(0, -4);
      }
      //  *********  //

      orderQuery = orderQuery.slice(0, -2);
      const countQuery = `SELECT COUNT(*) FROM "${params.tableName}" ${filterQuery}`;
      this.client.query(countQuery, (err, result) => {
        if (err) {
          reject(err);
        }
        totalCount = parseInt(result.rows[0].count, 10);
        const query = `
        SELECT * FROM "${params.tableName}" ${filterQuery} ${orderQuery}
        LIMIT ${settings.OFFSET} OFFSET ${offset}`;
        this.client.query(query, (error, res) => {
          if (error) {
            reject(error);
          }
          const rows = res.rows;
          resolve({
            rows,
            totalCount,
            order,
            page
          });
        });
      });
    });
  }

  module.exports.getTableStructure=function(tableName) {
    return new Promise((resolve) => {
      const structureQuery = `
            SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
            CHARACTER_MAXIMUM_LENGTH AS CharacterLength, COLUMN_DEFAULT as DefaultValue
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = '${tableName}'`;
      this.client.query(structureQuery, (titleError, resStructure) => {
        this.handleError(titleError);
        resolve(resStructure.rows);
      });
    });
  }

  module.exports.updateCells=function(params) {
    return new Promise((resolve, reject) => {
      const update = [];
      params.forEach((param, i) => {
        this.client.query(param.query, (err, res) => {
          if (err) {
            reject(`${err}`);
          } else if (res) {
            update.push({
              type: param.query.substr(0, 6),
              updated: res.rows[0]
            });
          }
          if (i === params.length - 1) {
            resolve(update);
          }
        });
      });
    });
  }

  module.exports.insertRow=function(params) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ${params.tableName} DEFAULT VALUES;`;
      this.client.query(query, (err, result) => {
        if (err) {
          reject(`${err}`);
        }
        resolve(result);
      });
    });
  }

  module.exports.createTable=function(tableName) {
    return new Promise((resolve, reject) => {
      const query = `CREATE TABLE ${tableName}
 (id SERIAL PRIMARY KEY);`;
      this.client.query(query, (err, result) => {
        if (err) {
          reject(`${err}`);
        }
        resolve(result);
      });
    });
  }

  module.exports.truncateTable=function(tableName, restartIdentity) {
    return new Promise((resolve, reject) => {
      const query = `TRUNCATE ${tableName} ${restartIdentity ? 'RESTART IDENTITY' : ''}`;
      this.client.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  module.exports.dropTable=function(tableName) {
    return new Promise((resolve, reject) => {
      const query = `DROP TABLE ${tableName}`;
      this.client.query(query, (err, result) => {
        if (err) {
          reject(`${err}`);
        }
        resolve(result);
      });
    });
  }

  module.exports.handleError=function(err) {
    if (err) {
      //pg.end();
    }
  }



  /*
  Authenticate the user .
*/
module.exports.authenticateUser = function (tableName, keyValue, callback,connection) 
{
  if (keyValue.columns.length > 0) 
  {  
    return new Promise((resolve, reject) => {
      //forming the where clause from the keyValue pair
      var whereClause='';
      let i = 0
      let j = 0
      
      for (let column of keyValue.columns)
      {
        if (j!==keyValue.columns.length-1)
            whereClause+= [column]+"='"+ keyValue.values[j]+"' and "
        else
          whereClause+= [column]+"='"+ keyValue.values[j]+"'"
        j++
      }

      var sqlQuery='SELECT count(ID) FROM users where '+whereClause;
      //check if the user with the provided set of credentials exists or not
      if ( this.checkIfRecordExists(sqlQuery,connection))
          resolve(true);
      else
          resolve(false);;
  });
 }
}

/*
Common Function To Check If a record exist in the database or not
*/
module.exports.checkIfRecordExists=function(query,connection)
{
  return new Promise((resolve, reject) => {
  var isRecordExists=false;
  var str = this.createConnectUrl(connection);
  pgClient = new pg.Client(str);
  pgClient.connect(function(connectError) {
 
      if(connectError !=null)
          console.log('connection error ', connectError);
  
      pgClient.query(query, function(queryError, result) {
          
          if(queryError!=null)
              console.log('Query Error', queryError);

          if (result !== null) {
              try {
                  let row = result.rows
                  if (row !== undefined && row.length > 0) {
                    isRecordExists=true;
                    resolve(isRecordExists);
                  }
              } catch (error) {
                  console.log('main-model.checkIfRecordExists ', error.message)
              } finally {
 
              }
          }
      });
  });
  resolve(isRecordExists);
});

}  

