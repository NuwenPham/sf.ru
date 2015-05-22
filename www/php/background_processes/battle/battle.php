<?php
require_once "../../PH.php";
require_once "../../../configuration.php";
require_once "../../Starfight.php";
require_once "../../battle_orders_processing.php";
$starfight = new Starfight();
$cfg = new Config();	
$sql = new PH(); 
$bop = new BattleOrdersProcessing();


$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);



ignore_user_abort(false);
set_time_limit(0);


$timeout = $_GET["timeout"];
$battle_id = $_GET["battle_id"];


$sql->updateField("counter", "count", $battle_id, "id=1");

// Разместить игроков на поле боя
$players = $sql->selectTableWhere("characters_in_battle", "battle_id=" . $battle_id);

// По очереди каждого игрока сортируем в команду
// И задаем координату
$a = 1;
$positions_setted;
while( $a <= count($players) )
{
	$team_number = ($a - 1) % 2;
	
	$sql->updateField("characters_in_battle", "team_number", $team_number, "id=" . $players[$a]["id"]);
	
	$pos_x = 0;
	$pos_y = 0;
	
	
	// Установка позиции корабля на поле боя
	while( true )
	{
		if( $team_number == 0 )
		{
			$pos_x = rand( 0, $cfg->btl_fieldsize_x / 2 );
			$pos_y = rand( 0, $cfg->btl_fieldsize_y );
		}
		else if( $team_number == 1 )
		{
			$pos_x = rand( $cfg->btl_fieldsize_x / 2, $cfg->btl_fieldsize_x );
			$pos_y = rand( 0, $cfg->btl_fieldsize_y );
		}
		
		$b = 0;
		$matches_count = 0;
		while( $b < count($positions_setted) )
		{
			if( $positions_setted[$b * 2] == $pos_x && $positions_setted[$b * 2 + 1] == $pos_y )
				$matches_count++;
				
			$b++;
		}
		
		if( $matches_count == 0 )
		{
			array_push($positions_setted, $pos_x);
			array_push($positions_setted, $pos_y);
			$sql->updateField("characters_in_battle", "pos_x", $pos_x, "id=" . $players[$a]["id"]);
			$sql->updateField("characters_in_battle", "pos_y", $pos_y, "id=" . $players[$a]["id"]);
			break;
		}
	}	
	
	$a++;
}

// Время одного хода
$step_timeout = 20;
$start_time = time();

while( true )
{	
	// <DEMON>
	//===========
	
	//==== Предохранитель
	$val = $sql->selectSingleFieldWhereExtended("info", "is_work_bg_processes", "id=0");
	if( $val == "0" || $val == 0)
		break;
	//==== /Предохранитель	
	
	
	
	// Высчитываем время когда начнется расчет хода
	if( time() - $start_time  > $step_timeout )
	{
		// Делаем расчет хода.
		$bop->Start( $battle_id );
	
		$step_timeout = 10;
		$start_time = time();
		
		$curstep = $sql->selectSingleFieldWhereExtended("battles", "current_step", "id=" . $battle_id);
		$sql->updateField("battles", "current_step", ($curstep + 1), "id=" . $battle_id);
		
	}
	
	$sql->updateField("battles", "countdown", $step_timeout - (time() - $start_time), "id=" . $battle_id);
	
	//===========
	// </DEMON>
	sleep(1); // Пауза - 1 секунда
}

$sql->Disconnect($cfg->db_name);