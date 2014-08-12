/*
| A change wrapped for transport.
|
| Authors: Axel Kittenberger
*/


/*
| Export.
*/
var
	jion;


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
		name :
			'ChangeWrap',
		unit :
			'jion',
		attributes :
			{
				cid :
					{
						comment :
							'change id',
						json :
							'true',
						type :
							'String'
					},
				chgX :
					{
						comment :
							'change or change ray',
						json :
							'true',
						type :
							'Object'
					},
				seq :
					{
						comment :
							'sequence number',
						json :
							'true',
						type :
							'Number'
					}
			},
		node :
			true
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jion =
		{
			ChangeWrap :
				require( '../jion/change-wrap' )
		};
}


/*
| Exports
*/
if( SERVER )
{
	module.exports = jion.ChangeWrap;
}


}( ) );
