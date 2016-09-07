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
	euclid_transform;


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

	return x * this.zoom + this.pan.x;
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

	return ( x  - this.pan.x ) / this.zoom;
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
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return y * this.zoom + this.pan.y;
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

	return ( y - this.pan.y ) / this.zoom;
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
