/*
| Default design for the space form.
*/
'use strict';


tim.define( module, 'gruga_space', ( def, gruga_space ) => {


const form_space = require( '../form/space' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( '../gruga/genericButton' );

const shell_fontPool = require( '../shell/fontPool' );

const widget_button = require( '../widget/button' );

const widget_label = require( '../widget/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_space.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			widget_label.abstract(
				'text', 'In future space settings can be altered here.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add', 'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);

} );

