(function (){
    function Starfight(){
        this.orderstatus = false; //  when false - you can click, when true - you can't click
        this.QueueOrders = [];
        this.Textures = {
            Default: "/image/hex_not_selected.png"
        };

        this.api = new api();

        this.AddOrderToQueue = function (target, gun){
            var lNewOrder = new QueueOrder();
            lNewOrder.gun = gun;
            lNewOrder.targetcoords = target.coordinates;
            this.QueueOrders.push(lNewOrder);
        };

        this.ClearQueueOfOrders = function (){
            __Starfight.QueueOrders = [];
        };

        //o.from, o.to, o.duration, o.onIteration
        this._def_move = function (_options){
            var lStartDate = new Date;
            var lProgress, lTimer;
            function frame(){
                lProgress = (new Date - lStartDate) / _options.duration;
                if(lProgress > 1) {
                    lProgress = 1;
                }
                _options.onIteration(lProgress, _options);
                if(lProgress == 1) {
                    clearInterval(lTimer);
                }
            }
            lTimer = setInterval(frame, 10);
        };

        // Random float number
        this.Random = function (min, max){
            return Math.random() * (max - min) + min;
        };

        this.OpenHideWindow = function (window_parent, window_element_id){
            var lWeight, lHeight, lOffsetX, lOffsetY;

            window.$(window_parent).css({display: "block"});
            lWeight = window.$(window_element_id).css("width");
            lHeight = window.$(window_element_id).css("height");
            lOffsetX = (window.document.body.clientWidth / 2) - (lWeight.substr(0, lWeight.length - 2) / 2);
            lOffsetY = (window.document.body.clientHeight / 2) - (lHeight.substr(0, lHeight.length - 2) / 2);
            lOffsetY = lOffsetY / 100 * 30;
            window.$(window_element_id).css({
                left: lOffsetX + "px",
                top: lOffsetY + "px"
            });
        };

        this.CloseHideWindow = function (window_parent){
            window.$(window_parent).css({display: "none"});
        };

        this.UpdateGUITimer = function (classorid, time){
            $(classorid).html(time)
        };

    }

    var __Starfight = new Starfight();

    // global mask func
    window.Starfight = window.SF = window.sf = __Starfight;

})(window);