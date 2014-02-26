/*
| A visual paragraph.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;


/*
| Imports
*/
var
	Euclid,
	fontPool,
	Jools,
	Mark,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Para',
		unit :
			'Visual',
		attributes :
			{
				flowWidth :
					{
						comment :
							'width of the para its flow',
						type :
							'Number'
					},
				fontsize :
					{
						comment :
							'size of the font',
						type :
							'Number'
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								func :
									'Para.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Mark'
					},
				path :
					{
						comment :
							'the path of the para',
						type :
							'Path'
					},
				tree :
					{
						comment :
							'the data tree',
						type :
							'Tree'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View'
					}
			},
		init :
			[
				'inherit'
			]
	};
}


var
	Para =
		Visual.Para;


/*
| Initializer.
*/
Para.prototype._init =
	function(
		inherit
	)
{
	// TODO make general equal builder
	if(
		inherit
		&&
		inherit.flowWidth === this.flowWidth
		&&
		inherit.fontsize === this.fontsize
		&&
		inherit.mark.equals( this.mark )
		&&
		inherit.path.equals( this.path )
		&&
		inherit.tree === this.tree
		&&
		inherit.view.zoom === this.view.zoom
	)
	{
		Jools.aheadValue(
			this,
			'flow',
			inherit.flow
		);

		Jools.aheadValue(
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
Para.concernsMark =
	function(
		mark,
		path
	)
{
	if( mark.reflect === 'Range' )
	{
		if(
			mark.itemPath.subPathOf( path )
		)
		{
			return mark;
		}
		else
		{
			return Mark.Vacant.create( );
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
		return Mark.Vacant.create( );
	}
};


/*
| Shortcut to the para's key.
| It is the last path entry.
*/
Jools.lazyValue(
	Para.prototype,
	'key',
	function( )
	{
		return this.path.get( -1 );
	}
);


/*
| The attention center.
*/
Jools.lazyValue(
	Para.prototype,
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
Jools.lazyValue(
	Para.prototype,
	'_fabric',
	function( )
	{
		var
			flow =
				this.flow,

			font =
				this.font,

			mark =
				this.mark,

			view =
				this.view,

			zoom =
				view.zoom,

			height =
				this.height * zoom,

			width =
				flow.spread * zoom;

		// adds to width so the caret gets visible.
		var f =
			Euclid.Fabric.create(
				'width',
					width + 7,
				'height',
					height + 1
			);

		f.scale( zoom );

		// draws text into the fabric
		for(
			var a = 0, aZ = flow.length;
			a < aZ;
			a++
		)
		{
			var
				line =
					flow[ a ];

			for(
				var b = 0, bZ = line.a.length;
				b < bZ;
				b++
			)
			{
				var
					chunk =
						line.a[ b ];

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
			mark.reflect === 'Caret'
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
Para.prototype.draw =
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
Para.prototype._drawCaret =
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
Jools.lazyValue(
	Para.prototype,
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
Jools.lazyValue(
	Para.prototype,
	'flow',
	function( )
	{
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
				Euclid.Measure.width( font, ' ' ),

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
					Euclid.Measure.width( font, token );

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

					x =
						0;

					xw =
						x + w;

					y +=
						Math.round( font.size * ( 1 + theme.bottombox ) );

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

			x =
				xw + space;
		}

		if( spread < xw )
		{
			spread =
				xw;
		}

		flow.height =
			y;

		flow.flowWidth =
			flowWidth;

		flow.spread =
			spread;

		return flow;
	}
);


/*
| Shortcut to the text in the para.
*/
Jools.lazyValue(
	Para.prototype,
	'text',
	function( )
	{
		return (
			this.tree.twig.text
		);
	}
);


/*
| The height of the para.
*/
Jools.lazyValue(
	Para.prototype,
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
Para.prototype.getOffsetAt =
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
			Euclid.Measure.width(
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
Para.prototype.locateOffset =
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
			Euclid.Point.create(
				'x',
					Math.round(
						token.x +
						Euclid.Measure.width(
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
			Euclid.Point.create(
				'x',
					Math.round(
						Euclid.Measure.width( font, text )
					),
				'y',
					line.y
			);
	}

	return (
		Jools.immute( {
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
Para.prototype.getPointOffset =
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
Para.prototype.input =
	function(
		text,
		item
	)
{
	var
		reg  =
			/([^\n]+)(\n?)/g,

		path =
			this.path,

		paraKey =
			this.key,

		textPath =
			this.textPath,

		doc =
			item.sub.doc,

		caretAt =
			this.mark.caretAt;

	for(
		var rx = reg.exec( text );
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var
			line =
				rx[ 1 ];

		shell.peer.insertText(
			textPath,
			caretAt,
			line
		);

		if( rx[ 2 ] )
		{
			// FIXME, somehow use changes
			// over return values more elegantly
			var
				r =
					shell.peer.split(
						textPath,
						caretAt + line.length
					);

			doc =
				r.tree.getPath( path.chop( ).limit( 2 ) );

			paraKey =
				doc.ranks[
					doc.rankOf( paraKey ) + 1
				];

			path =
				path.limit( 3 ).append( paraKey );

			textPath =
				path.append( 'text' );

			caretAt =
				0;
		}
	}
};


/*
| Handles a special key.
*/
Para.prototype.specialKey =
	function(
		key,
		item,
		shift,
		ctrl
	)
{
	var
		doc =
			item.sub.doc,

		mark =
			this.mark;

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :

				var
					v0 =
						doc.atRank( 0 ),
					v1 =
						doc.atRank( doc.tree.length - 1 );

				shell.setMark(
					Mark.Range.create(
						'docTree',
							doc.tree,
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
		case 'Caret' :

			if( CHECK )
			{
				if( !this.path.subPathOf( mark.caretPath ) )
				{
					throw new Error(
						'path mismatch'
					);
				}
			}

			at =
				mark.caretAt;

			retainx =
				mark.retainx;

			if( shift )
			{
				bPath =
					mark.caretPath;

				bAt =
					mark.caretAt;
			}

			break;

		case 'Range' :

			if( CHECK )
			{
				if( !this.path.subPathOf( mark.caretPath ) )
				{
					throw new Error(
						'path mismatch'
					);
				}
			}

			at =
				mark.caretAt;

			retainx =
				mark.retainx;

			if( shift )
			{
				bPath =
					mark.bPath;

				bAt =
					mark.bAt;
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
Jools.lazyValue(
	Para.prototype,
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
Para.prototype._keyBackspace =
	function(
		item,
		doc,
		at
		// retainx
		// bPath,
		// bAt
	)
{
	if( at > 0 )
	{
		shell.peer.removeText(
			this.textPath,
			at - 1,
			1
		);

		return;
	}

	var
		r =
			doc.tree.rankOf( this.key );

	if( r > 0 )
	{
		var
			ve =
				doc.atRank( r - 1 );

		shell.peer.join(
			ve.textPath,
			ve.text.length
		);
	}
};


/*
| Del-key pressed.
*/
Para.prototype._keyDel =
	function(
		item,
		doc,
		at
		// retainx,
		// bPath,
		// bAt
	)
{
	if( at < this.text.length )
	{
		shell.peer.removeText(
			this.textPath,
			at,
			1
		);

		return;
	}

	var
		r =
			doc.tree.rankOf( this.key );

	if( r < doc.tree.length - 1 )
	{
		shell.peer.join(
			this.textPath,
			this.text.length
		);
	}
};


/*
| Down arrow pressed.
*/
Para.prototype._keyDown =
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
		flow =
			this.flow,

		cpos =
			this.locateOffset( at ),

		x =
			retainx !== null ?
				retainx :
				cpos.p.x;

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
	var
		r =
			doc.tree.rankOf( this.key );

	if( r < doc.tree.length - 1 )
	{
		var
			ve =
				doc.atRank( r + 1 );

		at =
			ve.getOffsetAt( 0, x );

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
Para.prototype._keyEnd =
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
Para.prototype._keyEnter =
	function(
		item,
		doc,
		at
		// retainx,
		// bPath,
		// bAt
	)
{
	shell.peer.split(
		this.textPath,
		at
	);
};


/*
| Left arrow pressed.
*/
Para.prototype._keyLeft =
	function(
		item,
		doc,
		at,
		retainx,
		bPath,
		bAt
	)
{
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

	var
		r =
			doc.tree.rankOf( this.key );

	if( r > 0 )
	{
		var
			ve =
				doc.atRank( r - 1 );

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
Para.prototype._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		item,
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
			doc.getPNW( item, this.key ),

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
			doc.atRank( doc.tree.length - 1 );
	}

	var
		tpnw =
			doc.getPNW( item, tpara.key );

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
Para.prototype._keyPageDown =
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
Para.prototype._keyPageUp =
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
Para.prototype._keyPos1 =
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
Para.prototype._keyRight =
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
			doc.tree.rankOf( this.key );

	if( r < doc.tree.length - 1 )
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
Para.prototype._keyUp =
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
	var
		r =
			doc.tree.rankOf( this.key );

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
Para.prototype._setMark =
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
		return shell.setMark(
			Mark.Caret.create(
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
		return shell.setMark(
			Mark.Range.create(
				'docTree',
					doc.tree,
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


} )( );
