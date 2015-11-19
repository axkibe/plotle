/*
| Shortcuts for fonts.
*/


var
	euclid_color,
	euclid_font,
	gruga_fonts;

/*
| Capsule
*/
(function() {
'use strict';

var
	defaultFamily,
	defaultBoldFamily;
	
defaultFamily = 'DejaVuSans,sans-serif';

defaultBoldFamily = 'DejaVuSansBold,sans-serif';


gruga_fonts = { };


gruga_fonts.ca =
	euclid_font.abstract(
		'family', defaultFamily,
		'fill', euclid_color.black,
		'align', 'center',
		'base', 'alphabetic'
	);


gruga_fonts.car =
	euclid_font.abstract(
		'family', defaultFamily,
		'fill', euclid_color.red,
		'align', 'center',
		'base', 'alphabetic'
	);


gruga_fonts.cm =
	euclid_font.abstract(
		'family', defaultFamily,
		'fill', euclid_color.black,
		'align', 'center',
		'base', 'middle'
	);


gruga_fonts.la =
	euclid_font.abstract(
		'family', defaultFamily,
		'fill', euclid_color.black,
		'align', 'start',
		'base', 'alphabetic'
	);


gruga_fonts.lm =
	euclid_font.abstract(
		'family', defaultFamily,
		'fill', euclid_color.black,
		'align', 'start',
		'base', 'middle'
	);


gruga_fonts.ra =
	euclid_font.abstract(
		'family', defaultFamily,
		'fill', euclid_color.black,
		'align', 'end',
		'base', 'alphabetic'
	);


/**/if( FREEZE )
/**/{
/**/	Object.freeze( gruga_fonts );
/**/}


} )( );
