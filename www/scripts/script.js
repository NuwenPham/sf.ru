var VK;

$(document).ready(function(){funcLoader()});

function funcLoader()
{
	if($.cookie('is-auth') == "1")
	{		
		// Getting id
		var vk_id = $.cookie("vk-id");
		var is_online = $.cookie("is-online");		
		$('#login_button').css({display:"none"});
		$('#start_game_button').css({display:"inline-block"});
	}
	else
	{
		
	}
}

function Authentification(vk_id)
{
	$.cookie("vk-id", vk_id);
	$.cookie("is-auth", "1");
	
	var data = {
		vk_id: vk_id
	}
	
	SendData(
		"POST", 
		"http://" + window.location.host + "/php/auth.php", 
		data, 
		function (response) {
			response = response.split("//_/|");
			console.log(response);
			if( response[0] == "0" )
			{
				console.log(response);
				//Дальше скрываем кнопку регистрации и показываем кнопку "В игру"!
				$('#login_button').css({display:"none"});
				$('#start_game_button').css({display:"inline-block"});
				$.cookie("pid", response[2]);
			}
		}
	);
	
	
}


// SEPARATE METHODS
//================================
var SendData = function(type, url, data, callback)
{
	$.ajax({
		type: type,
		url: url,
		data: data
	})
	.done( function(response){ 
		//alert(response); 
		//console.log(response);
		callback(response);
	});
}

// UPLOAD FUNCTIONS
//================================
function hideBtn(){
	$('#upload').hide();
	$('#res').html("Идет загрузка файла");
}

function handleResponse(mes) {
	$('#upload').show();
	if (mes.errors != null) {
		$('#res').html("Возникли ошибки во время загрузки файла: " + mes.errors);
	}    
	else {
		$('#res').html("Файл " + mes.name + " загружен");    
	}    
}