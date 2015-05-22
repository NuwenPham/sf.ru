<?php
// Дальше проверить есть ли такая запись в базе данных.
// Если нет - то добавить.
// Если есть - то вернуть значение, что уже есть. И тогда просто авторизует.
// После этого появится кнопка входа в игру.

require_once "PH.php";
require_once "../configuration.php";
require_once "Starfight.php";
$starfight = new Starfight();
$cfg = new Config();	
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);

$vk_id = $_POST["vk_id"];
$battle_id = $_POST["battle_id"];

// 1) Указать, что игрок в бою, и что еще раз создавать ему запрещено.
// 2) Создать таблицу нового боя.
// 3) Добавить создавшего игрока в таблицу игроков, которые в бою. 
// 4) Указать, что этот игок создал бой и является модератором.

// 5) Создать задачу, по истечению которой, будет запущен или завершен бой. 
//	  - Запущен он если в команде больше 1 человека.

// 6) Запустить задачу, которая по истечении указанного времени закончит время лобби



//1) Getting player status
$isInBattle = $sql->selectSingleFieldWhereExtended( "character", "is_in_battle", "vk_id=" . $vk_id ); 

// If field is empty or 0, then create new row in table of fight
if( $isInBattle == "" ||$isInBattle == 0 )
{				
	// Получаю глобальный айди персонажа
	$global_player_id = $sql->selectSingleFieldWhereExtended( "character", "id", "vk_id=" . $vk_id ); 	
	
	// Add player to battle
	$sts_char_battle = new sql_table_struct_Characters_in_battle();
	$sts_char_battle->battle_id = $battle_id;
	$sts_char_battle->player_id = $global_player_id;
	$sts_char_battle->health = 10; 
	$sts_char_battle->sheild = 10;
	$sts_char_battle->is_owner = 0; // 0 - is not owner, 1 - is owner
	$sts_char_battle->team_number = 0; // 0 - first team, 1 - second team	
	$sql->insertRowExt("characters_in_battle", $sts_char_battle);		
	
	// Обновляю перснажа, указываю, что он в бою.
	$sql->updateField("character", "is_in_battle", "1", "vk_id=" . $vk_id);
	
	// Обновляю перснажа, указываю, в каком он бою. Если 0 - то он не в бою
	$sql->updateField("character", "battle_id", $battle_id, "vk_id=" . $vk_id);	
}




