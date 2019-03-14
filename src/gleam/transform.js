/*
| A coordinate transformation.
*/
'use strict';


tim.define( module, ( def, gleam_transform ) => {


if( TIM )
{
	def.attributes =
	{
		// coordinate offset
		offset : { type : './point' },

		// the zoom factor
		zoom : { type : 'number' },
	};
}


const gleam_point = tim.require( './point' );



/*
| The normal transform is a transform that doesn't transform.
*/
def.staticLazy.normal = () =>
	gleam_transform.create(
		'offset', gleam_point.zero,
		'zoom', 1
	);


/*
| Returns a transform with the same zoom like this,
| but with a zeroOffset.
*/
def.lazy.ortho =
	function( )
{
	return this.create( 'offset', gleam_point.zero );
};


/*
| Returns a transform which does the same
| as the combination of
| t applied after this transform.
*/
def.proto.combine =
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
				gleam_point.xy(
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
def.proto.dex =
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
def.proto.dey =
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
def.proto.point =
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
| FIXME this should be called 'distance' then
*/
def.proto.scale =
	function(
		d
	)
{
	return this.zoom * d;
};


/*
| Returns a transformed x value.
*/
def.proto.x =
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
def.proto.y =
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
