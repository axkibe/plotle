/*
| An input field.
*/
'use strict';


tim.define( module, ( def, widget_input ) => {


def.extend = './widget';


if( TIM )
{
	def.attributes =
	{
		// style facets
		facets : { type : '../gleam/facetList' },

		// component hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// font of the text
		font : { type : '../gleam/font/font' },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types' ] },

		// maximum input length
		maxlen : { type : 'integer' },

		// true for password input
		password : { type : 'boolean', defaultValue : 'false' },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the transform
		transform : { type : '../gleam/transform' },

		// the value in the input box
		value : { type : 'string', defaultValue : '""' },

		// if false the button is hidden
		visible : { type : 'boolean', defaultValue : 'true' },

		// designed zone
		zone : { type : '../gleam/rect' },
	};
}


const gleam_ellipse = tim.require( '../gleam/ellipse' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_font_font = tim.require( '../gleam/font/font' );

const gleam_glint_border = tim.require( '../gleam/glint/border' );

const gleam_glint_fill = tim.require( '../gleam/glint/fill' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_text = tim.require( '../gleam/glint/text' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_roundRect = tim.require( '../gleam/roundRect' );

const layout_input = tim.require( '../layout/input' );

const result_hover = tim.require( '../result/hover' );

const mark_caret = tim.require( '../mark/caret' );


/*
| Returns the mark if the widget with 'path' concerns about the mark.
*/
def.proto.concernsMark =
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	return mark && mark.containsPath( path ) ? mark : undefined;
};


/*
| Returns the hover path if the width with 'path' concerns about the hover.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,
		path
	)
{
	return hover && path.subPathOf( hover ) ? hover : undefined;
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,     // of type layout_label
		path,       // path of the widget
		transform   // visual transformation
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/
/**/	if( layout.timtype !== layout_input ) throw new Error( );
/**/}

	return(
		widget_input.create(
			'facets', layout.facets,
			'font', layout.font,
			'maxlen', layout.maxlen,
			'password', layout.password,
			'path', path,
			'transform', transform,
			'visible', true,
			'zone', layout.zone
		)
	);
};


/*
| Default distance of text.
*/
def.staticLazy._pitch = ( ) =>
	gleam_point.createXY( 8, 3 );


/*
| Attention center (see shell/root)
*/
def.lazy.attentionCenter =
	function( )
{
	const fs = this.font.size;

	const descend = fs * gleam_font_font.bottomBox;

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

	const zone = this._tZone.enlarge1;

	return(
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'glint', this._glint,
					'size', zone.size
				),
			'pos', zone.pos
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

	const descend = fs * gleam_font_font.bottomBox;

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
		for( let shape of this._passMask )
		{
			arr.push(
				gleam_glint_fill.create(
					'facet', gleam_facet.blackFill,
					'shape', shape
				)
			);
		}
	}
	else
	{
		arr.push(
			gleam_glint_text.create(
				'font', font,
				'p', gleam_point.createXY( pitch.x, font.size + pitch.y ),
				'text', value
			)
		);
	}

	if( mark && mark.timtype === mark_caret && mark.focus ) arr.push( this._caretGlint );

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
					+ ( this._maskWidth + this._maskKern )
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


/*
| Inputs can hold a caret.
*/
def.proto.caretable = true;


/*
| User clicked.
*/
def.proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	if( !p || !this._tZone.within( p ) ) return undefined;

	const pp = p.sub( this._tZone.pos );

	if( !this._tzShape.within( pp ) ) return undefined;

	root.alter( 'mark', mark_caret.createPathAt( this.path, this._getOffsetAt( pp ) ) );

	return false;
};


/*
| User input.
*/
def.proto.input =
	function(
		text
	)
{
	const mark = this.mark;

	const value = this.value;

	const at = mark.caret.at;

	const maxlen = this.maxlen;

	// cuts of text if larger than this maxlen
	if( maxlen > 0 && value.length + text.length > maxlen )
	{
		text = text.substring( 0, maxlen - value.length );
	}

	root.alter(
		this.path.append( 'value' ),
		value.substring( 0, at ) + text + value.substring( at )
	);

	root.alter( 'mark', mark_caret.createPathAt( mark.caret.path, at + text.length ) );
};


/*
| Inputs are focusable
*/
def.proto.focusable = true;


/*
| Mouse hover
*/
def.proto.pointingHover =
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

	return result_hover.create( 'path', this.path, 'cursor', 'text' );
};


/*
| User pressed a special key
*/
def.proto.specialKey =
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
def.proto._getOffsetAt =
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

	if( password ) mw = this._maskWidth + this._maskKern;

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
def.proto._keyBackspace =
	function( )
{
	const mark = this.mark;

	const at = mark.caret.at;

	if( at <= 0 ) return;

	root.alter(
		this.path.append( 'value' ),
			this.value.substring( 0, at - 1 ) + this.value.substring( at ),
		'mark', mark.backward
	);
};


/*
| User pressed del.
*/
def.proto._keyDel =
	function( )
{
	const at = this.mark.caret.at;

	if( at >= this.value.length ) return;

	root.alter(
		this.path.append( 'value' ),
		this.value.substring( 0, at ) + this.value.substring( at + 1 )
	);
};


/*
| User pressed return key.
| User pressed down key.
*/
def.proto._keyEnter =
def.proto._keyDown =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), 1 );
};


/*
| User pressed end key.
*/
def.proto._keyEnd =
	function( )
{
	const mark = this.mark;

	const at = mark.caret.at;

	if( at >= this.value.length ) return;

	root.alter(
		'mark', mark_caret.createPathAt( mark.caret.path, this.value.length )
	);
};


/*
| User pressed left key.
*/
def.proto._keyLeft =
	function( )
{
	const mark = this.mark;

	if( mark.caret.at <= 0 ) return;

	root.alter( 'mark', mark.backward );
};


/*
| User pressed pos1 key
*/
def.proto._keyPos1 =
	function( )
{
	const mark = this.mark;

	if( mark.caret.at <= 0 ) return;

	root.alter( 'mark', mark.zero );
};


/*
| User pressed right key
*/
def.proto._keyRight =
	function( )
{
	const mark = this.mark;

	if( mark.caret.at >= this.value.length ) return;

	root.alter( 'mark', mark.forward );
};


/*
| User pressed up key.
*/
def.proto._keyUp =
	function( )
{
	root.cycleFormFocus( this.path.get( 2 ), -1 );

	return;
};


/*
| Returns the kerning of characters for password masks.
*/
def.lazy._maskKern =
	function( )
{
	return Math.round( this.font.size * 0.15 );
};


/*
| Returns the width of a character for password masks.
*/
def.lazy._maskWidth =
	function( )
{
	return Math.round( this.font.size * 0.5 );
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

	const w = this._maskWidth;

	//h = size * 0.32,
	const h = w;

	const k = this._maskKern;

	for( let a = 0, al = value.length; a < al; a++, x += w + k )
	{
		pm.push(
			gleam_ellipse.create(
				'pos', gleam_point.createXY( x, y - h / 2 ),
				'width', w,
				'height', h
			)
		);
	}

	return pm;
};


} );
