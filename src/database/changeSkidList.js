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


const change_wrapList = require( '../change/wrapList' );

const database_changeSkid = require( './changeSkid' );


/*
| Creates a changeSkid from a changeWrap.
*/
def.static.createFromChangeWrapList =
	function(
		changeWrapList, // the change wrap list to turn into a skid list
		user,           // the user that sent the changeWrapList
		seq             // if undefined assign this seq
		//              // as start to changeSkidList
	)
{
	const list = [ ];

	for( let a = 0, aZ = changeWrapList.length; a < aZ; a++ )
	{
		const cw = changeWrapList.get( a );

		if( !cw ) continue;

		const cs = database_changeSkid.createFromChangeWrap( cw, user, seq++ );

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

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		list[ a ] = this.get( a ).asChangeWrap;
	}

	return change_wrapList.create( 'list:init', list );
};


} );
