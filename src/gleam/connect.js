/*
| Finds the shortest connection between two shapes/points.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_line = tim.require( './line' );

const gleam_point = tim.require( './point' );


/*
| Finds the shortest connection between two shapes/points.
*/
def.static.line =
	function(
		sp1,  // glint1 or point1
		sp2   // glint2 or point2
	)
{
	// the projection points
	let p1, p2;


/**/if( CHECK )
/**/{
/**/	if( !sp1 || !sp2 ) throw new Error( );
/**/}

	const pc1 = sp1.timtype === gleam_point ? sp1 : sp1.pc;

	const pc2 = sp2.timtype === gleam_point ? sp2 : sp2.pc;

	if( sp1.timtype === gleam_point )
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

	if( sp2.timtype === gleam_point )
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

	return gleam_line.create( 'p1', p1, 'p2', p2 );
};


} );
