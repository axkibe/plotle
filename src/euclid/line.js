/*
| A line.
*/


var
	euclid_line,
	euclid_point,
	euclid_rect,
	jools;


/*
| Capsule
*/
(function(){
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'euclid_line',
		attributes :
			{
				p1 :
					{
						comment :
							'first point',
						type :
							'euclid_point'
					},
				p2 :
					{
						comment :
							'second point',
						type :
							'euclid_point'
					}
			}
	};
}


/*
| The zone of the line.
*/
jools.lazyValue(
	euclid_line.prototype,
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
					euclid_point.renew(
						Math.min( p1.x, p2.x ),
						Math.min( p1.y, p2.y ),
						p1,
						p2
					),
				'pse',
					euclid_point.renew(
						Math.max( p1.x, p2.x ),
						Math.max( p1.y, p2.y ),
						p1,
						p2
					)
			)
		);
	}
);


/*
| The point at center.
*/
jools.lazyValue(
	euclid_line.prototype,
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
				'x', jools.half( p1.x + p2.x ),
				'y', jools.half( p1.y + p2.y )
			)
		);
	}
);


} )( );
