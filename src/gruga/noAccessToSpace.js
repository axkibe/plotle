/*
| Default design for no-access-to-space form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( '../gruga/genericButton' );

const layout_button = require( '../layout/button' );

const layout_form = require( '../layout/form' );

const layout_label = require( '../layout/label' );

const shell_fontPool = require( '../shell/fontPool' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add', 'headline',
			layout_label.create(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			layout_label.create(
				'text', 'Sorry, you cannot port to this space or create it.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add', 'okButton',
			layout_button.create(
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
