/*
| A list of visual items.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'visual_itemList',
		list : require( './typemap-item' )
	};
}


var
	gleam_rectGroup,
	jion,
	jion$pathList,
	visual_itemList;


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


prototype = visual_itemList.prototype;


/*
| Returns the list of paths of the items.
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

	return jion$pathList.create( 'list:init', arr );
}
);


/*
| Returns the list of zones of the items.
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
