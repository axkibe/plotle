/*
| A generic geometric shape.
*/


var
	euclid_shape,
	swatch;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return{
		id : 'euclid_shape',
		attributes :
		{
			pc :
			{
				comment : 'center point',
				type : 'euclid_point'
			}
		},
		ray : require( '../typemaps/shapeSection' )
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_shape.prototype;


/*
| Gets the source of a projection to p.
*/
prototype.getProjection =
	function(
		p
	)
{
	var
		pc,
		pi,
		pn,
		pp,
		pstart,
		r,
		rZ,
		section;

	pc = this.pc;

/**/if( CHECK )
/**/{
/**/	if( this.get( 0 ).reflect !== 'euclid_shape_start' )
/**/	{
/**/		// must have start at [0]
/**/		throw new Error( );
/**/	}
/**/}

	pstart = this.get( 0 ).p;

	pp = pstart;

	for( r = 1, rZ = this.length; r < rZ; r++ )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !pstart )
/**/		{
/**/			// closed prematurely
/**/			throw new Error( );
/**/		}
/**/	}

		section = this.get( r );

		if( section.close )
		{
			pn = pstart;

			pstart = undefined;
		}
		else
		{
			pn = section.p;
		}

		pi = section.getProjection( p, pn, pp, pc );

		if( pi ) return pi;

		pp = pn;
	}

	console.log( 'no section created a projection.' );

	return pc;

	// no section created a projection.
	//throw new Error( );
};

/*
| Returns the shape repositioned for 'view'.
*/
prototype.inView =
	function(
		view
	)
{
	var
		a, aZ,
		ray;

	ray = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		ray[ a ] = this.get( a ).inView( view );
	}

	return this.create( 'ray:init', ray );
};


/*
| Returns true if point is within the shape.
*/
prototype.within =
	function(
		p
	)
{
	return swatch.withinSketch( this, p );
};


})( );
