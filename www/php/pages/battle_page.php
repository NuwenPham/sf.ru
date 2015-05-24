<script src="scripts/engine/pixi.js"></script>
<script src="scripts/engine/baseClass.js"></script>
<script src="scripts/engine/starfight/SFCanvas.js"></script>
<script src="scripts/engine/starfight/Vector2.js"></script>
<script src="scripts/engine/starfight/Size.js"></script>
<script src="scripts/engine/starfight/Hexagon.js"></script>
<script src="scripts/engine/starfight/HexagonAction.js"></script>
<script src="scripts/engine/starfight/BattleField.js"></script>
<script src="scripts/engine/starfight/Ship.js"></script>
<script src="scripts/engine/starfight/QueueOrder.js"></script>
<script src="scripts/engine/starfight/BattleMenu.js"></script>
<script src="scripts/engine/starfight/Battle.js"></script>
<script src="scripts/engine/api.js"></script>
<script src="scripts/engine/starfight.js"></script>


<script src="scripts/timer.js"></script>
<script src="scripts/battle_page.js"></script>
<link href="styles/fight.css" rel="stylesheet" />

<div class="battle_header" style="position:fixed; width:100%; height:50px; background:rgba(255,255,255,0.8); z-index:20;" align="center" >
	<div>
    	<div class="bh_elements bh_doneorder_timer">00:00</div>
    	<div id="bh_doneorder_btn" class="bh_elements bh_doneorder_button" onclick="DoneOrder();">Done order</div>
    </div>
</div>

<div id="content">
	<div id="hide_navigation_bar">
    	<div class="b_hnb_background"></div>
    </div>
    <div id="fight" align="left"></div>
   <!-- <div style="width:200px; height:200px; background:rgba(0,0,0,0.3); position:relative; top:-400px; left:-200px;"></div>-->
</div>

