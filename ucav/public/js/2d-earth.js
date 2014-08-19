/****
 *
 * map {
 *  curEvent: currently listened envent
 *	curPoly: current poly under opration
 *	mode: the mode of how to operate on the map
 *	curMarker: current marker just set
 *
 *}
 *
 */

//poly lines
var polyArr = [];
//markers
var markerArr = [];
//military icons
var militaryIconArr = [];
//the map
var map;

function mapInitialize() {
	var myPoint = new google.maps.LatLng(43.160114, 131.814308);
	var mapOptionsStyleArray = [
		//stylize your own map
		{
			featureType: 'all',
			elementType: 'all'
		}
	];
  var mapOptions = {
    zoom: 10,
    center: myPoint,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
		styles: mapOptionsStyleArray

  };

	//initiate the map
  map = new google.maps.Map(document.getElementById('map2D'), mapOptions);
	
	//listen how user choose in the tools of left bar
	listenChoice();	

	//listen user keyboard event
	addEvent(document,"keydown",keyBoardHandler);

}

/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * @param {MouseEvent} mouseEvent
 */
function addPath(event) {
	// get the index of the poly
	var index = getIndexOfCurPoly( map.curPoly ); 
  var path = polyArr[ index ].getPath();
  
	// Because path is an MVCArray, we can simply append a new coordinate and it will automatically appear
  path.push(event.latLng);	
}

/**
 * delete the last point/path from the current poly
 */
function delPath(e) {
	// get the index of the poly
	var index = getIndexOfCurrentlyClickedPoly( e.latLng ); //how the locate the currently clicked path
  if (index >= 0){
		//just in case, clicked but not in the accuracy tolerance
		var path = polyArr[ index ].getPath();
		path.removeAt( (path.getLength() - 1) );
	}
}

/**
 * start a new one and set current poly to the polyArr
 * ruturn the poly created
 */
function setPoly() {
	//arrow on the poly
	var closedArrow = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
	};
	var openArrow = {
		path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
	}

	var polyOptions = {
    strokeColor: getColor(),
    strokeOpacity: 1.0,
    strokeWeight: 3,
		icons: [
			{
				icon: closedArrow,
				offset: '100%'
			},

			{
				icon: openArrow,
				offset: '0'
			}
		]
  }

  var poly = new google.maps.Polyline(polyOptions);
  
	poly.setMap(map);

	//save to polyArr
	polyArr.push(poly);

	//set the poly that being currently edited
	map.curPoly = poly;

	return poly;
}

/**
 * reset the the layer of certain poly
 */
function resetPoly(event) {
	//one.setMap(null);	
}

/**
 * get a random color
 */
function getColor() {
	var color = '';
	var int1 = Math.floor( Math.random()*255 );
	var int2 = Math.floor( Math.random()*255 );
	var int3 = Math.floor( Math.random()*255 );
	color += int1.toString(16) + int2.toString(16) + int3.toString(16);
	return color;
}

/**
 * get the index of the current poly in polyArr
 */
function getIndexOfCurPoly( curPoly ) {
	if ( !curPoly || !polyArr.length ) {
		return;
	}

	for ( var i in polyArr ){
		if ( polyArr[i] === curPoly ){
			return i;
		}
	}
}

/**
 * get the index of the poly that is being clicked
 */
function getIndexOfCurrentlyClickedPoly( latLng ) {
	for ( var i in polyArr ){
		if ( google.maps.geometry.poly.isLocationOnEdge(latLng, polyArr[i], 0.01) ) {
			//test whether the point falls within the polyline, the third param is tolerance
			return i;
		}
		
	}
}

/**
 * change the color to blue when mousemove the path
 */
function showPath () {
	var blue = '#00f';
}

/**
 * set mode to poly/rectangle/circle/polygen/drag, or default
 */
function Mode ( mode, opt ) {
	this.mode = mode;
	this.opt = opt
}

Mode.prototype.resetEvents = function(){
	google.maps.event.clearListeners( map, 'click' );
}

Mode.prototype.setNewEvent = function(){
	if ( this.mode == 'poly' ) {
		var poly = setPoly();	

		//add a listener for the click event to draw the path of a poly
		google.maps.event.addListener(map, 'click', addPath);//add
		google.maps.event.addListener(poly, 'rightclick', delPath);//del on rightclick
		google.maps.event.addListener(poly, 'dblclick', delPath);//del on dblclick
	}

	else if ( this.mode == 'marker' ) {
		//add a listener for adding/removing marker
		google.maps.event.addListener( map, 'click', function( event ){
			// init a marker
			var marker = setMarker ( event.latLng );	
			
			// save to array
			markerArr.push( marker );
			
			// add delete listener
			google.maps.event.addListener( marker, 'dblclick', function(){
				
				// invisible
				marker.setMap( null );
				
				// delete from array
				for( i in militaryIconArr ){
					if ( militaryIconArr[i] == marker ){
						militaryIconArr.splice( i, 1 );
					}
				}
				
			});

		});
		//google.maps.event.addListener( poly, 'rightclick', delPath );//del on rightclick
	}

	else if ( this.mode == 'militaryIcon' ) {
		var image = new google.maps.MarkerImage(
			// url
			'images/mili/' + this.opt + '.png'
		);

		//add listener for the click event to draw military icon
		google.maps.event.addListener( map, 'click', function( event ){
			// init a military icon marker
			var marker = setMilitaryIcon ( event.latLng, image );	

			// save to array
			militaryIconArr.push( marker );
			
			// add delete listener
			google.maps.event.addListener( marker, 'dblclick', function(){
				
				// invisible
				marker.setMap( null );
				
				// delete from array
				for( i in militaryIconArr ){
					if ( militaryIconArr[i] == marker ){
						militaryIconArr.splice( i, 1 );
					}
				}
				
			});
	
		});
		//google.maps.event.addListener( poly, 'rightclick', delPath );//del on rightclick
	}
}

/**
 * change the mode of operation on map
 */
function changeMode( mode, opt ) {
	var myMode = new Mode(mode, opt);
	myMode.resetEvents();
	myMode.setNewEvent();
}

/**
 * listen to user's choice of mode 
 */
function listenChoice() {
	var tools = document.getElementById('tools');

	tools.addEventListener("click", function(e){
		var choice;

		if ( e.target ) {
			choice = e.target.className;
		}
		else {
			choice = e.srcElement.className;
		}
			
		choice = choice.match(/-\w+/g)[0];
		choice = choice.match(/\w+/)[0];
		console.log(choice);	
		switch(choice){
			case 'pencil':
				changeMode('poly');
				break;

			case 'pushpin':
				changeMode('marker');
				break;

			default:
				break;
		}
	});

	var militaryIcon = document.getElementById('military-icon');	

	militaryIcon.addEventListener("click", function(e){
		var choice;

		if ( e.target ) {
			choice = e.target.id;
		}
		else {
			choice = e.srcElement.id;
		}
			
		changeMode( 'militaryIcon', choice );

	});
}

/**
 * register common event listener for cross Browser
 */
function addEvent(target,type,handler) {
	if (target.addEventListener){
		target.addEventListener(type,handler,false);
	}
	else{
		target.attachEvent("on"+type,function(event){
			return handler.call(target,event);
		});
	}
}

/**
 * handler of events on ker board
 */
function keyBoardHandler(e) {
	if ( e.ctrlKey ){
		//act when ctr is pressed
		switch ( e.keyCode ) {
			case 90: //crt + z
				// get the index of current poly
				var index = getIndexOfCurPoly(map.curPoly); 
				if (index){
					//just in case
					var path = polyArr[ index ].getPath();
					path.removeAt( (path.getLength() - 1) );
				}
	
				//if the path of this poly line has been all deleted
				/**
				if ( 0 === path.getLength() ) {
					//remove from the map
					polyArr[index].setMap(null);

					//remove from polyArr
					polyArr.splice(index, 1);
				}
				**/
				break;

			default :
				break;
		}
	}
}

/**
 * set a marker on the map
 */
function setMarker (latLng) {
	var marker = new google.maps.Marker({
    position: latLng,
    title: '#' + markerArr.length,
    map: map
  });

	return marker;
}

/**
 * add a new maker, both on the map and into the marker arr
 **/
function addMarker( event ) {
	var marker = setMarker ( event.latLng );
	
	// save to array
	markerArr.push( marker );
}

/**
 * set a military icon
 */
function setMilitaryIcon ( latLng, image ) {	
	var marker = new google.maps.Marker({
    position: latLng,
    title: '#' + markerArr.length,
    map: map,
		icon: image
  });

	return marker;
}



