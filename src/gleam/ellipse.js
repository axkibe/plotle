/*
| An ellipse.
*/
'use strict';


tim.define( module, ( def, gleam_ellipse ) => {


if( TIM )
{
	def.attributes =
	{
		// center for gradient
		gradientPC : { type : [ 'undefined', './point' ] },

		// inner radius for circle gradients
		gradientR0 : { type : [ 'undefined', 'number' ] },

		// outer radius for circle gradients
		gradientR1 : { type : [ 'undefined', 'number' ] },

		// height of the ellipse
		height : { type : 'number' },

		// width of the ellipse
		width : { type : 'number' },

		// position
		pos : { type : './point' },
	};
}


const angle = tim.require( './angle/root' );
const gleam_display_canvas = tim.require( './display/canvas' );
const gleam_shape = tim.require( './shape' );
const gleam_shape_round = tim.require( './shape/round' );
const gleam_shape_start = tim.require( './shape/start' );
const gleam_transform = tim.require( './transform' );


/*
| Returns a moved ellipse.
*/
def.proto.add =
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
| Shortcut to create an ellipse by specifying p and size.
*/
def.static.createPosSize =
	function(
		pos,
		size
	)
{
	return(
		gleam_ellipse.create(
			'height', size.height,
			'pos', pos,
			'width', size.width
		)
	);
};


/*
| The center point of gradient.
*/
def.adjust.gradientPC = function( gradientPC ) { return gradientPC || this.pc; };


/*
| Gradient inner radius.
*/
def.adjust.gradientR0 = function( gradientR0 ) { return gradientR0 || 0; };


/*
| Gradient inner radius.
*/
def.adjust.gradientR1 =
	function(
		gradientR1
	)
{
	if( gradientR1 !== undefined ) return gradientR1;

	return Math.max( this.width, this.height );
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
def.lazy.pn = function( ) { return this.pos.add( this.width / 2, 0 ); };


/*
| South point.
*/
def.lazy.ps = function( ) { return this.pos.add( this.width / 2, this.height ); };


/*
| West point.
*/
def.lazy.pw = function( ) { return this.pos.add( 0, this.height / 2 ); };


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
				gleam_shape_start.createPFun( this.pw, angle.w ),
				gleam_shape_round.createPFun( this.pn, angle.n ),
				gleam_shape_round.createPFun( this.pe, angle.e ),
				gleam_shape_round.createPFun( this.ps, angle.s ),
				gleam_shape_round.close
			],
			'pc', this.pc
		)
	);
};


/*
| Returns a shape funneled by d.
*/
def.proto.funnel =
	function(
		d // distance
	)
{
	return this.shape.funnel( d );
};


/*
| Gets the source of a projection to p.
*/
def.proto.getProjection =
	function( /*...*/ )
{
	return this.shape.getProjection.apply( this.shape, arguments );
};


/*
| Returns a transformed roundRect.
*/
def.proto.transform =
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
def.proto.within =
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
