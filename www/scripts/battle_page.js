var battle = new Battle();

function funcLoader(){

	battle.Initializie({
		width: 1000,
		height: 400,
		onClick:function (_cell){
			battle.ActionsForShip(_cell);
			console.log("hex click callback");
		}
	});

	Starfight.api.LoadBattleData(5, function (_response){
		battle.UpdateBattle(_response);
	});

}

function DoneOrder (){
	Starfight.api.DoneOrders({
		vals: Starfight.QueueOrders,
		battle_id : battle._lastBattleData.battle[1].id
	}, function(ev){
		Starfight.ClearQueueOfOrders();
	});

	OrderButtonStatus(false);
}

function OrderButtonStatus( status )
{
	cls_enabled = $("#bh_doneorder_btn").attr("class");
	cls_enabled = ( status == false ? cls_enabled + "_off" : "bh_elements bh_doneorder_button" );

	if( status == true )
	{
		Starfight.orderstatus = false;
		$("#bh_doneorder_btn").attr("onclick", "DoneOrder()");
	}
	else
	{
		Starfight.orderstatus = true;
		$("#bh_doneorder_btn").attr("onclick", "");
	}

	$("#bh_doneorder_btn").attr("class", cls_enabled);
}

function bm_OnClickGun (cell, sCell, battleMenu, action, gun) {

	if( battle._lastCreatedBattleMenu != null ) {
		battle._lastCreatedBattleMenu.RemoveMenu( battle.BattleField );
		battle._lastCreatedBattleMenu = null;
	}

	if( action == "step" ) {
		Starfight.AddOrderToQueue( sCell, gun );
		battle.isstepped = true;
	}
	else if( action == "laser" )
	{

	}
}

function dbg(o){
	console.log("--------- Begin debug message ----------");
	console.log(o);
	console.log("--------- End debug message ----------");
}