/*
| This wrapper enhances the HTML5 canvas by using immutable euclidean objects.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var Euclid;

Euclid =
	Euclid || { };


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
|
| TODO: change to free strings
|
| Fabric( )         -or-    creates a new fabric
| Fabric( canvas )  -or-    encloses an existing HTML5 canvas
| Fabric( width, height )   creates a new fabric and sets its size;
*/
var Fabric =
Euclid.Fabric =
	function(
		a1,
		a2
	)
{
	switch( typeof( a1 ) )
	{
		case 'undefined' :

			this._canvas =
				document.createElement( 'canvas' );

			break;

		case 'object' :

			switch( a1.constructor )
			{
				case Fabric :

					this._canvas =
						a1._canvas;

					break;

				case Euclid.RoundRect :
				case Euclid.Rect :

					this._canvas =
						document.createElement( 'canvas' );

					this._canvas.width =
						a1.width;

					this._canvas.height =
						a1.height;

					break;

				default :
					if( !a1.getContext )
					{
						throw new Error( 'Invalid parameter to new Fabric: ' + a1 );
					}

					this._canvas =
						a1;

					break;

			}

			break;

		case 'number' :

			this._canvas =
				document.createElement( 'canvas' );

			this._canvas.width =
				a1;

			this._canvas.height =
				a2;

			break;

		default :
			throw new Error( 'Invalid parameter to new Fabric: ' + a1 );
	}

	this._cx =
		this._canvas.getContext( '2d' );

	// curren positiont ( without twist )
	this._posx =
	this._posy =
		null;

	this.$clip =
		false;
};


/*
| Draws an arc.
|
| arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
*/
Fabric.prototype.arc =
	function(
		a1,
		a2,
		a3,
		a4,
		a5,
		a6
	)
{
	var tw = this._twist, x, y, r, sa, ea, ac;

	if( typeof( a1 ) === 'object' )
	{
		x  = a1.x;
		y  = a1.y;
		r  = a2;
		sa = a3;
		ea = a4;
		ac = a5;
	}
	else
	{
		x  = a1;
		y  = a2;
		r  = a3;
		sa = a4;
		ea = a5;
		ac = a6;
	}

	this._cx.arc(
		x + tw,
		y + tw,
		r,
		sa,
		ea,
		ac
	);
};


/*
| Draws a bezier.
|
| bezier(cp1,  cp2,  p)   -or-
| bezier(cp1x, cp1y, cp2x, cp2y, x, y) -or-
| any combination of points and arguments.
*/
Fabric.prototype.beziTo =
	function( )
{
	var a =
			0,
		aZ =
			arguments.length,
		tw =
			this._twist,
		cp1x,
		cp1y,
		cp2x,
		cp2y,
		x,
		y;

	if( this._posx === null || this._posy === null )
	{
		throw new Error( 'beziTo: pFail' );
	}

	if( a >= aZ )
	{
		throw new Error( 'beziTo: aFail' );
	}

	if( typeof( arguments[ a ] ) === 'object' )
	{
		cp1x =
			arguments[ a ].x;

		cp1y =
			arguments[ a++ ].y;
	}
	else
	{
		cp1x =
			arguments[ a++ ];

		if (a >= aZ)
		{
			throw new Error( 'beziTo: aFail' );
		}

		cp1y =
			arguments[ a++ ];
	}

	if( a >= aZ )
	{
		throw new Error('beziTo: aFail');
	}


	if( typeof( arguments[ a ] ) === 'object' )
	{
		cp2x =
			arguments[ a ].x;

		cp2y =
			arguments[ a++ ].y;
	}
	else
	{
		cp2x =
			arguments[ a++ ];

		if(a >= aZ)
		{
			throw new Error( 'beziTo: aFail' );
		}

		cp2y =
			arguments[ a++ ];
	}

	if(a >= aZ)
	{
		throw new Error( 'beziTo: aFail' );
	}

	if( typeof(arguments[ a ]) === 'object' )
	{
		x =
			arguments[ a ].x;

		y =
			arguments[ a++ ].y;
	}
	else
	{
		x =
			arguments[ a++ ];

		if( a >= aZ )
		{
			throw new Error( 'beziTo: aFail' );
		}

		y =
			arguments[ a++ ];
	}

	cp1x += this._posx + tw;
	cp1y += this._posy + tw;
	cp2x += x + tw;
	cp2y += y + tw;
	this._posx = x;
	this._posy = y;
	x += tw;
	y += tw;

	this._cx.bezierCurveTo(
		cp1x,
		cp1y,
		cp2x,
		cp2y,
		x,
		y
	);
};


/*
| Clips the fabric into a shape.
*/
Fabric.prototype.clip =
	function(
		shape,
		sketch,
		view,
		border,
		a1,
		a2,
		a3,
		a4
	)
{
	var cx =
		this._cx;

	if( !this.$clip )
	{
		cx.save( );

		this.$clip =
			true;
	}

	cx.beginPath( );

	shape[ sketch ](
		this,
		border,
		true,
		view,
		a1,
		a2,
		a3,
		a4
	);

	cx.clip( );
};

/*
| Removes the clipping
*/
Fabric.prototype.deClip =
	function( )
{
	if( !this.$clip )
	{
		throw new Error( 'not clipping!' );
	}

	this.$clip =
		false;

	this._cx.restore( );
};


/*
| Draws an image.
|
| Free string arguments:
|    'image'
|    'point'
|    'x'
|    'y'
|    'composite'
|    'alpha'
|
*/
Fabric.prototype.drawImage =
	function(
		// free strings
	)
{
	var image;

	var x, y, composite, alpha;

	var is =
		Jools.is;

	var a =
		0;

	var aZ =
		arguments.length;

	while( a < aZ )
	{
		var arg =
			arguments[ a++ ];

		switch( arg )
		{
			case 'image' :

				image =
					arguments[ a++ ];

				continue;

			case 'pnw' :

				x =
					arguments[ a ].x;

				y =
					arguments[ a++ ].y;

				continue;

			case 'x' :

				x =
					arguments[ a++ ];

				continue;

			case 'y' :

				y =
					arguments[ a++ ];

				continue;

			case 'composite' :

				composite =
					arguments[ a++ ];

				continue;

			case 'alpha' :

				alpha =
					arguments[ a++ ];

				continue;

			default :

				throw new Error( 'unknown argument: ' + arg );
		}
	}

	if( image instanceof Fabric )
	{
		if(
			!(
				image.width > 0 &&
				image.height > 0
			)
		)
		{
			return;
		}

		image =
			image._canvas;
	}

	if( !is( image ) )
	{
		throw new Error( 'image missing' );
	}

	if( !is( x ) || !is( y ) )
	{
		throw new Error( 'x/y missing' );
	}

	Jools.ensureInt(
		x,
		y
	);

	if( is( composite ) )
	{
		this._cx.globalCompositeOperation = composite;
	}

	var saveAlpha;

	if( is( alpha ) )
	{
		saveAlpha = this._cx.globalAlpha;

		this._cx.globalAlpha = alpha;
	}

	this._cx.drawImage(
		image,
		x,
		y
	);

	if( is( composite ) )
	{
		this._cx.globalCompositeOperation = 'source-over';
	}

	if( is( alpha ) )
	{
		this._cx.globalAlpha = saveAlpha;
	}
};


/*
| Draws an edge.
*/
Fabric.prototype.edge =
	function(
		style,  // the style formated in meshcraft style notation.
		shape,  // an object which has 'sketch'() defined
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var edge =
		style.edge;

	if( edge instanceof Array )
	{
		for( var i = 0; i < edge.length; i++ )
		{
			this._edge(
				edge[ i ],
				shape,
				sketch,
				view,
				a1,
				a2,
				a3,
				a4
			);
		}
	}
	else
	{
		this._edge(
			edge,
			shape,
			sketch,
			view,
			a1,
			a2,
			a3,
			a4
		);
	}
};


/*
| Draws a filled area.
*/
Fabric.prototype.fill =
	function(
		style,   // the style formated in meshcraft style notation.
		shape,   // an object which has 'sketch'() defined
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		fill =
			style.fill,

		cx =
			this._cx;

	this._$font =
		null;

	this._begin( false );

	shape[ sketch ](
		this,
		0,
		false,
		view,
		a1,
		a2,
		a3,
		a4
	);

	cx.fillStyle =
		this._colorStyle(
			fill,
			shape,
			view
		);

	if( this._twist !== 0 )
	{
		throw new Error(
			'wrong twist'
		);
	}

	cx.fill( );
};


/*
| Draws some text.
|
| Free string arguments
|
| 'xy'   ( x, y )
|      base point of text
|
| 'font' ( font )
|      font to draw the text in
|
| 'rotate' ( degree )
|      text is rotated by degree
*/
Fabric.prototype.paintText =
	function(
		// free strings
	)
{
	var text;
	var x;
	var y;
	var font;
	var rotate = null;

	var a = 0;
	var aZ = arguments.length;
	var p;

	while( a < aZ )
	{
		switch( arguments[ a ] )
		{
			case 'text' :

				text = arguments[ a + 1 ];

				a += 2;

				continue;

			case 'xy' :

				x = arguments[ a + 1 ];

				y = arguments[ a + 2 ];

				a += 3;

				continue;

			case 'p' :

				p = arguments[ a + 1 ];

				x = p.x;

				y = p.y;

				a += 2;

				continue;

			case 'font' :

				font = arguments[ a + 1 ];

				a += 2;

				continue;

			case 'rotate' :

				rotate = arguments[ a + 1 ];

				a += 2;

				continue;

			default :

				throw new Error(
					'unknown argument:' + arguments[ a ]
				);
		}
	}

	Jools.ensureArgs(
		'text',
			text,
		'x',
			x,
		'y',
			y,
		'font',
			font
	);

	this._setFont( font );

	var cx = this._cx;

	if( rotate === null )
	{
		cx.fillText(
			text,
			x,
			y
		);
	}
	else
	{
		var t1 =
			Math.cos( rotate );

		var t2 =
			Math.sin( rotate );

		var det =
			t1 * t1 + t2 * t2;

		//x += radius * t2;
		//y -= radius * t1;

		cx.setTransform(
			t1,  t2,
			-t2, t1,
			0, 0
		);


		cx.fillText(
			text,
			( x * t1 + y * t2 ) / det,
			( y * t1 - x * t2 ) / det
		);

		cx.setTransform(
			1, 0,
			0, 1,
			0, 0
		);
	}
};


/*
| fillRect( style, rect )     -or-
| fillRect( style, pnw, pse ) -or-
| fillRect( style, nwx, nwy, width, height )
*/
Fabric.prototype.fillRect =
	function(
		style,
		a1,
		a2,
		a3,
		a4
	)
{
	// FIXME remove fillRect

	var
		cx =
			this._cx;

	this._$font =
		null;

	cx.fillStyle =
		style;

	if( typeof( a1 ) === 'object' )
	{
		if( a1 instanceof Euclid.Rect )
		{
			return this._cx.fillRect(
				a1.pnw.x,
				a1.pnw.y,
				a1.pse.x,
				a1.pse.y
			);
		}
		else if( a1 instanceof Euclid.Point )
		{
			return this._cx.fillRect(
				a1.x,
				a1.y,
				a2.x,
				a2.y
			);
		}
		else if( a1 instanceof Euclid.Fabric )
		{
			return this._cx.fillRect(
				0,
				0,
				this.width,
				this.height
			);
		}

		throw new Error( 'fillRect not a rectangle' );
	}

	return this._cx.fillRect(
		a1,
		a2,
		a3,
		a4
	);
};


/*
| Returns the center point of the fabric.
*/
Fabric.prototype.getCenter =
	function( )
{
	var
		x =
			Jools.half( this.width ),

		y =
			Jools.half( this.height ),

		c =
			this._$center;

	if( c && c.x === x && c.y === y )
	{
		return c;
	}
	else
	{
		c =
		this._$center =
			new Euclid.Point( x, y );

		return c;
	}
};


/*
| getImageData(rect)     -or-
| getImageData(pnw, pse) -or-
| getImageData(x1, y1, x2, y2)
*/
Fabric.prototype.getImageData =
	function(
		a1,
		a2,
		a3,
		a4
	)
{
	var x1, y1, x2, y2;

	if( typeof( a1 ) === 'object' )
	{
		if( a1 instanceof Euclid.Rect )
		{
			x1 = a1.pnw.x;
			y1 = a1.pnw.y;
			x2 = a1.pse.x;
			y2 = a1.pse.y;
		}
		else if( a1 instanceof Euclid.Point )
		{
			x1 = a1.x; y1 = a1.y;
			x2 = a2.x; y2 = a2.y;
		}
		else
		{
			throw new Error('getImageData not a rectangle');
		}
	}
	else
	{
		x1 = a1;
		y1 = a2;
		x2 = a3;
		y2 = a4;
	}

	Jools.ensureInt( x1, y2, x1, y2 );

	return this._cx.getImageData( a1, a2, a3, a4 );
};


/*
| Sets the global alpha
| FIXME remove
*/
Fabric.prototype.globalAlpha =
	function( a )
{
	this._cx.globalAlpha = a;
};


/*
| Draws a line.
|
| lineto(point)       -or-
| lineto(x, y)        -or-
|
| lineto(point, view) -or-
| lineto(x, y, view)
*/
Fabric.prototype.lineTo =
	function(
		a1,
		a2,
		a3
	)
{
	var tw = this._twist, v, x, y;

	if( typeof( a1 ) === 'object' )
	{
		x = a1.x;
		y = a1.y;
		v = a2;
	}
	else
	{
		x = a1;
		y = a2;
		v = a3;
	}
	Jools.ensureInt( x, y );

	if( v )
	{
		var x1 = x;
		x = v.x( x,  y );
		y = v.y( x1, y );
	}

	this._posx = x;
	this._posy = y;

	this._cx.lineTo( x + tw, y + tw );
};


/*
| Moves the sketch maker.
|
| moveTo(point)       -or-
| moveTo(x, y)        -or-
|
| moveTo(point, view) -or-
| moveTo(x, y, view)
*/
Fabric.prototype.moveTo =
	function(
		a1,
		a2,
		a3
	)
{
	var tw = this._twist, v, x, y;

	if( typeof( a1 ) === 'object' )
	{
		x = a1.x;
		y = a1.y;
		v = a2;
	}
	else
	{
		x = a1;
		y = a2;
		v = a3;
	}

	Jools.ensureInt( x, y );

	if( v )
	{
		var x1 = x;
		x = v.x( x,  y );
		y = v.y( x1, y );
	}

	this._posx = x;
	this._posy = y;

	x += tw;
	y += tw;

	this._cx.moveTo(
		x + tw,
		y + tw
	);
};


/*
| putImageData( imagedata, p ) -or-
| putImageData( imagedata, x, y )
*/
Fabric.prototype.putImageData =
	function(
		imagedata,
		a1,
		a2
	)
{
	var x, y;
	if( typeof( a1 ) === 'object' )
	{
		x = a1.x;
		y = a1.y;
	}
	else
	{
		x = a1;
		y = a2;
	}

	Jools.ensureInt( x, y );

	this._cx.putImageData( imagedata, x, y );
};


/*
| The canvas is cleared and resized to width/height (of rect).
|
| reset()               -or-
| reset(rect)           -or-
| reset(width, height)
*/
Fabric.prototype.reset =
	function(
		a1,
		a2
	)
{
	var c = this._canvas;
	var w, h;

	switch( typeof( a1 ) )
	{
		case 'undefined' :
			this._cx.clearRect(
				0,
				0,
				c.width,
				c.height
			);
			return;

		case 'object' :
			w  = a1.width;
			h  = a1.height;
			break;

		default :
			w  = a1;
			h  = a2;
			break;
	}

	if( c.width === w &&
		c.height === h
	)
	{
		// no size change, clearRect() is faster
		this._cx.clearRect(0, 0, c.width, c.height);
	}
	else
	{
		// setting width or height clears the contents
		if( c.width  !== w )
			{ c.width  = w; }

		if( c.height !== h )
			{ c.height = h; }
	}
};


/*
| Fills an aera and draws its borders
*/
Fabric.prototype.paint =
	function(
		style,
		shape,
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var fillStyle = style.fill;

	var edgeStyle = style.edge;

	var cx = this._cx;

	// resets the font since the canvas context
	// is going to be reconfigured
	this._$font = null;

	this._begin( false );

	shape[ sketch ](
		this,
		0,
		false,
		view,
		a1,
		a2,
		a3,
		a4
	);

	if( Jools.isnon( fillStyle ) )
	{
		cx.fillStyle = this._colorStyle(
			fillStyle,
			shape,
			view
		);

		cx.fill( );
	}

	if( Jools.isArray( edgeStyle ) )
	{
		for(var i = 0; i < edgeStyle.length; i++)
		{
			this._edge(
				edgeStyle[ i ],
				shape,
				sketch,
				view,
				a1,
				a2,
				a3,
				a4
			);
		}
	}
	else
	{
		this._edge(
			edgeStyle,
			shape,
			sketch,
			view,
			a1,
			a2,
			a3,
			a4
		);
	}
};


/*
| Clips the fabric so that the shape is left out.
*/
Fabric.prototype.reverseClip =
	function(
		shape,
		sketch,
		view,
		border,
		a1,
		a2,
		a3,
		a4
	)
{
	var cx =
		this._cx;

	var c =
		this._canvas;

	var w =
		c.width;

	var h =
		c.height;

	if( !this.$clip )
	{
		cx.save( );

		this.$clip =
			true;
	}

	cx.beginPath( );
	cx.moveTo( 0, 0 );
	cx.lineTo( 0, h );
	cx.lineTo( w, h );
	cx.lineTo( w, 0 );
	cx.lineTo( 0, 0 );

	shape[ sketch ]( this, border, true, view, a1, a2, a3, a4 );

	cx.clip( );
};


/*
| Sets the canvas scale
| FIXME remove
*/
Fabric.prototype.scale =
	function(
		s
	)
{
	this._cx.scale( s, s );
};


/*
| Sets the font.
*/
Fabric.prototype._setFont =
	function(
		font
	)
{
	// already setted this font
	if( this._$font === font )
	{
		return;
	}

	var
		fill =
			font.twig.fill,

		align =
			font.twig.align,

		base =
			font.twig.base;

	if( !Jools.is( fill ) )
	{
		throw new Error(
			'fontstyle misses fill'
		);
	}

	if( !Jools.is( align ) )
	{
		throw new Error(
			'fontstyle misses align'
		);
	}

	if( !Jools.is( base ) )
	{
		throw new Error(
			'fontstyle misses base'
		);
	}

	var
		cx =
			this._cx;

	cx.font =
		font.getCSS( );

	cx.fillStyle =
		fill;

	cx.textAlign =
		align;

	cx.textBaseline =
		base;

	this._$font =
		font;
};


/*
| Returns true if a point is in a sketch.
|
| Euclid.Point -or-
| x / y
*/
Fabric.prototype.withinSketch =
	function(
		shape,
		sketch,
		view,
		a1,
		a2,
		a3,
		a4,
		a5
	)
{
	var px, py;
	var pobj;

	if( typeof( a1 ) === 'object' )
	{
		px   = a1.x;
		py   = a1.y;
		pobj = true;
	}
	else
	{
		px   = a1;
		py   = a2;
		pobj = false;
	}

	if(
		typeof( px ) !== 'number' ||
		typeof( py ) !== 'number'
	)
	{
		throw new Error( 'px|py not a number ' + px + ' ' + py );
	}

	/*
	var tw = this._twist;

	px += tw;
	py += tw;
	*/

	this._begin( true );

	if( pobj )
	{
		shape[ sketch ]( this, 0, true, view, a2, a3, a4 );
	}
	else
	{
		shape[ sketch ]( this, 0, true, view, a3, a4, a5 );
	}

	return this._cx.isPointInPath( px, py );
};


/*
| Begins a sketch
*/
Fabric.prototype._begin =
	function( twist )
{
	// lines are targed at .5 coords.
	this._twist = twist ? 0.5 : 0;
	this._cx.beginPath( );
	this._posx = this.posy = null;
};


/*
| Returns a HTML5 color style for a meshcraft style notation.
*/
Fabric.prototype._colorStyle =
	function(
		style,
		shape,
		view
	)
{
	if( style.substring )
	{
		return style;
	}

	else if( !style.gradient )
	{
		throw new Error( 'unknown style' );
	}

	var grad;
	switch( style.gradient )
	{
		case 'askew' :
			// FIXME use gradientPNW
			if( !shape.pnw || !shape.pse )
			{
				throw new Error(
					style.gradient + 'gradiend misses pnw/pse'
				);
			}

			grad = this._cx.createLinearGradient(
				view.x( shape.pnw ),
				view.y( shape.pnw ),
				view.x( shape.pnw ) + view.distance( shape.width / 10 ),
				view.y( shape.pse )
			);
			break;

		case 'horizontal' :

			// FIXME use gradientPNW
			if(
				!shape.pnw ||
				!shape.pse
			)
			{
				throw new Error(
					style.gradient + ': gradient misses pnw/pse'
				);
			}

			grad = this._cx.createLinearGradient(
				0,
				shape.pnw.y,
				0,
				shape.pse.y
			);

			break;

		case 'radial' :

			var r0 = shape.gradientR0 || 0;
			var r1 = shape.gradientR1;
			var pc = shape.gradientPC;

			if( !pc || !r1 )
			{
				throw new Error(
					style.gradient + 'gradient misses gradient[PC|R0|R1]'
				);
			}

			grad = this._cx.createRadialGradient(
				pc.x,
				pc.y,
				r0,
				pc.x,
				pc.y,
				r1
			);

			break;

		default :
			throw new Error('unknown gradient');
	}

	var steps = style.steps;
	for(var i = 0; i < steps.length; i++)
		{ grad.addColorStop(steps[i][0], steps[i][1]); }

	return grad;
};


/*
| Draws a single edge.
*/
Fabric.prototype._edge =
	function(
		style,  // the style formated in meshcraft style notation.
		shape,  // an object which has 'sketch'() defined
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		cx =
			this._cx;

	this._begin( true );

	shape[ sketch ](
		this,
		style.border,
		true,
		view,
		a1,
		a2,
		a3,
		a4
	);

	cx.strokeStyle =
		this._colorStyle(
			style.color,
			shape,
			view
		);

	cx.lineWidth =
		style.width;

	if( this._twist !== 0.5 )
	{
		throw new Error(
			'wrong twist'
		);
	}

	cx.stroke( );
};


/*
| Draws the fabrics background
*/
Fabric.prototype.sketch =
	function(
		fabric,
		border
		// twist
		// view
	)
{
	var b = border;
	var w = this.width - b;
	var h = this.height - b;

	fabric.moveTo( b, b );
	fabric.lineTo( w, b );
	fabric.lineTo( w, h );
	fabric.lineTo( b, h );
	fabric.lineTo( b, b );
};


/*
| pnw
*/
Fabric.prototype.pnw =
	Euclid.Point.zero;

/*
| pse
*/
Object.defineProperty(
	Fabric.prototype,
	'pse',
	{
		get :
			function( )
			{
				return new Euclid.Point(
					this.width,
					this.height
				);
			}
	}
);


/*
| Fabric width.
*/
Object.defineProperty(
	Fabric.prototype,
	'width',
	{
		get :
			function( )
			{
				return this._canvas.width;
			}
	}
);


/*
| Fabric height.
*/
Object.defineProperty(
	Fabric.prototype,
	'height',
	{
		get :
			function( )
			{
				return this._canvas.height;
			}
	}
);



} )( );
