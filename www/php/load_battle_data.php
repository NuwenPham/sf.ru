<?php
require_once "PH.php";
require_once "../configuration.php";
require_once "Starfight.php";
$starfight = new Starfight();
$cfg = new Config();	
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);


$pid = $_COOKIE["pid"];
$battle_id = $sql->selectSingleFieldWhereExtended( "character", "battle_id", "id=" . $pid ); 

//1) Getting player status
$status = $sql->selectSingleFieldWhereExtended( "battles", "status", "id=" . $battle_id ); 

if( $status == "" )
{
	$json_resp["error"] = "error";
	$json_resp["message"] = "Such battle is not exist.";
	$json_resp["pid"] = $pid;
	$json_resp["battle_id"] = $battle_id;
	echo json_encode( $json_resp );
}
else if( $status == 0 )
{
	$json_resp["error"] = "error";
	$json_resp["message"] = "This battle is not started.";
	echo json_encode( $json_resp );
}
else if( $status == 1 )
{
	$battle_row = $sql->selectTableWhere("battles", "id=" . $battle_id);
	$players = $sql->selectTableWhere("characters_in_battle", "battle_id=" . $battle_id);	
	
	// Получить айди корабль
	$ship_id = $sql->selectSingleFieldWhereExtended("character", "active_ship_id", "id=" . $pid);
	
	// Получить орудия корабля
	$guns = $sql->selectTableWhere("modules", "module_owner=" . $ship_id . " AND type=0 ORDER BY gun_range DESC");	
	
	// Получить данные о себе
	$you = $sql->selectTableWhere("characters_in_battle", "battle_id=" . $battle_id . " AND player_id=" . $pid );
	
	$json_resp["you"] = $you;
	$json_resp["your_guns"] = $guns;
	$json_resp["battle"] = $battle_row;
	$json_resp["players"] = $players;
	$json_resp["error"] = "";
	$json_resp["message"] = "ok";
	
	echo json_encode( $json_resp );
}
else
{
	$json_resp["error"] = "error";
	$json_resp["message"] = "Azaza lalka, try again.";
	echo json_encode( $json_resp );
}