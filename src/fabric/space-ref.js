/*
| A reference to a space.
*/


var
	fabric;

fabric = fabric || { };


var
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
	return {
		id :
			'fabric.spaceRef',
		attributes :
			{
				username :
					{
						comment :
							'name of the user the space belongs to',
						json :
							true,
						type :
							'String'
					},
				tag :
					{
						comment :
							'tag of the space',
						json :
							true,
						type :
							'String'
					}
			},
		node :
			true
	};
}


var
	spaceRef;


if( SERVER )
{
	spaceRef = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}
else
{
	spaceRef = fabric.spaceRef;
}


/*
| Returns the space's full name.
*/
jools.lazyValue(
	spaceRef.prototype,
	'fullname',
	function( )
{
	return this.username + ':' + this.tag;
}
);


/*
| Reference to ideolooms home space.
*/
spaceRef.ideoloomHome =
	spaceRef.create(
		'username', 'ideoloom',
		'tag', 'home'
	);

/*
| Reference to ideolooms sandbox space.
*/
spaceRef.ideoloomSandbox =
	spaceRef.create(
		'username', 'ideoloom',
		'tag', 'sandbox'
	);



} )( );
