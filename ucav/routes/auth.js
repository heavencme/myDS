var express = require('express');
var events = require( 'events' );
var router = express.Router();
var crypto = require('crypto');
// module of mysql
var myDB = require( '../database/myDB' );

/**using md5 to encrypt**/
function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

/**init a object of mysql**/
var mydb = new myDB( 1 );

/**authentication method**/
router.post( '/', function(req, res) {
	console.log ('getdata' + req.body );

	var userinfo = req.body;

	// register event on 'ready' evnets of data
	var dataEvents = new events.EventEmitter();
		
	dataEvents.on( 'ready', getData );

	// process the data got from database query results
	function getData( d ){
		var resData = {};

		if( 'mysql' == d.database && 'get_password' == d.action){
			// notice that d.data is an array
			if ( md5( userinfo.password ) == d.data[0].password ){
				resData.state = 'success';
				resData.role = d.data[0].role;
				res.json( resData );
			}else{
				resData.state = 'failed';
				resData.role = 'alient';
				res.json( resData );
			}
		}else{
			resData.state = 'error';
			res.json( resData );
		}
	}

	// do the query
	mydb.exec( "SELECT password,role FROM user_info WHERE name='"+userinfo.username+"'", dataEvents, 'get_password' );
	/**may be bug that long wait if dataEvents won't happen**/
});

/**close the conection with database client**/
//mydb.close();

/**export the module**/
module.exports = router;
