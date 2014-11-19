/*
| An arrow is a line that can have arrow heads.
*/


/*
| Export
*/
var
	euclid;


euclid = euclid || { };


/*
| Imports
*/
var
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
			'euclid.arrow',
		attributes :
			{
				p1 :
					{
						comment :
							'first point',
						type :
							'euclid.point'
					},
				p1end :
					{
						comment :
							'end style of first point',
						type :
							'String',
						allowsNull :
							true
					},
				p2 :
					{
						comment :
							'second point',
						type :
							'euclid.point'
					},
				p2end :
					{
						comment :
							'end style of second point',
						type :
							'String',
						allowsNull :
							true
					}
			}
	};
}


var
	arrow,
	arrowSize;

arrow = euclid.arrow;

arrowSize = 12;

/*
| Returns the arrow connecting shape1 to shape2
*/
arrow.connect =
	function(
		shape1,  // a rect or point
		end1,    // 'normal' or 'arrow'
		shape2,  // shape2: a rect or point
		end2     // 'normal' or 'arrow'
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
/**/	if( !shape1 || !shape2 )
/**/	{
/**/		// line.connect() missing shape1 or shape2
/**/		throw new Error( );
/**/	}
/**/}

	if( shape1.reflect === 'euclid.point' )
	{
		pc1 = shape1;
	}
	else
	{
		pc1 = shape1.pc;
	}

	if( shape2.reflect === 'euclid.point' )
	{
		pc2 = shape2;
	}
	else
	{
		pc2 = shape2.pc;
	}

	if( shape1.reflect === 'euclid.point' )
	{
		p1 = shape1;
	}
	else if( shape1.within( euclid.view.proper, pc2 ) )
	{
		p1 = pc1;
	}
	else
	{
		p1 = shape1.getProjection( pc2 );
	}

	if( shape2.reflect === 'euclid.point' )
	{
		p2 = shape2;
	}
	else if( shape2.within( euclid.view.proper, pc1 ) )
	{
		p2 = pc2;
	}
	else
	{
		p2 = shape2.getProjection( pc1 );
	}

	return(
		arrow.create(
			'p1',
				p1,
			'p1end',
				end1,
			'p2',
				p2,
			'p2end',
				end2
		)
	);
};


/*
| The line of the arrow.
*/
jools.lazyValue(
	arrow.prototype,
	'line',
	function( )
	{
		return(
			euclid.line.create(
				'p1',
					this.p1,
				'p2',
					this.p2
			)
		);
	}
);


/*
| The zone of the arrow.
*/
jools.lazyValue(
	arrow.prototype,
	'zone',
	function( )
	{
		return this.line.zone;
	}
);


/*
| The point at center.
*/
jools.lazyValue(
	arrow.prototype,
	'pc',
	function( )
	{
		return this.line.pc;
	}
);


/*
| Returns the shape of the arrow.
*/
jools.lazyValue(
	arrow.prototype,
	'_shape',
	function( )
	{
		var
			ad,
			arrowBase,
			cos,
			d,
			hull,
			p1,
			p2,
			ms,
			round,
			sin;

		p1 = this.p1;

		p2 = this.p2;

		hull = [ ];

		// FUTURE, allow arrows on p1.
		switch( this.p1end )
		{
			case 'normal':

				hull.push(
					'start',
						p1
				);

				break;

			default :

				// unknown arrow end
				throw new Error( );
		}

		switch( this.p2end )
		{
			case 'normal' :

				hull.push(
					'line',
						p2
				);

				break;

			case 'arrow' :

				cos = Math.cos;

				sin = Math.sin;

				round = Math.round;

				// degree of arrow tail
				d = Math.atan2( p2.y - p1.y, p2.x - p1.x );

				// degree of arrow head
				ad = Math.PI / 12;

				// arrow span
				// the arrow is formed as hexagon piece
				ms = 2 / Math.sqrt(3) * arrowSize;

				arrowBase =
					p2.fixPoint(
						-round( ms * cos( d ) ),
						-round( ms * sin( d ) )
					);

				hull.push(
					'line',
						arrowBase,
					'line',
						p2.fixPoint(
							-round( arrowSize * cos( d - ad ) ),
							-round( arrowSize * sin( d - ad ) )
						),
					'line',
						p2,
					'line',
						p2.fixPoint(
							-round( arrowSize * cos( d + ad ) ),
							-round( arrowSize * sin( d + ad ) )
						),
					'line',
						arrowBase
				);


				break;

			default :

				// unknown arrow end
				throw new Error( );
		}

		hull.push(
			'0-line',
				'close'
		);

		return(
			euclid.shape.create(
				'hull',
					hull,
				'pc',
					this.pc
			)
		);
	}
);


/*
| Displays the arrow.
*/
arrow.prototype.draw =
	function(
		display,
		view,
		style
	)
{
	display.paint( style, this._shape, view );
};


} )( );
