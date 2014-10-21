/*
| A change wrapped for transport.
|
| Authors: Axel Kittenberger
*/


var
	ccot;


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
			'ccot.changeWrap',
		attributes :
			{
				cid :
					{
						comment :
							'change id',
						json :
							true,
							// FIXME it accepted 'true',
							// jion validator shouldn't
						type :
							'String'
					},
				chgX :
					{
						comment :
							'change or change ray',
						json :
							true,
						type :
							'Object'
					},
				seq :
					{
						comment :
							'sequence number',
						json :
							true,
						type :
							'Number',
						defaultValue :
							undefined
					}
			},
		node :
			true
	};
}


var
	changeWrap,
	jools;


if( SERVER )
{
	changeWrap =
	module.exports =
		require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}
else
{
	changeWrap = ccot.changeWrap;
}


/*
| Creates an inverted changewrap.
|
| This one has a distinct change id and no sequence id
*/
changeWrap.prototype.invert =
	function( )
{
	return(
		changeWrap.create(
			'cid', jools.uid( ),
			'chgX', this.chgX.invert
		)
	);
};


}( ) );
