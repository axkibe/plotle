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


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	const checkAlign = Object.freeze( { left: true, center: true, right: true } );
/**/
/**/	const checkBase = Object.freeze( { alphabetic: true, middle: true } );
/**/
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if( !checkAlign[ this.align ] ) throw new Error( );
/**/
/**/		if( !checkBase[ this.base ] ) throw new Error( );
/**/	};
/**/}


} );
