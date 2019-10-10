/*
| A list of changeSkids.
|
| This is not to be inserted directly into the
| database where changeSkids are a collection.
|
| It is used to chache changeSkids in memory.
*/
'use strict';


tim.define( module, ( def, self ) => {


if( TIM )
{
	def.list = [ './changeSkid', 'undefined' ];

	def.json = 'database_changeSkidList';
}


const change_wrapList = tim.require( '../change/wrapList' );
const database_changeSkid = tim.require( './changeSkid' );
const ref_space = tim.require( '../ref/space' );

/*
| Creates a changeSkid from a changeWrap.
*/
def.static.createFromChangeWrapList =
	function(
		changeWrapList, // the change wrap list to turn into a skid list
		spaceRef,       // the space this takes place in
		username,       // the username that sends the changeWrapList
		seq             // if defined assign this seq as start to changeSkidList
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length < 3 || arguments.length > 4 ) throw new Error( );
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/	if( typeof( username ) !== 'string' ) throw new Error( );
/**/}

	const list = [ ];

	for( let cw of changeWrapList )
	{
		if( !cw ) continue;
		const cs = database_changeSkid.createFromChangeWrap( cw, username, seq++ );
		if( !cs ) continue;
		list.push( cs );
	}

	return self.create( 'list:init', list );
};


/*
| Transforms the change skid list to a change wrap list.
*/
def.lazy.asChangeWrapList =
	function( )
{
	const list = [ ];
	for( let cs of this ) list.push( cs.asChangeWrap );
	return change_wrapList.create( 'list:init', list );
};


} );
