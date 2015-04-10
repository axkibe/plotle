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
	return{
		id : 'database_changeSkid',
		attributes :
		{
			_id :
			{
				comment : 'sequence number',
				json : true,
				type : 'number',
			},
			cid :
			{
				comment : 'change id',
				json : true,
				type : 'string'
			},
			changeRay :
			{
				comment : 'change or change ray',
				json : true,
				type : 'change_ray'
			},
			user :
			{
				comment : 'the user that issued the change',
				json : true,
				type : 'string'
			},
			date :
			{
				comment : 'the date the change was issued',
				json : true,
				type : 'integer'
			}
		}
	};
}


var
	change_wrap,
	changeSkid,
	jion;

jion = require( 'jion' );

changeSkid = jion.this( module );

change_wrap = require( '../change/wrap' );


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
	// FIXME aheadValue changeWrap asChangeWrap

	if( !changeWrap.changeRay )
	{
		return;
	}

	return(
		changeSkid.create(
			'_id', seq === undefined ? changeWrap.seq : seq,
			'cid', changeWrap.cid,
			'changeRay', changeWrap.changeRay,
			'user', user,
			'date', Date.now( )
		)
	);
};


jion.lazyValue(
	changeSkid.prototype,
	'asChangeWrap',
	function( )
{
	return(
		change_wrap.create(
			'changeRay', this.changeRay,
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
	return this.changeRay.transform( cyt );
};


/*
| changes a data tree.
*/
changeSkid.prototype.changeTree =
	function(
		tree
	)
{
	return this.changeRay.changeTree( tree );
};


}( ) );
