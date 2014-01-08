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

Visual =
	Visual ||
	{ };


/*
| Imports
*/
var
	Euclid,
	fontPool,
	Jools,
	Mark,
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
		'this code requires a browser!'
	);
}

var
	_tag =
		'PARA-35155849';

/*
| Constructor.
*/
var Para =
Visual.Para =
	function(
		tag,
		tree,
		path,
		fontsize,
		flowWidth,
		mark
	)
{
	Jools.logNew(
		this,
		path
	);

	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( !tree )
		{
			throw new Error(
				'tree missing'
			);
		}

		if( tree.twig.type !== 'Para' )
		{
			throw new Error(
				'type error'
			);
		}

		if( !Jools.is( flowWidth ) )
		{
			throw new Error(
				'no flowWidth'
			);
		}
	}

	Visual.Base.call(
		this,
		tree
	);

	this.fontsize =
		fontsize;

	this.flowWidth =
		flowWidth;

	this.text =
		tree.twig.text;

	this.mark =
		mark;

	// caching
	this.$fabric =
		null;
};


/*
| Paras extend visual base
*/
Jools.subclass(
	Para,
	Visual.Base
);


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
| Reflection
*/
Para.prototype.reflect =
	'Para';


/*
| Creates a new para
*/
Para.create =
	function(
		// free strings
	)
{
	var
		flowWidth =
			null,

		fontsize =
			null,

		inherit =
			null,

		mark =
			null,

		path =
			null,

		tree =
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

			case 'flowWidth' :

				flowWidth =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
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
		if( path === null )
		{
			path =
				inherit.path;
		}
	}


	if( mark )
	{
		mark =
			Para.concernsMark(
				mark,
				path
			);
	}

	if( inherit )
	{
		if( !flowWidth )
		{
			flowWidth =
				inherit.flowWidth;
		}

		if( !fontsize )
		{
			fontsize =
				inherit.fontsize;
		}

		if( !tree )
		{
			tree =
				inherit.tree;
		}

		if(
			inherit.tree === tree
			&&
			(
				inherit.path && inherit.path.equals( path ) // TODO
			)
			&&
			inherit.fontsize === fontsize
			&&
			inherit.flowWidth === flowWidth
			&&
			inherit.mark.equals( mark )
		)
		{
			return inherit;
		}
	}

	return (
		new Para(
			_tag,
			tree,
			path,
			fontsize,
			flowWidth,
			mark
		)
	);
};


/*
| Marker. TODO remove all Markers.
*/
Para.prototype.Para =
	true;


/*
| Draws the paragraph in its cache and returns it.
*/
Para.prototype.draw =
	function(
		fabric, // the fabric to draw upon
		view,   // the current vient,
		item,   // the item the para belongs to.
		pnw     // pnw of this para
	)
{
	var
		f =
			this.$fabric,

		zoom =
			view.zoom;

	// FIXME, zoom level should be part of the object.
	if(
		!f ||
		f.zoom !== zoom
	)
	{
		// no cache

		var
			flow =
				this.flow,

			font =
				this.font,

			width =
				flow.spread * zoom,

			height =
				this.height * zoom;

		// adds to width so the caret gets visible.
		f =
		this.$fabric =
			new Euclid.Fabric(
				width + 7,
				height + 1
			);

		f.scale( zoom );

		f.zoom =
			zoom;

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

		var
			mark =
				this.mark;

		if(
			mark &&
			mark.reflect === 'Caret' &&
			this.path.subPathOf( mark.caretPath )
		)
		{
			this._drawCaret(
				f,
				view,
				item
			);
		}
	}

	fabric.drawImage(
		'image',
			f,
		'pnw',
			pnw
	);
};


/*
| Draws the caret
*/
Para.prototype._drawCaret =
	function(
		fabric,
		view,
		item
	)
{
	var
		fs =
			item.sub.doc.font.twig.size,

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

	// TODO
	/*
	system.focusCenter(
		'p',
			view.point(
				cx + zone.pnw.x,
				cn + zone.pnw.y
			)
	);
	*/

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
| Returns the font for this para.
*/
Jools.lazyFixate(
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
| Flows the paragraph, positioning all chunks.
*/
Jools.lazyFixate(
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
				font.size,

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
| Returns the height of the para.
*/
Jools.lazyFixate(
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
			shellverse.grow(
				'Point',
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
			shellverse.grow(
				'Point',
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
		text
	)
{
	var
		reg  =
			/([^\n]+)(\n?)/g,

		para =
			this,

		item =
			shell.space.getSub(
				para.path,
				'Item'
			),

		doc =
			item.sub.doc;

	for(
		var rx = reg.exec( text );
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		shell.peer.insertText(
			para.textPath,
			shell.space.mark.caretAt,
			line
		);

		if( rx[ 2 ] )
		{
			// FIXME, somehow use changes
			// over return values
			shell.peer.split(
				para.textPath,
				shell.space.mark.caretAt
			);

			item =
				shell.space.getSub(
					para.path,
					'Item'
				);

			doc =
				item.sub.doc;

			para =
				doc.atRank(
					doc.tree.rankOf( para.key ) + 1
				);
		}
	}

	item.scrollMarkIntoView( );
};


/*
| Handles a special key.
*/
Para.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		item =
			shell.space.getSub(
				this.path,
				'Item'
			),

		doc =
			item.sub.doc,

		mark =
			this.mark,

		show =
			false;

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

				shell.userMark(
					'set',
					'type',
						'range',
					'bPath',
						v0.textPath,
					'bAt',
						0,
					'ePath',
						v1.textPath,
					'eAt',
						v1.text.length
				);

				shell.redraw =
					true;

				return true;
		}
	}

	// TODO move to Doc
	if( mark.reflect === 'Range' )
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				shell.removeRange( mark );

				mark =
					shell.space.mark;

				show =
					true;

				key =
					null;

				return true;

			case 'enter' :

				shell.removeRange( mark );

				mark =
					shell.space.mark;

				show =
					true;

				shell.peer.split(
					this.textPath,
					this.mark.caretAt
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
		show =
			this[ keyHandler ](
				item,
				doc,
				at,
				retainx,
				bPath,
				bAt
			)
			||
			show;
	}
	else
	{
		switch( key )
		{
			case 'pageup' :

				item.scrollPage( true );

				break;

			case 'pagedown' :

				item.scrollPage( false );

				break;
		}
	}

	if( show )
	{
		item =
			shell.space.getSub(
				this.path,
				'Item'
			);

		item.scrollMarkIntoView( );

		shell.redraw =
			true;
	}
};


/*
| Returns the path to the .text attribute
*/
Jools.lazyFixate(
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

			'pos1' :
				'_keyPos1',

			'right' :
				'_keyRight',

			'up' :
				'_keyUp',
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

		return true;
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

		return true;
	}

	return false;
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

		return true;
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

		return true;
	}

	return false;
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
			bAt
		);


		return true;
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
			bAt
		);
	}

	return true;
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
	if( at === this.text.length )
	{
		return false;
	}

	this._setMark(
		this.text.length,
		null,
		bPath,
		bAt
	);

	return true;
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

	return true;
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
			bAt
		);

		return true;
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
			bAt
		);

		return true;
	}

	return false;
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
	if( at === 0 )
	{
		return false;
	}

	this._setMark(
		0,
		null,
		bPath,
		bAt
	);

	return true;
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
			bAt
		);

		return true;
	}

	var r =
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
			bAt
		);

		return true;
	}

	return false;
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
			bAt
		);

		return true;
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
			bAt
		);

		return true;
	}

	return false;
};


/*
| Sets the users caret or range
*/
Para.prototype._setMark =
	function(
		at,     // position to mark caret (or end of range)
		retainx, // retains this x position when moving up/down
		bPath,   // begin path when marking a range
		bAt      // begin at   when marking a range
	)
{
	if( !bPath )
	{
		if( retainx )
		{
			return shell.userMark(
				'set',
				'type',
					'caret',
				'path',
					this.textPath,
				'at',
					at,
				'retainx',
					retainx
			);
		}
		else
		{
			return shell.userMark(
				'set',
				'type',
					'caret',
				'path',
					this.textPath,
				'at',
					at
			);
		}
	}
	else
	{
		if( retainx )
		{
			return shell.userMark(
				'set',
				'type',
					'range',
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
			);
		}
		else
		{
			return shell.userMark(
				'set',
				'type',
					'range',
				'bPath',
					bPath,
				'bAt',
					bAt,
				'ePath',
					this.textPath,
				'eAt',
					at
			);
		}
	}
};


} )( );
