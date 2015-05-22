function baseClass(){
	this.__type__ = "custom";

	// Clear all classes and objects.
	this.destructor = function (){
		//this.trash( this );
	};

	this.trash = function (obj){
		if(this.__type__ == undefined) return;
		if(obj == undefined) return;
		for (var key in obj) {
			if(key == "ClearRecourse" || key == "__type__") continue;
			if(obj[key] != null) {
				if(obj[key].__type__ == "custom") {
					obj[key].destructor();
					delete obj[key];
				} else {
					if(obj[key].length > 0 && typeof(obj[key]) == "object")
						this.ClearRecourse(obj[key]);
					delete obj[key];
				}
			} else
				delete obj[key];
		}
		delete obj.trashAll;
		delete obj.__type__;
	};
}