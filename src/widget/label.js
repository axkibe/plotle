/*
| A label.
*/
'use strict';


tim.define( module, ( def, widget_label ) => {


def.extend = './widget';


if( TIM )
{
	def.attributes =
	{
		// component hovered upon
		hover : { type : 'undefined' },

		// font of the text
		font : { type : [ 'undefined', '../gleam/font' ] },

		// the users mark
		mark : { type : 'undefined' },

		// vertical distance of newline
		newline : { type : [ 'undefined', 'number' ] },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// designed position
		pos : { type : '../gleam/point' },

		// the label text
		text : { type : 'string' },

		// the transform
		transform : { type : '../gleam/transform' },

		// if false the widget is hidden
		visible : { type : 'boolean', defaultValue : 'true' },
	};
}


const gleam_glint_text = require( '../gleam/glint/text' );

const layout_label = require( '../layout/label' );


/*
| A label doesn't care about marks.
*/
def.proto.concernsMark =
def.static.concernsMark =
	( ) => undefined;


/*
| A label doesn't care about hovering.
*/
def.proto.concernsHover =
def.static.concernsHover =
	( ) => undefined;


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
/**/	if( layout.timtype !== layout_label ) throw new Error( );
/**/}

	return(
		widget_label.create(
			'font', layout.font,
			'newline', layout.newline,
			'path', path,
			'pos', layout.pos,
			'text', layout.text,
			'transform', transform,
			'visible', true
		)
	);
};


/*
| The transformed position of the label.
*/
def.lazy._pos =
	function( )
{
	return this.pos.transform( this.transform );
};


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	if( !this.visible ) return undefined;

	return(
		gleam_glint_text.create(
			'font', this.font,
			'p', this._pos,
			'text', this.text
		)
	);
};


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
	return undefined;
};


/*
| Mouse wheel is being turned.
*/
def.proto.mousewheel =
	function(
		p,
		shift,
		ctrl
	)
{
	return undefined;
};


/*
| User is hovering his/her pointer ( mouse move )
*/
def.proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	return undefined;
};



} );
