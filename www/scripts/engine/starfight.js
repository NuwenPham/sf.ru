(function () {

    function Starfight() {

        // Starfight params
		this._battleFeildSize = { horizontal: 20, vertical: 8 }
        this._battleData = {
            your_guns: null,
            you: null
        };
        this.LastCreatedBattleMenu = null;
        this._canvasStage = "";
        this._canvasElemId = "";
        this._canvasWidth = "";
        this._canvasHeight = "";
        this._canvasRenderer = "";
		this.orderstatus = false; //  when false - you can click, when true - you can't click
		this.isstepped = false;
        this.QueueOrders = [];
        this.CellsCount = 0;
        this.Cells = [];
        this.Ships = [];
        this.CellActionsCounter = 0;
		this.Textures = {
            Default: "/image/hex_not_selected.png"
        };
        this.api = new api();

        // Created canvas 
        this.CreateCanvas = function (insertedElement, width, height) {

            this._canvasElemId = insertedElement;
            var renderer = new PIXI.CanvasRenderer(width, height, { transparent: true });
            document.getElementById(insertedElement).appendChild(renderer.view);
            var stage = new PIXI.Stage;
            this._canvasRenderer = renderer;
            this._canvasStage = stage;
        }

        // rendering stage
        this.Render = function () {
            this._canvasRenderer.render(this._canvasStage);
        }

        // x - x position
        // y - y position
        // id - name
        // coordinates - numbers of cells, formula - (coordinates.y * a + coorinates.y);
        // celltype - type of hex: true - is field cell. false - is not field cell
        this.AddCell = function (x, y, name, onclick, coordinates, celltype, gunParams) {

            var lGraphics, lSideLeftRight, lSideTopBottom, lSideVertical, lPath, lTexture, lSprite, lHexCoords, lHexShotsCoords, lHex;

            lGraphics = new PIXI.Graphics();
            lGraphics.interactive = true;
            lGraphics.beginFill(0xFFFFFF, 0.1);

            // set the line style to have a width of 5 and set the color to red
            lGraphics.lineStyle(2, 0xFFFFFF, 0.9);

            // draw path of polygon
            lSideLeftRight = 13;
            lSideTopBottom = 30;
            lSideVertical = 20;
            lPath = [x + lSideLeftRight + 1, y, x + lSideLeftRight + lSideTopBottom, y, x + lSideLeftRight + lSideTopBottom + lSideLeftRight, y + lSideVertical, x + lSideLeftRight + lSideTopBottom, y + lSideVertical + lSideVertical, x + lSideLeftRight + 1, y + lSideVertical + lSideVertical, x + 1, y + lSideVertical];

            lTexture = PIXI.Texture.fromImage("/image/hex_not_selected.png");
            lSprite = new PIXI.Sprite(lTexture);

            lGraphics.Sprite = lSprite;
            lSprite.position.x = x;
            lSprite.position.y = y - 1;
            lGraphics.hitArea = new PIXI.Polygon(lPath);

            lGraphics.mouseover = function (ev) {
                if (lHex.iscanselect) {

                    var container = document.getElementById(__Starfight._canvasElemId);
                    container.style.cursor = "pointer";

                    lHex.graphics.clear();
                    lHex.graphics.beginFill(lHex.fillHover.color, lHex.fillHover.opacity);
                    lHex.graphics.lineStyle(2, 0xFFFFFF);
                    lHex.graphics.drawPolygon(lHex.verticles);
                    lHex.graphics.endFill();
                    //__Starfight.Render();

                    // Adding other actions
                    if (lHex.actions.length != 0) {

                        var a = 0;
                        while (a < lHex.actions.length) {
                            if (lHex.actions[a].type == "onOver")
                                if (lHex.actions[a].isactive == true)
                                    lHex.actions[a].func(lHex, a, lHex.actions[a].object); // возвращаем ячейку и айди действия

                            a++;
                        }
                    }
                }
            }

            lGraphics.mouseout = function (ev) {
                if (lHex.iscanselect) {

                    var container = document.getElementById(__Starfight._canvasElemId);
                    container.style.cursor = "default";

                    lHex.graphics.clear();
                    //__Starfight.Render();
                }
            }

            lGraphics.endFill();

            lHexCoords = null;
            if (celltype) {
                lHexCoords = new PIXI.Text(coordinates.x + ":" + coordinates.y, { font: "12px Arial", fill: "rgba(255,255,255,0.8)", align: "center" });
                lHexCoords.x = x + 19 - (coordinates.x > 9 ? 4 : 0);
                lHexCoords.y = y + 12;
            }

            lHexShotsCoords = null;
            if (gunParams != null) {
                lHexShotsCoords = new PIXI.Text(gunParams[2], { font: "10px Arial", fill: "rgba(255,255,255,1)", align: "center" });
                lHexShotsCoords.x = x + 14 - (coordinates.x > 9 ? 0 : 0);
                lHexShotsCoords.y = y + 2;
            }

            // Params of drawing polygon
            lHex = new Hexagon();
            lHex.fill = { color: 0xFFFFFF, opacity: 0.1 }
            lHex.fillHover = { color: 0xFFFFFF, opacity: 0.3 }
            lHex.verticles = lPath;
            lHex.graphics = lGraphics;
            lHex.positions = { x: x, y: y }
            lHex.coordinates = coordinates;
            lHex.name = name + "_" + this.CellsCount;
            lHex.isfieldcell = celltype;
            lHex.id = this.CellsCount;
            lHex.drawedText_coords = lHexCoords;
            lHex.drawedText_shots = lHexShotsCoords;
            lHex.gun_type = gunParams != undefined ? gunParams[0] : "null";
            lHex.gun_id = gunParams != undefined ? gunParams[1] : "null";

            // Добавляем текстуру спрайта
            this._canvasStage.addChild(lSprite);

            // Добавляем текстовые координаты
            if (celltype)
                this._canvasStage.addChild(lHexCoords);

            if (gunParams != null)
                this._canvasStage.addChild(lHexShotsCoords);

            // Отрисовываем нашу графику.
            lGraphics.click = function () { if (onclick != null) onclick(lHex); }
            this._canvasStage.addChild(lGraphics);

            // Записываем ячейку в стек ячеек
            this.Cells.push(lHex);
            this.CellsCount = Math.abs(this.CellsCount);

            // Возвращаем айди созданной ячейки
            return this.CellsCount++;

        }

        this.AddCellActions = function (cell_id, actiontype, func, object) {
            var lAction, lHexId;

            lAction = new HexagonActions();
            lAction.type = actiontype;
            lAction.func = func;
            lAction.isactive = true;
            lAction.id = this.CellActionsCounter;
            lAction.object = object;
            this.CellActionsCounter++;

            lHexId = this.getCellById(cell_id);
            this.Cells[lHexId].actions.push(lAction);
        };

        this.RemoveCell = function (cell_id) {
            var lHexId = this.getCellById(cell_id);

            this._canvasStage.removeChild(this.Cells[lHexId].graphics.Sprite);
            this._canvasStage.removeChild(this.Cells[lHexId].graphics);
            this._canvasStage.removeChild(this.Cells[lHexId].drawedText_coords);
            this._canvasStage.removeChild(this.Cells[lHexId].drawedText_shots);

            this.Cells.splice(lHexId, 1);
        };

        this.getCellById = function (cell_id) {
            var a = 0;
            while (a < this.Cells.length) {
                if (this.Cells[a].id == cell_id)
                    return a;

                a++;
            }
        };

        this.AddShip = function (image, coords, posx, posy, player_id) {
            var lShip, lTexture, lSprite;

            lShip = new Ship();
            lShip.image = image;
            lShip.coordinates = coords;
            lShip.positions = { x: posx, y: posy };
            lShip.player_id = player_id;

            lTexture = PIXI.Texture.fromImage(image);
            lSprite = new PIXI.Sprite(lTexture);
            lShip.Sprite = lSprite;

            lSprite.position.x = posx;
            lSprite.position.y = posy;

            this._canvasStage.addChild(lSprite);
            this.Ships.push(lShip);
        };

        this.getShipByPlayerId = function( _playerId ){
            var a = 0;
            while( a < this.Ships.length)
                if( this.Ships[a++].player_id == _playerId )
                    return true;

            return false;
        };
		
		this.AddOrderToQueue = function (target, gun)
		{
			var neworder = new QueueOrder();
			neworder.gun = gun;
			neworder.targetcoords = target.coordinates;
			this.QueueOrders.push(neworder);			
		};
		
		this.ClearQueueOfOrders = function ()
		{
			__Starfight.QueueOrders = [];
		};
		

		



        // Назначает или заменяет текстуру
        // cell_id - айди ячейки
        // path - путь к картинке.
        this.Texture = function (cell_id, path) {
            var texture = PIXI.Texture.fromImage(path);
            var real_number = this.getCellById(cell_id);
            this.Cells[real_number].graphics.Sprite.setTexture(texture);
        };

        this.Active = function (cell_id, is_active) {
            var real_number = this.getCellById(cell_id);
            this.Cells[real_number].iscanselect = is_active;
        };

        this.GetShipIdFromPlayerId = function (player_id) {
            var a = 0;
            while (a < this.Ships.length) {
                if (this.Ships[a].player_id == player_id)
                    return a;

                a++;
            }
        };


        // Находит угол шестигранной области.
        // x, y - Координаты центра
        // radius - Радиус
        // direction_x, direction_y - Вектор. от -1 до 1
        this.SLCT_corner = function (x, y, radius, direction_x, direction_y) {
            var a = 0, curshift = (x % 2 == 0 ? 1 : 0);

            if (direction_y > 0) curshift = x % 2;
            while (a < radius) {
                x += direction_x;
                if (curshift == 0) {
                    y += direction_y;
                    curshift = 2;
                }

                curshift--;
                a++;
            }
            return { x: x, y: y }
        };

        // Находит количество гексов между двумя гексами
        // a, b - координаты гексов.
        this.FindDist = function (a, b) {
            var preradius = b.x - a.x;
            var vector_x = (preradius > 0 ? 1 : -1);

            if (preradius != 0) {
                // Углы
                ca = this.SLCT_corner(a.x, a.y, Math.abs(preradius), vector_x, -1);
                cb = this.SLCT_corner(a.x, a.y, Math.abs(preradius), vector_x, 1);

                if (b.y >= ca.y && b.y <= cb.y) // Между углами
                    return Math.abs(b.x - a.x);

                if (b.y < ca.y) // Выше угла 
                    return Math.abs(ca.y - b.y) + Math.abs(b.x - a.x);

                if (b.y > cb.y) // Ниже угла
                    return Math.abs(cb.y - b.y) + Math.abs(b.x - a.x);
            }
            else // Если b.x - a.x == 0
                return Math.abs(a.y - b.y);
        };


        // Устанавливает текстуру из картинки, на каждый гекс по заданным координатам и указанным радиусом
        // coords - координаты центра области
        // radius - радиус области
        // path - путь к картинке.
        this.LightingArea = function (coords, radius, path) {
            var hexes = this.FindAroundCells(coords, radius);
            var a = 0;
            while (a < hexes.length) {
                var texture = PIXI.Texture.fromImage(path);
                hexes[a].graphics.Sprite.setTexture(texture);
                hexes[a].iscanselect = true;
                a++;
            }
        };
		
		
		this.ClearLighting = function()
		{
			var a = 0;
			while( a < this.Cells.length ) 
			{
				var texture = PIXI.Texture.fromImage(this.Textures.Default);
                this.Cells[a].graphics.Sprite.setTexture(texture);
                this.Cells[a].iscanselect = false;
				a++;
			}
		};


        //Находит все гексы в области, по заданным координатам, с указанным радиусом
        // coords - координаты центра области
        // radius - радиус области
        this.FindAroundCells = function (coords, radius) {
            var a = 0;
            var cells = [];

            cornerhex_coords = this.SLCT_corner(coords.x, coords.y, radius, -1, -1);

            tophexcoords = cornerhex_coords;
            var a = 0, vertical_size = radius + 1;
            while (a < radius * 2 + 1) {
                if (a > 0)
                    if (a < radius + 1)
                        tophexcoords = this.SLCT_corner(tophexcoords.x, tophexcoords.y, 1, 1, -1);
                    else
                        tophexcoords = this.SLCT_corner(tophexcoords.x, tophexcoords.y, 1, 1, 1);


                var id = this.Coords2CellId(tophexcoords.x, tophexcoords.y);

                if (id != null)
                    cells.push(this.Cells[id]);


                // Выборка гексов по вертикали, от угла крайнего верхнего, будет равна радиусу+1
                var b = 1;
                while (b < vertical_size) {
                    var verticalhexcoords = { x: tophexcoords.x, y: tophexcoords.y + b }

                    id = this.Coords2CellId(verticalhexcoords.x, verticalhexcoords.y);

                    if (id != null)
                        cells.push(this.Cells[id]);

                    b++;
                }

                if (a < radius)
                    vertical_size++;
                else
                    vertical_size--;

                a++;
            }

            return cells;
        };


        this.MoveShip = function (player_id, to_coord_x, to_coord_y) {
            var Ship_id = __Starfight.GetShipIdFromPlayerId(player_id);
            var position = __Starfight.Coords2Pos(to_coord_x, to_coord_y);

            //			__Starfight.Ships[Ship_id].Sprite.position.x = positions.x;
            //			__Starfight.Ships[Ship_id].Sprite.position.y = positions.y - 10;

            var from_x = __Starfight.Ships[Ship_id].Sprite.position.x;
            var from_y = __Starfight.Ships[Ship_id].Sprite.position.y;
            var dist_x = position.x - __Starfight.Ships[Ship_id].Sprite.position.x;
            var dist_y = position.y - __Starfight.Ships[Ship_id].Sprite.position.y;

            this._def_move({ duration: 600, onIteration: function (progress, o) {
                __Starfight.Ships[Ship_id].Sprite.position.x = from_x + (progress * dist_x);
                __Starfight.Ships[Ship_id].Sprite.position.y = from_y + (progress * dist_y) - 10;
            }
            });

            //__Starfight.CreateAnimMoving(Ship_id, positions.x, positions.y - 10, 0);
            //alert(positions);
        };


        //o.from, o.to, o.duration, o.onIteration
        this._def_move = function (o) {
            var start = new Date;
            function frame() {
                var progress = (new Date - start) / o.duration;
                if (progress > 1) { progress = 1; }
                o.onIteration(progress, o);
                if (progress == 1) {
                    clearInterval(timer);
                }
            }
            var timer = setInterval(frame, 10);
        };


        // Random float number
        this.rnd = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        this.OpenHideWindow = function (window_parent, window_element_id) {
            window.$(window_parent).css({ display: "block" });

            var wei_w = window.$(window_element_id).css("width");
            var wei_h = window.$(window_element_id).css("height");
            var offset_x = (window.document.body.clientWidth / 2) - (wei_w.substr(0, wei_w.length - 2) / 2)
            var offset_y = (window.document.body.clientHeight / 2) - (wei_h.substr(0, wei_h.length - 2) / 2)

            offset_y = offset_y / 100 * 30;
            window.$(window_element_id).css({ left: offset_x + "px", top: offset_y + "px" });
        };

        this.CloseHideWindow = function (window_parent) {
            window.$(window_parent).css({ display: "none" });
        };


        // Возвращает позицию координат
        this.Coords2Pos = function (crdX, crdY) {
            var a = 0;
            while (a < this.Cells.length) {
                if (this.Cells[a].isfieldcell == true)
                    if (this.Cells[a].coordinates.x == crdX && this.Cells[a].coordinates.y == crdY)
                        return this.Cells[a].positions;

                a++;
            }
        };

        this.Coords2CellId = function (crdX, crdY) {
            //_battleFeildSize= { horizontal : 20, vertical : 8}

            if (crdX >= this._battleFeildSize.horizontal || crdX < 0)
                return null;

            if (crdY >= this._battleFeildSize.vertical || crdY < 0)
                return null;

            var a = 0;
            while (a < this.Cells.length) {
                if (this.Cells[a].isfieldcell == true)
                    if (this.Cells[a].coordinates.x == crdX && this.Cells[a].coordinates.y == crdY)
                        return a;

                a++;
            }

            return null;
        };

		this.UpdateGUITimer = function(classorid, time)
		{
			$(classorid).html(time)
		};

    }

    var __Starfight = new Starfight();

    // global mask func
    window.Starfight = window.SF = window.sf = __Starfight;

})(window);