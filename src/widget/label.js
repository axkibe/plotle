/*
| A label.
*/
'use strict';


tim.define( module, ( def, widget_label ) => {


def.extend = './base';

if( TIM )
{
	def.attributes =
	{
		// horizonal alignment
		align : { type : 'string', defaultValue : '"left"' },

		// vertical alignment
		base : { type : 'string', defaultValue : '"alphabetic"' },

		// font family, size and color of the text
		fontFace : { type : [ 'undefined', '../gleam/font/face' ] },

		// vertical distance of newline
		newline : { type : [ 'undefined', 'number' ] },

		// designed position
		pos : { type : '../gleam/point' },

		// the label text
		text : { type : 'string' },
	};
}

const gleam_glint_text = tim.require( '../gleam/glint/text' );
const layout_label = tim.require( '../layout/label' );


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,           // of type layout_label
		trace,            // trace of the widget
		transform,        // visual transformation
		devicePixelRatio  // display's device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/	if( layout.timtype !== layout_label ) throw new Error( );
/**/	if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	return(
		widget_label.create(
			'align', layout.align,
			'base', layout.base,
			'devicePixelRatio', devicePixelRatio,
			'fontFace', layout.fontFace,
			'newline', layout.newline,
			'pos', layout.pos,
			'text', layout.text,
			'trace', trace,
			'transform', transform,
			'visible', true
		)
	);
};


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	if( !this.visible ) return;

	return(
		gleam_glint_text.create(
			'align', this.align,
			'base', this.base,
			'devicePixelRatio', this.devicePixelRatio,
			'fontFace', this.fontFace,
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
};


/*
| The transformed position of the label.
*/
def.lazy._pos =
	function( )
{
	return this.pos.transform( this.transform );
};


} );
