/**
 * Created by Pham on 09.05.2015.
 */
function Ship( ){
    this.image = "";
    this.positions = new Vector2(0, 0);
    this.coordinates = new Vector2(0, 0);
    this.player_id = null;
    this.Sprite = "";
}
Ship.prototype = new baseClass();