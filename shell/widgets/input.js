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
	Curve,
	Euclid,
	Jools,
	Path,
	shell,
	shellverse,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'INPUT-316354610';


/*
| Constructor.
*/
var Input =
Widgets.Input =
	function(
		tag,
		inherit,
		tree,
		path,
		frame,
		focusAccent,
		hoverAccent,
		visible,
		value,
		mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( path === null )
		{
			throw new Error(
				'path missing'
			);
		}

		if( frame === null )
		{
			throw new Error(
				'frame missing'
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

	this.path =
		path;

	this.tree =
		tree;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

	this.visible =
		visible;

	this.frame =
		frame;

	this._shape =
		new Euclid.RoundRect(
			Euclid.Point.zero,
			frame.pse.sub( frame.pnw ),
			7,
			3
		),

	this._pitch =
		Input._pitch;

	this.value =
		value;

	this.mark =
		mark;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

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

		frame =
			null,

		hoverAccent =
			null,

		mark =
			null,

		path =
			null,
		
		superFrame =
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

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'superFrame' :

				superFrame =
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
		
		if( frame === null && superFrame === null )
		{
			frame =
				inherit.frame;
		}

		if( path === null )
		{
			path =
				inherit.path;
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
			
	if( frame === null )
	{
		if( superFrame === null )
		{
			throw new Error(
				'superFrame and frame === null'
			);
		}
		
		frame =
			superFrame.computeRect(
				tree.twig.frame.twig
			);
	}

	// FIXME inherit cache

	return new Input(
		_tag,
		inherit,
		tree,
		path,
		frame,
		focusAccent,
		hoverAccent,
		visible,
		value,
		mark
	);
};


/*
| Default distance of text
*/
Input._pitch =
	new Euclid.Point(
		'TREE',
		{
			type :
				'Point',

			x :
				8,

			y :
				3
		},
		null
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
			this.tree.twig.font,

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
			this.tree.twig.font;

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
			this.frame.pnw
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
			tree.twig.font,

		pitch =
			this._pitch,

		value =
			this.value;

	if( this.tree.twig.password )
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					pitch.x +
					(
						2 * this.maskWidth( font.size ) +
						this.maskKern( font.size )
					) * offset
					- 1,
				'y',
					Math.round(
						pitch.y +
						font.size
					)
			)
		);
	}
	else
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					Math.round(
						pitch.x +
						Euclid.Measure.width(
							font,
							value.substring( 0, offset )
						)
					),
				'y',
					Math.round(
						pitch.y +
						font.size
					)
			)
		);
	}
};


/*
| Draws the caret
*/
Input.prototype._drawCaret =
	function(
		fabric
	)
{
	// draws the caret
	var
		fs =
			this.tree.twig.font.twig.size,

		descend =
			fs * theme.bottombox,

		p =
			this.locateOffset(
				this.mark.sign.at1
			),

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( fs + descend ),

		x =
			p.x + this.frame.pnw.x - 1;

	fabric.fillRect(
		'black',
		p.x,
		n,
		1,
		s - n
	);
};


/*
| Returns the caret position relative to the parent.
*/
/*
Input.prototype.getCaretPos =
	function( )
{
	var
		fs =
			this.tree.twig.font.twig.size,

		descend =
			fs * theme.bottombox,

		p =
			this.locateOffset(
				X.sign.at1
			),

		pnw =
			this.frame.pnw,

		s =
			Math.round( p.y + pnw.y + descend ),

		n =
			s - Math.round( fs + descend ),

		x =
			p.x + this.frame.pnw.x - 1;

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
*/


/*
| Draws the caret.
*/
/*
Input.prototype.positionCaret =
	function(
		view
	)
{
	var
		caret =
			X,

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
*/


/*
| User input.
*/
Input.prototype.input =
	function(
		text
	)
{
	var
		sign =
			this.mark.sign,

		value =
			this.value,

		at1 =
			sign.at1,

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

	shell.setFormValue(
		this.path,
		value.substring( 0, at1 ) +
			text +
			value.substring( at1 )
	);

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			sign.path,
		'at1',
			at1 + text.length
	);
};


/*
| User pressed backspace.
*/
Input.prototype.keyBackspace =
	function( )
{
	var
		sign =
			this.mark.sign,

		at1 =
			sign.at1;

	if( at1 <= 0 )
	{
		return;
	}

	shell.setFormValue(
		this.path,
		this.value.substring( 0, at1 - 1 ) +
			this.value.substring( at1 )
	);

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			sign.path,
		'at1',
			at1 - 1
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
			this.mark.sign.at1;

	if( at1 >= this.value.length )
	{
		return;
	}

	shell.setFormValue(
		this.path,
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
	shell.cycleFormFocus(
		this.path.get( 0 ),
		1
	);
};


/*
| User pressed down key.
*/
Input.prototype.keyDown =
	function( )
{
	shell.cycleFormFocus(
		this.path.get( 0 ),
		1
	);
};


/*
| User pressed end key.
*/
Input.prototype.keyEnd =
	function( )
{
	var
		sign =
			this.mark.sign,

		at1 =
			sign.at1;

	if( at1 >= this.value.length )
	{
		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			sign.path,
		'at1',
			this.value.length
	);
};


/*
| User pressed left key.
*/
Input.prototype.keyLeft =
	function( )
{
	var
		sign =
			this.mark.sign;

	if( sign.at1 <= 0 )
	{
		return;
	}


	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			sign.path,
		'at1',
			sign.at1 - 1
	);
};


/*
| User pressed pos1 key
*/
Input.prototype.keyPos1 =
	function( )
{
	var
		sign =
			this.mark.sign;

	if( sign.at1 <= 0 )
	{
		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			sign.path,
		'at1',
			0
	);
};


/*
| User pressed right key
*/
Input.prototype.keyRight =
	function( )
{
	var
		sign =
			this.mark.sign;

	if( sign.at1 >= this.value.length )
	{
		return;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			sign.path,
		'at1',
			sign.at1 + 1
	);
};


/*
| User pressed up key.
*/
Input.prototype.keyUp =
	function( )
{
	shell.cycleFormFocus(
		this.path.get( 0 ),
		-1
	);

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
| Inputs can hold a caret.
*/
Input.prototype.caretable =
	true;


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
		!this.frame.within(
			Euclid.View.proper,
			p
		)
	)
	{
		return null;
	}

	var
		pp =
			p.sub(
				this.frame.pnw
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
		!this.frame.within(
			Euclid.View.proper,
			p
		)
	)
	{
		return null;
	}

	var
		pp =
			p.sub( this.frame.pnw );

	if(
		!this._shape.within(
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'forms',
		'path',
			this.path,
		'at1',
			this.getOffsetAt( pp )
	);

	return false;
};


})( );
