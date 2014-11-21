/*
| A change on a skid for database storage.
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
			'database.changeSkid',
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
			}
	};
}


var
	ccot_changeWrap,
	changeSkid,
	jools;

changeSkid = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

ccot_changeWrap = require( '../ccot/change-wrap' );


/*
| Creates a changeSkid from a changeWrap.
*/
changeSkid.createFromChangeWrap =
	function(
		changeWrap, // the change wrap to turn into a skid
		user,       // the user that sent the changeWrap
		seq         // if undefined assign this seq to changeWrap.
	)
{
	// FUTURE aheadValue changeWrap asChangeWrap
	return(
		changeSkid.create(
			'_id', seq === undefined ? changeWrap.seq : seq,
			'cid', changeWrap.cid,
			'chgX', changeWrap.chgX,
			'user', user,
			'date', Date.now( )
		)
	);
};


jools.lazyValue(
	changeSkid.prototype,
	'asChangeWrap',
	function( )
{
	return(
		ccot_changeWrap.create(
			'chgX', this.chgX,
			'cid', this.cid,
			'seq', this._id
		)
	);
}
);


/*
| Returns a changy thing
| transformed on this changeSkid
*/
changeSkid.prototype.transform =
	function(
		cyt // a changy thing ( change, changeRay, changeWrap, etc. )
	)
{
	return this.chgX.transform( cyt );
};


}( ) );
