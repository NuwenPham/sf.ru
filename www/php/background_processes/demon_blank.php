<?php
require_once "PH.php";
require_once "../configuration.php";
require_once "Timer.php";
$cfg = new Config();	
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);

$a = 0;
ignore_user_abort(false);
set_time_limit(0);
while($a<10)
{	
	// <DEMON>
	//===========
	
	
	
	//===========
	// </DEMON>
	sleep(1); // Пауза - 1 секунда
	$a++;
}

$sql->Disconnect($cfg->db_name);