/*
| A line.
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
		id :
			'euclid.line',
		attributes :
			{
				p1 :
					{
						comment :
							'first point',
						type :
							'euclid.point'
					},
				p2 :
					{
						comment :
							'second point',
						type :
							'euclid.point'
					}
			}
	};
}


var
	line;

line = euclid.line;


/*
| The zone of the line.
*/
jools.lazyValue(
	line.prototype,
	'zone',
	function( )
	{
		var
			p1,
			p2;

		p1 = this.p1;

		p2 = this.p2;

		return(
			euclid.rect.create(
				'pnw',
					euclid.point.renew(
						Math.min( p1.x, p2.x ),
						Math.min( p1.y, p2.y ),
						p1,
						p2
					),
				'pse',
					euclid.point.renew(
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
	line.prototype,
	'pc',
	function( )
	{
		var
			p1,
			p2;

		p1 = this.p1;

		p2 = this.p2;

		return(
			euclid.point.create(
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
		p1x,
		p1y,
		p2x,
		p2y;

	if( !twist )
	{
		return;
	}

	p1x = view.x( this.p1.x );

	p1y = view.y( this.p1.y );

	p2x = view.x( this.p2.x );

	p2y = view.y( this.p2.y );

	fabric.moveTo( p1x, p1y );

	fabric.lineTo( p2x, p2y );
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
		view
	);
};


} )( );
