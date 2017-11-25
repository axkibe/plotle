/*
| A change on a skid for database storage.
*/
'use strict';


tim.define( module, 'database_changeSkid', ( def, database_changeSkid ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		_id :
		{
			// sequence number
			type : 'number',
			json : true,
		},
		cid :
		{
			// change id
			type : 'string',
			json : true,
		},
		changeList :
		{
			// change list
			type : 'change_list',
			json : true,
		},
		user :
		{
			// the user that issued the change
			type : 'string',
			json : true,
		},
		date :
		{
			// the date the change was issued
			type : 'integer',
			json : true,
		}
	};
}


/*:::::::::.
:: Imports
'::::::::::*/


const change_wrap = require( '../change/wrap' );


/*:::::::::::::::::::.
:: Static functions
'::::::::::::::::::::*/


/*
| Creates a changeSkid from a changeWrap.
*/
def.static.createFromChangeWrap =
	function(
		changeWrap, // the change wrap to turn into a skid
		user,       // the user that sent the changeWrap
		seq         // if undefined assign this seq to changeWrap.
	)
{
	if( !changeWrap.changeList ) return;

	const cs =
		database_changeSkid.create(
			'_id', seq === undefined ? changeWrap.seq : seq,
			'cid', changeWrap.cid,
			'changeList', changeWrap.changeList,
			'user', user,
			'date', Date.now( )
		);

	tim.aheadValue( cs, 'asChangeWrap', changeWrap );

	return cs;
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Transforms the change skid to a change wrap.
*/
def.lazy.asChangeWrap =
	function( )
{
	return(
		change_wrap.create(
			'changeList', this.changeList,
			'cid', this.cid,
			'seq', this._id
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns a changy thing
| transformed on this changeSkid
*/
def.func.transform =
	function(
		cyt // a changy thing ( change, changeList, changeWrap, etc. )
	)
{
	return this.changeList.transform( cyt );
};


/*
| Changes a data tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	return this.changeList.changeTree( tree );
};


} );
