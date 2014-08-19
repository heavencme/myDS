$(document).ready(function(){

var doc = document;

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
earth2DLoad();
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

});
