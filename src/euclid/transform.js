/*
| A coordinate transformation.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'euclid_transform',
		attributes :
		{
			offset :
			{
				comment : 'coordinate offset',
				type : 'euclid_point'
			},
			zoom :
			{
				comment : 'the zoom factor',
				type : 'number'
			}
		}
	};
}


var
	euclid_point,
	euclid_transform,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


prototype = euclid_transform.prototype;


/*
| Returns a transform which does the same
| as the combination of
| t applied after this transform.
*/
prototype.combine =
	function(
		t
	)
{
	var
		tzoom;

	tzoom = t.zoom;

	return(
		euclid_transform.create(
			'offset',
				euclid_point.create(
					'x', this.offset.x * tzoom + t.offset.x,
					'y', this.offset.y * tzoom + t.offset.y
				),
			'zoom',
				this.zoom * tzoom
		)
	);
};


/*
| Returns a reverse transformed x value.
*/
prototype.dex =
	function(
		x
	)
{

/**/if( CHECK )
/**/{
/**/	if( typeof( x ) !== 'number' || arguments.length !== 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return ( x  - this.offset.x ) / this.zoom;
};


/*
| Returns the reverse transformed y value.
*/
prototype.dey =
	function(
		y
	)
{

/**/if( CHECK )
/**/{
/**/	if( typeof( y ) !== 'number' || arguments.length !== 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return ( y - this.offset.y ) / this.zoom;
};


/*
| Returns a transform with the same zoom like this,
| but with a zeroOffset.
*/
jion.lazyValue(
	prototype,
	'ortho',
	function( )
{
	return this.create( 'offset', euclid_point.zero );
}
);


/*
| Creates a transformed point.
*/
prototype.point =
	function(
		x,
		y
	)
{
	return(
		euclid_point.create(
			'x', this.x( x ),
			'y', this.y( y )
		)
	);
};


/*
| Returns a transformed distance.
*/
prototype.scale =
	function(
		d
	)
{
	return this.zoom * d;
};


/*
| Returns a transformed x value.
*/
prototype.x =
	function(
		x
	)
{
/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( x ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return x * this.zoom + this.offset.x;
};


/*
| Returns a transformed y value.
*/
prototype.y =
	function(
		y
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( y ) !== 'number'
/**/		|| arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return y * this.zoom + this.offset.y;
};


/*
| The normal transform is a transform that doesn't transform.
*/
euclid_transform.normal =
	euclid_transform.create(
		'offset', euclid_point.zero,
		'zoom', 1
	);


} )( );
