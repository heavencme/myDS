$(function(){
	var dl = $( "#dialog" );

	dl.dialog({ autoOpen: false });

	$('#login-submit').click(function(e){
		e.preventDefault();
		var user_name = $('#user_login').val();
		var pass_word = $('#user_pass').val();
		console.log( user_name );
		console.log( pass_word );
		$.ajax({
			type: "POST",
			data: {
				username: user_name,
				password: pass_word
			},                      
			url: "http://localhost:3000/auth",                     
			success: function(data) {
				console.log( data );
				if ( 'success' == data.state ){
					switch( data.role ){
						case 'commander':
						case 'superuser':
							dl[0].innerHTML = "<strong>"+user_name+"登陆成功</strong><div><button id=\"admin\" class=\"btn btn-sm\">用户管理</button><button id=\"menu\" class=\"btn btn-sm\" style=\"margin-left: 20%;\"><a href=\"action/\">进入平台</a></button></div>";
							break;
						case 'designer':
						case 'visitor':
							dl[0].innerHTML = "<strong>"+user_name+"登陆成功</strong><div><button id=\"menu\" class=\"btn btn-sm\" style=\"margin-left: 40%;\"><a href=\"action/\">进入平台</a></button></div>";
						break;
					}

					dl.dialog( "open" );
					

				}else if ( 'failed' == data.state ){
				}else{

				}
			}
		});
	});             
});
