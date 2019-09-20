/*
| A size.
|
| Positionless dimensions.
*/
'use strict';


tim.define( module, ( def, gleam_size ) => {


if( TIM )
{
	def.attributes =
	{
		height : { type : 'number' },

		width : { type : 'number' },
	};
}

const gleam_point = tim.require( './point' );
const gleam_rect = tim.require( './rect' );


/*
| Shortcut to create an gleam_size tim.
*/
def.static.wh = // FIXME remove this one
def.static.createWH =
	function(
		width,
		height
	)
{
	return gleam_size.create( 'width', width, 'height', height );
};


/*
| Point in the center.
*/
def.lazy.pc =
	function( )
{
	return gleam_point.createXY( this.width / 2, this.height / 2 );
};


/*
| A size tim enlarged or shrinked by p in height and width.
*/
def.lazyFunc.funnel =
	function(
		p
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( p ) !== 'number' ) throw new Error( );
/**/}

	const result = this.add( p, p );
	tim.aheadValue( result, 'funnel', -p, this );
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


/*
| Returns a size tim enlarged by w/h.
*/
def.proto.add =
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
