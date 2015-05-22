/**
 * Created by Pham on 09.05.2015.
 */
function Size( _width , _height, _depth ){
    this.width = _width != undefined ? _width : 0;
    this.height = _height != undefined ? _height : 0;
    this.depth = _depth != undefined ? _depth : 0;
}
Size.prototype = new baseClass();