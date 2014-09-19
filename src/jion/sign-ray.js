/*
| An array of signs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	jion;

jion = jion || { };


/*
| Imports
*/
var
	jools;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion.signRay',
		attributes :
			{
				'array' :
				{
					comment :
						'the array',
					type :
						'Object',
					assign :
						null,
					defaultValue :
						undefined
				},

				'_sliced' :
				{
					comment :
						'true if the array is already sliced',
					type :
						'Boolean',
					assign :
						null,
					defaultValue :
						undefined
				}
			},
		init :
			[ 'array', '_sliced' ],
		node :
			true,
		ray :
			[ 'jion.sign' ],
		equals :
			false
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools'  );

	jion =
		{
			sign :
				require( '../jion/sign' ),
			signRay :
				require( '../jion/this' )( module )
		};
}


var
	signRay;

signRay = jion.signRay;


/*
| Exports
*/
if( SERVER )
{
	module.exports = signRay;
}

}( ) );
