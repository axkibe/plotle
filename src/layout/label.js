/*
| A label.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// horizonal alignment
		// "left", "right", "center"
		align : { type : 'string', defaultValue : '"left"' },

		// vertical alignment
		base : { type : 'string', defaultValue : '"alphabetic"' },

		// the fontFace of the text
		fontFace : { type : [ 'undefined', '../gleam/font/face' ] },

		// vertical distance of newline
		newline : { type : [ 'undefined', 'number' ] },

		// designed position
		pos : { type : '../gleam/point' },

		// the label text
		text : { type : 'string' },
	};
}

const checkAlign = Object.freeze( { left: true, center: true, right: true } );

const checkBase = Object.freeze( { alphabetic: true, middle: true } );

/*
| Exta checking.
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( !checkAlign[ this.align ] ) throw new Error( );
/**/
/**/	if( !checkBase[ this.base ] ) throw new Error( );
/**/}
};


} );
