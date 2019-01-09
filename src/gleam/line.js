/*
| A line.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		p1 : { type : './point' },

		p2 : { type : './point' }
	};
}


const gleam_point = require( './point' );

const gleam_rect = require( './rect' );


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
