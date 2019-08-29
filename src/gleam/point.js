/*
| A point in a 2D plane.
*/
'use strict';


tim.define( module, ( def, gleam_point ) => {


if( TIM )
{
	def.attributes =
	{
		// x coordinate
		x : { json : true, type : 'number' },

		// y coordinate
		y : { json : true, type : 'number' },
	};

	def.json = 'point';
}

const gleam_transform = tim.require( './transform' );


/*
| Adds a points or x/y values, returns a new point.
*/
def.proto.add =
	function(
		a1,
		a2
	)
{
	if( typeof( a1 ) === 'object' )
	{
/**/	if( CHECK )
/**/	{
/**/		if( a2 !== undefined ) throw new Error( );
/**/	}

		return this.create(
			'x', this.x + a1.x,
			'y', this.y + a1.y
		);
	}
	else
	{
/**/	if( CHECK )
/**/	{
/**/		if( arguments.length !== 2 ) throw new Error( );
/**/	}

		return gleam_point.createXY( this.x + a1, this.y + a2 );
	}
};


/*
| Returns a point scaled by action.scaleX, action.scaleY
| relative to the action.bPoint.
|
| ax / ay are added afterward.
*/
def.proto.baseScaleAction =
	function(
		action,  // action that scales the point
		ax,      // x value to be added
		ay       // y value to be added
	)
{
	return this.baseScaleXY( action.scaleX, action.scaleY, action.pBase, ax, ay );
};


/*
| Returns a point scaled by scaleX, scaleY
| relative to the action.bPoint.
|
| ax / ay are added afterward.
*/
def.proto.baseScaleXY =
	function(
		scaleX,  // x scaling
		scaleY,  // y scaling
		pBase,   // base point
		ax,      // x value to be added
		ay       // y value to be added
	)
{
	if( scaleX === 1 && scaleY === 1 ) return this.add( ax, ay );

	const x = this.x;

	const y = this.y;

	const bx = pBase.x;

	const by = pBase.y;

	if( x === bx && y === by ) return this.add( ax, ay );

	return(
		gleam_point.createXY(
			( x - bx ) * scaleX + bx + ax,
			( y - by ) * scaleY + by + ay
		)
	);
};


/*
| Returns a border bordering this point.
|
| See gleam_shape.border for further explanation.
*/
def.proto.border =
	function(
		pc,  // center point to border relatively to
		d    // distance to border
	)
{
	const x = this.x;

	const y = this.y;

	const cx = pc.x;

	const cy = pc.y;

	return(
		gleam_point.createXY(
			x + ( x > cx ?  -d : ( x < cx ? d : 0 ) ),
			y + ( y > cy ?  -d : ( y < cy ? d : 0 ) )
		)
	);
};


/*
| Shortcut to create a point by x/y values.
*/
def.static.createXY =
	( x, y ) =>
	gleam_point.create( 'x', x, 'y', y );


/*
| Returns a detransformed point.
*/
def.proto.detransform =
	function(
		transform   // transform to apply reversely.
	)
{
	return gleam_point.createXY( transform.dex( this.x ), transform.dey( this.y ) );
};


/*
| This point negated.
*/
def.lazy.negate =
	function( )
{
	const p = gleam_point.createXY( -this.x, -this.y );

	tim.aheadValue( p, 'negate', this );

	return p;
};


/*
| Subtracts a point (or x/y from this), returns new point.
*/
def.proto.sub =
	function(
		a1,
		a2
	)
{
	if( typeof( a1 ) === 'object' )
	{
/**/	if( CHECK )
/**/	{
/**/		if( a2 !== undefined ) throw new Error( );
/**/	}

		if( a1.x === 0 && a1.y === 0 ) return this;

		return gleam_point.createXY( this.x - a1.x, this.y - a1.y );
	}
	else
	{
/**/	if( CHECK )
/**/	{
/**/		if( arguments.length !== 2 ) throw new Error( );
/**/	}

		return gleam_point.createXY( this.x - a1, this.y - a2 );
	}
};


/*
| Returns a transformed point.
*/
def.proto.transform =
	function(
		transform  // transform to apply
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	return(
		transform.zoom === 1
		? this.add( transform.offset )
		: gleam_point.createXY( transform.x( this.x ), transform.y( this.y ) )
	);
};


/*
| Shortcut for point at 0/0.
*/
def.staticLazy.zero = ( ) => gleam_point.createXY( 0, 0 );


} );
