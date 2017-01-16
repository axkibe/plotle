/*
| Holds information of inner or outer distances.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_margin',
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


var
	gleam_margin,
	jion;


/*
| Capsule
*/
(function() {
'use strict';


if( NODE )
{
	jion = require( 'jion' );

	gleam_margin = jion.this( module, 'source' );
}


/*
| east + west margin = x
*/
jion.lazyValue(
	gleam_margin.prototype,
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
	gleam_margin.prototype,
	'y',
	function( )
	{
		return this.n + this.s;
	}
);


} )( );
