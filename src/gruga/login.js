/*
| Default design for the login form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_color = require( '../gleam/color' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_size = require( '../gleam/size' );

const gruga_genericButton = require( '../gruga/genericButton' );

const gruga_genericInput = require( '../gruga/genericInput' );

const layout_button = require( '../layout/button' );

const layout_form = require( '../layout/form' );

const layout_input = require( '../layout/input' );

const layout_label = require( '../layout/label' );

const shell_fontPool = require( '../shell/fontPool' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'text', 'Log In',
				'font', shell_fontPool.get( 22, 'a' ),
				'pos', gleam_point.xy( -225, -112 )
			),
		'twig:add',
		'usernameLabel',
			layout_label.create(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'a' ),
				'pos', gleam_point.xy( -175, -49 )
			),
		'twig:add',
		'passwordLabel',
			layout_label.create(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'a' ),
				'pos', gleam_point.xy( -175, -9 )
			),
		'twig:add',
		'errorLabel',
			layout_label.create(
				'align', 'center',
				'color', gleam_color.red,
				'text', '',
				'font', shell_fontPool.get( 14, 'a' ),
				'pos', gleam_point.xy( -20, -83 )
			),
		'twig:add',
		'userInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'a' ),
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
				'font', shell_fontPool.get( 14, 'a' ),
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
				'font', shell_fontPool.get( 14, 'a' ),
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
				'font', shell_fontPool.get( 14, 'a' ),
				'shape', 'ellipse'
			)
	);

} );

