var express = require('express');
// depend on router mudule to handle catch router info of request
var router = express.Router();
var http = require('http'); 

var add = require( '../add' );

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/routertest', function(req, res) {
	res.render('index', { title: 'Express is running'});
});

var calcObj = [];
var resultObj = [];

router.get('/matlab', function (req, res) {
	
	if ( req.param('ready') == 'true' ) {
		if( calcObj.length > 0 ){
			var data = calcObj.shift();

			res.json( data );
		}else{
			res.json( {tasktype:'none', num:3} );
		}


		if ( req.param('pathName') ) {
			var options = {
				host: add.matlab.host,
				port: add.matlab.port,
				path: req.param('pathName'),
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
					}
			};


			var req = http.request(options, function(res) {
				var body = '';
				res.setEncoding( 'utf8');
				res.on('data', function (chunk) {
					body += chunk;
				});

				res.on( 'end', function() {
					var result = JSON.parse(body);
					console.log( result );
					resultObj.push( result );
				});
			});

			req.on('error', function(e) {
				console.log('problem with request: ' + e.message);
			});

			req.write('name=wb&host=ubuntu');
			req.end();


		}
	}
});

router.get('/client', function (req, res) {
	//console.log('is json? '+ req.is('json') );
	//console.log( req.params );
	//res.json({ name: 'wb' });
	
	var data = req.query;
	if ( 'data' == data.state ){
		// convert string form digit to real digti from the get request
		var data = JSON.stringify( req.query );
		data = data.replace(/"(\d+)"/g, "$1");
		data = JSON.parse( data );
		calcObj.push( data );

		//var result = JSON.parse( req.query );
		//console.log( result );
		res.jsonp({state: 'calculating'});

	} else if ( 'check' == data.state ){
		if ( resultObj.length > 0 ){
			var re = resultObj.shift();
			res.jsonp( re );
		}
		else{
			res.jsonp( {state: 'calculating'} );
		}
	}
	
	/**
	if ( req.query ) {
		for ( var i in req.query ) {
			console.log( i + ' -> ' + req.query[i] );
			data[i] = req.query[i];
		}
	}
	**/
  

	/**
  res.header('Content-Type', 'application/json');
  res.header('Charset', 'utf-8');
  res.send( req.query.callback + '({"something": "rather", "more": "pork", "tua": "tara"});' ); 
	**/
	

	

});
// router module is exposed to the outside calling
module.exports = router;
