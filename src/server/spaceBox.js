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
		seqZ : { type : 'integer' },

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

const resume = require( 'suspend' ).resume;

const fabric_space = tim.require( '../fabric/space' );


/*
| Loads a space from the db and returns the spaceBox for it.
*/
def.static.loadSpace =
	function*(
		spaceRef
	)
{
	let seqZ = 1;

	let space = fabric_space.create( );

	const changesDB =
		yield* root.repository.collection( 'changes:' + spaceRef.fullname );

	const cursor =
		( yield changesDB.find(
			{ },
			{ sort : '_id' },
			resume( )
		) ).batchSize( 100 );

	for(
		let o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		const changeSkid = database_changeSkid.createFromJSON( o );

		if( changeSkid._id !== seqZ ) throw new Error( 'sequence mismatch' );

		seqZ++;

		space = changeSkid.changeTree( space );
	}

	return(
		self.create(
			'space', space,
			'spaceRef', spaceRef,
			'seqZ', seqZ,
			'_changesDB', changesDB,
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
			'_changesOffset', seqZ
		)
	);
};


/*
| Creates a new space and returns the spaceBox for it.
*/
def.static.createSpace =
	function*(
		spaceRef
	)
{
	yield root.repository.spaces.insert(
		{
			_id : spaceRef.fullname,
			username: spaceRef.username,
			tag : spaceRef.tag
		},
		resume( )
	);

	return(
		self.create(
			'space', fabric_space.create( ),
			'spaceRef', spaceRef,
			'seqZ', 1,
			'_changesDB', yield* root.repository.collection( 'changes:' + spaceRef.fullname ),
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
			'_changesOffset', 1
		)
	);

};


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
		database_changeSkidList.createFromChangeWrapList(
			changeWrapList,
			user,
			this.seqZ
		);

	// saves the changeSkid in the database
	this._changesDB.insert(
		JSON.parse( JSON.stringify( changeSkidList ) ).list,
		( error ) => { if( error ) throw new Error( 'Database error' ); }
	);

	return(
		this.create(
			'seqZ', this.seqZ + changeSkidList.length,
			'space', tree,
			'_changeWraps',
				this._changeWraps
				.appendList( changeSkidList.asChangeWrapList )
		)
	);
};


/*
| Returns the change skid by its sequence.
*/
def.proto.getChangeWrap =
	function(
		seq
	)
{
	return this._changeWraps.get( seq - this._changesOffset );
};


} );
