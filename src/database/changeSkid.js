/*
| A change list prepared for database storage.
*/
'use strict';


tim.define( module, ( def, self ) => {


if( TIM )
{
	def.attributes =
	{
		// change id
		cid : { type : 'string', json : true },

		// the date the change was issued
		date : { type : 'integer', json : true },

		// sequence number
		seq : { type : 'number', json : true },

		// change list
		changeList : { type : '../change/list', json : true },

		// the user who issued the change
		user : { type : 'string', json : true },

		// database id
		_id : { type : 'string', json : true },
	};

	def.json = 'database_changeSkid';
}

const change_wrap = tim.require( '../change/wrap' );
const ref_space = tim.require( '../ref/space' );


/*
| Creates a changeSkid from a changeWrap.
*/
def.static.createFromChangeWrap =
	function(
		changeWrap, // the change wrap to turn into a skid
		spaceRef,   // the space this takes place in
		username,   // the username that sends the changeWrap
		seq,        // if defined assign this seq to changeWrap.
		date        // if defined use this date
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length < 3 || arguments.length > 5 ) throw new Error( );
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/	if( typeof( username ) !== 'string' ) throw new Error( );
/**/}

	if( !changeWrap.changeList ) return;
	if( seq === undefined ) seq = changeWrap.seq;
	if( date === undefined ) date = Date.now( );

	const cs =
		self.create(
			'_id', spaceRef.dbChangesKey + ':' + seq,
			'cid', changeWrap.cid,
			'changeList', changeWrap.changeList,
			'user', username,
			'date', date,
			'seq', seq
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
