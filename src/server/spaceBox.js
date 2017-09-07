/*
| Holds a space.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
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
				type : 'ref_space',
			},
			'_changesDB' :
			{
				comment : 'changes database collection',
				type : 'protean'
			},
			'_changeWraps' :
			{
				comment : 'changeWraps cached in RAM',
				type : 'change_wrapList'
			},
			'_changesOffset' :
			{
				comment : 'the offset of the stored changeWraps',
				// on server load the past isn't kept in memory
				type : 'integer'
			}
		}
	};
}


/*
| Capsule.
*/
( function( ) {
'use strict';


var
	change_wrapList,
	database_changeSkid,
	database_changeSkidList,
	resume,
	server_spaceBox,
	fabric_space;

server_spaceBox = require( 'jion' ).this( module );

change_wrapList = require( '../change/wrapList' );

database_changeSkid = require( '../database/changeSkid' );

database_changeSkidList = require( '../database/changeSkidList' );

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
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
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
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
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
		changeWrapList,
		user
	)
{
	var
		changeSkidList,
		tree;

/**/if( CHECK )
/**/{
/**/	if( changeWrapList.length === 0 ) throw new Error( );
/**/}

	tree = changeWrapList.changeTree( this.space );

	changeSkidList =
		database_changeSkidList.createFromChangeWrapList(
			changeWrapList,
			user,
			this.seqZ
		);

	// saves the changeSkid in the database
	this._changesDB.insert(
		JSON.parse( JSON.stringify( changeSkidList ) ).list,
		function(
			error
			// count
		)
	{
		if( error ) throw new Error( 'Database error' );
	}
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
server_spaceBox.prototype.getChangeWrap =
	function(
		seq
	)
{
	return this._changeWraps.get( seq - this._changesOffset );
};


} )( );
