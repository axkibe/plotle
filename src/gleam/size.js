/*
| A size.
|
| Positionless dimensions.
*/
'use strict';


// FIXME
var
	gleam_point,
	gleam_rect;


tim.define( module, 'gleam_size', ( def, gleam_size ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		height :
		{
			type : 'number'
		},
		width :
		{
			type : 'number'
		}
	};
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Shortcut to create an gleam_size jion.
*/
def.static.wh =
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
|
| FIXME aheadValue
*/
def.lazy.enlarge1 =
	function( )
{
	return this.add( 1, 1 );
};


/*
| A size tim decreased by one height and width.
|
| FIXME aheadValue
*/
def.lazy.shrink1 =
	function( )
{
	return this.add( -1, -1 );
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
| Returns a size jion enlarged by w/h.
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
