/*
| Default design for the welcome form.
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
		'twig:add', 'headline',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 22 ),
				'pos', gleam_point.xy( 0, -120 ),
				'text', 'welcome'
			),
		'twig:add', 'message1',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.xy( 0, -50 ),
				'text', 'Your registration was successful :-)'
			),
		'twig:add', 'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			)
	);


} );

