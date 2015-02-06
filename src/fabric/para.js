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
	jools,
	mark_caret,
	mark_range,
	mark_text,
	root,
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
		id :
			'fabric_para',
		attributes :
			{
				flowWidth :
					{
						comment :
							'width of the para flow',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				fontsize :
					{
						comment :
							'size of the font',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'fabric_para',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},
						type :
							'->mark',
						defaultValue :
							'undefined',
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the para',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				text :
					{
						comment :
							'the paragraphs text',
						json :
							true,
						type :
							'string',
						defaultValue : // TODO
							'null'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						defaultValue :
							'undefined'
					}
			},
		alike :
			{
				alikeIgnoringView :
					{
						ignores : { 'view' : true }
					}
			},
		init :
			[ 'inherit' ]
	};
}



/*
| Node includes.
*/
if( SERVER )
{
	fabric_para = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}


/*
| Initializer.
*/
fabric_para.prototype._init =
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
		&&
		inherit.alikeIgnoringView( this )
		&&
		inherit.view.zoom === this.view.zoom
	)
	{
		jools.aheadValue( this, 'flow', inherit.flow );

		jools.aheadValue( this, '_display', inherit._display );
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
			: null
		);
	}

	return(
		mark.containsPath( path )
		? mark
		: null
	);
};


/*
| Shortcut to the para's key.
| It is the last path entry.
*/
jools.lazyValue(
	fabric_para.prototype,
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
	fabric_para.prototype,
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
	fabric_para.prototype,
	'_display',
	function( )
	{
		var
			a,
			aZ,
			b,
			bZ,
			chunk,
			f,
			flow,
			font,
			line,
			mark,
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
				'width', Math.round( flow.widthUsed * zoom + 5 ),
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
			line = flow[ a ];

			for(
				b = 0, bZ = line.a.length;
				b < bZ;
				b++
			)
			{
				chunk = line.a[ b ];

				f.paintText(
					'text', chunk.t,
					'xy', chunk.x, line.y,
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
fabric_para.prototype.draw =
	function(
		display, // the display to draw upon
		pnw      // pnw of this para
	)
{
	display.drawImage(
		'image', this._display,
		'pnw', pnw
	);
};


/*
| Draws the caret.
*/
fabric_para.prototype._drawCaret =
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

	p = this.locateOffset( this.mark.caretAt ).p,

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
	fabric_para.prototype,
	'font',
	function( )
	{
		return shell_fontPool.get( this.fontsize, 'la' );
	}
);


/*
| The para's flow, the position of all chunks.
|
| FUTURE make this a proper jion.
*/
jools.lazyValue(
	fabric_para.prototype,
	'flow',
	function( )
	{
		var
			ca,
			flow,
			flowWidth,
			font,
			line,
			reg,
			space,
			widthUsed,
			text,
			token,
			w,
			x,
			xw,
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

		// FUTURE go into subnodes instead
		text = this.text;

		// width really used.
		widthUsed = 0;

		// current x positon, and current x including last tokens width
		x = 0;

		xw = 0;

		y = Math.round( font.size );

		space = euclid_measure.width( font, ' ' );

		line = 0;

		flow = [ ];

		flow[ line ] = {
			a : [ ],
			y : y,
			o : 0
		};

		reg = ( /(\S+\s*$|\s*\S+|^\s+$)(\s?)(\s*)/g );
		// !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);

		for(
			ca = reg.exec( text );
			ca !== null;
			ca = reg.exec( text )
		)
		{
			// a token is a word plus following hard spaces
			token = ca[ 1 ] + ca[ 2 ] + ca[ 3 ];

			w = euclid_measure.width( font, token );

			xw = x + w;

			if(
				flowWidth > 0
				&&
				xw > flowWidth
			)
			{
				if( x > 0 )
				{
					// soft break
					if( widthUsed < xw )
					{
						widthUsed = xw;
					}

					x = 0;

					xw = x + w;

					y += Math.round( font.size * ( 1 + theme.bottombox ) );

					line++;

					flow[ line ] = {
						a : [ ],
						y : y,
						o : ca.index
					};
				}
				else
				{
					// horizontal overflow
					// ('HORIZONTAL OVERFLOW'); // FIXME
				}
			}

			flow[ line ].a.push(
				{
					x : x,
					w : w,
					o : ca.index,
					t : token
				}
			);

			x = xw;
		}

		if( widthUsed < x )
		{
			widthUsed = x;
		}

		flow.height = y;

		flow.flowWidth = flowWidth;

		flow.widthUsed = widthUsed;

		return flow;
	}
);


/*
| The height of the para.
*/
jools.lazyValue(
	fabric_para.prototype,
	'height',
	function( )
	{
		return (
			this.flow.height +
			Math.round(
				this.fontsize * theme.bottombox
			)
		);
	}
);


/*
| Returns the offset by an x coordinate in a flow.
*/
fabric_para.prototype.getOffsetAt =
	function(
		line,
		x
	)
{
	var
		a,
		dx,
		fline,
		flow,
		font,
		ftoken,
		text,
		token,
		x1,
		x2;

	font = this.font;

	flow = this.flow;

	fline = flow[ line ];

	ftoken = null;

	for(
		token = 0;
		token < fline.a.length;
		token++
	)
	{
		ftoken = fline.a[ token ];

		if( x <= ftoken.x + ftoken.w )
		{
			break;
		}
	}

	if( token >= fline.a.length )
	{
		ftoken = fline.a[ --token ];
	}

	if( !ftoken )
	{
		return 0;
	}

	dx = x - ftoken.x;

	text = ftoken.t;

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

	return ftoken.o + a;
};


/*
| Returns the point of a given offset.
|
| FUTURE: Use lazy value and use two functions
|         for p and line which aheadValue each other.
*/
fabric_para.prototype.locateOffset =
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
		if( flow[ lineN + 1 ].o > offset )
		{
			break;
		}
	}

	line = flow[ lineN ];

	for(
		tokenN = 0, aZ = line.a.length - 1;
		tokenN < aZ;
		tokenN++
	)
	{
		if( line.a[ tokenN + 1 ].o > offset )
		{
			break;
		}
	}

	token = line.a[ tokenN ];

	if( token )
	{
		p =
			euclid_point.create(
				'x',
					Math.round(
						token.x +
						euclid_measure.width(
							font,
							text.substring( token.o, offset )
						)
					),
				'y',
					line.y
			);
	}
	else
	{
		p =
			euclid_point.create(
				'x', 0,
				'y', line.y
			);
	}

	// FUTURE make it a jion result
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
fabric_para.prototype.getPointOffset =
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
		if( point.y <= flow[ line ].y )
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
fabric_para.prototype.input =
	function(
		text,
		item
	)
{
	var
		caretAt,
		changes,
		doc,
		line,
		textPath,
		textPath2,
		reg,
		rx;

	changes = [ ];

	reg = /([^\n]+)(\n?)/g;

	textPath = this.textPath;

	doc = item.doc;

	caretAt = this.mark.caretAt;

	for(
		rx = reg.exec( text );
		rx !== null;
		rx = reg.exec( text )
	)
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
			textPath2 = textPath.set( -2, jools.uid( ) );

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
};


/*
| Handles a special key.
*/
fabric_para.prototype.specialKey =
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

				root.setMark(
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

	at = null;

	begin = null;

	retainx = null;

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
	fabric_para.prototype,
	'textPath',
	function( )
	{
		if( this.path === null )
		{
			return null;
		}

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

/**/if( FREEZE )
/**/{
/**/	Object.freeze( _keyMap );
/**/}

/*
| Backspace pressed.
*/
fabric_para.prototype._keyBackspace =
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
fabric_para.prototype._keyDel =
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
				'path', doc.atRank( r + 1).textPath.chop,
				'path2', this.textPath.chop,
				'at1', this.text.length
			)
		);
	}
};


/*
| Down arrow pressed.
*/
fabric_para.prototype._keyDown =
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

	x =
		retainx !== null
		?  retainx
		: cpos.p.x;

	if( cpos.line < flow.length - 1 )
	{
		// stays within this para
		this._setMark(
			this.getOffsetAt(
				cpos.line + 1,
				x
			),
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
fabric_para.prototype._keyEnd =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._setMark( this.text.length, null, begin, doc );
};


/*
| Enter-key pressed
*/
fabric_para.prototype._keyEnter =
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
			'path2', tpc.set( -2, jools.uid( ) ),
			'at1', at
		)
	);
};


/*
| Left arrow pressed.
*/
fabric_para.prototype._keyLeft =
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
		this._setMark( at - 1, null, begin, doc );

		return;
	}

	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		ve._setMark( ve.text.length, null, begin, doc );

		return;
	}
	else
	{
		this._setMark( at, null, begin, doc );
	}
};


/*
| User pressed page up or down
|
| FUTURE maintain relative scroll pos
*/
fabric_para.prototype._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		item,     // TODO remove
		doc,
		at,
		retainx,
		begin
	)
{


/**/if( CHECK )
/**/{
/**/	if( dir !== +1 && dir !== -1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}


	var
		p,
		pnw,
		tp,
		tpara,
		tpnw,
		zone;

	p = this.locateOffset( at ).p,

	zone = item.zone,

	pnw = doc.getPNW( this.key ),

	tp =
		p.add(
			pnw.x,
			pnw.y + zone.height * dir
		),

	tpara = doc.getParaAtPoint( item, tp );

	if( tpara === null )
	{
		tpara = doc.atRank( doc.ranks.length - 1 );
	}

	tpnw = doc.getPNW( tpara.key );

	at =
		tpara.getPointOffset(
			item,
			tp.sub( tpnw )
		);

	tpara._setMark(
		at,
		retainx,
		begin,
		doc
	);
};


/*
| PageDown key pressed.
*/
fabric_para.prototype._keyPageDown =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._pageUpDown(
		+1,
		item,
		doc,
		at,
		retainx,
		begin
	);
};


/*
| PageUp key pressed.
*/
fabric_para.prototype._keyPageUp =
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
fabric_para.prototype._keyPos1 =
	function(
		item,
		doc,
		at,
		retainx,
		begin
	)
{
	this._setMark( 0, null, begin, doc );
};


/*
| Right arrow pressed.
*/
fabric_para.prototype._keyRight =
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
		this._setMark(
			at + 1,
			null,
			begin,
			doc
		);

		return;
	}

	r = doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		ve = doc.atRank( r + 1 );

		ve._setMark( 0, null, begin, doc );
	}
};


/*
| Up arrow pressed.
*/
fabric_para.prototype._keyUp =
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

	x =
		retainx !== null
		? retainx
		: cpos.p.x;

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
fabric_para.prototype._setMark =
	function(
		at,      // position to mark caret (or end of range)
		retainx, // retains this x position when moving up/down
		begin,   // begin when marking a range
		doc      // range mark need this
	)
{
	if( !begin )
	{
		return root.setMark(
			mark_caret.create(
				'path', this.textPath,
				'at', at,
				'retainx', retainx
			)
		);
	}
	else
	{
		return root.setMark(
			mark_range.create(
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
	}
};


} )( );
