/*
| Default design for no-access-to-space form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_font = require( './font' );

const gruga_genericButton = require( '../gruga/genericButton' );

const layout_button = require( '../layout/button' );

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
				'font', gruga_font.standard( 22 ),
				'pos', gleam_point.xy( 0, -120 ),
				'text', ''
			),
		'twig:add', 'message1',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.xy( 0, -50 ),
				'text', 'Sorry, you cannot port to this space or create it.'
			),
		'twig:add', 'okButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse',
				'text', 'ok',
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					)
			)
	);


} );
