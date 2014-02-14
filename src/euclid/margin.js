/*
| Holds information of inner or outer distances.
*/


/*
| Exports
*/
var
	Euclid;

Euclid =
	Euclid || { };


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
(function() {
'use strict';


/*
| Constructor.
|
| Margin(n, e, s, w)
|
| n: master or north margin
| e: east margin
| s: south margin
| w: west margin
*/
var Margin =
Euclid.Margin =
	function(
		m,
		e,
		s,
		w
	)
{
	if (typeof(m) === 'object')
	{
		this.n = m.n;
		this.e = m.e;
		this.s = m.s;
		this.w = m.w;
	}
	else
	{
		this.n = m;
		this.e = e;
		this.s = s;
		this.w = w;
	}

	Jools.immute(this);
};


/*
| A margin with all distances 0.
*/
Margin.zero =
	new Margin(
		0,
		0,
		0,
		0
	);


/*
| Returns a json object for this margin
| FIXME is this ever used?
*/
Margin.prototype.toJSON = function()
{
	return this._json ||
		( this._json =
			{
				n: this.n,
				e: this.e,
				s: this.s,
				w: this.w
			}
		);
};

/*
| East + west margin = x
*/
Jools.lazyValue(Margin.prototype, 'x',
	function( )
	{
		return this.e + this.w;
	}
);


/*
| North + south margin = y
*/
Jools.lazyValue(Margin.prototype, 'y',
	function( )
	{
		return this.n + this.s;
	}
);


} ) ();
