/*
| Default design for the non-existing-space form.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

const gleam_point = tim.require( '../../gleam/point' );
const gleam_rect = tim.require( '../../gleam/rect' );
const gruga_fontFace = tim.require( '../fontFace' );
const gruga_genericButton = tim.require( '../genericButton' );
const layout_button = tim.require( '../../layout/button' );
const layout_form = tim.require( '../../layout/form' );
const layout_label = tim.require( '../../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'align', 'center',
				'fontFace', gruga_fontFace.standard( 22 ),
				'pos', gleam_point.createXY( 0, -120 ),
				'text', '',
			),
		'twig:add',
		'message1',
			layout_label.create(
				'align', 'center',
				'text', 'Do you want to create it?',
				'fontFace', gruga_fontFace.standard( 16 ),
				'pos', gleam_point.createXY( 0, -50 )
			),
		'twig:add',
		'noButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -100, 28 ),
						'width', 75,
						'height', 75
					),
				'text', 'No',
				'fontFace', gruga_fontFace.standard( 14 ),
				'shape', 'ellipse'
			),
		'twig:add',
		'yesButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( 25, 28 ),
						'width', 75,
						'height', 75
					),
				'text', 'Yes',
				'fontFace', gruga_fontFace.standard( 14 ),
				'shape', 'ellipse'
			)
	);


} );

