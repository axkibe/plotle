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

		// color of the label
		color : { type : '../gleam/color', defaultValue : 'require( "../gleam/color" ).black' },

		// font of the text
		font : { type : [ 'undefined', '../gleam/font/font' ] },

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
		trace,      // trace of the widget
		transform   // visual transformation
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/
/**/	if( layout.timtype !== layout_label ) throw new Error( );
/**/}

	return(
		widget_label.create(
			'align', layout.align,
			'base', layout.base,
			'color', layout.color,
			'font', layout.font,
			'newline', layout.newline,
			'path', path,
			'pos', layout.pos,
			'text', layout.text,
			'trace', trace,
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
	if( !this.visible ) return;

	return(
		gleam_glint_text.create(
			'align', this.align,
			'base', this.base,
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



} );
