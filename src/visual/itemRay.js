/*
| A ray of visual items.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'visual_itemRay',
		ray : require( './typemap-item' )
	};
}


var
	gleam_rectGroup,
	jion,
	jion$pathRay,
	visual_itemRay;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


prototype = visual_itemRay.prototype;


/*
| Returns the ray of paths of the items
*/
jion.lazyValue(
	prototype,
	'itemPaths',
	function( )
{
	var
		a,
		arr,
		arrZ,
		aZ,
		item;

	arr = [ ];

	arrZ = 0;

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.get( a );

		arr[ arrZ++ ] = item.path;
	}

	return jion$pathRay.create( 'ray:init', arr );
}
);


/*
| Returns the ray of zones of the items
*/
jion.lazyValue(
	prototype,
	'zones',
	function( )
{
	var
		a,
		key,
		aZ,
		group,
		item;

	group = { };

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.get( a );

		key = item.path.get( 2 );

/**/	if( CHECK )
/**/	{
/**/		if( group[ key ] ) throw new Error( );
/**/	}

		group[ key ] = item.zone;
	}

	return gleam_rectGroup.create( 'group:init', group );
}
);


})( );
