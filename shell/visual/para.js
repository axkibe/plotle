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
	Caret,
	config,
	Euclid,
	fontPool,
	Jools,
	Sign,
	Path,
	shell,
	shellverse,
	system,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code requires a browser!'
	);
}

var
	_tag =
		'X35155849';

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
		tree,
		path
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

		if( !path )
		{
			path =
				inherit.path;
		}

		if( !tree )
		{
			tree =
				inherit.tree;
		}

		if(
			inherit.tree === tree &&
			(
				inherit.path && inherit.path.equals( path )
			) &&
			inherit.fontsize === fontsize &&
			inherit.flowWidth === flowWidth &&
			inherit.mark === mark
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
| Marker.
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
		pnw     // pnw of this para
	)
{
//	console.log(this.path);

	var
		f =
			this.$fabric,

		zoom =
			view.zoom;

	// FIXME, zoom level should be part of the object.
	if( !f || f.zoom !== zoom )
	{
		// no cache

		var
			flow =
				this.flow,

			font =
				this.font,

			width =
				flow.spread * view.zoom,

			height =
				this.height * view.zoom;

		// adds 1 to width so the caret is visible.
		f =
		this.$fabric =
			new Euclid.Fabric(
				width + 1,
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

		var
			mark =
				shell.space.mark;

		// TODO use concerns
		if(
			mark.sign &&
			mark.sign.path.equals( this.textPath )
		)
		{
			this._drawCaret(
				f,
				view,
				mark
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
		mark
	)
{
	var
		space =
			shell.space,

		item =
			shell.space.getSub(
				this.path,
				'Item'
			),

		fs =
			item.sub.doc.font.twig.size,

		descend =
			fs * theme.bottombox,

		p =
			this.locateOffset(
				mark.sign.at1
			).p,

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( fs + descend );

		/*

		doc =
			item.sub.doc,

		zone =
			item.zone,

		/*
		pnw =
			doc.getPNW(
				item,
				this.key
			),

		sbary =
			item.$scrollbarY,

		sy =
			sbary ?
				Math.round( sbary.pos )
				:
				0,

		cn =
			Jools.limit(
				0,
				n + pnw.y - sy,
				zone.height
			),

		cs =
			Jools.limit(
				0,
				s + pnw.y - sy,
				zone.height
			),

		cx =
			p.x + pnw.x;
		*/

	// TODO use X/Y
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
		p.x,
		n,
		1,
		s - n
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
			( /(\s*\S+|\s+$)\s?(\s*)/g );
			// !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);

		for(
			var ca = reg.exec( text );
			ca !== null;
			ca = reg.exec( text )
		)
		{
			// a token is a word plus following hard spaces
			var token =
				ca[ 1 ] + ca[ 2 ];

			var w =
				Euclid.Measure.width( font, token );

			xw =
				x + w + space;

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
						x + w + space;

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

			x = xw;
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

		//flow.fontsize =
		//	font.size;

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
			fline.a[token];

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
		a < text.length;
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
		tree =
			this.tree,

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
| Text has been inputted.
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
		var rx = reg.exec(text);
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		shell.peer.insertText(
			para.textPath,
			shell.space.mark.sign.at1,
			line
		);

        if( rx[ 2 ] )
		{
			// FIXME, somehow use changes
			// over return values
			shell.peer.split(
				para.textPath,
				shell.space.mark.sign.at1
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

	item.scrollCaretIntoView( );
};


/*
| Backspace pressed.
*/
Para.prototype._keyBackspace =
	function(
		item,
		doc
	)
{
	if( this.mark.sign.at1 > 0 )
	{
		shell.peer.removeText(
			this.textPath,
			this.mark.sign.at1 - 1,
			1
		);

		return true;
	}

	var
		r =
			doc.tree.rankOf( this.key );

	if( r > 0 )
	{
		var ve =
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
		doc
	)
{
	if( this.mark.sign.at1 < this.text.length )
	{
		shell.peer.removeText(
			this.textPath,
			this.mark.sign.at1,
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
		doc
	)
{
	var
		mark =
			this.mark,

		flow =
			this.flow,

		at1,

		cpos =
			this.locateOffset(
				mark.sign.at1
			),

		x =
			Jools.isnon( mark.retainx ) ?
				mark.retainx :
				cpos.p.x;

	if( cpos.line < flow.length - 1 )
	{
		// stays within this para
		at1 =
			this.getOffsetAt(
				cpos.line + 1,
				x
			);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				this.textPath,
			'at1',
				at1,
			'retainx',
				x
		);

		return true;
	}

	// goto next para
	var
		r =
			doc.tree.rankOf( this.key );

	if( r < doc.tree.length - 1 )
	{
		var ve =
			doc.atRank(r + 1);

		at1 =
			ve.getOffsetAt( 0, x );

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				ve.textPath,
			'at1',
				at1,
			'retainx',
				x
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
		doc
	)
{
	var
		mark =
			this.mark,

		text =
			this.text;

	if( mark.sign.at1 === text.length )
	{
		return false;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			this.textPath,
		'at1',
			text.length
	);

	return true;
};


/*
| Enter-key pressed
*/
Para.prototype._keyEnter =
	function(
		item,
		doc
	)
{
	shell.peer.split(
		this.textPath,
		this.mark.sign.at1
	);

	return true;
};


/*
| Left arrow pressed.
*/
Para.prototype._keyLeft =
	function(
		item,
		doc
	)
{
	var
		mark =
			this.mark,

		space =
			shell.space;

	if( mark.sign.at1 > 0 )
	{
		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				this.textPath,
			'at1',
				mark.sign.at1 - 1
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

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				ve.textPath,
			'at1',
				ve.text.length
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
		doc
	)
{
	var
		mark =
			this.mark,

		space =
			shell.space;

	if( mark.at1 === 0 )
	{
		return false;
	}

	shell.userMark(
		'set',
		'type',
			'caret',
		'section',
			'space',
		'path',
			this.textPath,
		'at1',
			0
	);

	return true;
};


/*
| Right arrow pressed.
*/
Para.prototype._keyRight =
	function(
		item,
		doc
	)
{
	var
		mark =
			this.mark,

		space =
			shell.space;

	if( mark.sign.at1 < this.text.length )
	{
		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				this.textPath,
			'at1',
				mark.sign.at1 + 1
		);

		return true;
	}

	var r =
		doc.tree.rankOf( this.key );

	if( r < doc.tree.length - 1 )
	{
		var ve =
			doc.atRank( r + 1 );

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				ve.textPath,
			'at1',
				0
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
		doc
	)
{
	var
		mark =
			this.mark,

		cpos =
			this.locateOffset(
				mark.sign.at1
			),

		x =
			(
				Jools.isnon( mark.retainx ) ?
					mark.retainx :
					cpos.p.x
			),

		space =
			shell.space,

		at1;

	if( cpos.line > 0 )
	{
		// stay within this para
		at1 =
			this.getOffsetAt(
				cpos.line - 1,
				x
			);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				this.textPath,
			'at1',
				at1,
			'retainx',
				x
		);

		return true;
	}

	// goto prev para
	var r =
		doc.tree.rankOf( this.key );

	if( r > 0 )
	{
		var ve =
			doc.atRank( r - 1 );

		at1 =
			ve.getOffsetAt(
				ve.flow.length - 1,
				x
			);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				ve.textPath,
			'at1',
				at1,
			'retainx',
				x
		);

		return true;
	}

	return false;
};


/*
| Handles a special key
*/
Para.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		selection =
			shell.getSelection( ),

		space =
			shell.space,

		item =
			space.getSub(
				this.path,
				'Item'
			),

		doc =
			item.sub.doc,

		// if true the caret moved or the selection changed
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

				// TODO userMark

				selection =
					shell.setSelection(
						doc,
						new Sign(
							{
								path :
									v0.textPath,
								at1 :
									0
							}
						),
						new Sign(
							{
								path :
									v1.textPath,

								at1 :
									v1.text.length
							}
						)
					);

				shell.userMark(
					'set',
					'type',
						'caret',
					'section',
						'space',
					'sign',
						selection.sign2
				);

				shell.redraw =
					true;

				return true;
		}
	}

	var select1 =
		selection && selection.sign1;

	if( !shift && selection )
	{
		switch( key )
		{
			case 'down' :
			case 'end' :
			case 'left' :
			case 'pageup' :
			case 'pagedown' :
			case 'pos1' :
			case 'right' :
			case 'up' :

				shell.deselect( );

				show =
					true;

				break;

			case 'backspace' :
			case 'del' :

				shell.removeSelection( );

				selection =
					null;

				show =
					true;

				key = null;

				break;

			case 'enter' :

				shell.removeSelection( );

				selection =
					null;

				show =
					true;

				break;
		}
	}
	else if ( shift && !selection )
	{
		switch( key )
		{
			case 'backup' :
			case 'down' :
			case 'end' :
			case 'left' :
			case 'pagedown' :
			case 'pos1':
			case 'right' :
			case 'up' :

				select1 =
					shell.space.mark.sign;

				show =
					true;
		}
	}

	switch( key )
	{
		case 'backspace' :

			show =
				this._keyBackspace(
					item,
					doc
				) || show;

			break;

		case 'enter' :

			show =
				this._keyEnter(
					item,
					doc
				) || show;

			break;

		case 'pageup' :

			item.scrollPage( true );

			break;

		case 'pagedown' :

			item.scrollPage( false );

			break;

		case 'down' :

			show =
				this._keyDown(
					item,
					doc
				)
				||
				show;

			break;

		case 'end' :

			show =
				this._keyEnd(
					item,
					doc
				)
				||
				show;

			break;

		case 'left' :

			show =
				this._keyLeft(
					item,
					doc
				)
				||
				show;

			break;

		case 'pos1' :

			show =
				this._keyPos1(
					item,
					doc
				)
				||
				show;

			break;

		case 'right' :

			show =
				this._keyRight(
					item,
					doc
				)
				||
				show;

			break;

		case 'up' :

			show =
				this._keyUp(
					item,
					doc
				)
				||
				show;

			break;

		case 'del' :

			show =
				this._keyDel(
					item,
					doc
				)
				||
				show;

			break;
	}

	var
		mark =
			shell.space.mark;

	if( shift )
	{
		switch( key )
		{
			case 'end' :
			case 'pos1' :
			case 'left' :
			case 'up' :
			case 'right' :
			case 'down' :

				selection =
					shell.setSelection(
						doc,
						select1,
						shell.space.mark.sign
					);

				shell.redraw =
					true;

				break;
		}
	}

	if( show )
	{
		item.scrollCaretIntoView( );

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

		return new Path(
			this.path,
			'++',
				'text'
		);
	}
);


} )( );
