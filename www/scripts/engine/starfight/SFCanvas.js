function SFCanvas(){

    this.PIXIStage = null;
    this.PIXICanvas = null;
    this._renderLibrary = "";
    this._isRendering = false;

    this.PIXICreate = function (_options){
        var lWidth, lHeight, lPixiCanvas;

        lWidth = _options.width ? _options.width : 100;
        lHeight = _options.height ? _options.height : 100;
        lPixiCanvas = new PIXI.CanvasRenderer(lWidth, lHeight, {transparent: true});
        this.PIXICanvas = lPixiCanvas;
        this.PIXIStage = new PIXI.Stage;
        this._renderLibrary = "PIXI";

        return lPixiCanvas;
    };

    this.appendTo = function (_appendingElement){
        document.getElementById(_appendingElement).appendChild(this.PIXICanvas.view);
    };

    this.Start = function (){
        this._isRendering = true;

        if(this._renderLibrary == "PIXI")
            this._renderPIXI();
    };

    this.Stop = function (){
        this._isRendering = false;
    };

    this._renderPIXI = function (){
        if(this._isRendering) {
            var lProxy = $.proxy(this._renderPIXI, this);
            requestAnimFrame(lProxy);
            this.PIXICanvas.render(this.PIXIStage);
        }
    };

    this.addChild = function (_child){
        if(this._renderLibrary == "PIXI")
            this.PIXIStage.addChild(_child);
    };
}
SFCanvas.prototype = new baseClass();
