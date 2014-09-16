/*
| A visual paragraph.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	visual;

visual = visual || { };


/*
| Imports
*/
var
	euclid,
	fontPool,
	jools,
	marks,
	peer,
	root,
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
			'visual.para',
		attributes :
			{
				flowWidth :
					{
						comment :
							'width of the para its flow',
						type :
							'Number',
						defaultValue :
							undefined
					},
				fontsize :
					{
						comment :
							'size of the font',
						type :
							'Number',
						defaultValue :
							undefined
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'visual.para',
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
							undefined
					},
				path :
					{
						comment :
							'the path of the para',
						type :
							'jion.path',
						defaultValue :
							undefined
					},
				text :
					{
						comment :
							'the paragraphs text',
						json :
							true,
						type :
							'String',
						defaultValue : // TODO
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						defaultValue :
							undefined
					}
			},
		alike :
			{
				alikeIgnoringView :
					{
						ignores :
							{
								'view' : true
							}
					}
			},
		init :
			[
				'inherit'
			],
		node :
			true
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	visual.para = require( '../jion/this' )( module );
}


var
	para;

para = visual.para;


/*
| Initializer.
*/
para.prototype._init =
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
		jools.aheadValue(
			this,
			'flow',
			inherit.flow
		);

		jools.aheadValue(
			this,
			'_fabric',
			inherit._fabric
		);
	}
};


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
para.concernsMark =
	function(
		mark,
		path
	)
{
	if( mark === undefined )
	{
		return undefined;
	}

	if( mark.reflect === 'marks.range' )
	{
		if(
			mark.itemPath.subPathOf( path )
		)
		{
			return mark;
		}
		else
		{
			return marks.vacant.create( );
		}
	}

	if(
		mark.containsPath( path )
	)
	{
		return mark;
	}
	else
	{
		return marks.vacant.create( );
	}
};


/*
| Shortcut to the para's key.
| It is the last path entry.
*/
jools.lazyValue(
	para.prototype,
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
	para.prototype,
	'attentionCenter',
	function( )
	{
		var
			fs =
				this.fontsize,

			descend =
				fs * theme.bottombox,

			p =
				this.locateOffset(
					this.mark.caretAt
				).p,

			s =
				Math.round( p.y + descend ),

			n =
				s - Math.round( fs + descend );

		return n;
	}
);


/*
| The para's fabric.
*/
jools.lazyValue(
	para.prototype,
	'_fabric',
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
			zoom,
			height,
			width;

		flow = this.flow;

		font = this.font;

		mark = this.mark;

		view = this.view;

		zoom = view.zoom;

		height = this.height * zoom;

		width = flow.spread * zoom;


		// adds to width so the caret gets visible.
		f =
			euclid.fabric.create(
				'width',
					width + 7,
				'height',
					height + 1
			);

		f.scale( zoom );

		// draws text into the fabric
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
					'text',
						chunk.t,
					'xy',
						chunk.x,
						line.y,
					'font',
						font
				);
			}
		}

		f.scale( 1 / zoom );

		if(
			mark.reflect === 'marks.caret'
			&&
			mark.focus
		)
		{
			this._drawCaret( f );
		}

		return f;
	}
);


/*
| Draws the paragraph in its cache and returns it.
*/
para.prototype.draw =
	function(
		fabric, // the fabric to draw upon
		pnw     // pnw of this para
	)
{
	fabric.drawImage(
		'image',
			this._fabric,
		'pnw',
			pnw
	);
};


/*
| Draws the caret.
*/
para.prototype._drawCaret =
	function(
		fabric
	)
{
	var
		view =
			this.view,

		descend =
			this.fontsize * theme.bottombox,

		p =
			this.locateOffset(
				this.mark.caretAt
			).p,

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( this.fontsize + descend );

	// draws the caret
	fabric.fillRect(
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
	para.prototype,
	'font',
	function( )
	{
		return fontPool.get(
			this.fontsize,
			'la'
		);
	}
);


/*
| The para's flow, the position of all chunks.
*/
jools.lazyValue(
	para.prototype,
	'flow',
	function( )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !this.fontsize )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		var
			flowWidth =
				this.flowWidth,
			font =
				this.font,
			// FIXME go into subnodes instead
			text =
				this.text,
			// width really used.
			spread =
				0,
			// current x positon, and current x including last tokens width
			x =
				0,
			xw =
				0,
			y =
				Math.round( font.size ),
			space =
				euclid.measure.width( font, ' ' ),
			line =
				0,
			flow =
				[ ];

		flow[ line ] = {
			a :
				[ ],
			y :
				y,
			o :
				0
		};


		var reg =
			( /(\S+\s*$|\s*\S+)\s?(\s*)/g );
			// !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);

		for(
			var ca = reg.exec( text );
			ca !== null;
			ca = reg.exec( text )
		)
		{
			// a token is a word plus following hard spaces
			var
				token =
					ca[ 1 ] + ca[ 2 ],
				w =
					euclid.measure.width( font, token );

			xw =
				x + w;

			if( flowWidth > 0 && xw > flowWidth )
			{
				if( x > 0 )
				{
					// soft break
					if( spread < xw )
					{
						spread =
							xw;
					}

					x = 0;

					xw = x + w;

					y += Math.round( font.size * ( 1 + theme.bottombox ) );

					line++;

					flow[ line ] = {
						a :
							[ ],
						y :
							y,
						o :
							ca.index
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
					x :
						x,
					w :
						w,
					o :
						ca.index,
					t :
						token
				}
			);

			x = xw + space;
		}

		if( spread < xw )
		{
			spread = xw;
		}

		flow.height = y;

		flow.flowWidth = flowWidth;

		flow.spread = spread;

		return flow;
	}
);


/*
| The height of the para.
*/
jools.lazyValue(
	para.prototype,
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
para.prototype.getOffsetAt =
	function(
		line,
		x
	)
{
	var
		font =
			this.font,

		flow =
			this.flow,

		fline =
			flow[ line ],

		ftoken =
			null;

	for(
		var token = 0;
		token < fline.a.length;
		token++
	)
	{
		ftoken =
			fline.a[ token ];

		if( x <= ftoken.x + ftoken.w )
		{
			break;
		}
	}

	if( token >= fline.a.length )
	{
		ftoken =
			fline.a[ --token ];
	}

	if( !ftoken )
	{
		return 0;
	}

	var
		dx =
			x - ftoken.x,

		text =
			ftoken.t,

		x1 =
			0,

		x2 =
			0,

		a;

	for(
		a = 0;
		a <= text.length;
		a++
	)
	{
		x1 =
			x2;

		x2 =
			euclid.measure.width(
				font,
				text.substr( 0, a )
			);

		if( x2 >= dx )
		{
			break;
		}
	}

	if( a > text.length )
	{
		a =
			text.length;
	}

	if( dx - x1 < x2 - dx && a > 0 )
	{
		a--;
	}

	return ftoken.o + a;
};


/*
| Returns the point of a given offset.
*/
para.prototype.locateOffset =
	function(
		offset    // the offset to get the point from.
	)
{
	// FIXME cache position
	var
		font =
			this.font,

		text =
			this.text,

		flow =
			this.flow,
		a,
		aZ,
		lineN,
		tokenN;

	for(
		a = 1, aZ = flow.length, lineN = aZ - 1;
		a < aZ;
		a++
	)
	{
		if( flow[ a ].o > offset )
		{
			lineN =
				a - 1;

			break;
		}
	}

	var
		line =
			flow[ lineN ];

	for(
		a = 1, aZ = line.a.length, tokenN = aZ - 1;
		a < aZ;
		a++
	)
	{
		if (line.a[a].o > offset)
		{
			tokenN =
				a - 1;

			break;
		}
	}

	var
		token =
			line.a[ tokenN ],

		p;

	if( token )
	{
		p =
			euclid.point.create(
				'x',
					Math.round(
						token.x +
						euclid.measure.width(
							font, text.substring( token.o, offset )
						)
					),
				'y',
					line.y
			);
	}
	else
	{
		p =
			euclid.point.create(
				'x',
					Math.round(
						euclid.measure.width( font, text )
					),
				'y',
					line.y
			);
	}

	return (
		jools.immute( {
			p :
				p,
			line :
				lineN
		} )
	);
};


/*
| Returns the offset closest to a point.
*/
para.prototype.getPointOffset =
	function(
		item,
		point     // the point to look for
	)
{
	var
		flow =
			this.flow,

		line;

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

	return this.getOffsetAt(
		line,
		point.x
	);
};


/*
| A text has been inputed.
*/
para.prototype.input =
	function(
		text,
		item
	)
{
	var
		caretAt,
		doc,
		line,
		paraKey,
		path,
		reg,
		r,
		rx,
		textPath;

	reg = /([^\n]+)(\n?)/g;

	path = this.path;

	paraKey = this.key;

	textPath = this.textPath;

	doc = item.doc;

	caretAt =
		this.mark.caretAt;

	for(
		rx = reg.exec( text );
		rx !== null;
		rx = reg.exec( text )
	)
	{
		line =
			rx[ 1 ];

		peer.insertText(
			textPath,
			caretAt,
			line
		);

		if( rx[ 2 ] )
		{
			// FIXME, somehow use changes
			// over return values more elegantly
			r =
				peer.split(
					textPath,
					caretAt + line.length
				);

			doc =
				r.tree.getPath(
					path.chop( ).limit( 3 )
				);

			paraKey =
				doc.ranks[
					doc.rankOf( paraKey ) + 1
				];

			path = path.limit( 5 ).append( paraKey );

			textPath = path.append( 'text' );

			caretAt = 0;
		}
	}
};


/*
| Handles a special key.
*/
para.prototype.specialKey =
	function(
		key,
		item,
		shift,
		ctrl
	)
{
	var
		doc,
		mark,
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
					marks.range.create(
						'doc',
							doc,
						'bPath',
							v0.textPath,
						'bAt',
							0,
						'ePath',
							v1.textPath,
						'eAt',
							v1.text.length
					)
				);

				return true;
		}
	}

	var
		keyHandler =
			_keyMap[ key ],

		at =
			null,

		bPath =
			null,

		bAt =
			null,

		retainx =
			null;

	switch( mark.reflect )
	{
		case 'marks.caret' :

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
				bPath = mark.caretPath;

				bAt = mark.caretAt;
			}

			break;

		case 'marks.range' :

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
				bPath = mark.bPath;

				bAt = mark.bAt;
			}

			break;
	}

	if( keyHandler )
	{
		this[ keyHandler ](
			item,
			doc,
			at,
			retainx,
			bPath,
			bAt
		);
	}
};


/*
| The path to the .text attribute
*/
jools.lazyValue(
	para.prototype,
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
	_keyMap =
		{
			'backspace' :
				'_keyBackspace',

			'del' :
				'_keyDel',

			'down' :
				'_keyDown',

			'end' :
				'_keyEnd',

			'enter' :
				'_keyEnter',

			'left' :
				'_keyLeft',

			'pagedown' :
				'_keyPageDown',

			'pageup' :
				'_keyPageUp',

			'pos1' :
				'_keyPos1',

			'right' :
				'_keyRight',

			'up' :
				'_keyUp'
		};


/*
| Backspace pressed.
*/
para.prototype._keyBackspace =
	function(
		item,
		doc,
		at
		// retainx
		// bPath,
		// bAt
	)
{
	var
		r;

	if( at > 0 )
	{
		peer.removeText(
			this.textPath,
			at - 1,
			1
		);

		return;
	}

	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		var
			ve =
				doc.atRank( r - 1 );

		peer.join(
			ve.textPath,
			ve.text.length
		);
	}
};


/*
| Del-key pressed.
*/
para.prototype._keyDel =
	function(
		item,
		doc,
		at
		// retainx,
		// bPath,
		// bAt
	)
{
	var
		r;

	if( at < this.text.length )
	{
		peer.removeText(
			this.textPath,
			at,
			1
		);

		return;
	}

	r = doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		peer.join(
			this.textPath,
			this.text.length
		);
	}
};


/*
| Down arrow pressed.
*/
para.prototype._keyDown =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	var
		cpos,
		flow,
		r,
		ve,
		x;

	flow = this.flow,

	cpos = this.locateOffset( at ),

	x =
		retainx !== null
		?  retainx
		: cpos.p.x;

	if( cpos.line < flow.length - 1 )
	{
		// stays within this para
		at =

		this._setMark(
			this.getOffsetAt(
				cpos.line + 1,
				x
			),
			x,
			bPath,
			bAt,
			doc
		);

		return;
	}

	// goto next para
	r =
		doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		ve = doc.atRank( r + 1 );

		at = ve.getOffsetAt( 0, x );

		ve._setMark(
			at,
			x,
			bPath,
			bAt,
			doc
		);
	}
};


/*
| End-key pressed.
*/
para.prototype._keyEnd =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	this._setMark(
		this.text.length,
		null,
		bPath,
		bAt,
		doc
	);
};


/*
| Enter-key pressed
*/
para.prototype._keyEnter =
	function(
		item,
		doc,
		at
		// retainx,
		// bPath,
		// bAt
	)
{
	peer.split(
		this.textPath,
		at
	);
};


/*
| Left arrow pressed.
*/
para.prototype._keyLeft =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	var
		r,
		ve;

	if( at > 0 )
	{
		this._setMark(
			at - 1,
			null,
			bPath,
			bAt,
			doc
		);

		return;
	}

	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		ve = doc.atRank( r - 1 );

		ve._setMark(
			ve.text.length,
			null,
			bPath,
			bAt,
			doc
		);

		return;
	}
	else
	{
		this._setMark(
			at,
			null,
			bPath,
			bAt,
			doc
		);
	}
};


/*
| User pressed page up or down
|
| FUTURE maintain relative scroll pos
*/
para.prototype._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		item,     // TODO remove
		doc,
		at,
		retainx,
		bPath,
		bAt
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
		p =
			this.locateOffset( at ).p,

		zone =
			item.zone,

		pnw =
			doc.getPNW( this.key ),

		tp =
			p.add(
				pnw.x,
				pnw.y + zone.height * dir
			),

		tpara =
			doc.getParaAtPoint(
				item,
				tp
			);

	if( tpara === null )
	{
		tpara =
			doc.atRank( doc.ranks.length - 1 );
	}

	var
		tpnw =
			doc.getPNW( tpara.key );

	at =
		tpara.getPointOffset(
			item,
			tp.sub( tpnw )
		);

	tpara._setMark(
		at,
		retainx,
		bPath,
		bAt,
		doc
	);
};


/*
| PageDown key pressed.
*/
para.prototype._keyPageDown =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	this._pageUpDown(
		+1,
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	);
};


/*
| PageUp key pressed.
*/
para.prototype._keyPageUp =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	this._pageUpDown(
		-1,
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	);
};


/*
| Pos1-key pressed.
*/
para.prototype._keyPos1 =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	this._setMark(
		0,
		null,
		bPath,
		bAt,
		doc
	);
};


/*
| Right arrow pressed.
*/
para.prototype._keyRight =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	if( at < this.text.length )
	{
		this._setMark(
			at + 1,
			null,
			bPath,
			bAt,
			doc
		);

		return;
	}

	var
		r =
			doc.rankOf( this.key );

	if( r < doc.ranks.length - 1 )
	{
		var
			ve =
				doc.atRank( r + 1 );

		ve._setMark(
			0,
			null,
			bPath,
			bAt,
			doc
		);
	}
};


/*
| Up arrow pressed.
*/
para.prototype._keyUp =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
	var
		cpos,
		r,
		x;

	cpos =
		this.locateOffset(
			at
		),

	x =
		retainx !== null ?
				retainx :
				cpos.p.x;

	if( cpos.line > 0 )
	{
		// stay within this para
		at =
			this.getOffsetAt(
				cpos.line - 1,
				x
			);

		this._setMark(
			at,
			x,
			bPath,
			bAt,
			doc
		);

		return;
	}

	// goto prev para
	r = doc.rankOf( this.key );

	if( r > 0 )
	{
		var
			ve =
				doc.atRank( r - 1 );

		at =
			ve.getOffsetAt(
				ve.flow.length - 1,
				x
			);

		ve._setMark(
			at,
			x,
			bPath,
			bAt,
			doc
		);
	}
};


/*
| Sets the users caret or range
*/
para.prototype._setMark =
	function(
		at,      // position to mark caret (or end of range)
		retainx, // retains this x position when moving up/down
		bPath,   // begin path when marking a range
		bAt,     // begin at   when marking a range
		doc      // range marks need this
	)
{
	if( !bPath )
	{
		return root.setMark(
			marks.caret.create(
				'path',
					this.textPath,
				'at',
					at,
				'retainx',
					retainx
			)
		);
	}
	else
	{
		return root.setMark(
			marks.range.create(
				'doc',
					doc,
				'bPath',
					bPath,
				'bAt',
					bAt,
				'ePath',
					this.textPath,
				'eAt',
					at,
				'retainx',
					retainx
			)
		);
	}
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = para;
}


} )( );
