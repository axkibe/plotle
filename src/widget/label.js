/*
| A label.
*/
'use strict';


tim.define( module, 'widget_label', ( def, widget_label ) => {


const gleam_glint_text = require( '../gleam/glint/text' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// component hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ], assign : '' },

		// font of the text
		font : { type : [ 'undefined', 'gleam_font' ] },

		// the users mark
		mark :
		{
			type : tim.typemap( module, '../visual/mark/mark' ).concat( ['undefined' ] ),

			assign : ''
		},

		// vertical distance of newline
		newline : { type : [ 'undefined', 'number' ] },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// designed position
		pos : { type : 'gleam_point' },

		// the label text
		text : { type : 'string' },

		// the transform
		transform : { type : 'gleam_transform' },

		// if false the button is hidden
		visible : { type : 'boolean', defaultValue : 'true' },
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


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
	return undefined;
};


/*
| Handles a potential dragStart event.
*/
def.func.dragStart =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl     // true if ctrl or meta key was held down
	)
{
	return undefined;
};


/*
| Mouse wheel is being turned.
*/
def.func.mousewheel =
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
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	return undefined;
};



} );
