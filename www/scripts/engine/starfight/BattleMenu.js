/**
 * Created by Pham on 11.05.2015.
 */
function BattleAction(){
    this.cell = null;
}
BattleAction.prototype = new baseClass();

function Gun(){
    this.gun = {
        image: "",
        gun_shots: null,
        gun_range: null
    };
}
Gun.prototype = new BattleAction();

function MenuRay (){
    this.cell = null;
    this.actionid = null;
    this.object = null;
}
MenuRay.prototype = new baseClass();

function BattleMenu() {
    this.LaserGuns = [];
    this.PlasmaGuns = [];
    this.AnnihilatorGuns = [];
    this.MineGuns = [];
    this.UsingCells = [];
    this.LastUnfoldedRay = null;

    this.Shifts = [
        { horizontal_shift : -10, vertical_shift : -5, x : -36, y : -17 },
        { horizontal_shift : 0, vertical_shift : -10, x : 0, y : -34 },
        { horizontal_shift : 10, vertical_shift : -5, x : 36, y : -17 },
        { horizontal_shift : 10, vertical_shift : 5, x : 36, y : 17 },
        { horizontal_shift : 0, vertical_shift : 10, x : 0, y : 34 }
    ];

    this.ShiftsOld = [
        { horizontal_shift : -10, vertical_shift : -5, x : -36, y : -17 },
        { horizontal_shift : 0, vertical_shift : -10, x : 0, y : -34 },
        { horizontal_shift : 10, vertical_shift : -5, x : 36, y : -17 },
        { horizontal_shift : 10, vertical_shift : 5, x : 36, y : 17 },
        { horizontal_shift : 0, vertical_shift : 10, x : 0, y : 34 }
    ];

    // gun - your_guns
    // type - laser, plasma, annihilator, mine
    this.AddGun = function ( gun, type ) {
        var lGun;
        if( type == "laser" ) {
            lGun = new Gun();
            lGun.gun = gun;
            this.LaserGuns.push( lGun );
        }
        else if( type == "plasma" ) {
            lGun = new Gun();
            lGun.gun = gun;
            this.PlasmaGuns.push( lGun );
        }
        else if( type == "annihilator" ) {
            lGun = new Gun();
            lGun.gun = gun;
            this.AnnihilatorGuns.push( lGun );
        }
        else if( type == "mine" ) {
            lGun = new Gun();
            lGun.gun = gun;
            this.MineGuns.push( lGun );
        }
    };

    this.SortGuns = function ( _guns ) {
        for (var key in _guns) {
            if( _guns[key].gun_type == 0 )
                this.AddGun( _guns[key], "laser" );
            else if( _guns[key].gun_type == 1 )
                this.AddGun( _guns[key], "plasma" );
            else if( _guns[key].gun_type == 2 )
                this.AddGun( _guns[key], "annihilator" );
            else if( _guns[key].gun_type == 3 )
                this.AddGun( _guns[key], "mine" );
        }
    };

    this.RemoveMenu = function( _starfightInstance ) {
        var a = 0;
        while (a < this.UsingCells.length)
            _starfightInstance.RemoveCell( this.UsingCells[a++] );
    }
}
BattleMenu.prototype = new baseClass();