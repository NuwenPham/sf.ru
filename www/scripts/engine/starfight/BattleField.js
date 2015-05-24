/**
 * Created by Pham on 17.05.2015.
 */
function BattleField(){

    this.SFCanvas = null;
    this.Hexes = [];
    this.HexesCount = 0;
    this.Ships = [];
    this.ShipsCount = 0;
    this.HexActionsCount = 0;
    this._isVisibleCoords = true;
    this._hexesCoords = [];
    this._battleFeildSize = { horizontal: 20, vertical: 8 };
    this.Textures = {
        Default: "/image/hex_not_selected.png"
    };

    this.Init = function (_options){
        this._initSFCanvas(_options);
        this._initBattleField(_options);
    };

    this._initSFCanvas = function (_options){
        var lSFCanvas;
        lSFCanvas = new SFCanvas();
        lSFCanvas.PIXICreate({
            width: _options.width ? _options.width : 1000,
            height: _options.height ? _options.height : 400
        });
        lSFCanvas.Start();
        lSFCanvas.appendTo("fight");
        this.SFCanvas = lSFCanvas;
    };

    this._initBattleField = function (_options){
        var lSideLeftRight, lSideTopBottom, lSideVertical, lPadding, lOffsetX, lOffsetY, lCurPosX, lCurPosY;

        lSideLeftRight = 12;
        lSideTopBottom = 30;
        lSideVertical = 20;
        lPadding = 4;
        lOffsetX = 30;
        lOffsetY = 40;
        lCurPosX = 0;
        lCurPosY = 0;

        var a = 0, b = 0;
        while (a < 20) {
            b = 0;
            while (b < 8) {
                if((a == 0 && b == 7) || (a == 19 && b == 0)) {

                } else {
                    lCurPosX = a * ((lSideLeftRight * 2) + lSideTopBottom + lPadding - lSideLeftRight) + lOffsetX;
                    lCurPosY = b * ((lSideVertical * 2) + lPadding ) + lOffsetY + (a % 2 == 1 ? -(lSideVertical + (lPadding / 2)) : 0);

                    this.AddHex({
                        x: lCurPosX,
                        y: lCurPosY,
                        name: "cell_" + (a * 10 + b),
                        click: _options.onClick ? _options.onClick : undefined,
                        coordinates: {
                            x: a,
                            y: b
                        }
                    });
                }
                b++;
            }
            a++;
        }
    };

    this.isShipByPlayerId = function( _playerId ){
        var a = 0;
        while( a < this.Ships.length)
            if( this.Ships[a++].player_id == _playerId )
                return true;

        return false;
    };

    this.getShipIdFromPlayerId = function (_player_id) {
        var a = 0;
        while (a < this.Ships.length) {
            if (this.Ships[a].player_id == _player_id)
                return a;
            a++;
        }
    };

    this.LightingArea = function (coords, radius, path) {
        var lHexes = this.FindAroundCells(coords, radius);
        var lTexture = PIXI.Texture.fromImage(path);
        var a = 0;
        while (a < lHexes.length) {

            lHexes[a].graphics.Sprite.setTexture(lTexture);
            lHexes[a].iscanselect = true;
            a++;
        }
    };

    this.ClearLighting = function(){
        var a = 0;
        while (a < this.Hexes.length) {
            var texture = PIXI.Texture.fromImage(this.Textures.Default);
            this.Hexes[a].graphics.Sprite.setTexture(texture);
            this.Hexes[a].iscanselect = false;
            a++;
        }
    };

    this.Coords2HexId = function (_crd_x, _crd_y){
        if(_crd_x >= this._battleFeildSize.horizontal || _crd_x < 0)
            return;
        if(_crd_y >= this._battleFeildSize.vertical || _crd_y < 0)
            return;
        var a = 0;
        while (a < this.Hexes.length) {
            if(this._isVisibleCoords)
                if(this.Hexes[a].coordinates.x == _crd_x && this.Hexes[a].coordinates.y == _crd_y)
                    return a;

            a++;
        }
        return null;
    };

    this.CornerPointOfHexagoneLocation = function (_x, _y, _radius, _direction_x, _direction_y){
        var a = 0;
        var lCurShift = (_x % 2 == 0 ? 1 : 0);
        if(_direction_y > 0) lCurShift = _x % 2;
        while (a < _radius) {
            _x += _direction_x;
            if(lCurShift == 0) {
                _y += _direction_y;
                lCurShift = 2;
            }
            lCurShift--;
            a++;
        }
        return {
            x: _x,
            y: _y
        }
    };

    this.FindAroundCells = function (_coords, _radius) {
        var a = 0;
        var lCells = [];
        var lCornerHexCoords, lTopHexCoords, lVerticalSize;

        lCornerHexCoords = this.CornerPointOfHexagoneLocation(_coords.x, _coords.y, _radius, -1, -1);
        lTopHexCoords = lCornerHexCoords;
        lVerticalSize = _radius + 1;
        a = 0;
        while (a < _radius * 2 + 1) {
            if (a > 0)
                if (a < _radius + 1)
                    lTopHexCoords = this.CornerPointOfHexagoneLocation(lTopHexCoords.x, lTopHexCoords.y, 1, 1, -1);
                else
                    lTopHexCoords = this.CornerPointOfHexagoneLocation(lTopHexCoords.x, lTopHexCoords.y, 1, 1, 1);

            var id = this.Coords2HexId(lTopHexCoords.x, lTopHexCoords.y);
            if (id != undefined && id != null)
                lCells.push(this.Hexes[id]);

            // Выборка гексов по вертикали, от угла крайнего верхнего, будет равна радиусу+1
            var b = 1;
            while (b < lVerticalSize) {
                id = this.Coords2HexId(lTopHexCoords.x, lTopHexCoords.y + b);
                if (id != undefined && id != null)
                    lCells.push(this.Hexes[id]);
                b++;
            }
            if (a < _radius)
                lVerticalSize++;
            else
                lVerticalSize--;
            a++;
        }

        return lCells;
    };

    this.Distance = function(_hex1, _hex2){
        var lPreradius = _hex2.x - _hex1.x;
        var lVectorX = (lPreradius > 0 ? 1 : -1);
        var lCa, lCb;
        var lDist;

        if (lPreradius != 0) {
            // Углы
            lCa = this.CornerPointOfHexagoneLocation(_hex1.x, _hex1.y, Math.abs(lPreradius), lVectorX, -1);
            lCb = this.CornerPointOfHexagoneLocation(_hex1.x, _hex1.y, Math.abs(lPreradius), lVectorX, 1);

            if (_hex2.y >= lCa.y && _hex2.y <= lCb.y) // Между углами
                lDist = Math.abs(_hex2.x - _hex1.x);

            if (_hex2.y < lCa.y) // Выше угла
                lDist = Math.abs(lCa.y - _hex2.y) + Math.abs(_hex2.x - _hex1.x);

            if (_hex2.y > lCb.y) // Ниже угла
                lDist = Math.abs(lCb.y - _hex2.y) + Math.abs(_hex2.x - _hex1.x);
        }
        else // Если b.x - a.x == 0
            lDist = Math.abs(_hex1.y - _hex2.y);

        return lDist;
    };

    this.MoveShip = function (player_id, to_coord_x, to_coord_y){
        var that = this;
        var Ship_id = this.getShipIdFromPlayerId(player_id);
        var position = this.getPosByCoords(to_coord_x, to_coord_y);

        var from_x = this.Ships[Ship_id].Sprite.position.x;
        var from_y = this.Ships[Ship_id].Sprite.position.y;
        var dist_x = position.x - this.Ships[Ship_id].Sprite.position.x;
        var dist_y = position.y - this.Ships[Ship_id].Sprite.position.y;

        Starfight._def_move({
            duration: 600,
            onIteration: function (progress, o){
                that.Ships[Ship_id].Sprite.position.x = from_x + (progress * dist_x);
                that.Ships[Ship_id].Sprite.position.y = from_y + (progress * dist_y) - 10;
            }
        });
    };

    this.AddShip = function ( _params ) {
        var lShip, lTexture, lSprite;

        _params.image = _params.image ? _params.image : null;
        _params.coords = _params.coords ? _params.coords : {x:0,y:0};
        _params.position = _params.position ? _params.position : {x:0,y:0};
        _params.player_id = _params.player_id ? _params.player_id : null;

        lShip = new Ship();
        lShip.image = _params.image;
        lShip.coordinates = _params.coords;
        lShip.positions = _params.position;
        lShip.player_id = _params.player_id;

        lTexture = PIXI.Texture.fromImage(_params.image);
        lSprite = new PIXI.Sprite(lTexture);
        lShip.Sprite = lSprite;

        lSprite.position.x = _params.position.x;
        lSprite.position.y = _params.position.y;

        this.SFCanvas.addChild(lSprite);
        this.Ships.push(lShip);
        this.ShipsCount = Math.abs(this.ShipsCount);
        this.ShipsCount++;
    };

    this.AddHex = function (_options){
        var that = this;
        var lGraphics, lSideLeftRight, lSideTopBottom, lSideVertical, lPath, lTexture, lSprite, lHexCoords, lHexShotsCoords, lHex;

        _options.click = _options.click ? _options.click : null;
        _options.coordinates = _options.coordinates ? _options.coordinates : {
            x: 0,
            y: 0
        };
        _options.name = _options.name ? _options.name : "";
        _options.gunParams = _options.gunParams ? _options.gunParams : null;
        _options.x = _options.x ? _options.x : 0;
        _options.y = _options.y ? _options.y : 0;
        _options.isShowcoords = _options.isShowcoords != undefined ? _options.isShowcoords : true;

        lGraphics = new PIXI.Graphics();
        lGraphics.interactive = true;
        lGraphics.beginFill(0xFFFFFF, 0.1);

        // set the line style to have a width 5 and set the color to red
        lGraphics.lineStyle(2, 0xFFFFFF, 0.9);

        // draw path of polygon
        lSideLeftRight = 13;
        lSideTopBottom = 30;
        lSideVertical = 20;
        lPath = [_options.x + lSideLeftRight + 1, _options.y,
            _options.x + lSideLeftRight + lSideTopBottom, _options.y,
            _options.x + lSideLeftRight + lSideTopBottom + lSideLeftRight, _options.y + lSideVertical,
            _options.x + lSideLeftRight + lSideTopBottom, _options.y + lSideVertical + lSideVertical,
            _options.x + lSideLeftRight + 1, _options.y + lSideVertical + lSideVertical,
            _options.x + 1, _options.y + lSideVertical];

        lTexture = PIXI.Texture.fromImage("/image/hex_not_selected.png");
        lSprite = new PIXI.Sprite(lTexture);

        lGraphics.Sprite = lSprite;
        lSprite.position.x = _options.x;
        lSprite.position.y = _options.y - 1;
        lGraphics.hitArea = new PIXI.Polygon(lPath);

        lGraphics.mouseover = function (){
            if(lHex.iscanselect) {

                var container = that.SFCanvas.PIXICanvas.view;
                container.style.cursor = "pointer";

                lHex.graphics.clear();
                lHex.graphics.beginFill(lHex.fillHover.color, lHex.fillHover.opacity);
                lHex.graphics.lineStyle(2, 0xFFFFFF);
                lHex.graphics.drawPolygon(lHex.verticles);
                lHex.graphics.endFill();

                // Adding other actions
                if(lHex.actions.length != 0) {
                    var a = 0;
                    while (a < lHex.actions.length) {
                        if(lHex.actions[a].type == "onOver")
                            if(lHex.actions[a].isactive == true)
                                lHex.actions[a].func(lHex, a, lHex.actions[a].object); // возвращаем ячейку и айди действия
                        a++;
                    }
                }
            }
        };
        lGraphics.mouseout = function (){
            if(lHex.iscanselect) {
                var container = that.SFCanvas.PIXICanvas.view;
                container.style.cursor = "default";
                lHex.graphics.clear();
            }
        };
        lGraphics.endFill();
        lGraphics.click = function (){
            if(_options.click != null) _options.click(lHex);
        };
        lHexCoords = null;

        if(this._isVisibleCoords && _options.isShowcoords) {
            lHexCoords = new PIXI.Text(_options.coordinates.x + ":" + _options.coordinates.y, {
                font: "12px Arial",
                fill: "rgba(255,255,255,0.8)",
                align: "center"
            });
            lHexCoords.x = _options.x + 19 - (_options.coordinates.x > 9 ? 4 : 0);
            lHexCoords.y = _options.y + 12;
        }
        lHexShotsCoords = null;
        if(_options.gunParams != null) {
            lHexShotsCoords = new PIXI.Text(_options.gunParams[2], {
                font: "10px Arial",
                fill: "rgba(255,255,255,1)",
                align: "center"
            });
            lHexShotsCoords.x = _options.x + 14 - (_options.coordinates.x > 9 ? 0 : 0);
            lHexShotsCoords.y = _options.y + 2;
        }

        // Params of drawing polygon
        lHex = new Hexagon();
        lHex.fill = {
            color: 0xFFFFFF,
            opacity: 0.1
        };
        lHex.fillHover = {
            color: 0xFFFFFF,
            opacity: 0.3
        };
        lHex.verticles = lPath;
        lHex.graphics = lGraphics;
        lHex.positions = {
            x: _options.x,
            y: _options.y
        };
        lHex.coordinates = _options.coordinates;
        lHex.name = _options.name + "_" + this.HexesCount;
        lHex.id = this.HexesCount;
        lHex.drawedText_coords = lHexCoords;
        lHex.drawedText_shots = lHexShotsCoords;
        lHex.isShowcoords = _options.isShowcoords;
        lHex.gun_type = _options.gunParams != null ? _options.gunParams[0] : "null";
        lHex.gun_id = _options.gunParams != null ? _options.gunParams[1] : "null";

        // Добавляем текстуру спрайта
        this.SFCanvas.addChild(lSprite);

        // Добавляем текстовые координаты
        if(this._isVisibleCoords && _options.isShowcoords) {
            this.SFCanvas.addChild(lHexCoords);
            this._hexesCoords.push({
                hexCoord: lHexCoords,
                hex_id: this.HexesCount
            });
        }

        if(_options.gunParams != null) {
            this.SFCanvas.addChild(lHexShotsCoords);
        }

        // Отрисовываем нашу графику.
        this.SFCanvas.addChild(lGraphics);

        // Записываем ячейку в стек ячеек
        this.Hexes.push(lHex);
        this.HexesCount = Math.abs(this.HexesCount);
        this.HexesCount++;

        return lHex;
    };

    this.AddHexActions = function (_hex_id, _action_type, _func, _object) {
        var lAction, lHexId;

        lAction = new HexagonActions();
        lAction.type = _action_type;
        lAction.func = _func;
        lAction.isactive = true;
        lAction.id = this.HexActionsCount;
        lAction.object = _object;
        this.HexActionsCount++;

        lHexId = this.getHexRealId(_hex_id);
        this.Hexes[lHexId].actions.push(lAction);
    };

    this.HexTexture = function (_hex_id, _path) {
        var lTexture = PIXI.Texture.fromImage(_path);
        var lRealId = this.getHexRealId(_hex_id);
        this.Hexes[lRealId].graphics.Sprite.setTexture(lTexture);
    };

    this.HexActive = function (_hex_id, _is_active) {
        var lRealId = this.getHexRealId(_hex_id);
        this.Hexes[lRealId].iscanselect = _is_active;
    };

    this.RemoveHex = function (_hex_id){
        var lRealHexId = this.getHexRealId(_hex_id);

        this.SFCanvas.removeChild(this.Hexes[lRealHexId].graphics.Sprite);
        this.SFCanvas.removeChild(this.Hexes[lRealHexId].graphics);
        this.SFCanvas.removeChild(this.Hexes[lRealHexId].drawedText_coords);
        this.SFCanvas.removeChild(this.Hexes[lRealHexId].drawedText_shots);

        var lTextCoordId = this.getTextHexCoordIdByHexId(lRealHexId);
        if(lTextCoordId != undefined) {
            delete this._hexesCoords[lTextCoordId].hex_id;
            delete this._hexesCoords[lTextCoordId].hexCoord;
            this._hexesCoords.splice(lTextCoordId, 1);
        }

        this.Hexes.splice(lRealHexId, 1);
    };

    this.getHexRealId = function (_hex_id){
        var a = 0;
        while (a < this.Hexes.length) {
            if(this.Hexes[a].id == _hex_id)
                return a;

            a++;
        }
    };

    this.getTextHexCoordIdByHexId = function(_hex_real_id){
        var a = 0;
        while (a < this._hexesCoords.length) {
            if(this._hexesCoords[a].hex_id == _hex_real_id)
                return a;
            a++;
        }
    };

    // Возвращает позицию координат
    this.getPosByCoords = function (crdX, crdY){
        var a = 0;
        while (a < this.Hexes.length) {
            if(this.Hexes[a].isShowcoords == true)
                if(this.Hexes[a].coordinates.x == crdX && this.Hexes[a].coordinates.y == crdY)
                    return this.Hexes[a].positions;

            a++;
        }
    };

    this.VisibleCoords = function(_isVisible){
        var a = 0;

        if(_isVisible != undefined) {
            if(_isVisible != this._isVisibleCoords)
                this._isVisibleCoords = _isVisible;
            else
                return;

            while (a < this._hexesCoords.length)
                this._hexesCoords[a++].hexCoord.visible = _isVisible;
        }
    };
}
BattleField.prototype = new baseClass();