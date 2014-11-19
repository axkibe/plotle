/*
| Holds a space.
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
	return {
		id :
			'server.spaceBox',
		attributes :
			{
				'changeSkids' :
					{
						// FIXME this should not be zero based
						comment :
							'changeSkids cached in RAM',
						type :
							'database.changeSkidRay'
					},
				'seqZ' :
					{
						comment :
							'latest sequence number',
						type :
							'Integer'
					},
				'space' :
					{
						comment :
							'latest space version',
						type :
							'visual.space'
					},
				'spaceRef' :
					{
						comment :
							'reference to the space',
						type :
							'fabric.spaceRef',
					},
				'_changesDB' :
					{
						comment :
							'changes database collection',
						type :
							'Object'
					}
			},
		node :
			true
	};
}

var
	ccot,
	database_changeSkid,
	database_changeSkidRay,
	resume,
	spaceBox,
	visual;


database_changeSkid = require( '../database/change-skid' );

database_changeSkidRay = require( '../database/change-skid-ray' );

resume = require( 'suspend' ).resume;

spaceBox = require( '../jion/this' )( module );

ccot =
	{
		// FUTURE double check if all are needed.
		change : require( '../ccot/change' ),

		changeRay : require( '../ccot/change-ray' ),

		changeWrap : require( '../ccot/change-wrap' ),

		changeWrapRay : require( '../ccot/change-wrap-ray' ),
	};

visual =
	{
		space : require( '../visual/space' )
	};


/*
| Loads a space from the db and returns the spaceBox for it.
*/
spaceBox.loadSpace =
	function*(
		spaceRef
	)
{
	var
		changeSkid,
		changeSkids,
		changesDB,
		cursor,
		o,
		seqZ,
		space;

	changeSkids = database_changeSkidRay.create( );

	seqZ = 1;

	space = visual.space.create( );

	changesDB =
		yield* root.repository.collection(
			'changes:' + spaceRef.fullname
		);

	cursor =
		yield changesDB.find(
			{ },
			{ sort : '_id' },
			resume( )
		);

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		changeSkid = database_changeSkid.createFromJSON( o );

		if( changeSkid._id !== seqZ )
		{
			throw new Error( 'sequence mismatch' );
		}

		changeSkids =
			changeSkids.create( 'ray:set', seqZ++, changeSkid );

		// FIXME remove chgX below
		space = changeSkid.chgX.changeTree( space ).tree;
	}

	return(
		spaceBox.create(
			'_changesDB', changesDB,
			'changeSkids', changeSkids,
			'space', space,
			'spaceRef', spaceRef,
			'seqZ', seqZ
		)
	);
};


/*
| Creates a new space and returns the spaceBox for it.
*/
spaceBox.createSpace =
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
		spaceBox.create(
			'_changesDB',
				yield* root.repository.collection(
					'changes:' + spaceRef.fullname
				),
			'changeSkids', database_changeSkidRay.create( ),
			'space', visual.space.create( ),
			'spaceRef', spaceRef,
			'seqZ', 1
		)
	);

};


/*
| Appends a change.
|
| This is currently write and forget to database.
*/
spaceBox.prototype.appendChange =
	function(
		changeWrap,
		user
	)
{
	var
		changeSkid,
		ctr;

/**/if( CHECK )
/**/{
/**/	if( changeWrap.seq )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	ctr = changeWrap.changeTree( this.space );

	changeSkid =
		database_changeSkid.createFromChangeWrap(
			changeWrap,
			user,
			this.seqZ
		);

	// saves the changeSkid in the database
	this._changesDB.insert(
		JSON.parse( JSON.stringify( changeSkid ) ),
		function( error /*, count */ )
		{
			if( error !== null )
			{
				throw new Error( 'Database error' );
			}
		}
	);

	return(
		this.create(
			'seqZ', this.seqZ + 1,
			'space', ctr.tree,
			'changeSkids',
				this.changeSkids.create(
					'ray:set', this.seqZ, changeSkid
				)
		)
	);
};


} )( );
