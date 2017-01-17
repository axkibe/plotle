/*
| A line.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_line',
		attributes :
		{
			p1 :
			{
				comment : 'first point',
				type : 'euclid_point'
			},
			p2 :
			{
				comment : 'second point',
				type : 'euclid_point'
			}
		}
	};
}


var
	euclid_point,
	euclid_rect,
	gleam_line,
	jion;


/*
| Capsule
*/
(function(){
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = gleam_line.prototype;


/*
| The zone of the line.
*/
jion.lazyValue(
	prototype,
	'zone',
	function( )
	{
		var
			p1,
			p2;

		p1 = this.p1;

		p2 = this.p2;

		return(
			euclid_rect.create(
				'pnw',
					p1.create(
						Math.min( p1.x, p2.x ),
						Math.min( p1.y, p2.y )
					),
				'pse',
					p2.create(
						Math.max( p1.x, p2.x ),
						Math.max( p1.y, p2.y )
					)
			)
		);
	}
);


/*
| The point at center.
*/
jion.lazyValue(
	prototype,
	'pc',
	function( )
	{
		var
			p1,
			p2;

		p1 = this.p1;

		p2 = this.p2;

		return(
			euclid_point.create(
				'x', ( p1.x + p2.x ) / 2,
				'y', ( p1.y + p2.y ) / 2
			)
		);
	}
);


} )( );
