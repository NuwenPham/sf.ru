/**
 * Created by Pham on 09.05.2015.
 */
function api(){

    // Создает бой в ожидании
    this.CreateBattleLobby = function ( player_id, callback ) {
        var lBattleType = document.getElementById('droplist');

        var data = {
            vk_id: player_id,
            battle_type: '"' + lBattleType + '"'
        };

        this.SenderNJ(
            "POST",
            "http://" + window.location.host + "/php/registration_battle.php",
            data,
            function (response) {
                //console.log(response);
                response = response.split("//_/|");
                if (response[0] == "0") {
                    if( callback != undefined ) callback( response );
                }
                else if( response[0] == "1" )
                    alert( response[1] );

            }
        );
    };

    // Добавляет игрока в бой
    this.Join = function (battle_id, player_vk_id) {
        var data = {
            battle_id: battle_id,
            vk_id: player_vk_id
        };

        this.Sender(
            "POST",
            "http://" + window.location.host + "/php/join_battle.php",
            data,
            function (response) {
                console.log(response);
                response = response.split("//_/|");
                if (response[0] == "0") {
                    alert(response[1]);
                }
            }
        );
    };

    this.LoadBattleData = function (battle_id, callback) {
        var data = {
            battle_id: battle_id,
            vk_id: 0
        };

        this.Sender(
            "POST",
            "http://" + window.location.host + "/php/load_battle_data.php",
            data,
            function (response) {
                //window.console.log(response);
                callback(response);
            }
        );
    };

    this.CheckBattleStatus = function ( callback ) {
        var data = {
        };

        this.Sender(
            "POST",
            "http://" + window.location.host + "/php/load_battle_status.php",
            data,
            function (response) {
                callback(response);
            }
        );
    };

    /**
     * @return {null}
     */
    this.GetBattleStatus = function ( battle_id, callback ) {
        var data = {
            battle_id : battle_id
        };

        this.Sender(
            "POST",
            "http://" + window.location.host + "/php/get_battle_status.php",
            data,
            function (response) {
                callback(response);
            }
        );
        return null;
    };

    /**
     * @return {null}
     */
    this.GetBattleList = function ( object, callback ) {

        if( callback == undefined ) callback = object;

        var data = {
            time_after : ( object.time != undefined ? object.time : 0 )
        };

        this.SenderNJ(
            "POST",
            "http://" + window.location.host + "/php/get_battles_list.php",
            data,
            function (response) {
                callback(response);
            }
        );
        return null;
    };

    this.DoneOrders = function(_data, _callback)
    {
        this.SenderNJ(
            "POST",
            "http://" + window.location.host + "/php/battle_done_orders.php",
            _data,
            function (response) {
                _callback(response);
            }
        );
    };

    // Ajax sender: response as json type
    this.Sender = function (type, url, data, callback) {
        window.$.ajax({
            type: type,
            url: url,
            dataType: 'json',
            data: data
        })
        .done(function (response) {
            callback(response);
        });
    };

    // AjaxSender No json response
    this.SenderNJ = function (type, url, data, callback) {
        window.$.ajax({
            type: type,
            url: url,
            data: data
        })
        .done(function (response) {
            callback(response);
        });
    }

}
//noinspection JSPotentiallyInvalidConstructorUsage
api.prototype = new baseClass();
