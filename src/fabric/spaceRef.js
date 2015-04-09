/*
| A reference to a space.
*/


var
	fabric_spaceRef,
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'fabric_spaceRef',
		attributes :
		{
			username :
			{
				comment : 'name of the user the space belongs to',
				json : true,
				type : 'string'
			},
			tag :
			{
				comment : 'tag of the space',
				json : true,
				type : 'string'
			}
		}
	};
}


var
	prototype;


if( SERVER )
{
	fabric_spaceRef = require( 'jion' ).this( module, 'source' );

	jools = require( '../jools/jools' );
}


prototype = fabric_spaceRef.prototype;


/*
| Returns the space's full name.
*/
jools.lazyValue(
	prototype,
	'fullname',
	function( )
{
	return this.username + ':' + this.tag;
}
);


/*
| Reference to ideolooms home space.
*/
fabric_spaceRef.ideoloomHome =
	fabric_spaceRef.create(
		'username', 'ideoloom',
		'tag', 'home'
	);

/*
| Reference to ideolooms sandbox space.
*/
fabric_spaceRef.ideoloomSandbox =
	fabric_spaceRef.create(
		'username', 'ideoloom',
		'tag', 'sandbox'
	);



} )( );
