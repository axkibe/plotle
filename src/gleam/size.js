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
	gleam_point,
	gleam_rect,
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
		gleam_rect.create(
			'pnw', gleam_point.zero,
			'pse',
				gleam_point.create(
					'x', this.width,
					'y', this.height
				)
		);

	jion.aheadValue( rect, 'size', this );

	return rect;
}
);


/*
| A size jion increased by one, height and width.
*/
jion.lazyValue(
	prototype,
	'plusOne',
	function( )
{
	return(
		this.create(
			'height', this.height + 1,
			'width', this.width + 1
		)
	);
}
);


} )( );
