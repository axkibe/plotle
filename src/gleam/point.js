/*
| A point in a 2D plane.
*/
'use strict';


var
	gleam_transform;


tim.define( module, 'gleam_point', ( def, gleam_point ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		x : // x coordinate
		{
			json : true,
			type : 'number',
		},
		y : // y coordinate
		{
			json : true,
			type : 'number',
		}
	};
}


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


/*
| Shortcut for point at 0/0.
*/
def.staticLazy.zero = () =>
	gleam_point.create( 'x', 0, 'y', 0 );


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Shortcut to create a point by x/y values.
*/
def.static.xy =
	function(
		x,
		y
	)
{
	return gleam_point.create( 'x', x, 'y', y);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Adds a points or x/y values, returns a new point.
*/
def.func.add =
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

		return this.create(
			'x', this.x + a1,
			'y', this.y + a2
		);
	}
};


/*
| Returns a point scaled by action.scaleX, action.scaleY
| relative to the action.bPoint.
|
| ax / ay are added afterward.
*/
def.func.baseScale =
	function(
		action,  // action that scales the point
		ax,      // x value to be added
		ay       // y value to be added
	)
{
	const pBase = action.pBase;

	const scaleX = action.scaleX;

	const scaleY = action.scaleY;

	if( scaleX === 1 && scaleY === 1 ) return this.add( ax, ay );

	const x = this.x;

	const y = this.y;

	const bx = pBase.x;

	const by = pBase.y;

	if( x === bx && y === by ) return this.add( ax, ay );

	return(
		this.create(
			'x', ( x - bx ) * scaleX + bx + ax,
			'y', ( y - by ) * scaleY + by + ay
		)
	);
};


/*
| Returns a border bordering this point.
|
| See gleam_shape.border for further explanation.
*/
def.func.border =
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
		this.create(
			'x',
				x +
				(
					x > cx
					?  -d
					: ( x < cx ? d : 0 )
				),
			'y',
				y +
				(
					y > cy
					?  -d
					: ( y < cy ? d : 0 )
				)
		)
	);
};


/*
| Returns a transformed point.
*/
def.func.transform =
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
		: this.create(
			'x', transform.x( this.x ),
			'y', transform.y( this.y )
		)
	);
};


/*
| Returns a detransformed point.
*/
def.func.detransform =
	function(
		transform   // transform to apply reversely.
	)
{
	return(
		this.create(
			'x', transform.dex( this.x ),
			'y', transform.dey( this.y )
		)
	);
};


/*
| Subtracts a point (or x/y from this), returns new point.
*/
def.func.sub =
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

		return this.create(
			'x', this.x - a1.x,
			'y', this.y - a1.y
		);
	}
	else
	{
/**/	if( CHECK )
/**/	{
/**/		if( arguments.length !== 2 ) throw new Error( );
/**/	}

		return this.create(
			'x', this.x - a1,
			'y', this.y - a2
		);
	}
};


} );
