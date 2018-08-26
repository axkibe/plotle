/*
| Shortcuts for fonts.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_color = require( '../gleam/color' );

const gleam_font = require( '../gleam/font' );

const defaultSize = 12;

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
	gleam_font.create(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'alphabetic',
		'size', defaultSize
	);


def.staticLazy.car = ( ) =>
	gleam_font.create(
		'opentype', defaultOTFont,
		'fill', gleam_color.red,
		'align', 'center',
		'base', 'alphabetic',
		'size', defaultSize
	);


def.staticLazy.cm = ( ) =>
	gleam_font.create(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'middle',
		'size', defaultSize
	);


def.staticLazy.la = ( ) =>
	gleam_font.create(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'alphabetic',
		'size', defaultSize
	);


def.staticLazy.lm = ( ) =>
	gleam_font.create(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'middle',
		'size', defaultSize
	);


def.staticLazy.ra = ( ) =>
	gleam_font.create(
		'opentype', defaultOTFont,
		'fill', gleam_color.black,
		'align', 'end',
		'base', 'alphabetic',
		'size', defaultSize
	);


} );

