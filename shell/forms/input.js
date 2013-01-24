/*
| An input field on a form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


/*
| Imports
*/
var Caret;
var Curve;
var Euclid;
var Jools;
var Path;
var shell;
var theme;


/*
| Capsule
*/
( function( ) {

'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Input =
Forms.Input =
	function(
		name,
		twig,
		form,
		inherit
	)
{
	this.name =
		name;

	this.twig =
		twig;

	this.form =
		form;

	var pnw =
	this.pnw =
		Curve.computePoint(
			twig.frame.pnw,
			form.iframe
		);

	var pse =
	this.pse =
		Curve.computePoint(
			twig.frame.pse,
			form.iframe
		);

	this._bezi =
		new Euclid.RoundRect(
			Euclid.Point.zero,
			pse.sub( pnw ),
			7, 3
		);

	this._pitch =
		new Euclid.Point(
			8, 3
		);

	this._$value =
		inherit ? inherit._$value : '';

	this._$fabric =
		null;

	this._$accent =
		Forms.Accent.NORMA;
};


/*
| Returns the offset nearest to point p.
*/
Input.prototype.getOffsetAt =
	function(
		p
	)
{
	var pitch =
		this._pitch;

	var dx =
		p.x - pitch.x;

	var value =
		this._$value;

	var x1 =
		0;

	var x2 =
		0;

	var a;

	var password =
		this.twig.password;

	var font =
		this.twig.font;

	var mw;

	if( password )
	{
		mw =
			this.maskWidth( font.size ) * 2 +
			this.maskKern( font.size );
	}

	for( a = 0; a < value.length; a++ )
	{
		x1 =
			x2;

		if( password )
		{
			x2 =
				a * mw;
		}
		else
		{
			x2 = Euclid.Measure.width(
				font,
				value.substr( 0, a )
			);
		}

		if( x2 >= dx )
		{
			break;
		}
	}

	if( dx - x1 < x2 - dx && a > 0 )
	{
		a--;
	}

	return a;
};


/*
| Returns the width of a character for password masks.
*/
Input.prototype.maskWidth =
	function(
		size
	)
{
	return Math.round( size * 0.2 );
};


/*
| Returns the kerning of characters for password masks.
*/
Input.prototype.maskKern =
	function(
		size
	)
{
	return Math.round( size * 0.15 );
};


/*
| Draws the mask for password fields
*/
Input.prototype.sketchMask =
	function(
		fabric,
		border,
		twist,
		view,
		length,
		size
	)
{
	var pitch =
		this._pitch;

	var x =
		view.x( pitch );

	var y =
		view.y( pitch ) +
		Math.round( size * 0.7 );

	var h =
		Math.round( size * 0.32 );

	var w =
		this.maskWidth( size );

	var w2 =
		w * 2;

	var k =
		this.maskKern( size );

	var magic =
		Euclid.Const.magic;

	var mw =
		magic * w;

	var mh =
		magic * h;

	for ( var a = 0; a < length; a++ )
	{
		fabric.moveTo(
			x + w,
			y - h
		);

		fabric.beziTo(
			mw,
			0,

			0,
			-mh,

			x + w2,
			y
		);

		fabric.beziTo(
			0,
			mh,

			mw,
			0,

			x + w,
			y + h
		);

		fabric.beziTo(
			-mw,
			0,

			0,
			mh,

			x,
			y
		);

		fabric.beziTo(
			0,
			-mh,

			-mw,
			0,

			x + w,
			y - h
		);

		x += w2 + k;
	}
};


/*
| Returns the fabric for the input field.
*/
Input.prototype._weave =
	function(
		accent
	)
{
	var fabric =
		this._$fabric;

	var value =
		this._$value;

	if (
		fabric &&
		fabric.$accent === accent &&
		fabric.$value === value
	)
	{
		return fabric;
	}

	var bezi =
		this._bezi;

	var pitch =
		this._pitch;

	fabric =
	this._$fabric =
		new Euclid.Fabric( bezi );

	var sname;

	switch( accent )
	{
		case Forms.Accent.NORMA :

			sname =
				this.twig.normaStyle;

			break;

		case Forms.Accent.HOVER :

			sname =
				this.twig.hoverStyle;

			break;

		case Forms.Accent.FOCUS :

			sname =
				this.twig.focusStyle;

			break;

		case Forms.Accent.HOFOC :

			sname =
				this.twig.hofocStyle;

			break;

		default :

			throw new Error('Invalid accent: ' + accent);
	}

	var style =
		Forms.getStyle( sname );

	fabric.fill(
		style.fill,
		bezi,
		'sketch',
		Euclid.View.proper
	);

	var font =
		this.twig.font;

	if( this.twig.password )
	{
		fabric.fill(
			'black',
			this,
			'sketchMask',
			Euclid.View.proper,
			value.length,
			font.size
		);
	}
	else
	{
		fabric.paintText(
			'text',
				value,
			'xy',
				pitch.x,
				font.size + pitch.y,
			'font',
				font
		);
	}

	fabric.edge(
		style.edge,
		bezi,
		'sketch',
		Euclid.View.proper
	);

	fabric.$accent =
		accent;

	fabric.$value =
		value;

	return fabric;
};


/*
| Draws the input field.
*/
Input.prototype.draw =
	function(
		fabric,
		accent
	)
{
	fabric.drawImage(
		'image',
			this._weave( accent ),
		'pnw',
			this.pnw
	);
};


/*
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
*/
Input.prototype.locateOffset =
	function(
		offset
	)
{
	// FIXME cache position
	var twig =
		this.twig;

	var font =
		twig.font;

	var pitch =
		this._pitch;

	var val =
		this._$value;

	if( this.twig.password )
	{
		return new Euclid.Point(
			pitch.x +
				(
					2 * this.maskWidth( font.size ) +
					this.maskKern( font.size )
				) * offset
				- 1,

			Math.round(
				pitch.y +
				font.size
			)
		);
	}
	else
	{
		return new Euclid.Point(
			Math.round(
				pitch.x +
				Euclid.Measure.width(
					font,
					val.substring( 0, offset )
				)
			),

			Math.round(
				pitch.y +
				font.size
			)
		);
	}
};


/*
| Returns the caret position relative to the form.
*/
Input.prototype.getCaretPos =
	function( )
{
	var fs =
		this.twig.font.size;

	var descend =
		fs * theme.bottombox;

	var p =
		this.locateOffset(
			this.form.$caret.sign.at1
		);

	var pnw =
		this.pnw;

	var s =
		Math.round( p.y + pnw.y + descend );

	var n =
		s - Math.round( fs + descend );

	var	x =
		p.x + this.pnw.x - 1;

	return Jools.immute(
		{
			s: s,
			n: n,
			x: x
		}
	);
};


/*
| Draws the caret.
*/
Input.prototype.positionCaret =
	function( view )
{
	var caret =
		this.form.$caret;

	var cpos =
	caret.$pos =
		this.getCaretPos();

	caret.$screenPos =
		view.point(
			cpos.x,
			cpos.n
		);

	caret.$height =
		Math.round(
			( cpos.s - cpos.n ) * view.zoom
		);
};


/*
| Returns the current value (text in the box)
*/
Input.prototype.getValue =
	function( )
{
	return this._$value;
};


/*
| Sets the current value (text in the box)
*/
Input.prototype.setValue =
	function( v )
{
	this._$value =
		v;

	this.poke( );
};


/*
| User input.
*/
Input.prototype.input =
	function( text )
{
	var csign =
		this.form.$caret.sign;

	var v =
		this._$value;

	var at1 =
		csign.at1;

	var mlen =
		this.twig.maxlen;

	if( mlen > 0 && v.length + text.length > mlen )
	{
		text =
			text.substring(
				0,
				mlen - v.length
			);
	}

	this._$value =
		v.substring( 0, at1 ) +
		text +
		v.substring( at1 );

	this.form.setCaret(
		{
			path :
				csign.path,

			at1 :
				at1 + text.length
		}
	);

	this.form.poke( );
};


/*
| User pressed backspace.
*/
Input.prototype.keyBackspace =
	function( )
{
	var csign =
		this.form.$caret.sign;

	var at1 =
		csign.at1;

	if( at1 <= 0 )
	{
		return false;
	}

	this._$value =
		this._$value.substring(0, at1 - 1) +
		this._$value.substring(at1);

	this.form.setCaret(
		{
			path : csign.path,
			at1  : csign.at1 - 1
		}
	);

	return true;
};


/*
| User pressed del.
*/
Input.prototype.keyDel =
	function( )
{
	var at1 =
		this.form.$caret.csign.at1;

	if( at1 >= this._$value.length )
	{
		return false;
	}

	this._$value =
		this._$value.substring( 0, at1 ) +
		this._$value.substring( at1 + 1 );

	return true;
};


/*
| User pressed return key.
*/
Input.prototype.keyEnter =
	function( )
{
	this.form.cycleFocus( 1 );

	return true;
};


/*
| User pressed down key.
*/
Input.prototype.keyDown =
	function( )
{
	this.form.cycleFocus( 1 );

	return true;
};


/*
| User pressed end key.
*/
Input.prototype.keyEnd =
	function( )
{
	var csign =
		this.form.$caret.sign;

	var at1 =
		csign.at1;

	if( at1 >= this._$value.length )
	{
		return false;
	}

	this.form.setCaret(
		{
			path :
				csign.path,

			at1 :
				this._$value.length
		}
	);

	return true;
};


/*
| User pressed left key.
*/
Input.prototype.keyLeft =
	function( )
{
	var csign =
		this.form.$caret.sign;

	if( csign.at1 <= 0 )
	{
		return false;
	}

	this.form.setCaret(
		{
			path :
				csign.path,

			at1 :
				csign.at1 - 1
		}
	);

	return true;
};


/*
| User pressed pos1 key
*/
Input.prototype.keyPos1 =
	function( )
{
	var csign =
		this.form.$caret.sign;

	if( csign.at1 <= 0 )
	{
		return false;
	}

	this.form.setCaret(
		{
			path :
				csign.path,

			at1 :
				0
		}
	);

	return true;
};


/*
| User pressed right key
*/
Input.prototype.keyRight = function()
{
	var csign =
		this.form.$caret.sign;

	if (csign.at1 >= this._$value.length)
	{
		return false;
	}

	this.form.setCaret(
		{
			path : csign.path,
			at1  : csign.at1 + 1
		}
	);

	return true;
};


/*
| User pressed up key.
*/
Input.prototype.keyUp =
	function( )
{
	this.form.cycleFocus( -1 );

	return true;
};


/*
| User pressed a special key
*/
Input.prototype.specialKey =
	function( key )
{
	var poke =
		false;

	switch( key )
	{
		case 'backspace' :

			poke =
				this.keyBackspace( );

			break;

		case 'del' :

			poke =
				this.keyDel( );

			break;

		case 'down' :

			poke =
				this.keyDown( );

			break;

		case 'end' :

			poke =
				this.keyEnd( );

			break;

		case 'enter' :

			poke =
				this.keyEnter( );

			break;

		case 'left' :

			poke =
				this.keyLeft( );

			break;

		case 'pos1' :

			poke =
				this.keyPos1( );

			break;

		case 'right' :

			poke =
				this.keyRight( );

			break;

		case 'up' :

			poke =
				this.keyUp( );

			break;
	}

	if( poke )
	{
		this.form.poke( );
	}
};


/*
| Control takes focus.
*/
Input.prototype.grepFocus =
	function( )
{
	if( this.form.focusedControl( ) === this )
	{
		return false;
	}

	var caret =
		this.form.setCaret(
			{
				path :
					new Path ( [this.form.name, this.name ] ),

				at1 :
					this._$value.length
			}
		);

	caret.show( );

	this.poke( );

	return true;
};


/*
| Clears all caches
*/
Input.prototype.poke =
	function( )
{
	this.$fabric =
		null;

	shell.redraw =
		true;

	this.form.poke( );
};


/*
| Force clears all caches.
*/
Input.prototype.knock =
	function( )
{
	this.$fabric =
		null;
};


/*
| Mouse hover
*/
Input.prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		p === null ||
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var pp = p.sub(
		this.pnw
	);

	if(
		!this._bezi.within( Euclid.View.proper, pp )
	)
	{
		return null;
	}

	return 'text';
};


/*
| pointing device is starting a point ( mouse down, touch start )
*/
Input.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		p === null ||
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return null;
	}

	var pp =
		p.sub( this.pnw );

	if(
		!this._bezi.within(
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	var caret =
		this.form.setCaret(
			{
				path :
					new Path ( [this.form.name, this.name ] ),

				at1 :
					this.getOffsetAt( pp )
			}
		);

	caret.show( );

	this.poke( );

	return false;
};


})( );
