/*
| A visual paragraph.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;
Visual = Visual || { };


/*
| Imports
*/
var Caret;
var Euclid;
var Jools;
var Sign;
var Path;
var config;
var shell;
var system;
var theme;


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
		spacename,
		twig,
		path
	)
{
	if( twig.type !== 'Para' )
	{
		throw new Error( 'type error' );
	}

	Visual.Base.call(
		this,
		spacename,
		twig,
		path
	);

	// caching
	this.$fabric =
		null;

	this.$flow =
		null;
};

Jools.subclass( Para, Visual.Base );


/*
| Draws the paragraph in a fabric and returns it.
*/
Para.s_draw =
	function(
		width,
		height,
		zoom,
		font,
		flow
	)
{
	// FIXME work out exact height for text below baseline
	var f = new Euclid.Fabric( width, height );
	f.scale( zoom );
	f.$zoom = zoom;

	// draws text into the fabric
	for( var a = 0, aZ = flow.length; a < aZ; a++ )
	{
		var line = flow[ a ];
		for( var b = 0, bZ = line.a.length; b < bZ; b++ )
		{
			var chunk = line.a[ b ];

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

	return f;
};


/*
| Marker.
*/
Para.prototype.Para = true;


/*
| Draws the paragraph in its cache and returns it.
*/
Para.prototype.draw =
	function(
		fabric,
		view,
		pnw
	)
{
	var flow =
		this.getFlow( );

	var doc =
		shell.$space.getSub(
			this.path,
			'Doc'
		);

	var font =
		doc.getFont( );

	var width =
		flow.spread * view.zoom;

	var height =
		this.getHeight( ) * view.zoom;

	var f =
		this.$fabric;

	// not a cache hit?
	if (
		config.debug.noCache ||
		!f ||
		f.width   !== width  ||
		f.height  !== height ||
		view.zoom !== f.$zoom
	)
	{
		f = this.$fabric = Para.s_draw(
			width,
			height,
			view.zoom,
			font,
			flow
		);

	}

	fabric.drawImage(
		'image', f,
		'pnw', pnw
	);
};


/*
| Draws the caret if its in this paragraph.
*/
Para.prototype.positionCaret =
	function( view )
{
	// TODO properly hand down stuff
	var caret =
		shell.$space.$caret;

	var item =
		shell.$space.getSub( this.path, 'Item' );

	var doc =
		item.$sub.doc;

	var zone =
		item.getZone( );

	var cpos =
	caret.$pos =
		this.getCaretPos( );

	var pnw =
		doc.getPNW( this.key );

	var sbary =
		item.scrollbarY;

	var sy =
		sbary ? Math.round( sbary.getPos( ) ) : 0;

	var cyn =
		Jools.limit( 0, cpos.n + pnw.y - sy, zone.height );

	var cys =
		Jools.limit( 0, cpos.s + pnw.y - sy, zone.height );

	var cx =
		cpos.x + pnw.x;

	caret.$screenPos =
		view.point(
			cx + zone.pnw.x,
			cyn + zone.pnw.y
		);

	caret.$height =
		Math.round( ( cys - cyn ) * view.zoom );
};


/*
| Returns the caret position relative to the doc.
|
| FIXME remove?
*/
Para.prototype.getCaretPos =
	function( )
{
	var item =
		shell.$space.getSub( this.path, 'Item' );

	var doc =
		item.$sub.doc;

	var fs =
		doc.getFont( item ).size;

	var descend =
		fs * theme.bottombox;

	// TODO hand down caret.
	var caret =
		shell.$space.$caret;

	var p =
		this.locateOffset(
			caret.sign.at1,
			caret
		);

	var s =
		Math.round( p.y + descend );

	var n =
		s - Math.round( fs + descend );

	var	x =
		p.x - 1;

	return Jools.immute(
		{
			s: s,
			n: n,
			x: x
		}
	);
};


Para.s_getFlow =
	function(
		font,
		flowWidth,
		text
	)
{
	var spread = 0;  // width really used.

	// current x positon, and current x including last tokens width
	var x = 0, xw = 0;

	var y = font.size;
	var space = Euclid.Measure.width( font, ' ' );
	var line = 0;
	var flow = [ ];

	flow[ line ] = {
		a : [ ],
		y : y,
		o : 0
	};

	//var reg = !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);
	var reg = ( /(\s*\S+|\s+$)\s?(\s*)/g );

	for( var ca = reg.exec(text); ca !== null; ca = reg.exec( text ) )
	{
		// a token is a word plus following hard spaces
		var token = ca[ 1 ] + ca[ 2 ];
		var w = Euclid.Measure.width( font, token );
		xw = x + w + space;

		if( flowWidth > 0 && xw > flowWidth )
		{
			if( x > 0 )
			{
				// soft break
				if( spread < xw )
					{ spread = xw; }

				x = 0;
				xw = x + w + space;

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
				// console.log('HORIZONTAL OVERFLOW'); // FIXME
			}
		}

		flow[ line ].a.push(
			{
				x: x,
				w: w,
				o: ca.index,
				t: token
			}
		);

		x = xw;
	}

	if( spread < xw )
		{ spread = xw; }

	flow.height    = y;
	flow.flowWidth = flowWidth;
	flow.spread    = spread;
	flow.fontsize  = font.size;

	return flow;
};


/*
| (re)flows the paragraph, positioning all chunks.
*/
Para.prototype.getFlow =
	function( )
{
	var item = shell.$space.getSub(
		this.path,
		'Item'
	);

	var flowWidth = item.getFlowWidth( );
	var font      = item.$sub.doc.getFont( item );

	var flow      = this.$flow;
	// FIXME go into subnodes instead
	var text      = this.twig.text;

	// checks for cache hit
	if (
		!config.debug.noCache && flow &&
		flow.flowWidth === flowWidth &&
		flow.fontsize  === font.size
	)
	{
		return flow;
	}

	// clears the caret flow cache if its within this flow
	var caret =
		shell.$space.$caret;

	if (
		caret.path &&
		caret.path.equals( this.path )
	)
	{
		caret.flow$line  = null;
		caret.flow$token = null;
	}


	// builds position informations.
	return this.$flow = Para.s_getFlow(
		font,
		flowWidth,
		text
	);
};


/*
| Returns the height of the para
*/
Para.prototype.getHeight =
	function( )
{
	var flow = this.getFlow( );

	var doc = shell.$space.getSub(
		this.path,
		'Doc'
	);

	return (
		flow.height +
		Math.round( doc.getFont( ).size * theme.bottombox )
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
	var item   = shell.$space.getSub ( this.path, 'Item' );
	var doc    = item.$sub.doc;
	var font   = doc.getFont(item);

	var flow   = this.getFlow();
	var fline  = flow[line];
	var ftoken = null;

	for (var token = 0; token < fline.a.length; token++)
	{
		ftoken = fline.a[token];
		if (x <= ftoken.x + ftoken.w)
			{ break; }
	}

	if (token >= fline.a.length)
		{ ftoken = fline.a[--token]; }

	if (!ftoken)
		{ return 0; }

	var dx   = x - ftoken.x;
	var text = ftoken.t;

	var x1 = 0, x2 = 0;
	var a;
	for(a = 0; a < text.length; a++)
	{
		x1 = x2;
		x2 = Euclid.Measure.width(font, text.substr(0, a));
		if (x2 >= dx)
			{ break; }
	}

	if (dx - x1 < x2 - dx && a > 0)
		{ a--; }

	return ftoken.o + a;
};


/*
| Returns the point of a given offset.
|
| FIXME change to multireturn.
*/
Para.prototype.locateOffset =
	function(
		offset,    // the offset to get the point from.
		flowPos$   // if set, writes flow$line and flow$token
		//         // to the flow position used.
	)
{
	// FIXME cache position
	var twig = this.twig;
	var doc  = shell.$space.getSub (
		this.path,
		'Doc'
	);
	var font = doc.getFont( );
	var text = twig.text;
	var flow = this.getFlow( );
	var a, aZ, lineN, tokenN;

	for( a = 1, aZ = flow.length, lineN = aZ - 1; a < aZ; a++ )
	{
		if (flow[a].o > offset)
			{ lineN = a - 1; break; }
	}
	var line = flow[lineN];

	for (a = 1, aZ = line.a.length, tokenN = aZ - 1; a < aZ; a++)
	{
		if (line.a[a].o > offset)
			{ tokenN = a - 1; break; }
	}

	if (flowPos$)
	{
		flowPos$.flow$line  = lineN;
		flowPos$.flow$token = tokenN;
	}

	var token = line.a[tokenN];

	if (token)
	{
		return new Euclid.Point(
			Math.round(token.x + Euclid.Measure.width(font, text.substring(token.o, offset))),
			line.y
		);
	}
	else
	{
		return new Euclid.Point(
			Math.round(Euclid.Measure.width(font, text)),
			line.y
		);
	}
};


/*
| Returns the offset closest to a point.
*/
Para.prototype.getPointOffset =
	function(
		point     // the point to look for
	)
{
	var flow = this.getFlow( );

	var line;
	for( line = 0; line < flow.length; line++ )
	{
		if( point.y <= flow[ line ].y )
			{ break; }
	}

	if( line >= flow.length )
		{ line--; }

	return this.getOffsetAt( line, point.x );
};


/*
| Text has been inputted.
*/
Para.prototype.input =
	function(
		text
	)
{
    var reg  =
		/([^\n]+)(\n?)/g;

	// TODO what the heck?
	var para =
		this;

	var item =
		shell.$space.getSub(
			para.path,
			'Item'
		);

	var doc =
		item.$sub.doc;

	// TODO, how about handing the caret as param to input?
	var caret =
		shell.$space.$caret;

    for( var rx = reg.exec(text); rx !== null; rx = reg.exec( text ) )
	{
		var line = rx[ 1 ];

		shell.peer.insertText(
			para.textPath,
			caret.sign.at1,
			line
		);

        if( rx[ 2 ] )
		{
			shell.peer.split(
				para.textPath,
				caret.sign.at1
			);

			para = doc.atRank(
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
		shell.peer.removeText( this.textPath, caret.sign.at1 - 1, 1 );
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
			ve.twig.text.length
		);

		return true;
	}

	return false;
};


/*
| Del-key pressed.
*/
Para.prototype.keyDel = function(item, doc, caret)
{
	if( caret.sign.at1 < this.twig.text.length )
	{
		shell.peer.removeText(
			this.textPath,
			caret.sign.at1,
			1
		);

		return true;
	}

	var r = doc.twig.rankOf( this.key );

	if (r < doc.twig.length - 1)
	{
		shell.peer.join(
			this.textPath,
			this.twig.text.length
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
	var flow =
		this.getFlow( );

	var x =
		caret.retainx !== null ? caret.retainx : caret.$pos.x;

	var at1;

	var space =
		shell.$space;

	if( caret.flow$line < flow.length - 1 )
	{
		// stays within this para
		at1 = this.getOffsetAt( caret.flow$line + 1, x );

		space.setCaret(
			{
				path: this.textPath,
				at1: at1
			},
			x
		);

		return true;
	}

	// goto next para
	var r = doc.twig.rankOf( this.key );
	if (r < doc.twig.length - 1)
	{
		var ve =
			doc.atRank(r + 1);

		at1 =
			ve.getOffsetAt( 0, x );

		space.setCaret(
			{
				path : ve.textPath,
				at1  : at1
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
	if( caret.sign.at1 === this.twig.text.length )
		{ return false; }

	var space =
		shell.$space;

	space.setCaret(
		{
			path : this.textPath,
			at1  : this.twig.text.length
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
				path : this.textPath,
				at1  : caret.sign.at1 - 1
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
				path : ve.textPath,
				at1  : ve.twig.text.length
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
			path : this.textPath,
			at1  : 0
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

	if( caret.sign.at1 < this.twig.text.length )
	{
		space.setCaret(
			{
				path : this.textPath,
				at1  : caret.sign.at1 + 1
			}
		);

		return true;
	}

	var r = doc.twig.rankOf( this.key );

	if( r < doc.twig.length - 1 )
	{
		var ve =
			doc.atRank( r + 1 );

		space.setCaret(
			{
				path : ve.textPath,
				at1  : 0
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

	var x =
		( caret.retainx !== null ? caret.retainx : caret.$pos.x );

	var at1;

	var space =
		shell.$space;

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
				path : this.textPath,
				at1  : at1
			},
			x
		);

		return true;
	}

	// goto prev para
	var r = doc.twig.rankOf( this.key );
	if (r > 0)
	{
		var ve =
			doc.atRank( r - 1 );

		at1 =
			ve.getOffsetAt( ve.getFlow().length - 1, x );

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
		key,
		shift,
		ctrl
	)
{
	var space =
		shell.$space;

	// TODO hand caret as param to specialKey
	var caret =
		space.$caret;

	var selection =
		shell.getSelection( );

	// TODO similar item, doc, hand it properly instead of regetting them.
	var item =
		space.getSub(
			this.path,
			'Item'
		);

	var doc =
		item.$sub.doc;

	// if true the caret moved or the selection changed
	var show =
		false;

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :
				var v0 = doc.atRank( 0 );
				var v1 = doc.atRank( doc.twig.length - 1 );

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
									v1.twig.text.length
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
			case 'down'      :
			case 'end'       :
			case 'left'      :
			case 'pageup'    :
			case 'pagedown'  :
			case 'pos1'      :
			case 'right'     :
			case 'up'        :

				shell.deselect( );

				show =
					true;

				break;

			case 'backspace' :
			case 'del'       :

				selection =
					shell.removeSelection( );

				show =
					true;

				key = null;

				break;

			case 'enter'     :

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

		case 'pos1'  :

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
		item.poke( );

		item.scrollCaretIntoView( );

		caret.show( );

		shell.redraw =
			true;
	}
};


/*
| Return the path to the .text attribute if this para.
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
	this.twig =
		twig;

	this.$flow =
		null;

	this.$fabric =
		null;
};


} )( );
