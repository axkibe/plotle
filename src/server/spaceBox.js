/*
| Holds a space.
|
| FIXME this should not have skids.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'server_spaceBox',
		attributes :
		{
			'seqZ' :
			{
				comment : 'latest sequence number',
				type : 'integer'
			},
			'space' :
			{
				comment : 'latest space version',
				type : 'fabric_space'
			},
			'spaceRef' :
			{
				comment : 'reference to the space',
				type : 'fabric_spaceRef',
			},
			'_changesDB' :
			{
				comment : 'changes database collection',
				type : 'protean'
			},
			'_changeSkids' :
			{
				comment : 'changeSkids cached in RAM',
				type : 'database_changeSkidRay'
			},
			'_changesOffset' :
			{
				comment : 'the offset of the stored changeSkids',
				// one server load the past isn't kept in memory
				type : 'integer'
			}
		}
	};
}

var
	database_changeSkid,
	database_changeSkidRay,
	resume,
	server_spaceBox,
	fabric_space;

server_spaceBox = require( 'jion' ).this( module );

database_changeSkid = require( '../database/changeSkid' );

database_changeSkidRay = require( '../database/changeSkidRay' );

resume = require( 'suspend' ).resume;

fabric_space = require( '../fabric/space' );


/*
| Loads a space from the db and returns the spaceBox for it.
*/
server_spaceBox.loadSpace =
	function*(
		spaceRef
	)
{
	var
		changeSkid,
		changesDB,
		cursor,
		o,
		seqZ,
		space;

	seqZ = 1;

	space = fabric_space.create( );

	changesDB =
		yield* root.repository.collection( 'changes:' + spaceRef.fullname );

	cursor =
		( yield changesDB.find(
			{ },
			{ sort : '_id' },
			resume( )
		) ).batchSize( 100 );

	for(
		o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		changeSkid = database_changeSkid.createFromJSON( o );

		if( changeSkid._id !== seqZ )
		{
			throw new Error( 'sequence mismatch' );
		}

		seqZ++;

		space = changeSkid.changeTree( space );
	}

	return(
		server_spaceBox.create(
			'space', space,
			'spaceRef', spaceRef,
			'seqZ', seqZ,
			'_changesDB', changesDB,
			'_changeSkids', database_changeSkidRay.create( 'ray:init', [ ] ),
			'_changesOffset', seqZ
		)
	);
};


/*
| Creates a new space and returns the spaceBox for it.
*/
server_spaceBox.createSpace =
	function*(
		spaceRef
	)
{

/**/if( CHECK )
/**/{
/**/	// FIXME see if root.repository has this space already.
/**/}

	yield root.repository.spaces.insert(
		{
			_id : spaceRef.fullname,
			username: spaceRef.username,
			tag : spaceRef.tag
		},
		resume( )
	);

	return(
		server_spaceBox.create(
			'space', fabric_space.create( ),
			'spaceRef', spaceRef,
			'seqZ', 1,
			'_changesDB',
				yield* root.repository.collection(
					'changes:' + spaceRef.fullname
				),
			'_changeSkids',
				database_changeSkidRay.create( 'ray:init', [ ] ),
			'_changesOffset', 1
		)
	);

};


/*
| Appends a change.
|
| This is currently write and forget to database.
*/
server_spaceBox.prototype.appendChanges =
	function(
		changeWrapRay,
		user
	)
{
	var
		changeSkidRay,
		tree;

/**/if( CHECK )
/**/{
/**/	if( changeWrapRay.length === 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	tree = changeWrapRay.changeTree( this.space );

	changeSkidRay =
		database_changeSkidRay.createFromChangeWrapRay(
			changeWrapRay,
			user,
			this.seqZ
		);

	// saves the changeSkid in the database
	this._changesDB.insert(
		JSON.parse( JSON.stringify( changeSkidRay ) ).ray,
		function( error /*, count */ )
		{
			if( error )
			{
				throw new Error( 'Database error' );
			}
		}
	);

	return(
		this.create(
			'seqZ', this.seqZ + changeSkidRay.length,
			'space', tree,
			'_changeSkids', this._changeSkids.appendRay( changeSkidRay )
		)
	);
};


/*
| Returns the change skid by its sequence.
*/
server_spaceBox.prototype.getChangeSkid =
	function(
		seq
	)
{
	return this._changeSkids.get( seq - this._changesOffset );
};


} )( );
