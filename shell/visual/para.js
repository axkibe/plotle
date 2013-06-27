/*
| A visual paragraph.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;
Visual =
	Visual || { };


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
	system,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code requires a browser!' );
}


/*
| Constructor.
*/
var Para =
Visual.Para =
	function(
		overload,
		a1,  // twig       | phrase
		a2,  // path       | fontsize
		a3,  // fontsize   | flowWidth
		a4   // flowWidth
	)
{
	switch( overload )
	{
		case 'twig' :

			var
				twig =
					a1,

				path =
					a2,

				fontsize =
					a3,

				flowWidth =
					a4;

			if( CHECK && twig.type !== 'Para' )
			{
				throw new Error(
					'type error'
				);
			}

			Visual.Base.call(
				this,
				twig,
				path
			);

			this.text =
				twig.text;

			this.fontsize =
				fontsize;

			this.flowWidth =
				flowWidth;

			break;

		case 'phrase' :

			Visual.Base.call(
				this,
				null,
				null
			);

			this.text =
				a1;

			this.fontsize =
				a2;

			this.flowWidth =
				a3;

			break;

		default :

			throw new Error(
				'invalid overload'
			);
	}

	// caching
	this.$fabric =
	this.$flow =
		null;

	if(
		CHECK &&
		!Jools.is( this.flowWidth )
	)
	{
		throw new Error(
			'no flowWidth'
		);
	}
};


Jools.subclass(
	Para,
	Visual.Base
);


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
	var
		f =
			this.$fabric,

		zoom =
			view.zoom;

	if( !f || f.zoom !== zoom )
	{
		// no cache

		var
			flow =
				this.getFlow( ),

			font =
				this.getFont( ),

			width =
				flow.spread * view.zoom,

			height =
				this.getHeight( ) * view.zoom;

		f =
		this.$fabric =
			new Euclid.Fabric(
				width,
				height
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
	}

	fabric.drawImage(
		'image',
			f,
		'pnw',
			pnw
	);
};


/*
| Positions the caret drawing data.
*/
Para.prototype.positionCaret =
	function(
		space,
		caret,
		view
	)
{
	var
		item =
			space.getSub(
				this.path,
				'Item'
			),

		doc =
			item.$sub.doc,

		zone =
			item.getZone( ),

		cpos =
		caret.$pos =
			this.getCaretPos(
				item,
				caret
			),

		pnw =
			doc.getPNW( this.key ),

		sbary =
			item.scrollbarY,

		sy =
			sbary ? Math.round( sbary.getPos( ) ) : 0,

		cyn =
			Jools.limit(
				0,
				cpos.n + pnw.y - sy,
				zone.height
			),

		cys =
			Jools.limit(
				0,
				cpos.s + pnw.y - sy,
				zone.height
			),

		cx =
			cpos.x + pnw.x;


	caret.$screenPos =
		view.point(
			cx + zone.pnw.x,
			cyn + zone.pnw.y
		);

	caret.$height =
		Math.round(
			( cys - cyn ) * view.zoom
		);
};


/*
| Returns the caret position relative to the doc.
|
| FIXME remove?
*/
Para.prototype.getCaretPos =
	function(
		item, // the item the para belongs to,
		caret // the caret
	)
{
	var
		fs =
			item.$sub.doc.getFont( item ).size,

		descend =
			fs * theme.bottombox,

		p =
			this.locateOffset(
				caret.sign.at1,
				caret
			),

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( fs + descend ),

		x =
			p.x - 1;

	return Jools.immute(
		{
			s: s,
			n: n,
			x: x
		}
	);
};


/*
| Returns the font for this para.
*/
Para.prototype.getFont =
	function( )
{
	return (
		fontPool.get(
			this.fontsize,
			'la'
		)
	);
};

/*
| Flows the paragraph, positioning all chunks.
| XXX
*/
Para.prototype.getFlow =
	function( )
{
	var
		flowWidth =
			this.flowWidth,

		font =
			this.getFont( ),

		flow =
			this.$flow,

		// FIXME go into subnodes instead
		text =
			this.text;

	// checks for cache hit
	if ( flow )
	{
		return flow;
	}

	// clears the caret flow cache if its within this flow
	// TODO this is not nice
	var caret =
		shell.$space && shell.$space.$caret;

	if (
		caret &&
		caret.path &&
		caret.path.equals( this.path )
	)
	{
		caret.flow$line =
		caret.flow$token =
			null;
	}


	var
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
			0;

	flow =
	this.$flow =
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
				// console.log('HORIZONTAL OVERFLOW'); // FIXME
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

	flow.fontsize =
		font.size;

	return flow;
};


/*
| Returns the height of the para
|
| XXX
*/
Para.prototype.getHeight =
	function( )
{
	var
		flow =
			this.getFlow( );

	return (
		flow.height +
		Math.round(
			this.fontsize * theme.bottombox
		)
	);
};


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
			this.getFont( ),

		flow =
			this.getFlow( ),

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
|
| FIXME change to multireturn.
| XXX
*/
Para.prototype.locateOffset =
	function(
		offset,    // the offset to get the point from.
		flowPos    // if set, writes flow$line and flow$token
		//         // to the flow position used.
	)
{
	if( typeof(offset) !== 'number' ) {
		throw new Error( 'TODO' );
	}

	// FIXME cache position
	var
		twig =
			this.twig,

		font =
			this.getFont( ),

		text =
			this.text,

		flow =
			this.getFlow( ),
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

	if( flowPos )
	{
		flowPos.flow$line =
			lineN;

		flowPos.flow$token =
			tokenN;
	}

	var
		token =
			line.a[ tokenN ];

	if( token )
	{
		return new Euclid.Point(
			Math.round(
				token.x +
				Euclid.Measure.width(
					font, text.substring( token.o, offset )
				)
			),
			line.y
		);
	}
	else
	{
		return new Euclid.Point(
			Math.round(
				Euclid.Measure.width( font, text )
			),
			line.y
		);
	}
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
			this.getFlow( ),

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
		caret,
		text
	)
{
    var
		reg  =
			/([^\n]+)(\n?)/g,

		para =
			this,

		item =
			shell.$space.getSub(
				para.path,
				'Item'
			),

		doc =
			item.$sub.doc;

    for(
		var rx = reg.exec(text);
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		shell.peer.insertText(
			para.textPath,
			caret.sign.at1,
			line
		);

		caret =
			shell.$space.$caret;

        if( rx[ 2 ] )
		{
			shell.peer.split(
				para.textPath,
				caret.sign.at1
			);

			caret =
				shell.$space.$caret;

			para =
				doc.atRank(
					doc.twig.rankOf( para.key ) + 1
				);
		}
    }

	item.scrollCaretIntoView();
};


/*
| Backspace pressed.
*/
Para.prototype.keyBackspace =
	function(
		item,
		doc,
		caret
	)
{
	if( caret.sign.at1 > 0 )
	{
		shell.peer.removeText(
			this.textPath,
			caret.sign.at1 - 1,
			1
		);

		return true;
	}

	var r =
		doc.twig.rankOf( this.key );

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
Para.prototype.keyDel =
	function(
		item,
		doc,
		caret
	)
{
	if( caret.sign.at1 < this.text.length )
	{
		shell.peer.removeText(
			this.textPath,
			caret.sign.at1,
			1
		);

		return true;
	}

	var r =
		doc.twig.rankOf( this.key );

	if( r < doc.twig.length - 1 )
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
Para.prototype.keyDown =
	function(
		item,
		doc,
		caret
	)
{
	var
		flow =
			this.getFlow( ),

		x =
			caret.retainx !== null ? caret.retainx : caret.$pos.x,

		space =
			shell.$space,

		at1;

	if( caret.flow$line < flow.length - 1 )
	{
		// stays within this para
		at1 =
			this.getOffsetAt(
				caret.flow$line + 1,
				x
			);

		space.setCaret(
			{
				path :
					this.textPath,
				at1 :
					at1
			},
			x
		);

		return true;
	}

	// goto next para
	var r =
		doc.twig.rankOf( this.key );

	if (r < doc.twig.length - 1)
	{
		var ve =
			doc.atRank(r + 1);

		at1 =
			ve.getOffsetAt( 0, x );

		space.setCaret(
			{
				path :
					ve.textPath,
				at1 :
					at1
			},
			x
		);
	}

	return true;
};


/*
| End-key pressed.
*/
Para.prototype.keyEnd =
	function(
		item,
		doc,
		caret
	)
{
	if( caret.sign.at1 === this.text.length )
	{
		return false;
	}

	var space =
		shell.$space;

	space.setCaret(
		{
			path :
				this.textPath,
			at1 :
				this.text.length
		}
	);

	return true;
};


/*
| Enter-key pressed
*/
Para.prototype.keyEnter =
	function(
		item,
		doc,
		caret
	)
{
	shell.peer.split(
		this.textPath,
		caret.sign.at1
	);

	return true;
};


/*
| Left arrow pressed.
*/
Para.prototype.keyLeft =
	function(
		item,
		doc,
		caret
	)
{
	var space =
		shell.$space;

	if( caret.sign.at1 > 0 )
	{
		space.setCaret(
			{
				path :
					this.textPath,

				at1 :
					caret.sign.at1 - 1
			}
		);

		return true;
	}

	var r =
		doc.twig.rankOf( this.key );

	if( r > 0 )
	{
		var ve =
			doc.atRank( r - 1 );

		space.setCaret(
			{
				path :
					ve.textPath,

				at1 :
					ve.text.length
			}
		);

		return true;
	}

	return false;
};


/*
| Pos1-key pressed.
*/
Para.prototype.keyPos1 =
	function(
		item,
		doc,
		caret
	)
{
	var space =
		shell.$space;

	if( caret.at1 === 0 )
	{
		return false;
	}

	space.setCaret(
		{
			path :
				this.textPath,

			at1 :
				0
		}
	);

	return true;
};


/*
| Right arrow pressed.
*/
Para.prototype.keyRight =
	function(
		item,
		doc,
		caret
	)
{
	var space =
		shell.$space;

	if( caret.sign.at1 < this.text.length )
	{
		space.setCaret(
			{
				path :
					this.textPath,

				at1 :
					caret.sign.at1 + 1
			}
		);

		return true;
	}

	var r =
		doc.twig.rankOf( this.key );

	if( r < doc.twig.length - 1 )
	{
		var ve =
			doc.atRank( r + 1 );

		space.setCaret(
			{
				path :
					ve.textPath,

				at1 :
					0
			}
		);

		return true;
	}

	return false;
};


/*
| Up arrow pressed.
*/
Para.prototype.keyUp =
	function(
		item,
		doc,
		caret
	)
{
	this.getFlow( ); // FIXME, needed?

	var
		x =
			(
				caret.retainx !== null ?
					caret.retainx :
					caret.$pos.x
			),

		space =
			shell.$space,

		at1;

	if( caret.flow$line > 0 )
	{
		// stay within this para
		at1 =
			this.getOffsetAt(
				caret.flow$line - 1,
				x
			);

		space.setCaret(
			{
				path :
					this.textPath,

				at1 :
					at1
			},
			x
		);

		return true;
	}

	// goto prev para
	var r =
		doc.twig.rankOf( this.key );

	if( r > 0 )
	{
		var ve =
			doc.atRank( r - 1 );

		at1 =
			ve.getOffsetAt(
				ve.getFlow( item ).length - 1,
				x
			);

		space.setCaret(
			{
				path : ve.textPath,
				at1  : at1
			},
			x
		);

		return true;
	}

	return false;
};


/*
| Force clears all caches.
*/
Para.prototype.knock =
	function( )
{
	this.$fabric =
		null;

	this.$flow =
		null;
};


/*
| Handles a special key
*/
Para.prototype.specialKey =
	function(
		space,
		caret,
		key,
		shift,
		ctrl
	)
{
	var
		selection =
			shell.getSelection( ),

		item =
			space.getSub(
				caret.sign.path,
				'Item'
			),

		doc =
			item.$sub.doc,

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
						doc.atRank( doc.twig.length - 1 );

				selection =
					shell.setSelection(
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

				space.setCaret(
					selection.sign2
				);

				caret.show( );

				item.poke( );

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

				selection =
					shell.removeSelection( );

				show =
					true;

				key = null;

				break;

			case 'enter' :

				selection =
					shell.removeSelection( );

				show =
					true;

				break;
		}
	}
	else if ( shift && !selection )
	{
		switch( key ) {
			case 'backup' :
			case 'down' :
			case 'end' :
			case 'left' :
			case 'pagedown' :
			case 'pos1':
			case 'right' :
			case 'up' :

				select1 =
					caret.sign;

				show =
					true;
		}
	}

	switch( key )
	{
		case 'backspace' :

			show =
				this.keyBackspace(
					item,
					doc,
					caret
				) || show;

			break;

		case 'enter' :

			show =
				this.keyEnter(
					item,
					doc,
					caret
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
				this.keyDown(
					item,
					doc,
					caret
				)
				||
				show;

			break;

		case 'end' :

			show =
				this.keyEnd(
					item,
					doc,
					caret
				)
				||
				show;

			break;

		case 'left' :

			show =
				this.keyLeft(
					item,
					doc,
					caret
				)
				||
				show;

			break;

		case 'pos1' :

			show =
				this.keyPos1(
					item,
					doc,
					caret
				)
				||
				show;

			break;

		case 'right' :

			show =
				this.keyRight(
					item,
					doc,
					caret
				)
				||
				show;

			break;

		case 'up' :

			show =
				this.keyUp(
					item,
					doc,
					caret
				)
				||
				show;

			break;

		case 'del' :

			show =
				this.keyDel(
					item,
					doc,
					caret
				)
				||
				show;

			break;
	}

	caret =
		space.$caret;

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
						select1,
						caret.sign
					);

				item.poke( );

				shell.redraw =
					true;

				break;
		}
	}

	if( show )
	{
		item =
			space.getSub(
				caret.sign.path,
				'Item'
			);

		item.poke( );

		item.scrollCaretIntoView( );

		caret.show( );

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
		return new Path(
			this.path,
			'++',
				'text'
		);
	}
);


/*
| Updates v-vine to match a new twig.
*/
Para.prototype.update =
	function( twig )
{
	// TODO
	throw new Error( 'Paras no longer update');
};


} )( );
