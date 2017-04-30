/*
| Shortcuts for fonts.
*/


var
	gleam_color,
	gleam_font,
	gruga_fonts;

/*
| Capsule
*/
(function() {
'use strict';

var
	defaultFamily;

defaultFamily = 'DejaVuSans,sans-serif';

gruga_fonts = { };


gruga_fonts.ca =
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'alphabetic'
	);


gruga_fonts.car =
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.red,
		'align', 'center',
		'base', 'alphabetic'
	);


gruga_fonts.cm =
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'center',
		'base', 'middle'
	);


gruga_fonts.la =
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'alphabetic'
	);


gruga_fonts.lm =
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'start',
		'base', 'middle'
	);


gruga_fonts.ra =
	gleam_font.abstract(
		'family', defaultFamily,
		'fill', gleam_color.black,
		'align', 'end',
		'base', 'alphabetic'
	);


if( FREEZE ) Object.freeze( gruga_fonts );


} )( );
