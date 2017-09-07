/*
| References a space.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'ref_space',
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
	ref_space,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	ref_space = jion.this( module, 'source' );
}


prototype = ref_space.prototype;


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
ref_space.ideoloomHome =
	ref_space.create(
		'username', 'ideoloom',
		'tag', 'home'
	);

/*
| Reference to ideolooms sandbox space.
*/
ref_space.ideoloomSandbox =
	ref_space.create(
		'username', 'ideoloom',
		'tag', 'sandbox'
	);


} )( );
