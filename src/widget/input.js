/*
| An input field.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'widget_input',
		hasAbstract : true,
		attributes :
		{
			area :
			{
				comment : 'designed area',
				type : 'euclid_rect'
			},
			facets :
			{
				comment : 'style facets',
				type : 'gleam_facetRay'
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
				type : 'gleam_font'
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'widget_widget.concernsMark( mark, path )',
				type :
					require( '../typemaps/visualMark' )
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
			transform :
			{
				comment : 'the transform',
				type : 'euclid_transform'
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


var
	euclid_ellipse,
	euclid_measure,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	euclid_size,
	gleam_facet,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_ray,
	gleam_glint_text,
	gleam_glint_window,
	jion,
	result_hover,
	root,
	shell_settings,
	visual_mark_caret,
	widget_input;


/*
| Capsule
*/
( function( ) {
'use strict';


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
		area;

	area =
	this._area =
		this.area
		.transform( this.transform )
		.align;

	this._shape =
		euclid_roundRect.create(
			'pnw', euclid_point.zero,
			'pse', area.pse.sub( area.pnw ),
			'a', 7,
			'b', 3
		);

	this._pitch = widget_input._pitch;
};


/*
| Default distance of text
*/
widget_input._pitch = euclid_point.create( 'x', 8, 'y', 3 );


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

	descend = fs * shell_settings.bottombox;

	p = this.locateOffsetPoint( this.mark.caret.at );

	s = Math.round( p.y + descend + 1 );

	return(
		this._area.pnw.y + s - Math.round( fs + descend )
	);
}
);


/*
| Inputs can hold a caret.
*/
prototype.caretable = true;


/*
| Inputs are focusable
*/
prototype.focusable = true;


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

	if( !p || !this._area.within( p ) ) return undefined;

	pp = p.sub( this._area.pnw );

	if( !this._shape.within( pp ) ) return undefined;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', this.path,
				'at', this._getOffsetAt( pp )
			)
	);

	return false;
};


/*
| The widget's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	if( !this.visible ) return;

	return(
		gleam_glint_window.create(
			'glint', this._glint,
			'p', this._area.pnw,
			'size',
				euclid_size.create(
					'height', this._area.height + 1,
					'width', this._area.width + 1
				)
		)
	);
}
);


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

	at = mark.caret.at;

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
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', at + text.length
			)
	);
};


/*
| The key of this widget.
*/
jion.lazyValue(
	prototype,
	'key',
	function( )
{
	return this.path.get( -1 );
}
);


/*
| Returns the point of a given offset.
*/
jion.lazyFunctionInteger(
	prototype,
	'locateOffsetPoint',
	function(
		offset // the offset to get the point from.
	)
{
	var
		font,
		pitch,
		value;

	font = this.font;

	pitch = this._pitch;

	value = this.value;

	if( this.password )
	{
		return(
			euclid_point.create(
				'x',
					pitch.x
					+ (
						this.maskWidth( font.size ) +
						this.maskKern( font.size )
					)
					* offset
					- 1,
				'y', Math.round( pitch.y + font.size )
			)
		);
	}

	return(
		euclid_point.create(
			'x',
				Math.round(
					pitch.x
					+ euclid_measure.width(
						font,
						value.substring( 0, offset )
					)
				),
			'y', Math.round( pitch.y + font.size )
		)
	);
}
);


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
| Mouse hover
*/
prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		!this._area.within( p )
		|| !this._shape.within( p.sub( this._area.pnw ) )
	)
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
| User pressed a special key
*/
prototype.specialKey =
	function(
		key
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'backspace' : this._keyBackspace( ); break;

		case 'del' : this._keyDel( ); break;

		case 'down' : this._keyDown( ); break;

		case 'end' : this._keyEnd( ); break;

		case 'enter' : this._keyEnter( ); break;

		case 'left' : this._keyLeft( ); break;

		case 'pos1' : this._keyPos1( ); break;

		case 'right' : this._keyRight( ); break;

		case 'up' : this._keyUp( ); break;
	}
};


/*
| Glint for the caret.
*/
jion.lazyValue(
	prototype,
	'_caretGlint',
	function( )
{
	var
		descend,
		fs,
		n,
		p,
		s;

	fs = this.font.size;

	descend = fs * shell_settings.bottombox;

	p = this.locateOffsetPoint( this.mark.caret.at );

	s = descend + 1;

	n = s - ( fs + descend );

	return(
		gleam_glint_fill.create(
			'facet', gleam_facet.blackFill,
			'shape',
				euclid_rect.create(
					'pnw', p.add( 0, n ),
					'pse', p.add( 1, s )
				)
		)
	);
}
);


/*
| Returns the inner glint of the input field.
*/
jion.lazyValue(
	prototype,
	'_glint',
	function( )
{
	var
		a,
		aZ,
		facet,
		font,
		gLen,
		gRay,
		mark,
		pitch,
		pm,
		shape,
		value;

	pitch = this._pitch;

	shape = this._shape;

	value = this.value;

	mark = this.mark;

	facet =
		this.facets.getFacet(
			'hover', false, // FUTURE
			'focus', !!this.mark
		);

	gRay =
		[
			gleam_glint_fill.create(
				'facet', facet,
				'shape', shape
			)
		];

	gLen = 1;

	font = this.font;

	if( this.password )
	{
		pm = this._passMask;

		for( a = 0, aZ = pm.length; a < aZ; a++ )
		{
			gRay[ gLen++ ] =
				gleam_glint_fill.create(
					'facet', gleam_facet.blackFill,
					'shape', pm[ a ]
				);
		}
	}
	else
	{
		gRay[ gLen++ ] =
			gleam_glint_text.create(
				'font', font,
				'p',
					euclid_point.create(
						'x', pitch.x,
						'y', font.size + pitch.y
					),
				'text', value
			);
	}

	if(
		mark
		&& mark.reflect === 'visual_mark_caret'
		&& mark.focus
	)
	{
		gRay[ gLen++ ] = this._caretGlint;
	}

	gRay[ gLen++ ] =
		gleam_glint_border.create(
			'facet', facet,
			'shape', shape
		);

	return gleam_glint_ray.create( 'ray:init', gRay );
}
);


/*
| Returns the offset nearest to point p.
*/
prototype._getOffsetAt =
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
| User pressed backspace.
*/
prototype._keyBackspace =
	function( )
{
	var
		at,
		mark;

	mark = this.mark;

	at = mark.caret.at;

	if( at <= 0 ) return;

	root.setPath(
		this.path.append( 'value' ),
		this.value.substring( 0, at - 1 ) +
			this.value.substring( at )
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
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
		at;

	at = this.mark.caret.at;

	if( at >= this.value.length ) return;

	root.setPath(
		this.path.append( 'value' ),
		this.value.substring( 0, at ) +
			this.value.substring( at + 1 )
	);
};


/*
| User pressed return key.
| User pressed down key.
*/
prototype._keyEnter =
prototype._keyDown =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), 1 );
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

	at = mark.caret.at;

	if( at >= this.value.length ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
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

	if( mark.caret.at <= 0 ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', mark.caret.at - 1
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

	if( mark.caret.at <= 0 ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
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

	if( mark.caret.at >= this.value.length ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', mark.caret.at + 1
			)
	);
};


/*
| User pressed up key.
*/
prototype._keyUp =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), -1 );

	return;
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
		w,
		x,
		y;

	value = this.value;

	size = this.font.size;

	pm = [ ];

	pitch = this._pitch;

	x = pitch.x;

	y =	pitch.y + Math.round( size * 0.7 );

	h = Math.round( size * 0.32 ),

	w = this.maskWidth( size );

	k = this.maskKern( size );

	for( a = 0, aZ = value.length; a < aZ; a++, x += w + k )
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


})( );
