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
	resume,
	spaceBox,
	visual;

resume = require( 'suspend' ).resume;

spaceBox = require( '../jion/this' )( module );

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

	// FIXME actually load changes and space and playback.
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
| Returns a cursor with all changes.
*/
spaceBox.prototype.findAllChanges =
	function*( )
{
	return(
		yield this._changesDB.find(
			{ },
			{ sort : '_id' },
			resume( )
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
		cid,  // FIXME
		seqZ, // FIXME
		chgX, // FIXME
		user  // FIXME
	)
{

/**/if( CHECK )
/**/{
/**/	if( !this._changesDB )
/**/	{
/**/		throw new Error( 'Spacebox not connected' );
/**/	}
/**/}

	// saves the change(ray) in the database
	this._changesDB.insert(
		{
			_id : seqZ,
			cid : cid,
			// needs to rid info.
			chgX : JSON.parse( JSON.stringify( chgX ) ),
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

	return this;
};




} )( );
