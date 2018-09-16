/*
| A label.
*/
'use strict';


tim.define( module, ( def, widget_label ) => {


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
		font : { type : [ 'undefined', '../gleam/font' ] },

		// the users mark
		mark :
		{
			type : [ '< ../visual/mark/types', 'undefined' ],
			assign : ''
		},

		// vertical distance of newline
		newline : { type : [ 'undefined', 'number' ] },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

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
