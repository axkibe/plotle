/*
| A paragraph.
*/

var
	change_insert,
	change_join,
	change_remove,
	change_split,
	euclid_display,
	euclid_measure,
	euclid_point,
	fabric_para,
	flow_block,
	flow_line,
	flow_token,
	jools,
	mark_caret,
	mark_range,
	mark_text,
	root,
	session_uid,
	shell_fontPool,
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
		id : 'fabric_para',
		attributes :
		{
			flowWidth :
			{
				comment : 'width of the para flow',
				type : 'number',
				defaultValue : 'undefined'
			},
			fontsize :
			{
				comment : 'size of the font',
				type : 'number',
				defaultValue : 'undefined'
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'fabric_para.concernsMark( mark, path )',
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined',
				allowsNull : true
			},
			path :
			{
				comment : 'the path of the para',
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			text :
			{
				comment : 'the paragraphs text',
				json : true,
				type : 'string'
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view',
				defaultValue : 'undefined'
			}
		},
		alike :
		{
			alikeIgnoringView :
				{
					ignores : { 'view' : true }
				}
		},
		init : [ 'inherit' ]
	};
}


var
	prototype;


if( NODE )
{
	fabric_para = require( 'jion' ).this( module, 'source' );

	jools = require( '../jools/jools' );

	// FIXME return?
}


prototype = fabric_para.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	if( !this.path )
	{
		return;
	}

	if(
		inherit
		&& inherit.alikeIgnoringView( this )
		&& inherit.view.zoom === this.view.zoom
	)
	{
		if( jools.hasLazyValueSet( inherit, 'flow' ) )
		{
			jools.aheadValue( this, 'flow', inherit.flow );
		}

		if( jools.hasLazyValueSet( inherit, '_display' ) )
		{
			jools.aheadValue( this, '_display', inherit._display );
		}
	}
};


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
fabric_para.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark )
	{
		return mark;
	}

	if( mark.reflect === 'mark_range' )
	{
		return(
			mark.itemPath.subPathOf( path )
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
| Shortcut to the para's key.
| It is the last path entry.
*/
jools.lazyValue(
	prototype,
	'key',
	function( )
	{
		return this.path.get( -1 );
	}
);


/*
| The attention center.
*/
jools.lazyValue(
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

		descend = fs * theme.bottombox;

		p = this.locateOffset( this.mark.caretAt).p;

		s = Math.round( p.y + descend );

		n = s - Math.round( fs + descend );

		return n;
	}
);


/*
| The para's display.
*/
jools.lazyValue(
	prototype,
	'_display',
	function( )
	{
		var
			a,
			aZ,
			b,
			bZ,
			f,
			flow,
			font,
			line,
			mark,
			token,
			view,
			zoom;

		flow = this.flow;

		font = this.font;

		mark = this.mark;

		view = this.view;

		zoom = view.zoom;

		// adds to width so the caret gets visible.
		f =
			euclid_display.create(
				'width', Math.round( flow.width * zoom + 5 ),
				'height', Math.round( this.height * zoom + 1 )
			);

		f.scale( zoom );

		// draws text into the display
		for(
			a = 0, aZ = flow.length;
			a < aZ;
			a++
		)
		{
			line = flow.get( a );

			for(
				b = 0, bZ = line.length;
				b < bZ;
				b++
			)
			{
				token = line.get( b );

				f.paintText(
					'text', token.text,
					'xy', token.x, line.y,
					'font', font
				);
			}
		}

		f.scale( 1 / zoom );

		if(
			mark
			&& mark.reflect === 'mark_caret'
			&& mark.focus
		)
		{
			this._drawCaret( f );
		}

		return f;
	}
);


/*
| Draws the paragraph in a display.
*/
prototype.draw =
	function(
		display, // the display to draw upon
		pnw      // pnw of this para
	)
{
	display.drawImage( 'image', this._display, 'pnw', pnw );
};


/*
| Draws the caret.
*/
prototype._drawCaret =
	function(
		display
	)
{
	var
		descend,
		n,
		p,
		s,
		view;

	view = this.view;

	descend = this.fontsize * theme.bottombox;

	p = this.locateOffset( this.mark.caretAt ).p;

	s = Math.round( p.y + descend );

	n = s - Math.round( this.fontsize + descend );

	// displays the caret
	display.fillRect(
		'black',
		view.scale( p.x ),
		view.scale( n ),
		1,
		view.scale( s - n )
	);
};


/*
| The font for this para.
*/
jools.lazyValue(
	prototype,
	'font',
	function( )
	{
		return shell_fontPool.get( this.fontsize, 'la' );
	}
);


/*
| The para's flow, the position of all chunks.
*/
jools.lazyValue(
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
			widthUsed,
			text,
			tokenText,
			w,
			x,
			y;

/**/	if( CHECK )
/**/	{
/**/		if( !this.fontsize )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		// width the flow can fill
		// 0 means infinite
		flowWidth = this.flowWidth;

		font = this.font;

		// FUTURE go into subnodes
		text = this.text;

		// width really used.
		widthUsed = 0;

		// current x positon, and current x including last tokens width
		x = 0;

		y = Math.round( font.size );

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

					y += Math.round( font.size * ( 1 + theme.bottombox ) );

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

			if( widthUsed < x + w ) { widthUsed = x + w; }

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
				'width', widthUsed
			)
		);
	}
);


/*
| The height of the para.
*/
jools.lazyValue(
	prototype,
	'height',
	function( )
	{
		return(
			this.flow.height
			+ Math.round( this.fontsize * theme.bottombox )
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

		if( x <= token.x + token.width )
		{
			break;
		}
	}

	if( tn >= lZ && lZ > 0 )
	{
		token = line.get( --tn );
	}

	if( !token )
	{
		return 0;
	}

	dx = x - token.x;

	text = token.text;

	x1 = 0;

	x2 = 0;

	for(
		a = 0;
		a <= text.length;
		a++
	)
	{
		x1 = x2;

		x2 = euclid_measure.width( font, text.substr( 0, a ) );

		if( x2 >= dx )
		{
			break;
		}
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
| Returns the point of a given offset.
|
| FIXME: Use lazy value and use two functions
|         for p and line which aheadValue each other.
*/
prototype.locateOffset =
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
		result,
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
		if( flow.get( lineN + 1 ).offset > offset )
		{
			break;
		}
	}

	line = flow.get( lineN );

	for(
		tokenN = 0, aZ = line.length - 1;
		tokenN < aZ;
		tokenN++
	)
	{
		if( line.get( tokenN + 1 ).offset > offset )
		{
			break;
		}
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

	// FIXME make it a jion result
	result =
	{
		p : p,
		line : lineN
	};

/**/if( FREEZE )
/**/{
/**/	Object.freeze( result );
/**/}

	return result;
};


/*
| Returns the offset closest to a point.
*/
prototype.getPointOffset =
	function(
		item,
		point     // the point to look for
	)
{
	var
		flow,
		line;

	flow = this.flow;

	for( line = 0; line < flow.length; line++ )
	{
		if( point.y <= flow.get( line ).y )
		{
			break;
		}
	}

	if( line >= flow.length )
	{
		line--;
	}

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
		caretAt,
		changes,
		line,
		textPath,
		textPath2,
		reg,
		rx;

	changes = [ ];

	reg = /([^\n]+)(\n?)/g;

	textPath = this.textPath;

	caretAt = this.mark.caretAt;

	for( rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		line = rx[ 1 ];

		changes.push(
			change_insert.create(
				'val', line,
				'path', textPath.chop,
				'at1', caretAt,
				'at2', caretAt + line.length
			)
		);

		if( rx[ 2 ] )
		{
			textPath2 = textPath.set( -2, session_uid( ) );

			changes.push(
				change_split.create(
					'path', textPath.chop,
					'path2', textPath2.chop,
					'at1', caretAt + line.length
				)
			);

			textPath = textPath2;

			caretAt = 0;
		}
	}

	root.alter( changes );

	root.clearCaretRetainX( );
};


/*
| Handles a special key.
*/
prototype.specialKey =
	function(
		key,
		item,
		shift,
		ctrl
	)
{
	var
		at,
		begin,
		doc,
		keyHandler,
		mark,
		retainx,
		v0,
		v1;

	doc = item.doc,

	mark = this.mark;

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :

				v0 = doc.atRank( 0 );

				v1 = doc.atRank( doc.ranks.length - 1 );

				root.create(
					'mark',
						mark_range.create(
							'doc', doc,
							'begin',
								mark_text.create(
									'path', v0.textPath,
									'at', 0
								),
							'end',
								mark_text.create(
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
		case 'mark_caret' :

/**/		if( CHECK )
/**/		{
/**/			if( !this.path.subPathOf( mark.caretPath ) )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			at = mark.caretAt;

			retainx = mark.retainx;

			if( shift )
			{
				begin = mark.caret;
			}

			break;

		case 'mark_range' :

/**/		if( CHECK )
/**/		{
/**/			if( !this.path.subPathOf( mark.caretPath ) )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			at = mark.caretAt;

			retainx = mark.retainx;

			if( shift )
			{
				begin = mark.begin;
			}

			break;
	}

	if( keyHandler )
	{
		this[ keyHandler ]( item, doc, at, retainx, begin );
	}
};


/*
| The path to the .text attribute
*/
jools.lazyValue(
	prototype,
	'textPath',
	function( )
	{
		return(
			this.path
			? this.path.append( 'text' )
			: undefined
		);
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

/**/if( FREEZE )
/**/{
/**/	Object.freeze( _keyMap );
/**/}

/*
| Backspace pressed.
*/
prototype._keyBackspace =
	function(
		item,
		doc,
		at
		// retainx,
		// begin
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

		return;
	}

	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		root.alter(
			change_join.create(
				'path', ve.textPath.chop,
				'path2', this.textPath.chop,
				'at1', ve.text.length
			)
		);
	}
};


/*
| Del-key pressed.
*/
prototype._keyDel =
	function(
		item,
		doc,
		at
		// retainx,
		// begin
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

		return;
	}

	r = doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		root.alter(
			change_join.create(
				'path', this.textPath.chop,
				'path2', doc.atRank( r + 1).textPath.chop,
				'at1', this.text.length
			)
		);
	}
};


/*
| Down arrow pressed.
*/
prototype._keyDown =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	var
		cpos,
		flow,
		r,
		ve,
		x;

	flow = this.flow;

	cpos = this.locateOffset( at );

	x = retainx !== undefined ? retainx : cpos.p.x;

	if( cpos.line < flow.length - 1 )
	{
		// stays within this para
		this._setMark(
			this.getOffsetAt( cpos.line + 1, x ),
			x,
			begin,
			doc
		);

		return;
	}

	// goto next para
	r = doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		ve = doc.atRank( r + 1 );

		at = ve.getOffsetAt( 0, x );

		ve._setMark( at, x, begin, doc );
	}
};


/*
| End-key pressed.
*/
prototype._keyEnd =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._setMark( this.text.length, undefined, begin, doc );
};


/*
| Enter-key pressed
*/
prototype._keyEnter =
	function(
		item,
		doc,
		at
		// retainx,
		// begin
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
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	var
		r,
		ve;

	if( at > 0 )
	{
		this._setMark( at - 1, undefined, begin, doc );

		return;
	}

	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		ve._setMark( ve.text.length, undefined, begin, doc );

		return;
	}
	else
	{
		this._setMark( at, undefined, begin, doc );
	}
};


/*
| User pressed page up or down
|
| FIXME maintain relative scroll pos
*/
prototype._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	var
		p,
		pnw,
		tp,
		tpara,
		tpnw,
		zone;

/**/if( CHECK )
/**/{
/**/	if( dir !== 1 && dir !== -1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	p = this.locateOffset( at ).p,

	zone = item.zone;

	pnw = doc.getPNW( this.key );

	tp = p.add( pnw.x, pnw.y + zone.height * dir );

	tpara = doc.getParaAtPoint( tp );

	if( !tpara )
	{
		tpara = doc.atRank( dir > 0 ? doc.ranks.length - 1 : 0 );
	}

	tpnw = doc.getPNW( tpara.key );

	at = tpara.getPointOffset( item, tp.sub( tpnw ) );

	tpara._setMark( at, retainx, begin, doc );
};


/*
| PageDown key pressed.
*/
prototype._keyPageDown =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._pageUpDown( +1, item, doc, at, retainx, begin );
};


/*
| PageUp key pressed.
*/
prototype._keyPageUp =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._pageUpDown( -1, item, doc, at, retainx, begin );
};


/*
| Pos1-key pressed.
*/
prototype._keyPos1 =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._setMark( 0, undefined, begin, doc );
};


/*
| Right arrow pressed.
*/
prototype._keyRight =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	var
		r,
		ve;

	if( at < this.text.length )
	{
		this._setMark( at + 1, undefined, begin, doc );

		return;
	}

	r = doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		ve = doc.atRank( r + 1 );

		ve._setMark( 0, undefined, begin, doc );
	}
};


/*
| Up arrow pressed.
*/
prototype._keyUp =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	var
		cpos,
		r,
		ve,
		x;

	cpos = this.locateOffset( at );

	x = retainx !== undefined ? retainx : cpos.p.x;

	if( cpos.line > 0 )
	{
		// stay within this para
		at = this.getOffsetAt( cpos.line - 1, x );

		this._setMark( at, x, begin, doc );

		return;
	}

	// goto prev para
	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		at = ve.getOffsetAt( ve.flow.length - 1, x );

		ve._setMark( at, x, begin, doc );
	}
};


/*
| Sets the users caret or range
*/
prototype._setMark =
	function(
		at,      // position to mark caret (or end of range)
		retainx, // retains this x position when moving up/down
		begin,   // begin when marking a range
		doc      // range mark need this
	)
{
	root.create(
		'mark',
			!begin
			? mark_caret.create(
				'path', this.textPath,
				'at', at,
				'retainx', retainx
			)
			: mark_range.create(
				'doc', doc,
				'begin', begin,
				'end',
					mark_text.create(
						'path', this.textPath,
						'at', at
					),
				'retainx', retainx
			)
	);
};


} )( );
