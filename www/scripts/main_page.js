function funcLoader()
{
	if($.cookie('is-auth') == "1")
	{	
		if( $.cookie('vk-id') != null ) 
		{
			$(".create_button").attr({ onclick : "CreateBattleLobby();" });
		}	
	}
	
	
	Load();
}

function Load()
{
	//battle_cd_timers
	Starfight.api.GetBattleList(function(resp){
		$("#gmp_blt_content").append(resp);
		TurnOnTimers();
	});
	
	
}

function TurnOnTimers()
{
	var a = 0;
	while( a < battle_cd_timers.length )
	{
		var ct = new ClockTimer();
		ct.AddObject( battle_cd_timers[a] ); 
		ct.Start(
			battle_cd_timers[a].countdown, 
			function (resp) { Starfight.UpdateGUITimer( "#table_" + resp.object.battle_id , resp.clock );  },  
			function (resp) { LoadFight(resp.object) } 
		);
		a++;
	}
}

function LoadFight(timerdata)
{
	//gmp_tbl_
	console.log( "battle_id: " + timerdata.battle_id );
	Starfight.api.GetBattleStatus( timerdata.battle_id, function( resp ){
		$( "#gmp_tbl_" + timerdata.battle_id ).remove();
		
		if( resp.status == "ok" )
		{
			if( resp.data.is_in_battle == 1 )
			{
				window.location = "";
			}
		}
		
		
		console.log(resp);
	});
	
}


function CreateBattleLobby()
{
	CloseBattleSetupMenu();
	Starfight.api.CreateBattleLobby( $.cookie('vk-id'), function( resp ){
				
		console.log(resp);
		object = { 
			time : last_created_battle_time
		}
		
		Starfight.api.GetBattleList( object, function(resp){
			//console.log(resp);
			$( "#gmp_blt_content" ).prepend( resp );
			TurnOnTimers();
		});
		
	});
	
}

function OpenBattleSetupMenu()
{
	Starfight.OpenHideWindow(".hide_items", ".battle_settings");
}

function CloseBattleSetupMenu()
{
	Starfight.CloseHideWindow(".hide_items");
}


function JoinToBattleLobby(battle_id)
{
	Starfight.api.Join(battle_id, $.cookie('vk-id'));
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
