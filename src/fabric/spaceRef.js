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
	return {
		id :
			'fabric_spaceRef',
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
			}
	};
}



if( SERVER )
{
	fabric_spaceRef = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}


/*
| Returns the space's full name.
*/
jools.lazyValue(
	fabric_spaceRef.prototype,
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