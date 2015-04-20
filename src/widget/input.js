/*
| An input field.
|
| FIXME remove all 'owner' referenced (including other widgets).
*/


/*
| Imports
*/
var
	euclid_color,
	euclid_display,
	euclid_ellipse,
	euclid_measure,
	euclid_point,
	euclid_roundRect,
	euclid_view,
	jion,
	mark_caret,
	result_hover,
	root,
	theme,
	widget_input;


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
		id : 'widget_input',
		attributes :
		{
			designFrame :
			{
				comment : 'designed frame (using anchors',
				type : 'design_anchorRect'
			},
			facets :
			{
				comment : 'style facets',
				type : 'design_facetRay'
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'widget_widget.concernsHover( hover, path )'
			},
			font :
			{
				comment : 'font of the text',
				type : 'euclid_font'
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'widget_widget.concernsMark( mark, path )',
				type :
					require( '../typemaps/mark' )
					.concat( [ 'undefined' ] )
			},
			maxlen :
			{
				comment : 'maximum input length',
				type : 'integer'
			},
			password :
			{
				comment : 'true for password input',
				type : 'boolean',
				defaultValue : 'false'
			},
			path :
			{
				comment : 'the path of the widget',
				type : [ 'undefined', 'jion$path' ]
			},
			superFrame :
			{
				comment : 'the frame the widget resides in',
				type : [ 'undefined', 'euclid_rect' ]
			},
			value :
			{
				comment : 'the value in the input box',
				type : 'string',
				defaultValue : '""'
			},
			visible :
			{
				comment : 'if false the button is hidden',
				type : 'boolean',
				defaultValue : 'true'
			}
		},
		init : [ ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = widget_input.prototype;


/*
| Initializes the widget.
*/
prototype._init =
	function( )
{
	var
		frame;

	if( this.superFrame )
	{
		frame =
		this.frame =
			this.designFrame.compute( this.superFrame );

		this._shape =
			euclid_roundRect.create(
				'pnw', euclid_point.zero,
				'pse', frame.pse.sub( frame.pnw ),
				'a', 7,
				'b', 3
			);
	}
	else
	{
		frame =
		this.frame =
		this._shape =
			undefined;
	}


	this._pitch = widget_input._pitch;
};


/*
| Default distance of text
*/
widget_input._pitch = euclid_point.create( 'x', 8, 'y', 3 );


/*
| Returns the offset nearest to point p.
*/
prototype.getOffsetAt =
	function(
		p
	)
{
	var
		a,
		dx,
		font,
		mw,
		password,
		pitch,
		value,
		x1,
		x2;

	pitch = this._pitch;

	dx = p.x - pitch.x;

	value = this.value,

	x1 = 0;

	x2 = 0;

	password = this.password,

	font = this.font;

	if( password )
	{
		mw = this.maskWidth( font.size ) + this.maskKern( font.size );
	}

	for( a = 0; a < value.length; a++ )
	{
		x1 = x2;

		if( password )
		{
			x2 = a * mw;
		}
		else
		{
			x2 = euclid_measure.width( font, value.substr( 0, a ) );
		}

		if( x2 >= dx )
		{
			break;
		}
	}

	if(
		dx - x1 < x2 - dx
		&&
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
prototype.maskWidth =
	function(
		size
	)
{
	return Math.round( size * 0.4 );
};


/*
| Returns the kerning of characters for password masks.
*/
prototype.maskKern =
	function(
		size
	)
{
	return Math.round( size * 0.15 );
};


/*
| Returns an array of ellipses
| representing the password mask.
*/
jion.lazyValue(
	prototype,
	'_passMask',
	function( )
	{
		var
			a,
			aZ,
			h,
			k,
			pitch,
			pm,
			size,
			value,
			view,
			w,
			x,
			y;

		value = this.value;

		view = euclid_view.proper;

		size = this.font.size;

		pm = [ ];

		pitch = this._pitch;

		x = view.x( pitch.x ),

		y =
			view.y( pitch.y )
			+
			Math.round( size * 0.7 );

		h = Math.round( size * 0.32 ),

		w = this.maskWidth( size );

		k = this.maskKern( size );

		for(
			a = 0, aZ = value.length;
			a < aZ;
			a++, x += w + k
		)
		{
			pm[ a ] =
				euclid_ellipse.create(
					'pnw',
						euclid_point.create(
							'x', x,
							'y', y - h
						),
					'pse',
						euclid_point.create(
							'x', x + w,
							'y', y + h
						)
				);
		}

		return pm;
	}
);


/*
| Returns the display for the input field.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
	{
		var
			a,
			aZ,
			display,
			facet,
			font,
			mark,
			pitch,
			pm,
			shape,
			value;

		pitch = this._pitch;

		shape = this._shape;

		value = this.value;

		mark = this.mark;

		display =
			euclid_display.create(
				'width', shape.width + 1,
				'height', shape.height + 1
			);

		facet =
			this.facets.getFacet(
				'hover', false, // FUTURE
				'focus', !!this.mark
			);

		font = this.font;

		display.fill( facet.fill, shape, euclid_view.proper );

		if( this.password )
		{
			pm = this._passMask;

			for(
				a = 0, aZ = pm.length;
				a < aZ;
				a++
			)
			{
				display.fill( euclid_color.black, pm[ a ], euclid_view.proper );
			}
		}
		else
		{
			display.paintText(
				'text', value,
				'xy', pitch.x, font.size + pitch.y,
				'font', font
			);
		}


		if(
			mark
			&& mark.reflect === 'mark_caret'
			&& mark.focus
		)
		{
			this._drawCaret( display );
		}

		display.border( facet.border, shape, euclid_view.proper );

		return display;
	}
);


/*
| Draws the input field.
*/
prototype.draw =
	function(
		display
	)
{
	display.drawImage( 'image', this._display, 'pnw', this.frame.pnw );
};


/*
| Returns the point of a given offset.
*/
prototype.locateOffset =
	function(
		offset // the offset to get the point from.
	)
{
	// FIXME cache position
	var
		font,
		pitch,
		value;

	font = this.font;

	pitch = this._pitch;

	value = this.value;

	if( this.password )
	{
		return (
			euclid_point.create(
				'x',
					pitch.x
					+ (
						this.maskWidth( font.size ) +
						this.maskKern( font.size )
					) * offset
					- 1,
				'y', Math.round( pitch.y + font.size )
			)
		);
	}
	else
	{
		return (
			euclid_point.create(
				'x',
					Math.round(
						pitch.x +
						euclid_measure.width(
							font,
							value.substring( 0, offset )
						)
					),
				'y', Math.round( pitch.y + font.size )
			)
		);
	}
};


/*
| Draws the caret
*/
prototype._drawCaret =
	function(
		display
	)
{
	// draws the caret
	var
		descend,
		fs,
		n,
		p,
		s;

	fs = this.font.size;

	descend = fs * theme.bottombox;

	p = this.locateOffset( this.mark.caretAt );

	s = Math.round( p.y + descend + 1 );

	n = s - Math.round( fs + descend );

	display.fillRect(
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
prototype.input =
	function(
		text
	)
{
	var
		at,
		mark,
		value,
		maxlen;

	mark = this.mark;

	value = this.value;

	at = mark.caretAt;

	maxlen = this.maxlen;

	// cuts of text if larger than this maxlen
	if(
		maxlen > 0
		&&
		value.length + text.length > maxlen
	)
	{
		text = text.substring( 0, maxlen - value.length );
	}

	root.setPath(
		this.path.append( 'value' ),
		value.substring( 0, at ) +
			text +
			value.substring( at )
	);

	root.create(
		'mark',
			mark_caret.create(
				'path', mark.caretPath,
				'at', at + text.length
			)
	);
};


/*
| User pressed backspace.
*/
prototype._keyBackspace =
	function( )
{
	var
		at,
		mark;

	mark = this.mark;

	at = mark.at;

	if( at <= 0 )
	{
		return;
	}

	root.setPath(
		this.path.append( 'value' ),
		this.value.substring( 0, at - 1 ) +
			this.value.substring( at )
	);

	root.create(
		'mark',
			mark_caret.create(
				'path', mark.caretPath,
				'at', at - 1
			)
	);
};


/*
| User pressed del.
*/
prototype._keyDel =
	function( )
{
	var
		at =
			this.mark.caretAt;

	if( at >= this.value.length )
	{
		return;
	}

	root.setPath(
		this.path.append( 'value' ),
		this.value.substring( 0, at ) +
			this.value.substring( at + 1 )
	);
};


// FIXME two times different cycles?

/*
| User pressed return key.
*/
prototype._keyEnter =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), 1 );
};


/*
| User pressed down key.
*/
prototype._keyDown =
	function(
		owner
	)
{
	owner.cycleFocus( 1 );
};


/*
| User pressed end key.
*/
prototype._keyEnd =
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

	root.create(
		'mark',
			mark_caret.create(
				'path', mark.caretPath,
				'at', this.value.length
			)
	);
};


/*
| User pressed left key.
*/
prototype._keyLeft =
	function( )
{
	var
		mark;

	mark = this.mark;

	if( mark.caretAt <= 0 )
	{
		return;
	}

	root.create(
		'mark',
			mark_caret.create(
				'path', mark.caretPath,
				'at', mark.caretAt - 1
			)
	);
};


/*
| User pressed pos1 key
*/
prototype._keyPos1 =
	function( )
{
	var
		mark;

	mark = this.mark;

	if( mark.at <= 0 )
	{
		return;
	}

	root.create(
		'mark',
			mark_caret.create(
				'path', mark.caretPath,
				'at', 0
			)
	);
};


/*
| User pressed right key
*/
prototype._keyRight =
	function( )
{
	var
		mark;

	mark = this.mark;

	if( mark.caretAt >= this.value.length )
	{
		return;
	}

	root.create(
		'mark',
			mark_caret.create(
				'path', mark.caretPath,
				'at', mark.caretAt + 1
			)
	);
};


/*
| User pressed up key.
*/
prototype._keyUp =
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
prototype.specialKey =
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
prototype.caretable = true;


/*
| Inputs are focusable
*/
prototype.focusable = true;


/*
| Mouse hover
*/
prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		pp;

	if( !this.frame.within( euclid_view.proper, p )
	)
	{
		return undefined;
	}

	pp = p.sub( this.frame.pnw );

	if( !this._shape.within( euclid_view.proper, pp ) )
	{
		return undefined;
	}

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'text'
		)
	);
};


/*
| User clicked.
*/
prototype.click =
	function(
		p
		// shift
		// ctrl
	)
{
	var
		pp;

	if( !p || !this.frame.within( euclid_view.proper, p ) )
	{
		return undefined;
	}

	pp = p.sub( this.frame.pnw );

	if(
		!this._shape.within(
			euclid_view.proper,
			pp
		)
	)
	{
		return undefined;
	}

	root.create(
		'mark',
			mark_caret.create(
				'path', this.path,
				'at', this.getOffsetAt( pp )
			)
	);

	return false;
};


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
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

		p = this.locateOffset( this.mark.caretAt );

		s = Math.round( p.y + descend + 1 );

		return (
			this.frame.pnw.y + s - Math.round( fs + descend )
		);
	}
);


})( );
