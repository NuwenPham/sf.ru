<?php 
require_once "PH.php";
require_once "../configuration.php";
require_once "Starfight.php";
$starfight = new Starfight();
$cfg = new Config();
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);


$pid = $_COOKIE["pid"];
$bid = $_POST["battle_id"];

print_r($_POST);

// Here we get all orders
if( $_POST != null ) // Проверка наличия содержимого
	if( $_POST["vals"] != null ) //Проверка наличия объектов массива
		if( count($_POST["vals"]) > 0 ) //Проверяем точно ли это массив
		{
			$a = 0;
			while( $a < count($_POST["vals"]) ) // Прогоняем содержимое массива по циклу
			{
				// Ну и добавляем шаг. Эврика!
				if( $_POST["vals"][$a]["gun"] == "step" )
					AddBattleOrder($bid, $pid, "0", $_POST["vals"][$a]["targetcoords"]["x"], $_POST["vals"][$a]["targetcoords"]["y"], "0");
					
				$a++;
			}			
		}
			
			
// Добавляет новый приказ в текущий бой до расчета хода, который будет учтен при расчете хода
// Айди бой
// Айди игрока (Уникальный)
// Тип приказа: 0 - ход, 1 - орудия
// Координата поля по Х
// Координата поля по Y
// Айди орудия. ( Для хода айди "-1" )
function AddBattleOrder($battle_id, $player_id, $type, $tpos_x, $tpos_y, $gun_id)
{
	$starfight = new Starfight();
	$cfg = new Config();
	$sql = new PH();
	$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);
	
	$order = new sql_table_struct_Battle_queue_orders();
	$order->battle_id = $battle_id;
	$order->player_id = $player_id;
	$order->type = $type; 
	$order->target_pos_x = $tpos_x;
	$order->target_pos_y = $tpos_y; 
	$order->gun_id = $gun_id; // id хода - "-1".

	$sql->insertRowExt("battle_queue_orders", $order);	
}