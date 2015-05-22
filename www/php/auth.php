<?php
// Дальше проверить есть ли такая запись в базе данных.
// Если нет - то добавить.
// Если есть - то вернуть значение, что уже есть. И тогда просто авторизует.
// После этого появится кнопка входа в игру.

require_once "PH.php";
require_once "../configuration.php";
$cfg = new Config();	
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);

$vk_id = $_POST["vk_id"];

if(IsExistedRow("character", "vk_id", $vk_id))
{
	$pid = $sql->selectSingleFieldWhereExtended("character", "id", "vk_id=".$vk_id);
	echo "0//_/|Вы уже зарегестрированы!//_/|" . $pid;
}
else
{
	$player_id = CreateCharacter("character", $vk_id);
	echo "0//_/|Вы успешно авторизированы и зарегестрированы!//_/|" . $player_id;
}


function IsExistedRow($table, $field, $value)
{
	$sql = new PH();
	$result = $sql->selectSingleFieldWhereExtended($table, $field, $field."='".$value."'");
	
	if($result != "")
		return true;
	else
		return false;	
}


function CreateCharacter($table, $vk_id)
{
	$cfg = new Config();	
	$sql = new PH();
	$cols = "vk_id";	
	$vals = $vk_id;
	$sql->insertRow($table, $cols, $vals);
	$player_id = mysql_insert_id();
	return $player_id;
}

