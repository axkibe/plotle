/*
| Default design for the login form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_color = require( '../gleam/color' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_size = require( '../gleam/size' );

const gruga_font = require( './font' );

const gruga_genericButton = require( '../gruga/genericButton' );

const gruga_genericInput = require( '../gruga/genericInput' );

const layout_button = require( '../layout/button' );

const layout_form = require( '../layout/form' );

const layout_input = require( '../layout/input' );

const layout_label = require( '../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'text', 'Log In',
				'font', gruga_font.standard( 22 ),
				'pos', gleam_point.xy( -225, -112 )
			),
		'twig:add',
		'usernameLabel',
			layout_label.create(
				'text', 'username',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.xy( -175, -49 )
			),
		'twig:add',
		'passwordLabel',
			layout_label.create(
				'text', 'password',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.xy( -175, -9 )
			),
		'twig:add',
		'errorLabel',
			layout_label.create(
				'align', 'center',
				'color', gleam_color.red,
				'text', '',
				'font', gruga_font.standard( 14 ),
				'pos', gleam_point.xy( -20, -83 )
			),
		'twig:add',
		'userInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'font', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -67 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'passwordInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -27 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'loginButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.posSize(
						gleam_point.xy( 95, 28 ),
						gleam_size.wh( 70, 70 )
					),
				'text', 'log in',
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.posSize(
						gleam_point.xy( 180, 38 ),
						gleam_size.wh( 50, 50 )
					),
				'text', 'close',
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			)
	);

} );

