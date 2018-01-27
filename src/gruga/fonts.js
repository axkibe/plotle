/*
| Shortcuts for fonts.
*/
'use strict';


tim.define( module, 'gruga_fonts', ( def, gruga_fonts ) => {


const gleam_color = require( '../gleam/color' );

const gleam_font = require( '../gleam/font' );

let defaultOTFont;

/*
| Sets the opentype default font.
*/
def.static.setOpenTypeDefault =
	function(
		font
	)
{
/**/if( CHECK )
/**/{
/**/	if( defaultOTFont ) throw new Error( );
/**/}

	defaultOTFont =  font;
};


def.staticLazy.ca = ( ) =>
	gleam_font.abstract(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'alphabetic'
	);


def.staticLazy.car = ( ) =>
	gleam_font.abstract(
		'opentype', defaultOTFont,
		'fill', gleam_color.red,
		'align', 'center',
		'base', 'alphabetic'
	);


def.staticLazy.cm = ( ) =>
	gleam_font.abstract(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'middle'
	);


def.staticLazy.la = ( ) =>
	gleam_font.abstract(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'alphabetic'
	);


def.staticLazy.lm = ( ) =>
	gleam_font.abstract(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'middle'
	);


def.staticLazy.ra = ( ) =>
	gleam_font.abstract(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'end',
		'base', 'alphabetic'
	);


} );

