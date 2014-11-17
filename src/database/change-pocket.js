/*
| A change pocketed for database storage.
|
| Authors: Axel Kittenberger
*/


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
			'database.changePocket',
		attributes :
			{
				_id :
					{
						comment :
							'sequence number',
						json :
							true,
						type :
							'Number',
					},
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
							[ 'ccot.change', 'ccot.changeRay' ]
					},
				user :
					{
						comment :
							'the user that issued the change',
						json :
							true,
						type :
							'String'
					},
				date :
					{
						comment :
							'the date the change was issued',
						json :
							true,
						type :
							'Object' // FUTURE Date
					}
			},
		node :
			true
	};
}


var
	ccotChangeWrap,
	changePocket,
	jools;

changePocket = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

ccotChangeWrap = require( '../ccot/change-wrap' );


/*
| Creates a changePocket from a changeWrap.
*/
changePocket.createFromChangeWrap =
	function(
		cw,
		user
	)
{
	return(
		changePocket.create(
			'_id', cw.seq,
			'cid', cw.cid,
			'chgX', cw.chgX,
			'user', user,
			'date', Date.now( )
		)
	);
};


jools.lazyValue(
	changePocket.prototype,
	'asChangeWrap',
	function( )
{
	return(
		ccotChangeWrap.create(
			'chgX', this.chgX,
			'cid', this.cid,
			'seq', this._id
		)
	);
}
);

}( ) );
