<?php
//==
 

class BattleOrdersProcessing 
{

	function Start($battle_id)
	{
		$starfight = new Starfight();
		$cfg = new Config();	
		$sql = new PH(); 	
		 
		// Загрузить список приказов по бою
		$orders = $sql->selectTableWhere("battle_queue_orders", "battle_id=" . $battle_id);
		
		$sql->updateField("dbg", "data", '"' . print_r($orders, true) . '"', "id=0" ); 

		if( $orders != "error_empty_table" )
			if( count( $orders ) > 0 )
			{
				$a = 1; // Прогоняем каждый приказ по всем условиям. 
				while( $a <= count( $orders ) )
				{
					// Выполнить действие приказа
					// Удалить приказ
					
					//$sql->updateField("counter", "count", "875", "id=1");
					
					
//					if( $orders[$a]["gun_id"] == "0" ) 
//					{
//						//$self->Moving( $order["player_id"], $order["target_pos_x"], $order["target_pos_y"] );
//						$sql->updateField("characters_in_battle", "pos_x", $orders[$a]["target_pos_x"], "player_id=" . $orders[$a]["player_id"] ); 
//						$sql->updateField("characters_in_battle", "pos_y", $orders[$a]["target_pos_y"], "player_id=" . $orders[$a]["player_id"] ); 
//					}
					
					$this->ProcessOrder( $orders[$a] );
					
					//$sql->removeRowExt("battle_queue_orders", "id=" . $orders[$a]["id"]);
					$a++;
				}
				
			}
	
	}
	
	public function ProcessOrder( $order )
	{
		$starfight = new Starfight();
		$cfg = new Config();	
		$sql = new PH(); 
		
		$sql->updateField("counter", "count", $order["gun_id"], "id=1");
		// This is step.
		
		if( $order["gun_id"] == "0" ) 
		{
			$this->Moving( $order["player_id"], $order["target_pos_x"], $order["target_pos_y"] );			
		}
		
		// Remove complited order
		$sql->removeRowExt("battle_queue_orders", "id=" . $order["id"]);
	}
	
	public function Moving( $player_real_id, $coord_x, $coord_y )
	{
		$starfight = new Starfight();
		$cfg = new Config();	
		$sql = new PH(); 
		
		// Update player
		$sql->updateField("characters_in_battle", "pos_x", $coord_x, "player_id=" . $player_real_id ); 
		$sql->updateField("characters_in_battle", "pos_y", $coord_y, "player_id=" . $player_real_id ); 
	}
}
