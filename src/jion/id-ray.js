/*
| A jion id ray.
|
| To be used when an attribute or ray element can be
| one out of several type.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';

/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'jion.idRay',
		node : true,
		ray : [ 'jion.id' ]
	};
}


var
	id,
	idRay;


idRay =
module.exports =
	require( '../jion/this' )( module );

id = require( './id' );


/*
| Creates the id-ray from an array of id strings.
*/
idRay.prototype.createFromArray =
	function(
		ids
	)
{
	var
		a,
		aZ,
		ray,
		set;

/**/if( CHECK )
/**/{
/**/	if( !Array.isArray( ids ) )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	set = { };
/**/}

	ray = [ ];

	for(
		a = 0, aZ = ids.length;
		a < aZ;
		a++
	)
	{
/**/	if( CHECK )
/**/	{
/**/		if( set[ ids[ a ] ] )
/**/		{
/**/			throw new Error( 'duplicate id' );
/**/		}
/**/
/**/		set[ ids[ a ] ] = true;
/**/	}

		ray[ a ] = id.createFromString( ids[ a ] );
	}

	return idRay.create( 'ray:init', ray );
}


} )( );
