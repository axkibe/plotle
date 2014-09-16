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
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'euclid.margin',
		attributes :
			{
				n :
					{
						comment :
							'n margin',
						type :
							'Number'
					},
				e :
					{
						comment :
							'e margin',
						type :
							'Number'
					},
				s :
					{
						comment :
							's margin',
						type :
							'Number'
					},
				w :
					{
						comment :
							'w margin',
						type :
							'Number'
					}
			}
	};
}


var
	margin;

margin = euclid.margin;


/*
| A margin with all distances 0.
*/
margin.zero =
	margin.create(
		'n', 0,
		'e', 0,
		's', 0,
		'w', 0
	);

/*
| east + west margin = x
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
| north + south margin = y
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
