/*
| An input field.
*/
'use strict';


tim.define( module, 'widget_input', ( def, widget_input ) => {


const gleam_ellipse = require( '../gleam/ellipse' );

const gleam_facet = require( '../gleam/facet' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_text = require( '../gleam/glint/text' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_roundRect = require( '../gleam/roundRect' );

const result_hover = require( '../result/hover' );

const shell_settings = require( '../shell/settings' );

const visual_mark_caret = require( '../visual/mark/caret' );

const widget_widget = require( './widget' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// style facets
		facets : { type : 'gleam_facetList' },

		// component hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			prepare : 'self.concernsHover( hover, path )'
		},

		// font of the text
		font : { type : 'gleam_font' },

		// the users mark
		mark :
		{
			prepare : 'widget_widget.concernsMark( mark, path )',
			type :
				tim.typemap( module, '../visual/mark/mark' )
				.concat( [ 'undefined' ] )
		},

		// maximum input length
		maxlen : { type : 'integer' },

		// true for password input
		password : { type : 'boolean', defaultValue : 'false' },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the transform
		transform : { type : 'gleam_transform' },

		// the value in the input box
		value : { type : 'string', defaultValue : '""' },

		// if false the button is hidden
		visible : { type : 'boolean', defaultValue : 'true' },

		// designed zone
		zone : { type : 'gleam_rect' },
	};
}


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/

/*
| Default distance of text
*/
def.staticLazy._pitch = () => gleam_point.xy( 8, 3 );


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Deriving concerns stuff.
*/
def.static.concernsHover = widget_widget.concernsHover;

def.static.concernsMark = widget_widget.concernsMark;


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


def.lazy.attentionCenter =
	function( )
{
	const fs = this.font.size;

	const descend = fs * shell_settings.bottombox;

	const p = this.locateOffsetPoint( this.mark.caret.at );

	const s = Math.round( p.y + descend + 1 );

	return this._tZone.pos.y + s - Math.round( fs + descend );
};


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	if( !this.visible ) return;

	return(
		gleam_glint_window.create(
			'glint', this._glint,
			'rect', this._tZone.enlarge1,
			'offset', gleam_point.zero
		)
	);
};


/*
| The transformed zone of the button.
*/
def.lazy._tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


/*
| Glint for the caret.
*/
def.lazy._caretGlint =
	function( )
{
	const fs = this.font.size;

	const descend = fs * shell_settings.bottombox;

	const p = this.locateOffsetPoint( this.mark.caret.at );

	return(
		gleam_glint_fill.create(
			'facet', gleam_facet.blackFill,
			'shape',
				gleam_rect.create(
					'pos', p.add( 0, 1 - fs ),
					'width', 1,
					'height', fs + descend
				)
		)
	);
};


/*
| Returns the inner glint of the input field.
*/
def.lazy._glint =
	function( )
{
	const pitch = widget_input._pitch;

	const value = this.value;

	const mark = this.mark;

	const arr =
		[
			gleam_glint_fill.create(
				'facet', this._facet,
				'shape', this._tzShape
			)
		];

	const font = this.font;

	if( this.password )
	{
		const pm = this._passMask;

		for( let a = 0, aZ = pm.length; a < aZ; a++ )
		{
			arr.push(
				gleam_glint_fill.create(
					'facet', gleam_facet.blackFill,
					'shape', pm[ a ]
				)
			);
		}
	}
	else
	{
		arr.push(
			gleam_glint_text.create(
				'font', font,
				'p',
					gleam_point.create(
						'x', pitch.x,
						'y', font.size + pitch.y
					),
				'text', value
			)
		);
	}

	if(
		mark
		&& mark.timtype === visual_mark_caret
		&& mark.focus
	)
	{
		arr.push( this._caretGlint );
	}

	arr.push(
		gleam_glint_border.create(
			'facet', this._facet,
			'shape', this._tzShape
		)
	);

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The widget's facet.
*/
def.lazy._facet =
	function( )
{
	return(
		this.facets.getFacet(
			'hover', false, // FUTURE
			'focus', !!this.mark
		)
	);
};


/*
| The transformed shape of the button
| positioned at zero.
*/
def.lazy._tzShape =
	function( )
{
	const tZone = this._tZone;

	return(
		gleam_roundRect.create(
			'pos', gleam_point.zero,
			'width', tZone.width,
			'height', tZone.height,
			'a', 7,
			'b', 3
		)
	);
};


/*
| Returns the point of a given offset.
*/
def.lazyFuncInt.locateOffsetPoint =
	function(
		offset // the offset to get the point from.
	)
{
	const font = this.font;

	const pitch = widget_input._pitch;

	const value = this.value;

	if( this.password )
	{
		return(
			gleam_point.create(
				'x',
					pitch.x
					+ (
						this.maskWidth( font.size ) +
						this.maskKern( font.size )
					)
					* offset
					- 1,
				'y', Math.round( pitch.y + font.size )
			)
		);
	}

	return(
		gleam_point.create(
			'x', Math.round( pitch.x + font.getAdvanceWidth( value.substring( 0, offset ) ) ),
			'y', Math.round( pitch.y + font.size )
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Inputs can hold a caret.
*/
def.func.caretable = true;


/*
| User clicked.
*/
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	if( !p || !this._tZone.within( p ) ) return undefined;

	const pp = p.sub( this._tZone.pos );

	if( !this._tzShape.within( pp ) ) return undefined;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', this.path,
				'at', this._getOffsetAt( pp )
			)
	);

	return false;
};


/*
| User input.
*/
def.func.input =
	function(
		text
	)
{
	const mark = this.mark;

	const value = this.value;

	const at = mark.caret.at;

	const maxlen = this.maxlen;

	// cuts of text if larger than this maxlen
	if(
		maxlen > 0
		&& value.length + text.length > maxlen
	)
	{
		text = text.substring( 0, maxlen - value.length );
	}

	root.setPath(
		this.path.append( 'value' ),
		value.substring( 0, at ) +
			text +
			value.substring( at )
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', at + text.length
			)
	);
};


/*
| Inputs are focusable
*/
def.func.focusable = true;


/*
| Returns the kerning of characters for password masks.
*/
def.func.maskKern =
	function(
		size
	)
{
	return Math.round( size * 0.15 );
};


/*
| Returns the width of a character for password masks.
*/
def.func.maskWidth =
	function(
		size
	)
{
	return Math.round( size * 0.5 );
};


/*
| Mouse hover
*/
def.func.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		!this._tZone.within( p )
		|| !this._tzShape.within( p.sub( this._tZone.pos ) )
	)
	{
		return undefined;
	}

	return result_hover.create( 'path', this.path, 'cursor', 'text');
};


/*
| User pressed a special key
*/
def.func.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	switch( key )
	{
		case 'backspace' : this._keyBackspace( ); break;

		case 'del' : this._keyDel( ); break;

		case 'down' : this._keyDown( ); break;

		case 'end' : this._keyEnd( ); break;

		case 'enter' : this._keyEnter( ); break;

		case 'left' : this._keyLeft( ); break;

		case 'pos1' : this._keyPos1( ); break;

		case 'right' : this._keyRight( ); break;

		case 'up' : this._keyUp( ); break;
	}
};


/*
| Returns the offset nearest to point p.
*/
def.func._getOffsetAt =
	function(
		p
	)
{
	let mw;

	const pitch = widget_input._pitch;

	const dx = p.x - pitch.x;

	const value = this.value;

	let x1 = 0;

	let x2 = 0;

	const password = this.password;

	const font = this.font;

	if( password )
	{
		mw = this.maskWidth( font.size ) + this.maskKern( font.size );
	}

	let a;

	for( a = 0; a < value.length; a++ )
	{
		x1 = x2;

		x2 =
			password
			? a * mw
			: font.getAdvanceWidth( value.substr( 0, a ) );

		if( x2 >= dx ) break;
	}

	if( dx - x1 < x2 - dx && a > 0 ) a--;

	return a;
};


/*
| User pressed backspace.
*/
def.func._keyBackspace =
	function( )
{
	const mark = this.mark;

	const at = mark.caret.at;

	if( at <= 0 ) return;

	root.setPath(
		this.path.append( 'value' ),
		this.value.substring( 0, at - 1 ) +
			this.value.substring( at )
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', at - 1
			)
	);
};


/*
| User pressed del.
*/
def.func._keyDel =
	function( )
{
	const at = this.mark.caret.at;

	if( at >= this.value.length ) return;

	root.setPath(
		this.path.append( 'value' ),
		this.value.substring( 0, at ) +
			this.value.substring( at + 1 )
	);
};


/*
| User pressed return key.
| User pressed down key.
*/
def.func._keyEnter =
def.func._keyDown =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), 1 );
};


/*
| User pressed end key.
*/
def.func._keyEnd =
	function( )
{
	const mark = this.mark;

	const at = mark.caret.at;

	if( at >= this.value.length ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', this.value.length
			)
	);
};


/*
| User pressed left key.
*/
def.func._keyLeft =
	function( )
{
	const mark = this.mark;

	if( mark.caret.at <= 0 ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', mark.caret.at - 1
			)
	);
};


/*
| User pressed pos1 key
*/
def.func._keyPos1 =
	function( )
{
	const mark = this.mark;

	if( mark.caret.at <= 0 ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', 0
			)
	);
};


/*
| User pressed right key
*/
def.func._keyRight =
	function( )
{
	const mark = this.mark;

	if( mark.caret.at >= this.value.length ) return;

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', mark.caret.path,
				'at', mark.caret.at + 1
			)
	);
};


/*
| User pressed up key.
*/
def.func._keyUp =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), -1 );

	return;
};



/*
| Returns an array of ellipses
| representing the password mask.
*/
def.lazy._passMask =
	function( )
{
	const value = this.value;

	const size = this.font.size;

	const pm = [ ];

	const pitch = widget_input._pitch;

	let x = pitch.x;

	const y = pitch.y + Math.round( size * 0.7 );

	const w = this.maskWidth( size );

	//h = size * 0.32,
	const h = w;

	const k = this.maskKern( size );

	for( let a = 0, aZ = value.length; a < aZ; a++, x += w + k )
	{
		pm[ a ] =
			gleam_ellipse.create(
				'pos', gleam_point.xy( x, y - h / 2 ),
				'width', w,
				'height', h
			);
	}

	return pm;
};


} );
