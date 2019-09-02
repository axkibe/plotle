/*
| Holds a space.
*/
'use strict';


tim.define( module, ( def, self ) => {


if( TIM )
{
	def.attributes =
	{
		// latest sequence number
		seq : { type : 'integer' },

		// latest space version
		space : { type : '../fabric/space' },

		// reference to the space
		spaceRef : { type : '../ref/space' },

		// changes database collection
		_changesDB : { type : 'protean' },

		// changeWraps cached in RAM
		_changeWraps : { type : '../change/wrapList' },

		// the offset of the stored changeWraps
		// on server load the past isn't kept in memory
		_changesOffset : { type : 'integer' }
	};
}


const change_wrapList = tim.require( '../change/wrapList' );
const database_changeSkid = tim.require( '../database/changeSkid' );
const database_changeSkidList = tim.require( '../database/changeSkidList' );
const fabric_space = tim.require( '../fabric/space' );


/*
| Appends a change wrap list.
|
| This is currently initiate write to database and forget.
*/
def.proto.appendChanges =
	function(
		changeWrapList,
		user
	)
{
/**/if( CHECK )
/**/{
/**/	if( changeWrapList.length === 0 ) throw new Error( );
/**/}

	const tree = changeWrapList.changeTree( this.space );

	const changeSkidList =
		database_changeSkidList.createFromChangeWrapList( changeWrapList, user, this.seq );

	// saves the changeSkid in the database
	this._changesDB.insert(
		JSON.parse( JSON.stringify( changeSkidList ) ).list,
		( error ) => { if( error ) throw new Error( 'Database error' ); }
	);

	return(
		this.create(
			'seq', this.seq + changeSkidList.length,
			'space', tree,
			'_changeWraps',
				this._changeWraps
				.appendList( changeSkidList.asChangeWrapList )
		)
	);
};


/*
| Creates a new space and returns the spaceBox for it.
*/
def.static.createSpace =
	async function(
		spaceRef
	)
{
	await root.repository.spaces.insert(
		{
			_id : spaceRef.fullname,
			username: spaceRef.username,
			tag : spaceRef.tag
		}
	);

	return(
		self.create(
			'space', fabric_space.create( ),
			'spaceRef', spaceRef,
			'seq', 1,
			'_changesDB', await root.repository.collection( 'changes:' + spaceRef.fullname ),
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
			'_changesOffset', 1
		)
	);

};


/*
| Returns the change wrap by its sequence.
*/
def.proto.getChangeWrap =
	function(
		seq
	)
{
	return this._changeWraps.get( seq - this._changesOffset );
};


/*
| Returns the change waps from 'seq' up to current
*/
def.proto.getChangeWrapsUp2Current =
	function(
		seq
	)
{
	const a = [ ];

	const cseq = this.seq;

	for( let c = seq; c < cseq; c++ )
	{
		a.push( this.getChangeWrap( c ) );
	}

	return change_wrapList.create( 'list:init', a );
};


/*
| Loads a space from the db and returns the spaceBox for it.
*/
def.static.loadSpace =
	async function(
		spaceRef
	)
{
	let seq = 1;

	let space = fabric_space.create( );

	const changesDB =
		await root.repository.collection( 'changes:' + spaceRef.fullname );

	const cursor =
		( await changesDB.find( { }, { sort : '_id' } ) )
		.batchSize( 100 );

	for( let o = await cursor.nextObject( ); o; o = await cursor.nextObject( ) )
	{
		const changeSkid = database_changeSkid.createFromJSON( o );

		if( changeSkid._id !== seq ) throw new Error( 'sequence mismatch' );

		seq++;

		space = changeSkid.changeTree( space );
	}

	return(
		self.create(
			'space', space,
			'spaceRef', spaceRef,
			'seq', seq,
			'_changesDB', changesDB,
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
			'_changesOffset', seq
		)
	);
};


} );
