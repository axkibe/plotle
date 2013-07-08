/*
| An input field.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;

Widgets =
	Widgets || { };


/*
| Imports
*/
var
	Accent,
	Caret,
	Curve,
	Euclid,
	Jools,
	Path,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Input =
Widgets.Input =
	function(
		tag,
		inherit,
		tree,
		parent,
		name,
		focusAccent,
		hoverAccent,
		visible,
		value
	)
{
	if( CHECK )
	{
		if( tag !== 'XOXO' )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( parent === null )
		{
			throw new Error(
				'parent missing'
			);
		}

		if( tree === null )
		{
			throw new Error(
				'tree missing'
			);
		}

		if( typeof( focusAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid focusAccent.'
			);
		}

		if( typeof( hoverAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid hoverAccent.'
			);
		}
	}

	// TODO inherit
	this.path =
		new Path(
			[
				parent.name,
				name
			]
		);

	this.tree =
		tree;

	this.parent =
		parent;

	this.name =
		name;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

	this.visible =
		visible;

	// TODO compute a rect.
	var
		pnw =
		this.pnw =
			parent.iframe.computePoint(
				tree.twig.frame.twig.pnw
			),

		pse =
		this.pse =
			parent.iframe.computePoint(
				tree.twig.frame.twig.pse
			);

	this._shape =
		new Euclid.RoundRect(
			Euclid.Point.zero,
			pse.sub( pnw ),
			7,
			3
		),

	this._pitch =
		Input._pitch;

	this.value =
		value;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

	// TODO tree creator
	this._font =
		new Euclid.Font(
			tree.twig.font.twig
		);

	Jools.immute( this );
};


/*
| Creates an input.
*/
Input.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		focusAccent =
			null,

		hoverAccent =
			null,

		parent =
			null,

		name =
			null,

		tree =
			null,

		value =
			null,

		visible =
			null;


	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'focusAccent' :

				focusAccent =
					arguments[ a + 1 ];

				break;

			case 'hoverAccent' :

				hoverAccent =
					arguments[ a + 1 ];

				break;

			case 'name' :

				name =
					arguments[ a + 1 ];

				break;

			case 'parent' :

				parent =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'value' :

				value =
					arguments[ a + 1 ];

				break;

			case 'visible' :

				visible =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	if( inherit )
	{
		if( focusAccent === null )
		{
			focusAccent =
				inherit.focusAccent;
		}

		if( hoverAccent === null )
		{
			hoverAccent =
				inherit.hoverAccent;
		}

		if( name === null )
		{
			name =
				inherit.name;
		}

		if( parent === null )
		{
			parent =
				inherit.parent;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( value === null )
		{
			value =
				inherit.value;
		}

		if( visible === null )
		{
			visible =
				inherit.visible;
		}
	}

	if( focusAccent === null )
	{
		focusAccent =
			false;
	}

	if( hoverAccent === null )
	{
		hoverAccent =
			false;
	}

	if( visible === null )
	{
		visible =
			true;
	}

	if( value === null )
	{
		value =
			'';
	}

	return new Input(
		'XOXO',
		inherit,
		tree,
		parent,
		name,
		focusAccent,
		hoverAccent,
		visible,
		value
	);
};


/*
| Default distance of text
*/
Input._pitch =
	new Euclid.Point(
		8, 3
	);

/*
| Returns the offset nearest to point p.
*/
Input.prototype.getOffsetAt =
	function(
		p
	)
{
	var
		pitch =
			this._pitch,

		dx =
			p.x - pitch.x,

		value =
			this.value,

		x1 =
			0,

		x2 =
			0,

		a,

		password =
			this.tree.twig.password,

		font =
			this._font,

		mw;

	if( password )
	{
		mw =
			this.maskWidth( font.size ) * 2 +
			this.maskKern( font.size );
	}

	for( a = 0; a < value.length; a++ )
	{
		x1 =
			x2;

		if( password )
		{
			x2 =
				a * mw;
		}
		else
		{
			x2 =
				Euclid.Measure.width(
					font,
					value.substr( 0, a )
				);
		}

		if( x2 >= dx )
		{
			break;
		}
	}

	if(
		dx - x1 < x2 - dx &&
		a > 0
	)
	{
		a--;
	}

	return a;
};


/*
| Returns the width of a character for password masks.
*/
Input.prototype.maskWidth =
	function(
		size
	)
{
	return Math.round( size * 0.2 );
};


/*
| Returns the kerning of characters for password masks.
*/
Input.prototype.maskKern =
	function(
		size
	)
{
	return Math.round( size * 0.15 );
};


/*
| Draws the mask for password fields
*/
Input.prototype.sketchMask =
	function(
		fabric,
		border,
		twist,
		view,
		length,
		size
	)
{
	var
		pitch =
			this._pitch,

		x =
			view.x( pitch ),

		y =
			view.y( pitch ) +
			Math.round( size * 0.7 ),

		h =
			Math.round( size * 0.32 ),

		w =
			this.maskWidth( size ),

		w2 =
			w * 2,

		k =
			this.maskKern( size ),

		magic =
			Euclid.Const.magic,

		mw =
			magic * w,

		mh =
			magic * h;

	for( var a = 0; a < length; a++ )
	{
		fabric.moveTo(
			x + w,
			y - h
		);

		fabric.beziTo(
			mw,
			0,

			0,
			-mh,

			x + w2,
			y
		);

		fabric.beziTo(
			0,
			mh,

			mw,
			0,

			x + w,
			y + h
		);

		fabric.beziTo(
			-mw,
			0,

			0,
			mh,

			x,
			y
		);

		fabric.beziTo(
			0,
			-mh,

			-mw,
			0,

			x + w,
			y - h
		);

		x += w2 + k;
	}
};


/*
| Returns the fabric for the input field.
*/
Input.prototype._weave =
	function( )
{
	var
		fabric =
			this._$fabric;

	if( fabric )
	{
		return fabric;
	}

	var
		value =
			this.value,

		shape =
			this._shape,

		pitch =
			this._pitch;

	fabric =
	this._$fabric =
		new Euclid.Fabric(
			shape
		);

	var
		style =
			Widgets.getStyle(
				this.tree.twig.style,
				Accent.state(
					this.hoverAccent,
					this.focusAccent
				)
			),

		font =
			this._font;

	fabric.fill(
		style,
		shape,
		'sketch',
		Euclid.View.proper
	);

	if( this.tree.twig.password )
	{
		fabric.fill(
			{
				fill:
					'black'
			},
			this,
			'sketchMask',
			Euclid.View.proper,
			value.length,
			font.size
		);
	}
	else
	{
		fabric.paintText(
			'text',
				value,
			'xy',
				pitch.x,
				font.size + pitch.y,
			'font',
				font
		);
	}

	fabric.edge(
		style,
		shape,
		'sketch',
		Euclid.View.proper
	);

	return fabric;
};


/*
| Draws the input field.
*/
Input.prototype.draw =
	function(
		fabric
	)
{
	fabric.drawImage(
		'image',
			this._weave( ),
		'pnw',
			this.pnw
	);
};


/*
| Returns the point of a given offset.
*/
Input.prototype.locateOffset =
	function(
		offset // the offset to get the point from.
	)
{
	// FIXME cache position
	var
		tree =
			this.tree,

		font =
			this._font,

		pitch =
			this._pitch,

		value =
			this.value;

	if( this.tree.twig.password )
	{
		return new Euclid.Point(
			pitch.x +
				(
					2 * this.maskWidth( font.size ) +
					this.maskKern( font.size )
				) * offset
				- 1,

			Math.round(
				pitch.y +
				font.size
			)
		);
	}
	else
	{
		return new Euclid.Point(
			Math.round(
				pitch.x +
				Euclid.Measure.width(
					font,
					value.substring( 0, offset )
				)
			),

			Math.round(
				pitch.y +
				font.size
			)
		);
	}
};


/*
| Returns the caret position relative to the parent.
*/
Input.prototype.getCaretPos =
	function( )
{
	var
		fs =
			this._font.size,

		descend =
			fs * theme.bottombox,

		p =
			this.locateOffset(
				this.parent.$caret.sign.at1
			),

		pnw =
			this.pnw,

		s =
			Math.round( p.y + pnw.y + descend ),

		n =
			s - Math.round( fs + descend ),

		x =
			p.x + this.pnw.x - 1;

	return Jools.immute(
		{
			s :
				s,
			n :
				n,
			x :
				x
		}
	);
};


/*
| Draws the caret.
*/
Input.prototype.positionCaret =
	function(
		view
	)
{
	var
		caret =
			this.parent.$caret,

		cpos =
		caret.$pos =
			this.getCaretPos();

	caret.$screenPos =
		view.point(
			cpos.x,
			cpos.n
		);

	caret.$height =
		Math.round(
			( cpos.s - cpos.n ) * view.zoom
		);
};


/*
| Returns the current value (text in the box)
|
| TODO remove
*/
Input.prototype.getValue =
	function( )
{
	throw new Error( 'TODO ');
};


/*
| Sets the current value (text in the box)
*/
Input.prototype.setValue =
	function( )
{
	throw new Error(
		'TODO'
	);
};


/*
| User input.
*/
Input.prototype.input =
	function(
		text
	)
{
	var
		csign =
			this.parent.$caret.sign,

		value =
			this.value,

		at1 =
			csign.at1,

		maxlen =
			this.tree.twig.maxlen;

	// cuts of text if larger than this maxlen
	if(
		maxlen > 0 &&
		value.length + text.length > maxlen
	)
	{
		text =
			text.substring(
				0,
				maxlen - value.length
			);
	}

	this.parent.setValue(
		this.name,
		value.substring( 0, at1 ) +
			text +
			value.substring( at1 )
	);

	this.parent.setCaret(
		{
			path :
				csign.path,

			at1 :
				at1 + text.length
		}
	);
};


/*
| User pressed backspace.
*/
Input.prototype.keyBackspace =
	function( )
{
	var
		csign =
			this.parent.$caret.sign,

		at1 =
			csign.at1;

	if( at1 <= 0 )
	{
		return;
	}

	this.parent.setValue(
		this.name,
		this.value.substring( 0, at1 - 1 ) +
			this.value.substring( at1 )
	);

	this.parent.setCaret(
		{
			path : csign.path,
			at1  : csign.at1 - 1
		}
	);
};


/*
| User pressed del.
*/
Input.prototype.keyDel =
	function( )
{
	var
		at1 =
			this.parent.$caret.csign.at1;

	if( at1 >= this.value.length )
	{
		return;
	}

	this.parent.setValue(
		this.name,
		this.value.substring( 0, at1 ) +
			this.value.substring( at1 + 1 )
	);
};


/*
| User pressed return key.
*/
Input.prototype.keyEnter =
	function( )
{
	this.parent.cycleFocus( 1 );
};


/*
| User pressed down key.
*/
Input.prototype.keyDown =
	function( )
{
	this.parent.cycleFocus( 1 );
};


/*
| User pressed end key.
*/
Input.prototype.keyEnd =
	function( )
{
	var
		csign =
			this.parent.$caret.sign,

		at1 =
			csign.at1;

	if( at1 >= this.value.length )
	{
		return;
	}

	this.parent.setCaret(
		{
			path :
				csign.path,

			at1 :
				this.value.length
		}
	);
};


/*
| User pressed left key.
*/
Input.prototype.keyLeft =
	function( )
{
	var
		csign =
			this.parent.$caret.sign;

	if( csign.at1 <= 0 )
	{
		return;
	}

	this.parent.setCaret(
		{
			path :
				csign.path,

			at1 :
				csign.at1 - 1
		}
	);
};


/*
| User pressed pos1 key
*/
Input.prototype.keyPos1 =
	function( )
{
	var
		csign =
			this.parent.$caret.sign;

	if( csign.at1 <= 0 )
	{
		return;
	}

	this.parent.setCaret(
		{
			path :
				csign.path,

			at1 :
				0
		}
	);
};


/*
| User pressed right key
*/
Input.prototype.keyRight =
	function( )
{
	var
		csign =
			this.parent.$caret.sign;

	if( csign.at1 >= this.value.length )
	{
		return;
	}

	this.parent.setCaret(
		{
			path : csign.path,
			at1  : csign.at1 + 1
		}
	);
};


/*
| User pressed up key.
*/
Input.prototype.keyUp =
	function( )
{
	this.parent.cycleFocus( -1 );

	return;
};


/*
| User pressed a special key
*/
Input.prototype.specialKey =
	function(
		key
	)
{
	switch( key )
	{
		case 'backspace' :

			this.keyBackspace( );

			break;

		case 'del' :

			this.keyDel( );

			break;

		case 'down' :

			this.keyDown( );

			break;

		case 'end' :

			this.keyEnd( );

			break;

		case 'enter' :

			this.keyEnter( );

			break;

		case 'left' :

			this.keyLeft( );

			break;

		case 'pos1' :

			this.keyPos1( );

			break;

		case 'right' :

			this.keyRight( );

			break;

		case 'up' :

			this.keyUp( );

			break;
	}
};


/*
| Inputs are focusable
*/
Input.prototype.focusable =
	true;


/*
| Mouse hover
*/
Input.prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		p === null ||
		p.x < this.pnw.x || // FIXME use within
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var
		pp =
			p.sub(
				this.pnw
			);

	if(
		!this._shape.within(
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	return 'text';
};


/*
| pointing device is starting a point ( mouse down, touch start )
*/
Input.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		p === null ||
		p.x < this.pnw.x || // FIXME use within
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var
		pp =
			p.sub( this.pnw );

	if(
		!this._shape.within(
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	var caret =
		this.parent.setCaret(
			{
				path :
					new Path (
						[
							this.parent.name,
							this.name
						]
					),

				at1 :
					this.getOffsetAt( pp )
			}
		);

	caret.show( );

	return false;
};


/*
| Control takes focus.
| TODO remove
*/
Input.prototype.grepFocus =
	function( )
{
	if(
		!this.focusable ||
		!this.visible ||
		this.parent.getFocus( ) === this
	)
	{
		return false;
	}

	this.parent.setCaret(
		{
			path :
				this.path,

			at1 :
				0
		}
	);

	return true;
};


// TODO remove
Input.prototype.knock =
	function() {};


})( );
