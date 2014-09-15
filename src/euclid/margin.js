/*
| Holds information of inner or outer distances.
|
| FIXME, make it a jion.
*/


/*
| Exports
*/
var
	euclid;

euclid = euclid || { };


/*
| Imports
*/
var jools;


/*
| Capsule
*/
(function() {
'use strict';


/*
| Constructor.
|
| margin(n, e, s, w)
|
| n: master or north margin
| e: east margin
| s: south margin
| w: west margin
*/
var margin =
euclid.margin =
	function(
		m,
		e,
		s,
		w
	)
{
	if( typeof( m ) === 'object' )
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

	jools.immute(this);
};


/*
| A margin with all distances 0.
*/
margin.zero =
	new margin(
		0,
		0,
		0,
		0
	);


/*
| Returns a json object for this margin
| FIXME is this ever used?
*/
margin.prototype.toJSON = function()
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
jools.lazyValue(
	margin.prototype,
	'x',
	function( )
	{
		return this.e + this.w;
	}
);


/*
| North + south margin = y
*/
jools.lazyValue(
	margin.prototype,
	'y',
	function( )
	{
		return this.n + this.s;
	}
);


} ) ();
