/*
| Default design for the space form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( '../gruga/genericButton' );

const gruga_genericCheckbox = require( '../gruga/genericCheckbox' );

const shell_fontPool = require( '../shell/fontPool' );

const layout_button = require( '../layout/button' );

const layout_checkbox = require( '../layout/checkbox' );

const layout_form = require( '../layout/form' );

const layout_label = require( '../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add', 'headline',
			layout_label.create(
				'align', 'center',
				'font', shell_fontPool.get( 22, 'a' ),
				'pos', gleam_point.xy( 0, -120 ),
				'text', ''
			),
		'twig:add', 'gridCheckBox',
			layout_checkbox.create(
				'facets', gruga_genericCheckbox.facets,
				'checked', false,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -52, -64 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add', 'gridMessage',
			layout_label.create(
				'text', 'show grid',
				'font', shell_fontPool.get( 16, 'a' ),
				'pos', gleam_point.xy( -25, -50 )
			),
		'twig:add', 'snappingCheckBox',
			layout_checkbox.create(
				'facets', gruga_genericCheckbox.facets,
				'checked', false,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -52, -29 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add', 'snappingMessage',
			layout_label.create(
				'text', 'snap to grid',
				'font', shell_fontPool.get( 16, 'a' ),
				'pos', gleam_point.xy( -25, -15 )
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
				'font', shell_fontPool.get( 14, 'a' ),
				'shape', 'ellipse'
			)
	);

} );

