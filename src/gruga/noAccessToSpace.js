/*
| Default design for no-access-to-space form.
*/
'use strict';


tim.define( module, 'gruga_noAccessToSpace', ( def, gruga_noAccessToSpace ) => {


const form_noAccessToSpace = require( '../form/noAccessToSpace' );

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
	form_noAccessToSpace.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			widget_label.abstract(
				'text', 'Sorry, you cannot port to this space or create it.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add', 'okButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'ok',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} );

