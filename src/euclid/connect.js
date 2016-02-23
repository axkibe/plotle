/*
| Finds the shortest connection between two shapes/points.
*/


var
	euclid_connect,
	euclid_line;


/*
| Capsule
*/
( function( ) {
'use strict';


euclid_connect = { };


/*
| Finds the shortest connection between two shapes/points.
*/
euclid_connect.line =
	function(
		sp1,  // shape1 or point1
		sp2   // shape2 or point2
	)
{
	var
		// the projection points
		p1,
		p2,
		// the center points
		pc1,
		pc2;


/**/if( CHECK )
/**/{
/**/	if( !sp1 || !sp2 ) throw new Error( );
/**/}

	pc1 =
		sp1.reflect === 'euclid_point'
		? sp1
		: sp1.pc;

	pc2 =
		sp2.reflect === 'euclid_point'
		? sp2
		: sp2.pc;

	if( sp1.reflect === 'euclid_point' )
	{
		p1 = sp1;
	}
	else if( sp1.within( pc2 ) )
	{
		p1 = pc1;
	}
	else
	{
		p1 = sp1.getProjection( pc2 );
	}

	if( sp2.reflect === 'euclid_point' )
	{
		p2 = sp2;
	}
	else if( sp2.within( pc1 ) )
	{
		p2 = pc2;
	}
	else
	{
		p2 = sp2.getProjection( pc1 );
	}

	return(
		euclid_line.create(
			'p1', p1,
			'p2', p2
		)
	);
};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( euclid_connect );
/**/}

} )( );
