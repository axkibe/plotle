/*
| Shortcuts for fonts.
*/
'use strict';


tim.define( module, 'gruga_fonts', ( def, gruga_fonts ) => {


const gleam_color = require( '../gleam/color' );

const gleam_font = require( '../gleam/font' );

const defaultFamily = 'DejaVuSans,sans-serif';


def.staticLazy.ca = ( ) =>
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'alphabetic'
	);


def.staticLazy.car = ( ) =>
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.red,
		'align', 'center',
		'base', 'alphabetic'
	);


def.staticLazy.cm = ( ) =>
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'middle'
	);


def.staticLazy.la = ( ) =>
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'alphabetic'
	);


def.staticLazy.lm = ( ) =>
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'middle'
	);


def.staticLazy.ra = ( ) =>
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'end',
		'base', 'alphabetic'
	);


} );

