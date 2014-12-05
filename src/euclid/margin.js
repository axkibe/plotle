/*
| Holds information of inner or outer distances.
*/


var
	euclid_margin;


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
			'euclid_margin',
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


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	euclid_margin = require( '../jion/this' )( module );
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
jools.lazyValue(
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
jools.lazyValue(
	euclid_margin.prototype,
	'y',
	function( )
	{
		return this.n + this.s;
	}
);


} )( );
