/*
| A line.
*/
'use strict';


tim.define( module, ( def, gleam_line ) => {


if( TIM )
{
	def.attributes =
	{
		p1 : { type : './point' },

		p2 : { type : './point' },
	};
}


const gleam_point = tim.require( './point' );

const gleam_rect = tim.require( './rect' );


/*
| Finds the shortest connection between two shapes/points.
*/
def.static.createConnection =
	function(
		sp1,  // glint1 or point1
		sp2   // glint2 or point2
	)
{
/**/if( CHECK )
/**/{
/**/	if( !sp1 || !sp2 ) throw new Error( );
/**/}

	const pc1 = sp1.timtype === gleam_point ? sp1 : sp1.pc;

	const pc2 = sp2.timtype === gleam_point ? sp2 : sp2.pc;

	// the projection points
	let p1, p2;

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


/*
| The point at center.
*/
def.lazy.pc =
	function( )
{
	const p1 = this.p1;

	const p2 = this.p2;

	return(
		gleam_point.create(
			'x', ( p1.x + p2.x ) / 2,
			'y', ( p1.y + p2.y ) / 2
		)
	);
};


/*
| The zone of the line.
*/
def.lazy.zone =
	function( )
{
	return gleam_rect.createArbitrary( this.p1, this.p2 );
};


} );
