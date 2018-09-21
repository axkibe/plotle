/*
| Default design for the non-existing-space form.
*/
'use strict';


tim.define( module, ( def ) => {


const form_nonExistingSpace = require( '../form/nonExistingSpace' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( '../gruga/genericButton' );

const shell_fontPool = require( '../shell/fontPool' );

const layout_button = require( '../layout/button' );

const layout_label = require( '../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_nonExistingSpace.abstract(
		'twig:add',
		'headline',
			layout_label.create(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add',
		'message1',
			layout_label.create(
				'text', 'Do you want to create it?',
				'font', shell_fontPool.get( 16, 'ca' ),
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
				'font', shell_fontPool.get( 14, 'cm' ),
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
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} );

