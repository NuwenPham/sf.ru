$(document).ready(function(){funcLoader()});





var funcLoader = function()
{
	if($.cookie('aves_c_is_logged') == null || $.cookie('aves_c_is_logged') == "null")
	{	
	
		var exploded = location.href.split("&");
		var status = exploded[1].split("=")[1];
		
		if( status == "ok" ) 
		{
			var token = exploded[2].split("=")[1];
			var nick = exploded[3].split("=")[1];
			var account_id = exploded[4].split("=")[1];
			var expires_at = exploded[5].split("=")[1];
			
			$.cookie('aves_c_is_logged', '1');
			$.cookie('aves_c_token', token);
			$.cookie('aves_c_account_id', account_id);
			$.cookie('aves_c_nick', nick);
			$.cookie('aves_c_expires_at', expires_at);
			
			window.location = "http://" + window.location.host;			
		}
	}
}