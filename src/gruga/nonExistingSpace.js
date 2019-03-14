/*
| Default design for the non-existing-space form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gruga_font = tim.require( './font' );

const gruga_genericButton = tim.require( './genericButton' );

const layout_button = tim.require( '../layout/button' );

const layout_form = tim.require( '../layout/form' );

const layout_label = tim.require( '../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 22 ),
				'pos', gleam_point.xy( 0, -120 ),
				'text', '',
			),
		'twig:add',
		'message1',
			layout_label.create(
				'align', 'center',
				'text', 'Do you want to create it?',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add',
		'noButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -100, 28 ),
						'width', 75,
						'height', 75
					),
				'text', 'No',
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			),
		'twig:add',
		'yesButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 25, 28 ),
						'width', 75,
						'height', 75
					),
				'text', 'Yes',
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			)
	);


} );

