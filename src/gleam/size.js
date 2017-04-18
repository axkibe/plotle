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
| Returns a size jion enlarged by w/h.
| Or reduced by -w/-h
*/
prototype.add =
	function( w, h )
{
	return(
		this.create(
			'width', this.width + w,
			'height', this.height + h
		)
	);
};


/*
| A size jion increased by one, height and width.
|
| FIXME rename enlarge1
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


/*
| A size jion increased by one, height and width.
*/
jion.lazyValue(
	prototype,
	'shrink1',
	function( )
{
	return(
		this.create(
			'height', this.height - 1,
			'width', this.width - 1
		)
	);
}
);


/*
| A rectangle of same size with p at 0/0
*/
jion.lazyValue(
	prototype,
	'zeroRect',
	function( )
{
	var
		rect;

	rect =
		gleam_rect.create(
			'pos', gleam_point.zero,
			'width', this.width,
			'height', this.height
		);

	jion.aheadValue( rect, 'size', this );

	return rect;
}
);


} )( );
