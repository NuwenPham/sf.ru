<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>STAR FIGHT from Pham Nuwen</title>
    <script src="scripts/jquery.js" type="text/javascript"></script>	
    <script src="scripts/jquery.cookie.js" type="text/javascript" ></script>
    <script src="scripts/script.js" type="text/javascript"></script>
	<script src="//vk.com/js/api/openapi.js" type="text/javascript"></script>
    <script src="scripts/VK_registration.js" type="text/javascript"></script>

    <link href="styles/style.css" rel="stylesheet" />
    <link href="styles/startpage.css" rel="stylesheet" />
    
</head>

<body>
	<div class="workspace" align="center">
		<?php

			require_once "php/PH.php";
			require_once "configuration.php";
			$cfg = new Config();	
			$sql = new PH();
		
            require_once "router.php";						
            $nav = new Router();
			
			$sql->Connect($cfg->db_host, $cfg->db_name, $cfg->db_password, $cfg->db_user);			
			$isInBattle = $sql->selectSingleFieldWhereExtended( "character", "is_in_battle", "vk_id=" . $_COOKIE['vk-id'] ); 
			$battle_status = 0;
			if($isInBattle == 1 )
			{
				$battle_id = $sql->selectSingleFieldWhereExtended( "character", "battle_id", "vk_id=" . $_COOKIE['vk-id'] ); 
				$battle_status = $sql->selectSingleFieldWhereExtended( "battles", "status", "id=" . $battle_id ); 
			}
			$sql->Disconnect($cfg->db_name);
			
			if( $battle_status == 1 )
				$nav->Route("battle_page");
			else
			{            
				$ParsedURL = $nav->ParseUrl($_SERVER['REQUEST_URI']);	
				
				if($ParsedURL->Error_ID == 1000)
					$nav->Route("reg_page");
				else					
					$nav->Route($ParsedURL->Page);
			}
        ?>       
    </div>
</body>
</html>
