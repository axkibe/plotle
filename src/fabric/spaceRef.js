/*
| A reference to a space.
*/


var
	fabric_spaceRef,
	jion;


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


if( NODE )
{
	jion = require( 'jion' );

	fabric_spaceRef = jion.this( module, 'source' );
}


prototype = fabric_spaceRef.prototype;


/*
| Returns the space's full name.
*/
jion.lazyValue(
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
