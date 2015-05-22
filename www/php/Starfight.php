<?php
class Starfight 
{

	function SendAnswer($type, $status, $answer)
	{
		if( $type == 0 )
			echo $status . "//_/|" . $answer;
			
		flush();
	}

	function Timer($relative_path, $delay_seconds, $get)
	{
		$http = fsockopen('starfight.ru',80);
		fputs($http, "GET http://starfight.ru/".$relative_path."?timeout=" . $delay_seconds . "&" . $get . " HTTP/1.0\r\n");
		fputs($http, "Host: starfight.ru\r\n");
		fputs($http, "\r\n");
		fclose($http);
	}		
}


class sql_table_struct_Battle
{
	// statuses:
	//  0 - Lobby
	//  1 - Fight
	//  2 - Battle_ended
	public $status;
	public $current_step;
	public $created_time;
}

class sql_table_struct_Characters_in_battle
{
	public $battle_id;
	public $player_id;
	public $health;
	public $sheild;
	public $is_owner;
	public $team_number;
}

class sql_table_struct_Battle_queue_orders
{
	public $battle_id;
	public $player_id;
	public $type; // 0 - not gun, 1 - gun
	public $target_pos_x;
	public $target_pos_y;
	public $gun_id;
}


