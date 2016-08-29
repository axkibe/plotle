/*
| A facet of an element.
|
| for example hover, focus or down.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_facet',
		attributes :
		{
			border :
			{
				comment : 'border',
				type :
					require( '../typemaps/border' )
					.concat( [ 'undefined' ] )
			},
			fill :
			{
				comment : 'fill',
				type :
					require( '../typemaps/fill' )
					.concat( [ 'undefined' ] )
			}
		},
		group : [ 'boolean' ]
	};
}


var
	jion,
	gleam_color,
	gleam_facet;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = gleam_facet.prototype;


/*
| A simple black fill.
*/
jion.lazyStaticValue(
	gleam_facet,
	'blackFill',
	function( )
{
	return(
		gleam_facet.create(
			'fill', gleam_color.black
		)

	);
}
);


/*
| A simple white fill.
*/
jion.lazyStaticValue(
	gleam_facet,
	'whiteFill',
	function( )
{
	return(
		gleam_facet.create(
			'fill', gleam_color.white
		)

	);
}
);

})( );
