/*
| Holds a space.
|
| FIXME move logic into here.
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
				'changes' :
					{
						// FIXME this should not be zero based
						// and it should be a changeWrapRay
						comment :
							'changes buffer ( in RAM )',
						type :
							'Object'
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
	resume,
	spaceBox,
	visual;


database_changeSkid = require( '../database/change-skid' );

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
		changes,
		changesDB,
		chgX,
		cursor,
		cp,
		o,
		seqZ,
		space;

	changes = [ ];

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
		cp = database_changeSkid.createFromJSON( o );

		if( cp._id !== seqZ )
		{
			throw new Error( 'sequence mismatch' );
		}

		chgX = cp.chgX;

		// FIXME
		changes[ seqZ++ ] =
			{
				cid : cp.cid,
				chgX : cp.chgX
			};

		space = chgX.changeTree( space ).tree;
	}

	return(
		spaceBox.create(
			'_changesDB', changesDB,
			'changes', changes,
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
			'changes', [ ],
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
//		cp,
		ctr;

	ctr = changeWrap.changeTree( this.space );

	//XXX
	//cp = database_changeSkid.createFromChangeWrap( changeWrap );


	// saves the change(ray) in the database
	// FIXME save changeSkids
	this._changesDB.insert(
		{
			_id : this.seqZ,
			cid : changeWrap.cid,
			// needs to rid info.
			chgX : JSON.parse( JSON.stringify( ctr.reaction.chgX ) ),
			user : user,
			date : Date.now( )
		},
		function( error /*, count */ )
		{
			if( error !== null )
			{
				throw new Error( 'Database error' );
			}
		}
	);

	// FIXME changeWrap?
	this.changes[ this.seqZ ] =
		{
			cid : changeWrap.cid,
			chgX : ctr.reaction.chgX
		};

	return(
		this.create(
			// FIXME changes
			'seqZ', this.seqZ + 1,
			'space', ctr.tree
		)
	);
};


} )( );
