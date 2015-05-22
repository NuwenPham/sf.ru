<?php
require_once "../../PH.php";
require_once "../../../configuration.php";
require_once "../../Starfight.php";
$starfight = new Starfight();
$cfg = new Config();	
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);

ignore_user_abort(false);
set_time_limit(0);


$timeout = $_GET["timeout"];
$battle_id = $_GET["battle_id"];

$start_time = time();
$step_timeout = 40;

while( time() - $start_time  < $timeout )
{	
	// <DEMON>
	//===========
		
	//$sql->updateField("counter", "count", time() - $start_time, "id=1");	
	
	$sql->updateField("battles", "countdown", $step_timeout - (time() - $start_time), "id=" . $battle_id);
	
	
	//===========
	// </DEMON>
	sleep(1); // Пауза - 1 секунда
}
// <TIMEOUT>
//===========	


// Если в бою 1 человек - тогда, завешить бой. - удалить таблицу
// Проверить сколько людей в бою.
// removeRowExt($table, $where)

$players = $sql->selectTableWhere("characters_in_battle", "battle_id=" . $battle_id);
if(count($players) == 0)//1
{
	// End fight
	$sql->removeRowExt("battles", "id=" . $battle_id);
		
	$b = 1;
	$out = "";
	while($b <= count($players))
	{
		$sql->removeRowExt("characters_in_battle", "id=" . $players[$b]["id"]);
		
		// Обновляю перснажа, указываю, что он не в бою.
		$sql->updateField("character", "is_in_battle", "0", "id=" . $players[$b]["player_id"]);
		
		$b++;
	}
}
else if(count($players) > 0)//1
{
	$sql->updateField("battles", "status", 1, "id=" . $battle_id);
	
	// старт боя
	$starfight->Timer("php/background_processes/battle/battle.php", 1, "battle_id=" . $battle_id);
}	

//===========
// </TIMEOUT>

$sql->Disconnect($cfg->db_name);