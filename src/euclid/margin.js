/*
| Holds information of inner or outer distances.
*/


var
	euclid_margin,
	jion;


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
	return{
		id : 'euclid_margin',
		attributes :
		{
			n :
			{
				comment : 'n margin',
				type : 'number'
			},
			e :
			{
				comment : 'e margin',
				type : 'number'
			},
			s :
			{
				comment : 's margin',
				type : 'number'
			},
			w :
			{
				comment : 'w margin',
				type : 'number'
			}
		}
	};
}


if( NODE )
{
	jion = require( 'jion' );

	euclid_margin = jion.this( module, 'source' );
}


/*
| A margin with all distances 0.
*/
euclid_margin.zero =
	euclid_margin.create(
		'n', 0,
		'e', 0,
		's', 0,
		'w', 0
	);

/*
| east + west margin = x
*/
jion.lazyValue(
	euclid_margin.prototype,
	'x',
	function( )
	{
		return this.e + this.w;
	}
);


/*
| north + south margin = y
*/
jion.lazyValue(
	euclid_margin.prototype,
	'y',
	function( )
	{
		return this.n + this.s;
	}
);


} )( );
