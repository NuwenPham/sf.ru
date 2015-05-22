<?php
require_once "PH.php";
require_once "../configuration.php";
require_once "Starfight.php";

//== 
$starfight = new Starfight();
$cfg = new Config();	
$sql = new PH(); 
 
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);	

$is_exist = $sql->existRow("battles", "id=" . $_POST["battle_id"]);

if( $is_exist == 1 )
{
	$orders = $sql->selectSingleRowExt("battles", "id=" . $_POST["battle_id"]);
	
	$isInBattle = $sql->selectSingleFieldWhereExtended( "character", "is_in_battle", "vk_id=" . $_COOKIE['vk-id'] );
	
	$response = '{"status": "ok", "data": { "battle_status": "'.$orders["status"].'", "is_in_battle": "'.$isInBattle.'"}}';
	echo $response;
}
else
{
	$response = '{"status": "error", "data": {"message": "ROW_IS_NOT_EXIST", "battle_id": "'.$_POST["battle_id"].'" }}';
	echo $response;
}


