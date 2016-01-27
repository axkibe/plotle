/*
| Default note.
*/


var
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_askew,
	gleam_gradient_colorStop,
	euclid_margin,
	gruga_highlight,
	gruga_note;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_note = { };


gruga_note.facets =
	gleam_facetRay.create(
		'ray:append',
		// default
		gleam_facet.create(
			'fill',
				gleam_gradient_askew.create(
					'ray:append',
					gleam_gradient_colorStop.create(
						'offset', 0,
						'color', gleam_color.rgba( 255, 255, 248, 0.955 )
					),
					'ray:append',
					gleam_gradient_colorStop.create(
						'offset', 1,
						'color', gleam_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			'border',
				gleam_borderRay.create(
					'ray:append',
					gleam_border.create(
						'distance', 1,
						'color', gleam_color.rgb( 255, 188, 87 )
					),
					'ray:append',
					gleam_border.simpleBlack
				)
		),
		'ray:append', gruga_highlight
	);


/*
| Inner distance of note to doc.
*/
gruga_note.innerMargin =
	euclid_margin.create(
		'n', 4,
		'e', 5,
		's', 4,
		'w', 5
	);


/*
| Minimum note size.
*/
gruga_note.minWidth = 30;

gruga_note.minHeight = 30;


/*
| Radius of the corners.
*/
gruga_note.cornerRadius = 8;


/*
| Default fontsize.
*/
gruga_note.defaultFontsize = 13;


/*
| Vertical distance of scrollbar from border.
*/
gruga_note.vScrollbarDis = 5;


if( FREEZE )
{
	Object.freeze( gruga_note );
}


} )( );
