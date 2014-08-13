/*
| A line.
|
| It can have arrow heads.
|
| Authors: Axel Kittenberger
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
		name :
			'line',
		unit :
			'euclid',
		attributes :
			{
				p1 :
					{
						comment :
							'first point',
						type :
							'Point'
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
							'Point'
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
	line;

line = euclid.line;


/*
| Returns the line connecting shape1 to shape2
*/
line.connect =
	function(
		shape1,  // a Rect or Point
		end1,    // 'normal' or 'arrow'
		shape2,  // shape2: a Rect or Point
		end2     // 'normal' or 'arrow'
	)
{

/**/if( CHECK )
/**/{
/**/	if( !shape1 || !shape2 )
/**/	{
/**/		throw new Error(
/**/			'line.connect() missing shape1 or shape2'
/**/		);
/**/	}
/**/}

	// the center points

	var
		pc1,
		pc2;

	if( shape1.reflex === 'euclid.point' )
	{
		pc1 = shape1;
	}
	else
	{
		pc1 = shape1.pc;
	}

	if( shape2.reflex === 'euclid.point' )
	{
		pc2 = shape2;
	}
	else
	{
		pc2 = shape2.pc;
	}

	// the projection points
	var
		p1,
		p2;

	if
	(
		shape1.reflex === 'euclid.point'
	)
	{
		p1 = shape1;
	}
	else if
	(
		shape1.within( euclid.View.proper, pc2 )
	)
	{
		p1 = pc1;
	}
	else
	{
		p1 = shape1.getProjection( pc2 );
	}

	if
	(
		shape2.reflex === 'euclid.point'
	)
	{
		p2 =
			shape2;
	}
	else if
	(
		shape2.within( euclid.View.proper, pc1 )
	)
	{
		p2 =
			pc2;
	}
	else
	{
		p2 =
			shape2.getProjection( pc1 );
	}

	return line.create(
		'p1',
			p1,
		'p1end',
			end1,
		'p2',
			p2,
		'p2end',
			end2
	);
};


/*
| The zone of the arrow.
*/
jools.lazyValue(
	line.prototype,
	'zone',
	function()
	{
		var
			p1 =
				this.p1,

			p2 =
				this.p2;

		return euclid.Rect.create(
			'pnw',
				euclid.Point.renew(
					Math.min( p1.x, p2.x ),
					Math.min( p1.y, p2.y ),
					p1,
					p2
				),
			'pse',
				euclid.Point.renew(
					Math.max( p1.x, p2.x ),
					Math.max( p1.y, p2.y ),
					p1,
					p2
				)
		);
	}
);


/*
| The point at center.
*/
jools.lazyValue(
	line.prototype,
	'pc',
	function() {
		var
			p1 =
				this.p1,

			p2 =
				this.p2;

		return (
			euclid.Point.create(
				'x',
					jools.half( p1.x + p2.x ),
				'y',
					jools.half( p1.y + p2.y )
			)
		);
	}
);


/*
| Sketches the line.
*/
line.prototype.sketch =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	var
		p1x =
			view.x( this.p1.x ),

		p1y =
			view.y( this.p1.y ),

		p2x =
			view.x( this.p2.x ),

		p2y =
			view.y( this.p2.y );

	// @@, multiple line end types
	switch(this.p1end)
	{
		case 'normal':
			if( twist )
			{
				fabric.moveTo( p1x, p1y );
			}
			break;

		default :
			throw new Error(
				CHECK &&
				'unknown line end'
			);
	}

	switch(this.p2end)
	{
		case 'normal' :

			if( twist )
			{
				fabric.lineTo( p2x, p2y );
			}
			break;

		case 'arrow' :

			var
				cos =
					Math.cos,

				sin =
					Math.sin,

				ro =
					Math.round,

				// arrow size
				as =
					12,

				// degree of arrow tail
				d =
					Math.atan2(p2y - p1y, p2x - p1x),

				// degree of arrow head
				ad =
					Math.PI/12,

				// arrow span
				// the arrow is formed as hexagon piece
				ms =
					2 / Math.sqrt(3) * as;

			if (twist)
			{
				fabric.lineTo(
					p2x - ro( ms * cos( d ) ),
					p2y - ro( ms * sin( d ) )
				);
			}
			else
			{
				fabric.moveTo(
					p2x - ro( ms * cos( d ) ),
					p2y - ro( ms * sin( d ) )
				);
			}

			fabric.lineTo(
				p2x - ro( as * cos( d - ad ) ),
				p2y - ro( as * sin( d - ad ) )
			);

			fabric.lineTo(
				p2x,
				p2y
			);

			fabric.lineTo(
				p2x - ro( as * cos( d + ad ) ),
				p2y - ro( as * sin( d + ad ) )
			);

			fabric.lineTo(
				p2x - ro( ms * cos( d ) ),
				p2y - ro( ms * sin( d ) )
			);

			break;

		default :
			throw new Error(
				CHECK
				&&
				'unknown line end'
			);
	}
};


/*
| Draws the line.
*/
line.prototype.draw =
	function(
		fabric,
		view,
		style
	)
{
	fabric.paint(
		style,
		this,
		'sketch',
		view
	);
};


} )( );
