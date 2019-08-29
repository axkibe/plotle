/*
| A change list prepared for database storage.
*/
'use strict';


tim.define( module, ( def, self ) => {


if( TIM )
{
	def.attributes =
	{
		// sequence number
		_id : { type : 'number', json : true },

		// change id
		cid : { type : 'string', json : true },

		// change list
		changeList : { type : '../change/list', json : true },

		// the user who issued the change
		user : { type : 'string', json : true },

		// the date the change was issued
		date : { type : 'integer', json : true }
	};

	def.json = 'database_changeSkid';
}

const change_wrap = tim.require( '../change/wrap' );


/*
| Creates a changeSkid from a changeWrap.
*/
def.static.createFromChangeWrap =
	function(
		changeWrap, // the change wrap to turn into a skid
		user,       // the user that sent the changeWrap
		seq         // if defined assign this seq to changeWrap.
	)
{
	if( !changeWrap.changeList ) return;

	const cs =
		self.create(
			'_id', seq === undefined ? changeWrap.seq : seq,
			'cid', changeWrap.cid,
			'changeList', changeWrap.changeList,
			'user', user,
			'date', Date.now( )
		);

	tim.aheadValue( cs, 'asChangeWrap', changeWrap );

	return cs;
};


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


/*
| Returns a changy thing
| transformed on this changeSkid
*/
def.proto.transform =
	function(
		cyt // a changy thing ( change, changeList, changeWrap, etc. )
	)
{
	return this.changeList.transform( cyt );
};


/*
| Changes a data tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	return this.changeList.changeTree( tree );
};


} );
