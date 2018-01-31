/*
| A coordinate transformation.
*/
'use strict';


tim.define( module, 'gleam_transform', ( def, gleam_transform ) => {


const gleam_point = require( './point' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
			offset :
			{
				comment : 'coordinate offset',
				type : 'gleam_point'
			},
			zoom :
			{
				comment : 'the zoom factor',
				type : 'number'
			}
	};
}


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


/*
| The normal transform is a transform that doesn't transform.
*/
def.staticLazy.normal = () =>
	gleam_transform.create(
		'offset', gleam_point.zero,
		'zoom', 1
	);


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Returns a transform with the same zoom like this,
| but with a zeroOffset.
*/
def.lazy.ortho =
	function( )
{
	return this.create( 'offset', gleam_point.zero );
};



/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns a transform which does the same
| as the combination of
| t applied after this transform.
*/
def.func.combine =
	function(
		t
	)
{
	const offset = this.offset;

	const toffset = t.offset;

	const tzoom = t.zoom;

	return(
		gleam_transform.create(
			'offset',
				gleam_point.create.xy(
					offset.x * tzoom + toffset.x,
					offset.y * tzoom + toffset.y
				),
			'zoom', this.zoom * tzoom
		)
	);
};


/*
| Returns a reverse transformed x value.
*/
def.func.dex =
	function(
		x
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( x ) !== 'number' || arguments.length !== 1 ) throw new Error( );
/**/}

	return ( x  - this.offset.x ) / this.zoom;
};


/*
| Returns the reverse transformed y value.
*/
def.func.dey =
	function(
		y
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( y ) !== 'number' || arguments.length !== 1 ) throw new Error( );
/**/}

	return ( y - this.offset.y ) / this.zoom;
};


/*
| Creates a transformed point.
*/
def.func.point =
	function(
		x,
		y
	)
{
	return gleam_point.xy( this.x( x ), this.y( y ) );
};


/*
| Returns a transformed distance.
|
| FIXME this should be called 'd' then
*/
def.func.scale =
	function(
		d
	)
{
	return this.zoom * d;
};


/*
| Returns a transformed x value.
*/
def.func.x =
	function(
		x
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( x ) !== 'number' || arguments.length !== 1	) throw new Error( );
/**/}

	return x * this.zoom + this.offset.x;
};


/*
| Returns a transformed y value.
*/
def.func.y =
	function(
		y
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( y ) !== 'number' || arguments.length !== 1) throw new Error( );
/**/}

	return y * this.zoom + this.offset.y;
};


} );
