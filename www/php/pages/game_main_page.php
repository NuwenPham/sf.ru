<script src="scripts/engine/pixi.js"></script>
<script src="scripts/engine/baseClass.js"></script>
<script src="scripts/engine/starfight/Vector2.js"></script>
<script src="scripts/engine/starfight/Size.js"></script>
<script src="scripts/engine/starfight/Hexagon.js"></script>
<script src="scripts/engine/starfight/HexagonAction.js"></script>
<script src="scripts/engine/starfight/Ship.js"></script>
<script src="scripts/engine/starfight/QueueOrder.js"></script>
<script src="scripts/engine/api.js"></script>
<script src="scripts/engine/starfight.js"></script>
<script src="scripts/timer.js"></script>
<script src="scripts/main_page.js"></script>
<link href="styles/mainpage.css" rel="stylesheet" />

<div id="layout" align="center" >

	<div align="left">
    
        <div class="hide_items">
            <div class="battle_settings" align="center">
            
            	<div style="height:30px;" align="right">
                	<div class="button_close" onclick="CloseBattleSetupMenu()"></div>
                </div>
                
                <div style="height:20px;">
                    <select id="droplist" required>
                        <option value="0">Случайный</option>
                        <option value="1">Командный</option>
                        <option value="2">Детматч</option>
                    </select>
                </div>
                
                <div style="height:20px;">
                	<div class="create_button">Создать</div>
                </div>
                
            </div> 
        </div>   
         
    </div>
    	
        
    <div id="container">
    
    	<div id="menu" align="left">
        	<ul class="mp_menu">
            	<li>В ожидании</li>
            	<li>В бою</li>
            </ul>
        </div>
        
        <div id="content">
        	<div class="cnt_header" align="left">
            	<div class="game_button" onclick="OpenBattleSetupMenu()">Создать бой</div>
            </div>
            
            <div align="left" id="gmp_battle_lobbys">
            	<div class="gmp_battle_lobby_table">
                	<div style="width:30px;" align="center"><div style="height:11px;"></div>#</div>
                    <div style="width:500px;"><div style="height:11px;"></div>Игроки</div>
                </div>
                <div id="gmp_blt_content">
                

                </div>
                
            </div>  
        
        </div>
        
    </div>
    
</div>



