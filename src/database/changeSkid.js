/*
| A change on a skid for database storage.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
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
			changeList :
			{
				comment : 'change list',
				json : true,
				type : 'change_list'
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


/*
| Capsule
*/
( function( ) {
"use strict";


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
	var
		cs;

	if( !changeWrap.changeList ) return;

	cs =
		changeSkid.create(
			'_id', seq === undefined ? changeWrap.seq : seq,
			'cid', changeWrap.cid,
			'changeList', changeWrap.changeList,
			'user', user,
			'date', Date.now( )
		);

	jion.aheadValue( cs, 'asChangeWrap', changeWrap );

	return cs;
};


/*
| Transforms the change skid to a change wrap.
*/
jion.lazyValue(
	changeSkid.prototype,
	'asChangeWrap',
	function( )
{
	return(
		change_wrap.create(
			'changeList', this.changeList,
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
		cyt // a changy thing ( change, changeList, changeWrap, etc. )
	)
{
	return this.changeList.transform( cyt );
};


/*
| changes a data tree.
*/
changeSkid.prototype.changeTree =
	function(
		tree
	)
{
	return this.changeList.changeTree( tree );
};


}( ) );
