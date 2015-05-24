/**
 * Created by Pham on 24.05.2015.
 */
function Battle(){

    //this.isFirstLoadCompleted = false;
    this._lastBattleData = null;
    this.isstepped = false;
    this.BattleField = null;
    this._lastCreatedBattleMenu = null;

    this.Initializie = function(_options){
        this.BattleField = new BattleField();
        this.BattleField.Init(_options);
    };

    this.UpdateBattle = function(_response){
        var that = this;
        var lBattleField = that.BattleField;
        var lCurPosX, lCurPosY, lPlayers, lSideLeftRight, lSideTopBottom, lSideVertical, lPadding, lOffsetX, lOffsetY,
            lShipPos, lClockTimer, lKey, lPlayer;

        lSideLeftRight = 12;
        lSideTopBottom = 30;
        lSideVertical = 20;
        lPadding = 4;
        lOffsetX = 30;
        lOffsetY = 40;

        lPlayers = _response.players;
        for (lKey in lPlayers) {
            if(lPlayers[lKey])// != undefined )
                if(lPlayers[lKey].player_id)// != undefined )
                    if(lBattleField.isShipByPlayerId(lPlayers[lKey].player_id))
                        continue;

            // Here loading ships
            lPlayer = lPlayers[lKey];
            lCurPosX = lPlayer.pos_x * ((lSideLeftRight * 2) + lSideTopBottom + lPadding - lSideLeftRight) + lOffsetX;
            lCurPosY = lPlayer.pos_y * ((lSideVertical * 2) + lPadding ) + lOffsetY + ( ( lPlayer.pos_x % 2 == 1 ) ? -(lSideVertical + (lPadding / 2)) : 0) - 10;

            lBattleField.AddShip({
                image: "../image/ships/default_ship/top_battle_2.png",
                coords: {
                    x: lPlayer.pos_x * 1,
                    y: lPlayer.pos_y * 1
                },
                position: {
                    x: lCurPosX,
                    y: lCurPosY
                },
                player_id: lPlayer.player_id
            });
        }

        var lYou = _response.you[1];
        lShipPos = {
            x: Math.abs(lYou.pos_x),
            y: Math.abs(lYou.pos_y)
        };

        var lYouGuns = _response.your_guns;
        for (lKey in lYouGuns) {
            // laser
            if(lYouGuns[lKey].gun_type == 0)
                lBattleField.LightingArea(lShipPos, Math.abs(lYouGuns[lKey].gun_range), "/image/hex_selected_laser.png");

            // plasma
            if(lYouGuns[lKey].gun_type == 1)
                lBattleField.LightingArea(lShipPos, Math.abs(lYouGuns[lKey].gun_range), "/image/hex_selected_plasma.png");
        }

        // Where you can go
        lBattleField.LightingArea(lShipPos, 1, "/image/hex_selected.png");
        var lPrxStatus = $.proxy(battle.GetStatusOfFight, battle);
        lClockTimer = new ClockTimer();
        lClockTimer.Start(
            _response.battle[1].countdown,
            function (_resp){
                Starfight.UpdateGUITimer(".bh_doneorder_timer", _resp.clock)
            }, // Обновление таймера
            lPrxStatus // Конец хода. // С этого момента запрашивать состояние боя, пока не обновиться ход.
        );
        lPlayers = null;
        lShipPos = null;
        battle._lastBattleData = _response;

    };

    this.GetStatusOfFight = function(){
        var lProxyMain, lPoxyInner;

        lProxyMain = $.proxy(function (resp){
            // Если следующий ход еще не начался.
            if(this._lastBattleData.battle[1].current_step == resp.battle[1].current_step) {
                lPoxyInner = $.proxy(this.GetStatusOfFight, this);
                setTimeout(lPoxyInner, 1000);
                // Если начался следующий ход.
            } else if(this._lastBattleData.battle[1].current_step < resp.battle[1].current_step) {
                this.UpdateBattleField(resp);
            }
        }, this);
        Starfight.api.CheckBattleStatus(lProxyMain);
    };


    this.UpdateBattleField = function( _actuallyBattleData ){
        var lKey, lPlayer, lShipId;
        var lBattleField = this.BattleField;

        lBattleField.ClearLighting();

        if( this._lastCreatedBattleMenu != null ){
            this._lastCreatedBattleMenu.RemoveMenu( lBattleField );
            this._lastCreatedBattleMenu = null;
        }

        this.isstepped = false;
        lPlayer = _actuallyBattleData.players;
        for (lKey in lPlayer){
            lShipId = lBattleField.getShipIdFromPlayerId( lPlayer[lKey].player_id );
            if( lPlayer[lKey].pos_x == lBattleField.Ships[lShipId].coordinates.x && lPlayer[lKey].pos_y == lBattleField.Ships[lShipId].coordinates.y){

            } else {

                lBattleField.MoveShip( lPlayer[lKey].player_id,  lPlayer[lKey].pos_x, lPlayer[lKey].pos_y );
                lBattleField.Ships[lShipId].coordinates.x = lPlayer[lKey].pos_x;
                lBattleField.Ships[lShipId].coordinates.y = lPlayer[lKey].pos_y;

            }
        }

        this.UpdateBattle(_actuallyBattleData);
        OrderButtonStatus(true);
        this._lastBattleData = _actuallyBattleData;
    };

    this.ActionsForShip = function(_cell){
        if(_cell.iscanselect == 1)
            if(Starfight.orderstatus == false)
                this.OpenShipActionWindow(_cell)
    };


    // Открыть окошко с возможными действиями на поле боя.
    this.OpenShipActionWindow = function(cell)	{
        var that = this;
        var a, x, y, lSourceCell, lBattleMenu, lRange, lShiftId, lExceptCount, lHorizontalShift, lHex, lProxy, lVerticalShift;
        var lBattleData = that._lastBattleData;
        var lBattleField = this.BattleField;

        if( this._lastCreatedBattleMenu != null )
            this._lastCreatedBattleMenu.RemoveMenu( lBattleField );

        lSourceCell = cell;
        lBattleMenu = new BattleMenu();
        lBattleMenu.SortGuns( lBattleData.your_guns );
        lRange = lBattleField.Distance( {x : lBattleData.you[1].pos_x * 1, y : lBattleData.you[1].pos_y * 1 }, {x : cell.coordinates.x, y : cell.coordinates.y});
        this._lastCreatedBattleMenu = lBattleMenu;

        lShiftId = 0;
        if( lBattleMenu.LaserGuns.length > 0 )
        {
            lExceptCount = 0;
            lHorizontalShift = lBattleMenu.Shifts[lShiftId].horizontal_shift;
            lVerticalShift = lBattleMenu.Shifts[lShiftId].vertical_shift;
            a = lBattleMenu.LaserGuns.length;
            x = cell.positions.x + lBattleMenu.Shifts[lShiftId].x + (lHorizontalShift * a);
            y = cell.positions.y + lBattleMenu.Shifts[lShiftId].y + (lVerticalShift * a ) ;

            while( a > 0 )
            {
                if( lBattleMenu.LaserGuns[a-1].gun.gun_range >= lRange ) {

                    lHex = lBattleField.AddHex({
                        x: x,
                        y: y,
                        name: "fight_menu",
                        click: function (cell){
                            bm_OnClickGun(cell, lSourceCell, lBattleMenu, "laser", lBattleMenu.LaserGuns[a - 1]);
                        },
                        isShowcoords: false,
                        coordinates: {},
                        gunParams: ["laser", a - 1, lBattleMenu.LaserGuns[a - 1].gun.gun_shots]
                    });

                    lBattleField.HexTexture(lHex.id, lBattleMenu.LaserGuns[a - 1].gun.image);
                    lBattleField.HexActive(lHex.id, true);

                    if(a == 1) {
                        lProxy = $.proxy(this.UnfoldRayOfMenu, this);
                        lBattleField.AddHexActions(lHex.id, "onOver", lProxy, {
                            type: "laser",
                            ray_num: lShiftId,
                            battleMenu: lBattleMenu
                        });
                    }
                    lBattleMenu.LaserGuns[a - 1].cell = lHex.id;
                    lBattleMenu.UsingCells.push(lHex.id);
                } else {
                    lExceptCount++;
                }

                x -= lHorizontalShift;
                y -= lVerticalShift;
                a--;
            }

            if(lExceptCount < lBattleMenu.LaserGuns.length)
                lShiftId++;
        }

        if( lBattleMenu.PlasmaGuns.length > 0 )
        {
            lExceptCount = 0;
            lHorizontalShift = lBattleMenu.Shifts[lShiftId].horizontal_shift;
            lVerticalShift = lBattleMenu.Shifts[lShiftId].vertical_shift;
            a = lBattleMenu.PlasmaGuns.length;
            x = cell.positions.x + lBattleMenu.Shifts[lShiftId].x + (lHorizontalShift * a);
            y = cell.positions.y + lBattleMenu.Shifts[lShiftId].y + (lVerticalShift * a ) ;

            while( a > 0 ){
                if( lBattleMenu.PlasmaGuns[a-1].gun.gun_range >= lRange ){
                    lHex = lBattleField.AddHex({
                        x: x,
                        y: y,
                        name: "fight_menu",
                        click: function (cell){
                            bm_OnClickGun(cell, lSourceCell, lBattleMenu);
                        },
                        coordinates: {},
                        isShowcoords: false,
                        gunParams: ["plasma", a - 1, lBattleMenu.PlasmaGuns[a - 1].gun.gun_shots]
                    });

                    lBattleField.HexTexture(lHex.id, lBattleMenu.PlasmaGuns[a - 1].gun.image);
                    lBattleField.HexActive( lHex.id, true );

                    if( a == 1 ) {
                        lProxy = $.proxy(this.UnfoldRayOfMenu, this);
                        lBattleField.AddHexActions(lHex.id, "onOver", lProxy, {
                            type: "plasma",
                            ray_num: lShiftId,
                            battleMenu: lBattleMenu
                        });
                    }

                    lBattleMenu.PlasmaGuns[a-1].cell = lHex.id;
                    lBattleMenu.UsingCells.push(lHex.id);
                }
                else
                    lExceptCount++;

                x -= lHorizontalShift;
                y -= lVerticalShift;
                a--;
            }

            if(lExceptCount < lBattleMenu.PlasmaGuns.length)
                lShiftId++;
        }

        if( lBattleMenu.AnnihilatorGuns.length > 0 ){
            lExceptCount = 0;
            lHorizontalShift = lBattleMenu.Shifts[lShiftId].horizontal_shift;
            lVerticalShift = lBattleMenu.Shifts[lShiftId].vertical_shift;
            a = lBattleMenu.AnnihilatorGuns.length;
            x = cell.positions.x + lBattleMenu.Shifts[lShiftId].x + (lHorizontalShift * a);
            y = cell.positions.y + lBattleMenu.Shifts[lShiftId].y + (lVerticalShift * a );

            while( a > 0 ){
                if( lBattleMenu.AnnihilatorGuns[a-1].gun.gun_range >= lRange ){
                    lHex = lBattleField.AddHex({
                        x: x,
                        y: y,
                        name: "fight_menu",
                        click: function (cell){
                            bm_OnClickGun(cell, lSourceCell, lBattleMenu);
                        },
                        coordinates: {},
                        isShowcoords: false,
                        gunParams: ["annihilator", a - 1, lBattleMenu.AnnihilatorGuns[a - 1].gun.gun_shots]
                    });

                    lBattleField.HexTexture(lHex.id, lBattleMenu.AnnihilatorGuns[a - 1].gun.image);
                    lBattleField.HexActive( lHex.id, true );
                    lBattleMenu.AnnihilatorGuns[a-1].cell = lHex.id;
                    lBattleMenu.UsingCells.push(lHex.id);

                }
                else
                    lExceptCount++;

                x -= lHorizontalShift;
                y -= lVerticalShift;

                a--;
            }

            if(lExceptCount < lBattleMenu.AnnihilatorGuns.length)
                lShiftId++;
        }

        if( lBattleMenu.MineGuns.length > 0 ){
            lExceptCount = 0;
            lHorizontalShift = lBattleMenu.Shifts[lShiftId].horizontal_shift;
            lVerticalShift = lBattleMenu.Shifts[lShiftId].vertical_shift;
            a = lBattleMenu.MineGuns.length;
            x = cell.positions.x + lBattleMenu.Shifts[lShiftId].x + (lHorizontalShift * a);
            y = cell.positions.y + lBattleMenu.Shifts[lShiftId].y + (lVerticalShift * a );

            while( a > 0 ){
                if( lBattleMenu.MineGuns[a-1].gun.gun_range >= lRange )	{
                    lHex = lBattleField.AddHex({
                        x: x,
                        y: y,
                        name: "fight_menu",
                        click: function (cell){
                            bm_OnClickGun(cell, lSourceCell, lBattleMenu);
                        },
                        coordinates: {},
                        isShowcoords: false,
                        gunParams: ["mine", a - 1, lBattleMenu.MineGuns[a - 1].gun.gun_shots]
                    });

                    lBattleField.HexTexture(lHex.id, lBattleMenu.MineGuns[a - 1].gun.image);
                    lBattleField.HexActive( lHex.id, true );
                    lBattleMenu.MineGuns[a-1].cell = lHex.id;
                    lBattleMenu.UsingCells.push(lHex.id);
                }
                else
                    lExceptCount++;

                x -= lHorizontalShift;
                y -= lVerticalShift;
                a--;
            }

            if(lExceptCount < lBattleMenu.MineGuns.length)
                lShiftId++;
        }

        // Step
        if( true && lRange <= 1 && lRange != 0 && that.isstepped == false ){
            lHorizontalShift = lBattleMenu.Shifts[lShiftId].horizontal_shift;
            lVerticalShift = lBattleMenu.Shifts[lShiftId].vertical_shift;
            a = 1;
            x = cell.positions.x + lBattleMenu.Shifts[lShiftId].x + (lHorizontalShift * a);
            y = cell.positions.y + lBattleMenu.Shifts[lShiftId].y + (lVerticalShift * a );

            while( a > 0 ) {
                lHex = lBattleField.AddHex({
                    x: x,
                    y: y,
                    name: "fight_menu",
                    click: function (cell){
                        bm_OnClickGun(cell, lSourceCell, lBattleMenu, "step", "step");
                    },
                    coordinates: {},
                    isShowcoords: false,
                    gunParams: ["steps", a - 1, 1]
                });

                lBattleField.HexTexture(lHex.id, "/image/hex_step.png");
                lBattleField.HexActive(lHex.id, true);

                lBattleMenu.Step = new BattleAction();
                lBattleMenu.Step.cell = lHex.id;
                lBattleMenu.UsingCells.push(lHex.id);

                x -= lHorizontalShift;
                y -= lVerticalShift;

                a--;
            }
            lShiftId++;
        }
    };

    this.UnfoldRayOfMenu = function(_cell, _actionId, _objData)	{
        var a, lRealId, lSprite, lGraphic, lTextShots, lShiftId, lShiftPoses, lSpriteEnd, lLastUnfolded;
        var lBattleField = this.BattleField;

        _cell.actions[_actionId].isactive = false;

        if( _objData.type == "laser" ){
            if( _objData.battleMenu.LastUnfoldedRay != null )
                this.FoldRayOfMenu( _objData.battleMenu.LastUnfoldedRay.cell, _objData.battleMenu.LastUnfoldedRay.actionid, _objData.battleMenu.LastUnfoldedRay.object );

            a = 1;
            while(a < _objData.battleMenu.LaserGuns.length) {
                if( _objData.battleMenu.LaserGuns[a].cell != "" ) {
                    lRealId = lBattleField.getHexRealId( _objData.battleMenu.LaserGuns[a].cell );
                    lSprite = {x : lBattleField.Hexes[lRealId].graphics.Sprite.position.x, y : lBattleField.Hexes[lRealId].graphics.Sprite.position.y };
                    lGraphic = { x: lBattleField.Hexes[lRealId].graphics.x, y: lBattleField.Hexes[lRealId].graphics.y };
                    lTextShots = { x: lBattleField.Hexes[lRealId].drawedText_shots.x, y: lBattleField.Hexes[lRealId].drawedText_shots.y };
                    lShiftId = _objData.ray_num;
                    lShiftPoses = _objData.battleMenu.Shifts[lShiftId];
                    lSpriteEnd = { x : (lShiftPoses.x / 2) * a, y : (lShiftPoses.y / 2) * a };

                    Starfight._def_move({ rid: lRealId, source_g: lGraphic, source_sp: lSprite, source_ts: lTextShots, source_sp_end: lSpriteEnd,
                        duration: 100, onIteration: function (progress, o) {
                            lBattleField.Hexes[o.rid].graphics.Sprite.position.x = o.source_sp.x + (progress * o.source_sp_end.x);
                            lBattleField.Hexes[o.rid].graphics.Sprite.position.y = o.source_sp.y + (progress * o.source_sp_end.y);
                            lBattleField.Hexes[o.rid].graphics.x = o.source_g.x + (progress * o.source_sp_end.x);
                            lBattleField.Hexes[o.rid].graphics.y = o.source_g.y + (progress * o.source_sp_end.y);
                            lBattleField.Hexes[o.rid].drawedText_shots.x = o.source_ts.x + (progress * o.source_sp_end.x);
                            lBattleField.Hexes[o.rid].drawedText_shots.y = o.source_ts.y + (progress * o.source_sp_end.y);
                        }
                    });
                }
                a++;
            }
        }

        else if( _objData.type == "plasma" ) {
            if( _objData.battleMenu.LastUnfoldedRay != null )
                this.FoldRayOfMenu( _objData.battleMenu.LastUnfoldedRay.cell, _objData.battleMenu.LastUnfoldedRay.actionid, _objData.battleMenu.LastUnfoldedRay.object );

            a = 1;
            while(a < _objData.battleMenu.PlasmaGuns.length) {
                lRealId = lBattleField.getHexRealId( _objData.battleMenu.PlasmaGuns[a].cell );
                lSprite = { x: lBattleField.Hexes[lRealId].graphics.Sprite.position.x, y: lBattleField.Hexes[lRealId].graphics.Sprite.position.y };
                lGraphic = { x: lBattleField.Hexes[lRealId].graphics.x, y: lBattleField.Hexes[lRealId].graphics.y };
                lTextShots = { x: lBattleField.Hexes[lRealId].drawedText_shots.x, y: lBattleField.Hexes[lRealId].drawedText_shots.y };
                lShiftId = _objData.ray_num;
                lShiftPoses = _objData.battleMenu.Shifts[lShiftId];
                lSpriteEnd = { x: (lShiftPoses.x / 2) * a, y: (lShiftPoses.y / 2) * a };

                Starfight._def_move({ rid: lRealId, source_g: lGraphic, source_sp: lSprite, source_ts: lTextShots, source_sp_end: lSpriteEnd,
                    duration: 100, onIteration: function (progress, o) {
                        lBattleField.Hexes[o.rid].graphics.Sprite.position.x = o.source_sp.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].graphics.Sprite.position.y = o.source_sp.y + (progress * o.source_sp_end.y);
                        lBattleField.Hexes[o.rid].graphics.x = o.source_g.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].graphics.y = o.source_g.y + (progress * o.source_sp_end.y);
                        lBattleField.Hexes[o.rid].drawedText_shots.x = o.source_ts.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].drawedText_shots.y = o.source_ts.y + (progress * o.source_sp_end.y);
                    }
                });
                a++;
            }
        }

        lLastUnfolded = new MenuRay();
        lLastUnfolded.cell = _cell;
        lLastUnfolded.actionid = _actionId;
        lLastUnfolded.object = _objData;
        _objData.battleMenu.LastUnfoldedRay = lLastUnfolded;
    };

    this.FoldRayOfMenu = function(cell, action_id, objData)	{
        var a, lRealId, lSprite, lGraphic, lTextShots, lShiftId, lShiftPoses, lSpriteEnd;
        var lBattleField = this.BattleField;

        cell.actions[action_id].isactive = true;

        if( objData.type == "laser" ) {
            a = 1;
            while(a < objData.battleMenu.LaserGuns.length) {
                lRealId = lBattleField.getHexRealId( objData.battleMenu.LaserGuns[a].cell );
                lSprite = {x : lBattleField.Hexes[lRealId].graphics.Sprite.position.x, y : lBattleField.Hexes[lRealId].graphics.Sprite.position.y };
                lGraphic = {x : lBattleField.Hexes[lRealId].graphics.x, y : lBattleField.Hexes[lRealId].graphics.y };
                lTextShots = { x: lBattleField.Hexes[lRealId].drawedText_shots.x, y: lBattleField.Hexes[lRealId].drawedText_shots.y };
                lShiftId = objData.ray_num;
                lShiftPoses = objData.battleMenu.Shifts[lShiftId];
                lSpriteEnd = {
                    x : ( (lShiftPoses.x>0?-Math.abs(lShiftPoses.x):Math.abs(lShiftPoses.x)) / 2) * a,
                    y : ( (lShiftPoses.y>0?-Math.abs(lShiftPoses.y):Math.abs(lShiftPoses.y)) / 2) * a
                };

                Starfight._def_move({ rid: lRealId, source_g: lGraphic, source_sp: lSprite, source_ts: lTextShots, source_sp_end: lSpriteEnd,
                    duration : 100, onIteration : function (progress, o){
                        lBattleField.Hexes[o.rid].graphics.Sprite.position.x =  o.source_sp.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].graphics.Sprite.position.y =  o.source_sp.y + (progress * o.source_sp_end.y);
                        lBattleField.Hexes[o.rid].graphics.x =  o.source_g.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].graphics.y = o.source_g.y + (progress * o.source_sp_end.y);
                        lBattleField.Hexes[o.rid].drawedText_shots.x = o.source_ts.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].drawedText_shots.y = o.source_ts.y + (progress * o.source_sp_end.y);
                    }});
                a++;
            }
        }

        else if( objData.type == "plasma" ) {
            a = 1;
            while(a < objData.battleMenu.PlasmaGuns.length) {
                lRealId = lBattleField.getHexRealId( objData.battleMenu.PlasmaGuns[a].cell );
                lSprite = {x : lBattleField.Hexes[lRealId].graphics.Sprite.position.x, y : lBattleField.Hexes[lRealId].graphics.Sprite.position.y };
                lGraphic = { x: lBattleField.Hexes[lRealId].graphics.x, y: lBattleField.Hexes[lRealId].graphics.y };
                lTextShots = { x: lBattleField.Hexes[lRealId].drawedText_shots.x, y: lBattleField.Hexes[lRealId].drawedText_shots.y };
                lShiftId = objData.ray_num;
                lShiftPoses = objData.battleMenu.Shifts[lShiftId];
                lSpriteEnd = {
                    x : ( (lShiftPoses.x>0?-Math.abs(lShiftPoses.x):Math.abs(lShiftPoses.x)) / 2) * a,
                    y : ( (lShiftPoses.y>0?-Math.abs(lShiftPoses.y):Math.abs(lShiftPoses.y)) / 2) * a
                };

                Starfight._def_move({ rid: lRealId, source_g: lGraphic, source_sp: lSprite, source_ts: lTextShots, source_sp_end: lSpriteEnd,
                    duration: 100, onIteration: function (progress, o) {
                        lBattleField.Hexes[o.rid].graphics.Sprite.position.x = o.source_sp.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].graphics.Sprite.position.y = o.source_sp.y + (progress * o.source_sp_end.y);
                        lBattleField.Hexes[o.rid].graphics.x = o.source_g.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].graphics.y = o.source_g.y + (progress * o.source_sp_end.y);
                        lBattleField.Hexes[o.rid].drawedText_shots.x = o.source_ts.x + (progress * o.source_sp_end.x);
                        lBattleField.Hexes[o.rid].drawedText_shots.y = o.source_ts.y + (progress * o.source_sp_end.y);
                    }
                });
                a++;
            }
        }
    };
}
Battle.prototype = new baseClass();