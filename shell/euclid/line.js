/*
| A line.
| It can have arrow heads.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Euclid;

Euclid =
	Euclid || { };


/*
| Imports
*/
var
	Jools;


/*
| Capsule
*/
(function(){
'use strict';


/*
| Constructor.
|
| p1: point 1
| p1end: 'normal' or 'arrow'
| p2: point 1
| p2end: 'normal' or 'arrow'
*/
var Line =
Euclid.Line =
	function(
		p1,
		p1end,
		p2,
		p2end
	)
{
	this.p1    = p1;
	this.p1end = p1end;
	this.p2    = p2,
	this.p2end = p2end;

	Jools.immute(this);
};


/*
| Returns the line connecting entity1 to entity2
*/
Line.connect =
	function(
		shape1,  // a Rect or Point
		end1,    // 'normal' or 'arrow'
		shape2,  // shape2: a Rect or Point
		end2     // 'normal' or 'arrow'
	)
{
	if( !shape1 || !shape2 )
	{
		throw new Error( 'Line.connect() missing shape1 or shape2' );
	}

	// the center points

	var pc1, pc2;

	if( shape1 instanceof Euclid.Point )
	{
		pc1 = shape1;
	}
	else
	{
		pc1 = shape1.pc;

	}

	if( shape2 instanceof Euclid.Point )
	{
		pc2 = shape2;
	}
	else
	{
		pc2 = shape2.pc;

	}

	// the projection points

	var p1, p2;

	if( shape1 instanceof Euclid.Point )
	{
		p1 = shape1;
	}
	else if( shape1.within( Euclid.View.proper, pc2 ) )
	{
		p1 = pc1;
	}
	else
	{
		p1 = shape1.getProjection( pc2 );
	}

	if( shape2 instanceof Euclid.Point )
	{
		p2 = shape2;
	}
	else if( shape2.within( Euclid.View.proper, pc1 ) )
	{
		p2 = pc2;
	}
	else
	{
		p2 = shape2.getProjection( pc1 );
	}

	return new Line(
		p1,
		end1,
		p2,
		end2
	);
};


/*
| Returns the zone of the arrow.
*/
Jools.lazyFixate(
	Line.prototype,
	'zone',
	function()
	{
		var
			p1 =
				this.p1,

			p2 =
				this.p2;

		return Euclid.Rect.create(
			'pnw',
				Euclid.Point.renew(
					Math.min( p1.x, p2.x ),
					Math.min( p1.y, p2.y ),
					p1,
					p2
				),
			'pse',
				Euclid.Point.renew(
					Math.max( p1.x, p2.x ),
					Math.max( p1.y, p2.y ),
					p1,
					p2
				)
		);
	}
);


/*
| Returns the point at center.
*/
Jools.lazyFixate(
	Line.prototype,
	'pc',
	function() {
		var
			p1 =
				this.p1,

			p2 =
				this.p2;

		return (
			Euclid.Point.create(
				'x',
					Jools.half( p1.x + p2.x ),
				'y',
					Jools.half( p1.y + p2.y )
			)
		);
	}
);


/*
| Sketches the line.
*/
Line.prototype.sketch =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	var
		p1x =
			view.x( this.p1 ),

		p1y =
			view.y( this.p1 ),

		p2x =
			view.x( this.p2 ),

		p2y =
			view.y( this.p2 );

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
			throw new Error('unknown line end');
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

			var cos = Math.cos;
			var sin = Math.sin;
			var ro  = Math.round;

			// arrow size
			var as = 12;

			// degree of arrow tail
			var d = Math.atan2(p2y - p1y, p2x - p1x);

			// degree of arrow head
			var ad = Math.PI/12;

			// arrow span, the arrow is formed as hexagon piece
			var ms = 2 / Math.sqrt(3) * as;

			if (twist)
			{
				fabric.lineTo(p2x - ro(ms * cos(d)), p2y - ro(ms * sin(d)));
			}
			else
			{
				fabric.moveTo(p2x - ro(ms * cos(d)), p2y - ro(ms * sin(d)));
			}

			fabric.lineTo(p2x - ro(as * cos(d - ad)), p2y - ro(as * sin(d - ad)));
			fabric.lineTo(p2x, p2y);
			fabric.lineTo(p2x - ro(as * cos(d + ad)), p2y - ro(as * sin(d + ad)));
			fabric.lineTo(p2x - ro(ms * cos(d)), p2y - ro(ms * sin(d)));
			break;

		default :
			throw new Error('unknown line end');
	}
};


/*
| Draws the line.
*/
Line.prototype.draw =
	function(
		fabric,
		view,
		style
	)
{
	if( !style )
	{
		throw new Error('Line.draw misses style');
	}

	fabric.paint(
		style,
		this,
		'sketch',
		view
	);
};


} )( );
