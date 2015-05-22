<?php
require_once "PH.php";
require_once "../configuration.php";
require_once "Starfight.php";

//== 
$starfight = new Starfight();
$cfg = new Config();	
$sql = new PH();
$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);




$time_after = $_POST["time_after"];

$where = "created_time>0";
if( $time_after != null )
	if( $time_after != "" )
		$where = "created_time>" . $time_after;


$table = $sql->selectTableOrderLimitWhere("battles", "DESC", "created_time", 0, 10000, $where);


$vk_id = $_COOKIE["vk-id"];
$isInBattle = $sql->selectSingleFieldWhereExtended( "character", "is_in_battle", "vk_id=" . $vk_id );

$js_script = "var battle_cd_timers = [";
$js_script2 = "var last_created_battle_time = 0;";

$a = 1;
while($a <= count($table) )
{					
	// TO DO:
	// owner name	
	
	if( $table[$a]["status"] != 0 )
		continue;
	
	if( $a == 1 )
		$js_script2 = "var last_created_battle_time = " . $table[$a]["created_time"] . ";";
		
	
	$players = $sql->selectTableWhere("characters_in_battle", "battle_id=" . $table[$a]["id"]);
	
	$b = 1;
	$out = "";
	while($b <= count($players))
	{
		$out .= $sql->selectSingleFieldWhereExtended( "character", "name", "id=" . $players[$b]["player_id"] ) . ","; 
		$b++;
	}
	

	
	
	?><div class="gmp_battle_lobby_table" id="gmp_tbl_<?php echo $table[$a]["id"]; ?>"><?php
		?><div style="width:30px;" align="center"><div style="height:11px;"></div><?php echo $a; ?></div><?php
		?><div style="width:500px;"><?php echo $out; ?></div><?php
		
		?><input type="button" value="Join" style="width:80px; height:40px; 
			
			<?php if( $isInBattle == 0 ) {?>
			 " onclick="JoinToBattleLobby(<?php echo $table[$a]["id"]; ?>)" 
			<?php } else {?>
				opacity:0.5" disabled="disabled"
			<? } ?>
		 /><?php
		 ?><div class="gmp_cd_timer" ><div style="display:block; height:11px;"></div><div id="table_<?php echo $table[$a]["id"]; ?>" ></div></div><?php
	?></div><?php
	
	//timer, battle_id
	
	$sign = ",";
	if( count($table) == $a )
		$sign = "";
		
	$js_script .= "{ created_at : ".$table[$a]["created_time"].", battle_id : " . $table[$a]["id"] . ", countdown : " . $table[$a]["countdown"] . "}" . $sign;
	
	
	
	$a++;
}

$js_script .= "]";
?> <script> <?php
echo $js_script;
echo "\n" . $js_script2;
?> </script>
