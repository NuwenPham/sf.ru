function ClockTimer()
{
	
	this.Timer = null;
	this.OnTick = null;
	this.OnTimeout = null;
	this._end_time = null;
	this.CurTime = 0;
	this._Object = {};
	
	this.AddObject = function(o)
	{
		this._Object = o;
	}
	
	this.Start = function ( time, ontick, ontimeout )
	{
		var d = new Date();
		this._end_time = d.getTime() + ( time * 1000 ) ;
		this.CurTime = time;
		
		if( ontick != null )
			this.OnTick = ontick;
			
		if( ontimeout != null )
			this.OnTimeout = ontimeout;
		

		this.Timer = setInterval(this.Worker, 1000, [this]);
	}
	
	this.Worker = function(params)
	{
		var self = params[0];
		var d = new Date();
		
		var tl = self.CurTime--;
		
		if( self.OnTick != null )
			self.OnTick( { timeleft : tl, clock : self.ConvertToClock( tl ), object : self._Object } );		
			
		if( self._end_time < d.getTime() )
		{
			clearInterval(self.Timer);
			
			if( self.OnTimeout != null )
				self.OnTimeout( { timeleft : tl, clock : self.ConvertToClock( tl ), object : self._Object } );
		}
		
	}
	
	this.ConvertToClock = function ( seconds )
	{
		var h = seconds / 3600 ^ 0 ;
		var m = ( seconds - h * 3600 ) / 60 ^ 0;
		var s = seconds - h * 3600 - m * 60;		
		return ( m < 10 ? "0" + m : m ) + ":" + ( s < 10 ? "0" + s : s );
	}
}