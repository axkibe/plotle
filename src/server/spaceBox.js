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

		// changeWraps cached in RAM
		_changeWraps : { type : '../change/wrapList' },

		// the offset of the stored changeWraps
		// on server load the past isn't kept in memory
		_changesOffset : { type : 'integer' }
	};
}


const change_wrapList = tim.require( '../change/wrapList' );
const database_changeSkid = tim.require( '../database/changeSkid' );
const fabric_space = tim.require( '../fabric/space' );


/*
| Appends a change wrap list.
|
| This is currently initiate write to database and forget.
*/
def.proto.appendChanges =
	function(
		changeWrapList,
		username
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/	if( changeWrapList.length === 0 ) throw new Error( );
/**/	if( typeof( username ) !== 'string' ) throw new Error( );
/**/}

	const tree = changeWrapList.changeTree( this.space );

	// saves the changees in the database
	root.repository.sendChanges( changeWrapList, this.spaceRef, username, this.seq );

	return(
		this.create(
			'seq', this.seq + changeWrapList.length,
			'space', tree,
			'_changeWraps',
				this._changeWraps
				.appendList( changeWrapList )
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
	await root.repository.establishSpace( spaceRef );

	return(
		self.create(
			'space', fabric_space.create( ),
			'spaceRef', spaceRef,
			'seq', 1,
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

	for( let c = seq; c < cseq; c++ ) a.push( this.getChangeWrap( c ) );

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

	const sRows = await root.repository.getSpaceChangeSeqs( spaceRef.dbChangesKey );

	for( let r of sRows )
	{
		const o = await root.repository.getChange( r.id );
		const changeSkid = database_changeSkid.createFromJSON( o );
		if( changeSkid.seq !== seq ) throw new Error( 'sequence mismatch' );
		seq++;
		space = changeSkid.changeTree( space );
	}

	return(
		self.create(
			'space', space,
			'spaceRef', spaceRef,
			'seq', seq,
			'_changeWraps', change_wrapList.create( 'list:init', [ ] ),
			'_changesOffset', seq
		)
	);
};


} );
