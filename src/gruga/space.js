/*
| Default design for the space form.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gruga_font = tim.require( '../gruga/font' );

const gruga_genericButton = tim.require( '../gruga/genericButton' );

const gruga_genericCheckbox = tim.require( '../gruga/genericCheckbox' );

const layout_button = tim.require( '../layout/button' );

const layout_checkbox = tim.require( '../layout/checkbox' );

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
				'pos', gleam_point.createXY( 0, -120 ),
				'text', ''
			),
		'twig:add', 'gridCheckBox',
			layout_checkbox.create(
				'facets', gruga_genericCheckbox.facets,
				'checked', false,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -52, -64 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add', 'gridMessage',
			layout_label.create(
				'text', 'show grid',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -25, -50 )
			),
		'twig:add', 'snappingCheckBox',
			layout_checkbox.create(
				'facets', gruga_genericCheckbox.facets,
				'checked', false,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -52, -29 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add', 'snappingMessage',
			layout_label.create(
				'text', 'snap to grid',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -25, -15 )
			),
		'twig:add', 'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			)
	);

} );

