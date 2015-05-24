/**
 * Created by Pham on 09.05.2015.
 */

function Hexagon() {

    // DefaultParams
    this.fill = { color: "", opacity: "" }
    this.fillHover = { color: "", opacity: "" }
    this.verticles = [];
    this.graphics = "";
    this.positions = new Vector2(0, 0);
    this.coordinates = new Vector2(0, 0);
    this.mouseover = null;
    this.mouseout = null;
    this.drawedText_coords = null;
    this.drawedText_shots = null;
    this.name = "";
    this.ismouseover = false;
    this.iscanselect = false;
    this.isShowcoords = false;
    this.id = -1;
    this.gun_type = "null";
    this.gun_id = null;
    this.actions = [];
}
Hexagon.prototype = new baseClass();
