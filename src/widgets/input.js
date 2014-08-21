/*
| An input field.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	widgets;

widgets = widgets || { };


/*
| Imports
*/
var
	Accent,
	euclid,
	jools,
	marks,
	reply,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {

		name :
			'Input',

		unit :
			'widgets',

		attributes :
			{
				designFrame :
					{
						comment :
							'designed frame (using anchors',
						type :
							'design.anchorRect'
					},
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'Boolean',
						defaultValue :
							false
					},
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'path',
						defaultValue :
							null,
						concerns :
							{
								unit :
									'widgets',
								type :
									'Widget',
								func :
									'concernsHover',
								args :
									[
										'hover',
										'path'
									]
							}
					},
				font :
					{
						comment :
							'font of the text',
						type :
							'euclid.font'
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								unit :
									'widgets',
								type :
									'Widget',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							null
					},
				maxlen :
					{
						comment :
							'maximum input length',
						type :
							'Integer'
					},
				password :
					{
						comment :
							'true for password input',
						type :
							'Boolean',
						defaultValue :
							false
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'path',
						defaultValue :
							null
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'euclid.rect',
						defaultValue :
							null
					},
				style :
					{
						// FIXME put in a real object instead
						comment :
							'name of the style used',
						type :
							'String'
					},
				value :
					{
						comment :
							'the value in the input box',
						type :
							'String',
						defaultValue :
							''
					},
				visible :
					{
						comment :
							'if false the button is hidden',
						type :
							'Boolean',
						defaultValue :
							true
					}
			},

		subclass :
			'widgets.Widget',

		init :
			[ ]
	};
}


var
	Input;

Input = widgets.Input;


/*
| Initializes the widget.
*/
Input.prototype._init =
	function( )
{
	var
		frame;

	if( this.superFrame )
	{
		frame =
		this.frame =
			this.designFrame.compute(
				this.superFrame
			);

		this._shape =
			euclid.roundRect.create(
				'pnw',
					euclid.point.zero,
				'pse',
					frame.pse.sub( frame.pnw ),
				'a',
					7,
				'b',
					3
			);
	}
	else
	{
		frame =
		this.frame =
		this._shape =
			null;
	}


	this._pitch =
		Input._pitch;
};


/*
| Default distance of text
*/
Input._pitch =
	euclid.point.create( 'x', 8, 'y', 3 );


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
			this.password,

		font =
			this.font,

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
				euclid.measure.width(
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
			view.x( pitch.x ),

		y =
			view.y( pitch.y ) +
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
			euclid.constants.magic,

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
jools.lazyValue(
	Input.prototype,
	'_fabric',
	function( )
	{
		var
			value =
				this.value,

			shape =
				this._shape,

			pitch =
				this._pitch,

			f =
				euclid.fabric.create(
					'width',
						shape.width + 1,
					'height',
						shape.height + 1
				),

			style =
				widgets.getStyle(
					this.style,
					Accent.state(
						false, // FIXME
						this.focusAccent
					)
				),

			font =
				this.font;

		f.fill(
			style,
			shape,
			'sketch',
			euclid.view.proper
		);

		if( this.password )
		{
			f.fill(
				{
					fill:
						'black'
				},
				this,
				'sketchMask',
				euclid.view.proper,
				value.length,
				font.size
			);
		}
		else
		{
			f.paintText(
				'text',
					value,
				'xy',
					pitch.x,
					font.size + pitch.y,
				'font',
					font
			);
		}


		if(
			this.mark.reflex === 'mark.caret'
			&&
			this.mark.focus
		)
		{
			this._drawCaret( f );
		}


		f.edge(
			style,
			shape,
			'sketch',
			euclid.view.proper
		);

		return f;
	}
);


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
			this._fabric,
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
		font =
			this.font,

		pitch =
			this._pitch,

		value =
			this.value;

	if( this.password )
	{
		return (
			euclid.point.create(
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
			euclid.point.create(
				'x',
					Math.round(
						pitch.x +
						euclid.measure.width(
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
			this.font.size,

		descend =
			fs * theme.bottombox,

		p =
			this.locateOffset(
				this.mark.caretAt
			),

		s =
			Math.round( p.y + descend + 1 ),

		n =
			s - Math.round( fs + descend );

	fabric.fillRect(
		'black',
		p.x,
		n,
		1,
		s - n
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
		mark =
			this.mark,

		value =
			this.value,

		at =
			mark.caretAt,

		maxlen =
			this.maxlen;

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

	shell.setPath(
		this.path.Append( 'value' ),
		value.substring( 0, at ) +
			text +
			value.substring( at )
	);

	shell.setMark(
		marks.Caret.create(
			'path',
				mark.caretPath,
			'at',
				at + text.length
		)
	);
};


/*
| User pressed backspace.
*/
Input.prototype._keyBackspace =
	function( )
{
	var
		mark =
			this.mark,

		at =
			mark.at;

	if( at <= 0 )
	{
		return;
	}

	shell.setPath(
		this.path.Append( 'value' ),
		this.value.substring( 0, at - 1 ) +
			this.value.substring( at )
	);

	shell.setMark(
		marks.Caret.create(
			'path',
				mark.caretPath,
			'at',
				at - 1
		)
	);
};


/*
| User pressed del.
*/
Input.prototype._keyDel =
	function( )
{
	var
		at =
			this.mark.caretAt;

	if( at >= this.value.length )
	{
		return;
	}

	shell.setPath(
		this.path.Append( 'value' ),
		this.value.substring( 0, at ) +
			this.value.substring( at + 1 )
	);
};


/*
| User pressed return key.
*/
Input.prototype._keyEnter =
	function( )
{
	shell.cycleFormFocus(
		this.path.get( 2 ),
		1
	);
};


/*
| User pressed down key.
*/
Input.prototype._keyDown =
	function(
		owner
	)
{
	owner.cycleFocus( 1 );
};


/*
| User pressed end key.
*/
Input.prototype._keyEnd =
	function( )
{
	var
		at,
		mark;

	mark = this.mark;

	at = mark.caretAt;

	if( at >= this.value.length )
	{
		return;
	}

	shell.setMark(
		marks.Caret.create(
			'path',
				mark.caretPath,
			'at',
				this.value.length
		)
	);
};


/*
| User pressed left key.
*/
Input.prototype._keyLeft =
	function( )
{
	var
		mark;

	mark = this.mark;

	if( mark.caretAt <= 0 )
	{
		return;
	}


	shell.setMark(
		marks.Caret.create(
			'path',
				mark.caretPath,
			'at',
				mark.caretAt - 1
		)
	);
};


/*
| User pressed pos1 key
*/
Input.prototype._keyPos1 =
	function( )
{
	var
		mark;

	mark = this.mark;

	if( mark.at <= 0 )
	{
		return;
	}

	shell.setMark(
		marks.Caret.create(
			'path',
				mark.caretPath,
			'at',
				0
		)
	);
};


/*
| User pressed right key
*/
Input.prototype._keyRight =
	function( )
{
	var
		mark;

	mark = this.mark;

	if( mark.caretAt >= this.value.length )
	{
		return;
	}

	shell.setMark(
		marks.Caret.create(
			'path',
				mark.caretPath,
			'at',
				mark.caretAt + 1
		)
	);
};


/*
| User pressed up key.
*/
Input.prototype._keyUp =
	function(
		owner
	)
{
	owner.cycleFocus( -1 );

	return;
};


/*
| User pressed a special key
*/
Input.prototype.specialKey =
	function(
		key,
		owner
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'backspace' :

			this._keyBackspace( owner );

			break;

		case 'del' :

			this._keyDel( owner );

			break;

		case 'down' :

			this._keyDown( owner );

			break;

		case 'end' :

			this._keyEnd( owner );

			break;

		case 'enter' :

			this._keyEnter( owner );

			break;

		case 'left' :

			this._keyLeft( owner );

			break;

		case 'pos1' :

			this._keyPos1( owner );

			break;

		case 'right' :

			this._keyRight( owner );

			break;

		case 'up' :

			this._keyUp( owner );

			break;
	}
};


/*
| Inputs can hold a caret.
*/
Input.prototype.caretable = true;


/*
| Inputs are focusable
*/
Input.prototype.focusable = true;


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
	var
		pp;

	if(
		!this.frame.within(
			euclid.view.proper,
			p
		)
	)
	{
		return null;
	}

	pp = p.sub( this.frame.pnw );

	if(
		!this._shape.within(
			euclid.view.proper,
			pp
		)
	)
	{
		return null;
	}

	return (
		reply.hover.create(
			'path',
				this.path,
			'cursor',
				'text'
		)
	);
};


/*
| User clicked.
*/
Input.prototype.click =
	function(
		p
		// shift
		// ctrl
	)
{
	var
		pp;

	if(
		p === null ||
		!this.frame.within(
			euclid.view.proper,
			p
		)
	)
	{
		return null;
	}

	pp = p.sub( this.frame.pnw );

	if(
		!this._shape.within(
			euclid.view.proper,
			pp
		)
	)
	{
		return null;
	}

	shell.setMark(
		marks.Caret.create(
			'path',
				this.path,
			'at',
				this.getOffsetAt( pp )
		)
	);

	return false;
};


/*
| The attention center.
*/
jools.lazyValue(
	Input.prototype,
	'attentionCenter',
	function( )
	{
		var
			descend,
			fs,
			p,
			s;

		fs = this.font.size;

		descend = fs * theme.bottombox;

		p =
			this.locateOffset(
				this.mark.caretAt
			);

		s = Math.round( p.y + descend + 1 );

		return (
			this.frame.pnw.y + s - Math.round( fs + descend )
		);
	}
);


})( );
