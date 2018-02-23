/*
| An ellipse.
*/
'use strict';


tim.define( module, ( def, gleam_ellipse ) => {


/*::::::::::::::::::::::::::::.
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

		// center for gradient
		gradientPC : { type : [ 'undefined', './point' ], assign : '_gradientPC' },

		// inner radius for circle gradients
		gradientR0 : { type : [ 'undefined', 'number' ], assign : '_gradientR0' },

		// outer radius for circle gradients
		gradientR1 : { type : [ 'undefined', 'number' ], assign : '_gradientR1' },
	};
}


const gleam_display_canvas = require( './display/canvas' );

const gleam_shape = require( './shape' );

const gleam_shape_round = require( './shape/round' );

const gleam_shape_start = require( './shape/start' );

const gleam_transform = require( './transform' );



/*::::::::::::::::::.
:: Static functions
::::::::::::::::::::*/


/*
| Shortcut to create an ellipse by specifying p and size.
*/
def.static.posSize =
	function(
		pos,
		size
	)
{
	return(
		gleam_ellipse.create(
			'pos', pos,
			'width', size.width,
			'height', size.height
		)
	);
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The center point of gradient.
*/
def.lazy.gradientPC =
	function( )
{
	if( this._gradientPC ) return this._gradientPC;

	return this.pc;
};


/*
| Gradient inner radius.
*/
def.lazy.gradientR1 =
	function( )
{
	if( this._gradientR1 ) { return this._gradientR1; }

	return Math.max( this.width, this.height );
};


/*
| Gradient inner radius.
*/
def.lazy.gradientR0 =
	function( )
{
	if( this._gradientR0 ) return this._gradientR0;

	return 0;
};


/*
| Center point of an ellipse.
*/
def.lazy.pc =
	function( )
{
	return this.pos.add( this.width / 2, this.height / 2 );
};


/*
| East point.
*/
def.lazy.pe =
	function( )
{
	return this.pos.add( this.width, this.height / 2 );
};


/*
| North point.
*/
def.lazy.pn =
	function( )
{
	return this.pos.add( this.width / 2, 0 );
};


/*
| South point.
*/
def.lazy.ps =
	function( )
{
	return this.pos.add( this.width / 2, this.height );
};


/*
| West point.
*/
def.lazy.pw =
	function( )
{
	return this.pos.add( 0, this.height / 2 );
};


/*
| The shape of the ellipse.
*/
def.lazy.shape =
	function( )
{
	return(
		gleam_shape.create(
			'list:init',
			[
				gleam_shape_start.p( this.pw ),
				gleam_shape_round.p( this.pn ),
				gleam_shape_round.p( this.pe ),
				gleam_shape_round.p( this.ps ),
				gleam_shape_round.close
			],
			'pc', this.pc
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns a moved ellipse.
*/
def.func.add =
	function(
		p
	)
{
	return(
		( p.x === 0 && p.y === 0 )
		? this
		: this.create( 'pos', this.pos.add( p.x, p.y ) )
	);
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
	function( /*...*/ )
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

	// FUTURE, this creates gradientSettings even if there were none...
	//         since they fall back on defaults
	return(
		transform.zoom === 1
		? this.add( transform.offset )
		: this.create(
			'pos', this.pos.transform( transform ),
			'width', transform.scale( this.width ),
			'height', transform.scale( this.height ),
			'gradientPC',
				this.gradientPC !== undefined
				? this.gradientPC.transform( transform )
				: pass,
			'gradientR0',
				this.gradientR0 !== undefined
				? transform.scale( this.gradientR0 )
				: pass,
			'gradientR1',
				this.gradientR1 !== undefined
				? transform.scale( this.gradientR1 )
				: pass
		)
	);
};


/*
| Returns true if p is within the ellipse.
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
