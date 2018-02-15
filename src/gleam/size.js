/*
| A size.
|
| Positionless dimensions.
*/
'use strict';


tim.define( module, ( def, self ) => {


const gleam_point = require( './point' );

const gleam_rect = require( './rect' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		height : { type : 'number' },

		width : { type : 'number' }
	};
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Shortcut to create an gleam_size tim.
*/
def.static.wh =
	function(
		width,
		height
	)
{
	return self.create( 'width', width, 'height', height );
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Point in the center.
*/
def.lazy.pc =
	function( )
{
	return gleam_point.xy( this.width / 2, this.height / 2 );
};


/*
| A size tim increased by one height and width.
*/
def.lazy.enlarge1 =
	function( )
{
	const result = this.add( 1, 1 );

	tim.aheadValue( result, 'shrink1', this );

	return result;
};


/*
| A size tim decreased by one height and width.
*/
def.lazy.shrink1 =
	function( )
{
	const result = this.add( -1, -1 );

	tim.aheadValue( result, 'enlarge1', this );

	return result;
};


/*
| A rectangle of same size with p at 0/0
*/
def.lazy.zeroRect =
	function( )
{
	const rect =
		gleam_rect.create(
			'pos', gleam_point.zero,
			'width', this.width,
			'height', this.height
		);

	tim.aheadValue( rect, 'size', this );

	return rect;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns a size tim enlarged by w/h.
*/
def.func.add =
	function(
		w,
		h
	)
{
	return(
		this.create(
			'width', this.width + w,
			'height', this.height + h
		)
	);
};


} );
