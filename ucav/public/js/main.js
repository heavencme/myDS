$(document).ready(function(){

var doc = document;

// set #dialog as dialog 0bject of jq-ui
var dl = $( "#dialog" );
dl.dialog({ 
	autoOpen: false,
	width: 500,
	height: 600
});

/**set left-panel as accordion with jquery-ui**/
$( "#left-accordion" ).accordion({
    active: 10,
    header: "h3",    
    collapsible: true,
    heightStyle: "content"
});

/**set top nav as menu with jquery-ui**/
$( ".jquery-ui-menu" ).menu();

/**mian-icon toggle**/
$("#main-icon").click(function(){
    if ( "true" == $(this).attr("clicked") ) {
        $(this).attr("clicked","false");
		$( "#left-accordion" ).accordion("enable");
		$("#left-panel").css("overflow", "visible");		
		$("#left-panel").animate({
            width: "20%",
            height: "100%"
		});
        		
	}
    else if ( "false" == $(this).attr("clicked") ) {
		$(this).attr("clicked","true");
		$("#left-panel").css("overflow", "hidden");
        $( "#left-accordion" ).accordion("disable");        
		$("#left-panel").animate({
            width: "53",
            height: "53"
		});
		
	}
});

/**set icon in left-panel draggable**/
$( ".menu-icon" ).draggable();

/**load the 2d earth**/
mapInitialize();

/**set click event on #scenario-description to lauch #dialog**/
$( "#scenario-description" ).click(function(e){
	e.preventDefault();
	dl[0].innerHTML = "<iframe src=\"scenario.html\"></iframe>";
	dl.dialog( "open" );
});

/**
     
    $("[name='my-checkbox']").bootstrapSwitch();
    $('input[name="my-checkbox"]').bootstrapSwitch('size', 'mini');
    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
      console.log(this); // DOM element
      console.log(event); // jQuery event
      console.log(state); // true | false
    });
    console.log("hell, world.");
 **/

$( "#show-simulation" ).click(function(e){
	console.log("clicked.");
	e.preventDefault();
	// hide others
	clearOthers( 'simulation' );	
	// show the simulation
	document.getElementById( "simulation" ).style.display = 'block';
	// start simulation
	simu();
});

$( "#show-map2D" ).click(function(e){
	console.log("clicked.");
	e.preventDefault();
	// hide others
	clearOthers( 'map2D' );	
	// show the simulation
	document.getElementById( "map2D" ).style.display = 'block';
	
});

function clearOthers( name ){
	switch( name ){
		case 'map2D':
			document.getElementById("simu-container").innerHTML = "";
			document.getElementById("think").style.display = "none";
			break;
		case 'simulation':
			document.getElementById("map2D").style.display = "none";
			document.getElementById("think").style.display = "none";
			break;
		case 'think':
			document.getElementById("simu-containner").innerHTML = "";
			document.getElementById("map2D").style.display = "none";
			break;
		default:
			break;

	}
}


/**end of document.ready**/
});
