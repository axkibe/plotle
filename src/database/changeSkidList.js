/*
| A list of changeSkids.
|
| This is not to be inserted directly into the
| database where changeSkids are a collection.
|
| It is used to chache changeSkids in memory.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'database_changeSkidList',
		list : [ 'database_changeSkid', 'undefined' ],
		json : true,
	};
}


var
	database_changeSkid,
	database_changeSkidList;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	change_wrapList,
	jion;

jion = require( 'jion' );

change_wrapList = require( '../change/wrapList' );

database_changeSkidList = jion.this( module );

database_changeSkid = require( './changeSkid' );


/*
| Creates a changeSkid from a changeWrap.
*/
database_changeSkidList.createFromChangeWrapList =
	function(
		changeWrapList, // the change wrap list to turn into a skid list
		user,           // the user that sent the changeWrapList
		seq             // if undefined assign this seq
		                // as start to changeSkidList
	)
{
	var
		a,
		aZ,
		cw,
		cs,
		list;

	list = [ ];

	for( a = 0, aZ = changeWrapList.length; a < aZ; a++ )
	{
		cw = changeWrapList.get( a );

		if( !cw ) continue;

		cs = database_changeSkid.createFromChangeWrap( cw, user, seq++ );

		if( !cs ) continue;

		list.push( cs );
	}

	return database_changeSkidList.create( 'list:init', list );
};


/*
| Transforms the change skid list to a change wrap list.
*/
jion.lazyValue(
	database_changeSkidList.prototype,
	'asChangeWrapList',
	function( )
{
	var
		a,
		aZ,
		list;

	list = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		list[ a ] = this.get( a ).asChangeWrap;
	}

	return change_wrapList.create( 'list:init', list );
}
);


}( ) );
