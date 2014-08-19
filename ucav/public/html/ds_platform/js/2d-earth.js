var map;
var polyline;
var myIcon=new GIcon();
myIcon.image="http://labs.google.com/ridefinder/images/mm_20_green.png";
myIcon.shadow="http://labs.google.com/ridefinder/images/mm_20_shadow.png";
myIcon.iconSize=new GSize(12,20);
myIcon.shadowSize=new GSize(22,20);
myIcon.iconAnchor=new GPoint(6,20);
myIcon.infoWindowAnchor=new GPoint(5,1);


function locate(address){
	var geocoder=new GClientGeocoder();
	geocoder.getLatLng(address,function(point){
		if(!point){
			alert(adress+"not found");
		 }
		else{
			map.setCenter(point);
			map.setZoom(6);
		   	var marker=new GMarker(point);
		   	map.addOverlay(marker);
		}
	});
							   
}

function earth2DLoad(){
	if(GBrowserIsCompatible()){
		G_NORMAL_MAP.getTileLayers()[0].getOpacity=function(){return 1};
		map= new GMap2(document.getElementById("map2D"));
		map.getContainer().style.backgroundColor="#ffffff";
		map.enableScrollWheelZoom();
		map.addControl(new GMapTypeControl());
		map.addControl(new GSmallMapControl());
		map.addControl(new GOverviewMapControl());
		var geoPoint0=new GLatLng(39.92,116.46);
		map.setCenter(geoPoint0,2);
	
		GEvent.addListener(map,'click',function(overlay,point){
			if(point){
				var marker=new GMarker(point,{draggable:true,bouncy:true,bounceGravity:true});
				map.setZoom(80);
				
				map.setCenter(point);
			
				var playHtml="纬度："+map.getCenter().lat()+"<br/>经度："+map.getCenter().lng();
				map.openInfoWindow(point,playHtml);
				
				map.addOverlay(marker);
			  
			}
		});
	}		
}

function  askPoint()
{
  locate(prompt("请输入需要查询的地址",""));
}



//去地标
function removeMarkers()
{
	map.clearOverlays();
}

