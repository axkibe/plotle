/*
| Finds the shortest connection between two shapes/points.
*/


var
	gleam_connect,
	euclid_line;


/*
| Capsule
*/
( function( ) {
'use strict';


gleam_connect = { };


/*
| Finds the shortest connection between two shapes/points.
*/
gleam_connect.line =
	function(
		sp1,  // glint1 or point1
		sp2   // glint2 or point2
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
		: sp1.shape.pc;

	pc2 =
		sp2.reflect === 'euclid_point'
		? sp2
		: sp2.shape.pc;

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
		p1 = sp1.shape.getProjection( pc2 );
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
		p2 = sp2.shape.getProjection( pc1 );
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
/**/	Object.freeze( gleam_connect );
/**/}

} )( );
