/*
| A size.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_size',
		attributes :
		{
			height :
			{
				comment : 'the height',
				type : 'number'
			},
			width :
			{
				comment : 'the width',
				type : 'number'
			}
		}
	};
}


var
	euclid_point,
	euclid_rect,
	gleam_size,
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

	gleam_size = jion.this( module, 'source' );
}


prototype = gleam_size.prototype;


/*
| Shortcut to create an gleam_size jion.
*/
gleam_size.wh =
	function(
		width,
		height
	)
{
	return(
		gleam_size.create(
			'width', width,
			'height', height
		)
	);
};


/*
| A rectangle of same size with pnw at 0/0
*/
jion.lazyValue(
	prototype,
	'zeroPnwRect',
	function( )
{
	var
		rect;

	rect =
		euclid_rect.create(
			'pnw', euclid_point.zero,
			'pse',
				euclid_point.create(
					'x', this.width,
					'y', this.height
				)
		);

	jion.aheadValue( rect, 'size', this );

	return rect;
}
);


} )( );
