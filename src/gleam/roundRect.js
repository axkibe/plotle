/*
| A rectangle with rounded corners.
|
| RoundRects are immutable objects.
|
|      <--> a
|      |  |
|  pos + .----------------. - - - A - - - A
|      .'                  `. _ _ V b     | height
|      |                    |             |
|      |                    |             |
|      |                    |             |
|      |                    |             |
|      '.                  .'             |
|        `----------------' + - - - - - - V
|      |                    |
|      <--------------------> width
*/
'use strict';


tim.define( module, ( def ) => {


/*:::::::::::::::::::::::::::::
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// position
		pos : { type : './point' },

		width : { type : 'number' },

		height : { type : 'number' },

		// horizonal rounding
		a : { type : 'number' },

		// vertical rounding
		b : { type : 'number' },
	};
}


const gleam_display_canvas = require( './display/canvas' );

const gleam_shape = require( './shape' );

const gleam_shape_line = require( './shape/line' );

const gleam_shape_round = require( './shape/round' );

const gleam_shape_start = require( './shape/start' );

const gleam_transform = require( './transform' );


/*::::::::::::::
:: Lazy values
'::::::::::::::*/


/*
| Point in the center.
*/
def.lazy.pc =
	function( )
{
	return this.pos.add( this.width / 2, this.height / 2 );
};


/*
| The shape of the roundRect.
*/
def.lazy.shape =
	function( )
{
	const a = this.a;

	const b = this.b;

	const h = this.height;

	const p = this.pos;

	const w = this.width;

	if( b * 2 + 0.1 >= h )
	{
		return(
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p( p.add( 0 , b ) ),
					gleam_shape_round.p( p.add( a , 0 ) ),
					gleam_shape_line .p( p.add( w - a , 0 ) ),
					gleam_shape_round.p( p.add( w , b ) ),
					gleam_shape_round.p( p.add( w - a , h ) ),
					gleam_shape_line .p( p.add( a , h ) ),
					gleam_shape_round.close
				],
				'pc', this.pc
			)
		);
	}

	return(
		gleam_shape.create(
			'list:init',
			[
				gleam_shape_start.p( p.add( 0 , b ) ),
				gleam_shape_round.p( p.add( a , 0 ) ),
				gleam_shape_line .p( p.add( w - a , 0 ) ),
				gleam_shape_round.p( p.add( w , b ) ),
				gleam_shape_line .p( p.add( w , h - b ) ),
				gleam_shape_round.p( p.add( w - a , h ) ),
				gleam_shape_line .p( p.add( a , h ) ),
				gleam_shape_round.p( p.add( 0 , h - b ) ),
				gleam_shape_line .close
			],
			'pc', this.pc
		)
	);
};


/*::::::::::::
:: Functions
'::::::::::::*/


/*
| Returns a round rect moved by x/y
*/
def.func.add =
	function(
		x,
		y
	)
{
	if( x === 0 && y === 0 ) return this;

	return this.create( 'pos', this.pos.add( x, y ) );
};


/*
| Returns a shape bordering this shape by d.
*/
def.func.border =
	function(
		d // distance to border
	)
{
	return this.shape.border( d );
};


/*
| Gets the source of a projection to p.
*/
def.func.getProjection =
	function( /* ... */ )
{
	return this.shape.getProjection.apply( this.shape, arguments );
};


/*
| Returns a transformed roundRect.
*/
def.func.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	return(
		transform.zoom === 1
		? this.add( transform.offset )
		: this.create(
			'pos', this.pos.transform( transform ),
			'width', transform.scale( this.width ),
			'height', transform.scale( this.height ),
			'a', transform.scale( this.a ),
			'b', transform.scale( this.b )
		)
	);
};


/*
| Returns true if p is within the shape.
*/
def.func.within =
	function(
		p
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return gleam_display_canvas.helper.within( p, this );
};


} );
