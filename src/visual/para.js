/*
| A paragraph.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_para',
		attributes :
		{
			fabric :
			{
				comment : 'the para fabric',
				type : 'fabric_para'
			},
			flowWidth :
			{
				comment : 'width the flow can fill',
				type : [ 'undefined', 'number' ]
			},
			fontsize :
			{
				comment : 'size of the font',
				type : [ 'undefined', 'number' ]
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'visual_para.concernsMark( mark, path )',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the para',
				type : [ 'undefined', 'jion$path' ]
			},
			pnw :
			{
				comment : 'point in north west',
				type : 'euclid_point'
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'euclid_transform'
			}
		},
		alike :
		{
			alikeVisually :
			{
				ignores :
				{
					'pnw' : true,
					'transform' : true
				}
			}
		},
		init : [ 'inherit' ]
	};
}


var
	change_insert,
	change_join,
	change_remove,
	change_split,
	euclid_point,
	euclid_rect,
	euclid_size,
	gleam_display_canvas,
	gleam_facet,
	gleam_glint_fill,
	gleam_glint_text,
	gleam_glint_twig,
	gleam_glint_window,
	euclid_measure,
	euclid_point,
	flow_block,
	flow_line,
	flow_token,
	jion,
	visual_mark_caret,
	visual_mark_range,
	root,
	session_uid,
	shell_fontPool,
	shell_settings,
	visual_mark_text,
	visual_para;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	visual_para = jion.this( module, 'source' );

	return;
}


prototype = visual_para.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	if(
		inherit
		&& inherit.alikeVisually( this )
		&& inherit.transform.zoom === this.transform.zoom
	)
	{
		if( jion.hasLazyValueSet( inherit, 'flow' ) )
		{
			jion.aheadValue( this, 'flow', inherit.flow );
		}

		if( jion.hasLazyValueSet( inherit, 'glint' ) )
		{
			this._inheritedGlint = inherit.glint;
		}
		else
		{
			this._inheritedGlint = inherit._inheritedGlint;
		}
	}
};


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
visual_para.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark ) return mark;

	if( mark.reflect === 'visual_mark_range' )
	{
		return(
			mark.containsPath( path.limit( 3 ) )
			? mark
			: undefined
		);
	}

	return(
		mark.containsPath( path )
		? mark
		: undefined
	);
};


/*
| The para's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	return(
		( this._inheritedGlint || gleam_glint_window )
		.create(
			'glint', this._glint,
			'p', this.pnw.transform( this.transform.ortho ),
			'size',
				euclid_size.create(
					'height', Math.round( this.height * this.transform.zoom + 1 ),
					'width', Math.round( this.flow.width * this.transform.zoom + 5 )
				)
				// FIXME why +5?
		)
	);
}
);


/*
| Shortcut to the para's key.
| It is the last path entry.
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
| Forwards fabric settings.
*/
jion.lazyValue(
	prototype,
	'text',
	function( )
{
	return this.fabric.text;
}
);


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
		n,
		p,
		s;

	fs = this.fontsize;

	descend = fs * shell_settings.bottombox;

	p = this.locateOffsetPoint( this.mark.caret.at );

	s = Math.round( p.y + descend );

	n = s - Math.round( fs + descend );

	return this.pnw.y + n;
}
);


/*
| The para's glint without window.
*/
jion.lazyValue(
	prototype,
	'_glint',
	function( )
{
	var
		a,
		aZ,
		b,
		bZ,
		flow,
		tFont,
		glint,
		line,
		lineKey,
		mark,
		token,
		transform;

	flow = this.flow;

	tFont = this.tFont;

	mark = this.mark;

	transform = this.transform.ortho;

	// draws text into the display

	// XRX

	glint = gleam_glint_twig.create( );

	// FIXME create the glint in one go
	for( a = 0, aZ = flow.length; a < aZ; a++ )
	{
		line = flow.get( a );

		lineKey = '' + a + '_';

		for( b = 0, bZ = line.length; b < bZ; b++ )
		{
			token = line.get( b );

			glint =
				glint.create(
					'ray:append',
						gleam_glint_text.create(
							'font', tFont,
							'p',
								// FIXME make a createTransform
								euclid_point.create(
									'x', token.x,
									'y', line.y
								).transform( transform ),
							'text', token.text
						)
				);
		}
	}

	if(
		mark
		&& mark.reflect === 'visual_mark_caret'
		&& mark.focus
	)
	{
		glint = glint.create( 'ray:append', this._caretGlint );
	}

	return glint;
}
);


/*
| The para's display.
| FIXME XXX remove
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
{
	return(
		gleam_display_canvas.create(
			'glint', this._glint,
			'size',
				euclid_size.create(
					'height', Math.round( this.height * this.transform.zoom + 1 ),
					'width', Math.round( this.flow.width * this.transform.zoom + 5 )
				)
		)
	);
}
);


/*
| Glint for the caret.
|
| FUTURE this could be part for doc.
*/
jion.lazyValue(
	prototype,
	'_caretGlint',
	function( )
{
	var
		descend,
		n,
		p,
		pnw,
		pse,
		s,
		transform;

	transform = this.transform.ortho;

	descend = this.fontsize * shell_settings.bottombox;

	p = this.locateOffsetPoint( this.mark.caret.at );

	// FIXME simplify all this
	s = p.y + descend;

	n = s - ( this.fontsize + descend );

	pnw =
		euclid_point.create(
			'x', p.x,
			'y', n
		).transform( transform );

	pse =
		pnw.add(
			1,
			transform.scale( this.fontsize + descend )
		);

	return(
		gleam_glint_fill.create(
			'facet', gleam_facet.blackFill,
			'shape',
				euclid_rect.create(
					'pnw', pnw,
					'pse', pse
				)
		)
	);
}
);


/*
| The font for this para.
*/
jion.lazyValue(
	prototype,
	'font',
	function( )
{
	return(
		shell_fontPool.get( this.fontsize, 'la' )
	);
}
);


/*
| The font for current transform.
*/
jion.lazyValue(
	prototype,
	'tFont',
	function( )
{
	return(
		shell_fontPool.get(
			this.transform.scale( this.fontsize ),
			'la'
		)
	);
}
);


/*
| The para's flow, the position of all chunks.
*/
jion.lazyValue(
	prototype,
	'flow',
	function( )
{
	var
		ca,
		currentLineOffset,
		currentLineRay,
		lines,
		flowWidth,
		font,
		reg,
		space,
		width,
		text,
		tokenText,
		w,
		x,
		y;

/**/if( CHECK )
/**/{
/**/	if( !this.fontsize ) throw new Error( );
/**/}

	// width the flow can fill
	// 0 means infinite
	flowWidth = this.flowWidth;

	font = this.font;

	// FUTURE go into subnodes
	text = this.text;

	// width really used.
	width = 0;

	// current x positon, and current x including last tokens width
	x = 0;

	y = font.size;

	space = euclid_measure.width( font, ' ' );

	lines = [ ];

	currentLineOffset = 0;

	currentLineRay = [ ];

	reg = ( /(\S+\s*$|\s*\S+|^\s+$)(\s?)(\s*)/g );
	// !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);

	for( ca = reg.exec( text ); ca; ca = reg.exec( text ) )
	{
		// a token is a word plus following hard spaces
		tokenText = ca[ 1 ] + ca[ 3 ];

		w = euclid_measure.width( font, tokenText );

		if( flowWidth > 0 && x + w > flowWidth )
		{
			if( x > 0 )
			{
				// soft break
				lines.push(
					flow_line.create(
						'ray:init', currentLineRay,
						'y', y,
						'offset', currentLineOffset
					)
				);

				x = 0;

				currentLineRay = [ ];

				y += font.size * ( 1 + shell_settings.bottombox );

				currentLineOffset = ca.index;
			}
			else
			{
				// horizontal overflow
				// ('HORIZONTAL OVERFLOW'); // FUTURE
			}
		}

		currentLineRay.push(
			flow_token.create(
				'x', x,
				'width', w,
				'offset', ca.index,
				'text', tokenText
			)
		);

		if( width < x + w ) { width = x + w; }

		x = x + w + space;
	}

	lines.push(
		flow_line.create(
			'ray:init', currentLineRay,
			'offset', currentLineOffset,
			'y', y
		)
	);

	return(
		flow_block.create(
			'ray:init', lines,
			'height', y,
			'width', width
		)
	);
}
);


/*
| The height of the para.
*/
jion.lazyValue(
	prototype,
	'height',
	function( )
{
	return(
		this.flow.height
		+ Math.round( this.fontsize * shell_settings.bottombox )
	);
}
);


/*
| Returns the offset by an x coordinate in a flow.
*/
prototype.getOffsetAt =
	function(
		ln,  // line number
		x    // x coordinate
	)
{
	var
		a,
		dx,
		flow,
		font,
		line,
		lZ,
		token,
		text,
		tn,
		x1,
		x2;

	font = this.font;

	flow = this.flow;

	line = flow.get( ln );

	lZ = line.length;

	for( tn = 0; tn < lZ; tn++ )
	{
		token = line.get( tn );

		if( x <= token.x + token.width ) break;
	}

	if( tn >= lZ && lZ > 0 )
	{
		token = line.get( --tn );
	}

	if( !token ) return 0;

	dx = x - token.x;

	text = token.text;

	x1 = 0;

	x2 = 0;

	for( a = 0; a <= text.length; a++ )
	{
		x1 = x2;

		x2 = euclid_measure.width( font, text.substr( 0, a ) );

		if( x2 >= dx ) break;
	}

	if( a > text.length )
	{
		a = text.length;
	}

	if( dx - x1 < x2 - dx && a > 0 )
	{
		a--;
	}

	return token.offset + a;
};


/*
| Returns the offset closest to a point.
*/
prototype.getPointOffset =
	function(
		point     // the point to look for
	)
{
	var
		flow,
		line;

	flow = this.flow;

	if( point.y < 0 ) return 0;

	for( line = 0; line < flow.length; line++ )
	{
		if( point.y <= flow.get( line ).y ) break;
	}

	if( line >= flow.length ) line--;

	return this.getOffsetAt( line, point.x );
};


/*
| A text has been inputed.
*/
prototype.input =
	function(
		text   // text inputed
	)
{
	var
		at,
		changes,
		line,
		textPath,
		textPath2,
		reg,
		rx;

	changes = [ ];

	reg = /([^\n]+)(\n?)/g;

	textPath = this.textPath;

	at = this.mark.caret.at;

	for( rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		line = rx[ 1 ];

		changes.push(
			change_insert.create(
				'val', line,
				'path', textPath.chop,
				'at1', at,
				'at2', at + line.length
			)
		);

		if( rx[ 2 ] )
		{
			textPath2 = textPath.set( -2, session_uid( ) );

			changes.push(
				change_split.create(
					'path', textPath.chop,
					'path2', textPath2.chop,
					'at1', at + line.length
				)
			);

			textPath = textPath2;

			at = 0;
		}
	}

	root.alter( changes );

	root.clearRetainX( );
};


/*
| Locates the line number of a given offset.
*/
jion.lazyFunctionInteger(
	prototype,
	'locateOffsetLine',
	function(
		offset
	)
{
	this._locateOffset( offset );

	// this is not recursive, it returns
	// the aheaded value set by _locateOffset

	return this.locateOffsetLine( offset );
}
);


/*
| Locates the line number of a given offset.
*/
jion.lazyFunctionInteger(
	prototype,
	'locateOffsetPoint',
	function(
		offset
	)
{
	this._locateOffset( offset );

	// this is not recursive, it returns
	// the aheaded value set by _locateOffset

	return this.locateOffsetPoint( offset );
}
);


/*
| Handles a special key.
*/
prototype.specialKey =
	function(
		key,
		doc,
		shift,
		ctrl
	)
{
	var
		at,
		beginMark,
		keyHandler,
		mark,
		retainx,
		v0,
		v1;

	mark = this.mark;

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :

				v0 = doc.atRank( 0 );

				v1 = doc.atRank( doc.length - 1 );

				root.create(
					'mark',
						visual_mark_range.create(
							'doc', doc.fabric,
							'beginMark',
								visual_mark_text.create(
									'path', v0.textPath,
									'at', 0
								),
							'endMark',
								visual_mark_text.create(
									'path', v1.textPath,
									'at', v1.text.length
								)
						)
				);

				return true;
		}
	}

	keyHandler = _keyMap[ key ];

	switch( mark.reflect )
	{
		case 'visual_mark_caret' :

/**/		if( CHECK )
/**/		{
/**/			if( !this.path.subPathOf( mark.caret.path ) )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			at = mark.caret.at;

			retainx = mark.retainx;

			if( shift ) beginMark = mark.textMark;

			break;

		case 'visual_mark_range' :

/**/		if( CHECK )
/**/		{
/**/			if( !this.path.subPathOf( mark.caret.path ) )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			at = mark.caret.at;

			retainx = mark.retainx;

			if( shift ) beginMark = mark.beginMark;

			break;
	}

	if( keyHandler )
	{
		this[ keyHandler ]( doc, at, retainx, beginMark );
	}
};


/*
| Path to a text value.
*/
jion.lazyValue(
	prototype,
	'textPath',
	function( )
{
	return this.path.append( 'text' );
}
);


/*
+----------- private --------------
*/


var
	_keyMap;

_keyMap =
	{
		'backspace' : '_keyBackspace',
		'del' : '_keyDel',
		'down' : '_keyDown',
		'end' : '_keyEnd',
		'enter' : '_keyEnter',
		'left' : '_keyLeft',
		'pagedown' : '_keyPageDown',
		'pageup' : '_keyPageUp',
		'pos1' : '_keyPos1',
		'right' : '_keyRight',
		'up' : '_keyUp'
	};

if( FREEZE ) Object.freeze( _keyMap );

/*
| Backspace pressed.
*/
prototype._keyBackspace =
	function(
		doc,
		at
		// retainx,
		// beginMark
	)
{
	var
		r,
		ve;

	if( at > 0 )
	{
		root.alter(
			change_remove.create(
				'path', this.textPath.chop,
				'at1', at - 1,
				'at2', at,
				'val', this.text.substring( at - 1, at )
			)
		);

		root.clearRetainX( );

		return;
	}

	r = doc.rankOf( this.key );

	if( r === 0 ) return;

	ve = doc.atRank( r - 1 );

	root.alter(
		change_join.create(
			'path', ve.textPath.chop,
			'path2', this.textPath.chop,
			'at1', ve.text.length
		)
	);

	root.clearRetainX( );
};


/*
| Del-key pressed.
*/
prototype._keyDel =
	function(
		doc,
		at
		// retainx,
		// beginMark
	)
{
	var
		r;

	if( at < this.text.length )
	{
		root.alter(
			change_remove.create(
				'path', this.textPath.chop,
				'at1', at,
				'at2', at + 1,
				'val', this.text.substring( at, at + 1 )
			)
		);

		root.clearRetainX( );

		return;
	}

	r = doc.rankOf( this.key );

	if( r >= doc.length - 1 ) return;

	root.alter(
		change_join.create(
			'path', this.textPath.chop,
			'path2', doc.atRank( r + 1).textPath.chop,
			'at1', this.text.length
		)
	);

	root.clearRetainX( );
};


/*
| Down arrow pressed.
*/
prototype._keyDown =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	var
		cPosLine,
		cPosP,
		flow,
		r,
		ve,
		x;

	flow = this.flow;

	cPosLine = this.locateOffsetLine( at );

	cPosP = this.locateOffsetPoint( at );

	x = retainx !== undefined ? retainx : cPosP.x;

	if( cPosLine < flow.length - 1 )
	{
		// stays within this para
		this._setMark(
			this.getOffsetAt( cPosLine + 1, x ),
			x,
			beginMark,
			doc
		);

		return;
	}

	// goto next para
	r = doc.rankOf( this.key );

	if( r < doc.length - 1 )
	{
		ve = doc.atRank( r + 1 );

		at = ve.getOffsetAt( 0, x );

		ve._setMark( at, x, beginMark, doc );
	}
};


/*
| End-key pressed.
*/
prototype._keyEnd =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._setMark( this.text.length, undefined, beginMark, doc );
};


/*
| Enter-key pressed
*/
prototype._keyEnter =
	function(
		doc,
		at
		// retainx,
		// beginMark
	)
{
	var
		tpc;

	tpc = this.textPath.chop;

	root.alter(
		change_split.create(
			'path', tpc,
			'path2', tpc.set( -2, session_uid( ) ),
			'at1', at
		)
	);
};


/*
| Left arrow pressed.
*/
prototype._keyLeft =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	var
		r,
		ve;

	if( at > 0 )
	{
		this._setMark( at - 1, undefined, beginMark, doc );

		return;
	}

	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		ve._setMark( ve.text.length, undefined, beginMark, doc );
	}
	else
	{
		this._setMark( at, undefined, beginMark, doc );
	}
};


/*
| User pressed page up or down
|
| FUTURE maintain relative scroll pos
*/
prototype._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		doc,
		at,
		retainx,
		beginMark
	)
{
	var
		p,
		size,
		tp,
		tpara,
		tpnw;

/**/if( CHECK )
/**/{
/**/	if( dir !== 1 && dir !== -1 ) throw new Error( );
/**/}

	p = this.locateOffsetPoint( at );

	size = doc.clipsize;

	tp =
		this.pnw.add(
			retainx !== undefined ? retainx : p.x,
			p.y + size.height * dir
		);

	tpara = doc.getParaAtPoint( tp );

	if( !tpara )
	{
		tpara = doc.atRank( dir > 0 ? doc.length - 1 : 0 );
	}

	tpnw = doc.getPNW( tpara.key );

	at = tpara.getPointOffset( tp.sub( tpnw ) );

	tpara._setMark( at, retainx, beginMark, doc );
};


/*
| PageDown key pressed.
*/
prototype._keyPageDown =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._pageUpDown( +1, doc, at, retainx, beginMark );
};


/*
| PageUp key pressed.
*/
prototype._keyPageUp =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._pageUpDown( -1, doc, at, retainx, beginMark );
};


/*
| Pos1-key pressed.
*/
prototype._keyPos1 =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._setMark( 0, undefined, beginMark, doc );
};


/*
| Right arrow pressed.
*/
prototype._keyRight =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	var
		r,
		ve;

	if( at < this.text.length )
	{
		this._setMark( at + 1, undefined, beginMark, doc );

		return;
	}

	r = doc.rankOf( this.key );

	if( r < doc.length - 1 )
	{
		ve = doc.atRank( r + 1 );

		ve._setMark( 0, undefined, beginMark, doc );
	}
};


/*
| Up arrow pressed.
*/
prototype._keyUp =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	var
		cPosLine,
		cPosP,
		r,
		ve,
		x;

	cPosLine = this.locateOffsetLine( at );

	cPosP = this.locateOffsetPoint( at );

	x = retainx !== undefined ? retainx : cPosP.x;

	if( cPosLine > 0 )
	{
		// stay within this para
		at = this.getOffsetAt( cPosLine - 1, x );

		this._setMark( at, x, beginMark, doc );

		return;
	}

	// goto prev para
	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		at = ve.getOffsetAt( ve.flow.length - 1, x );

		ve._setMark( at, x, beginMark, doc );
	}
};


/*
| Sets the aheadValues for point and line of a given offset.
*/
prototype._locateOffset =
	function(
		offset    // the offset to get the point from.
	)
{
	var
		aZ,
		flow,
		font,
		line,
		lineN,
		p,
		text,
		token,
		tokenN;

	font = this.font;

	text = this.text;

	flow = this.flow;

	// determines which line this offset belongs to
	for(
		lineN = 0, aZ = flow.length - 1;
		lineN < aZ;
		lineN++
	)
	{
		if( flow.get( lineN + 1 ).offset > offset ) break;
	}

	line = flow.get( lineN );

	for(
		tokenN = 0, aZ = line.length - 1;
		tokenN < aZ;
		tokenN++
	)
	{
		if( line.get( tokenN + 1 ).offset > offset ) break;
	}

	if( tokenN < line.length )
	{
		token = line.get( tokenN );

		p =
			euclid_point.create(
				'x',
					Math.round(
						token.x
						+ euclid_measure.width(
							font,
							text.substring( token.offset, offset )
						)
					),
				'y', line.y
			);
	}
	else
	{
		p = euclid_point.create( 'x', 0, 'y', line.y );
	}

	jion.aheadFunctionInteger(
		this,
		'locateOffsetLine',
		offset,
		lineN
	);

	jion.aheadFunctionInteger(
		this,
		'locateOffsetPoint',
		offset,
		p
	);
};


/*
| Sets the users caret or range
*/
prototype._setMark =
	function(
		at,        // position to mark caret (or endMark of range)
		retainx,   // retains this x position when moving up/down
		beginMark, // beginMark when marking a range
		doc        // range mark need this
	)
{
	root.create(
		'mark',
			!beginMark
			? visual_mark_caret.create(
				'path', this.textPath,
				'at', at,
				'retainx', retainx
			)
			: visual_mark_range.create(
				'doc', doc.fabric,
				'beginMark', beginMark,
				'endMark',
					visual_mark_text.create(
						'path', this.textPath,
						'at', at
					),
				'retainx', retainx
			)
	);
};


} )( );
