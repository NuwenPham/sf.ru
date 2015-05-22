/**
 * Created by Pham on 09.05.2015.
 */
function Vector2( _x , _y ){
    this.x = _x != undefined ? _x : 0;
    this.y = _y != undefined ? _y : 0;
}
Vector2.prototype = new baseClass();