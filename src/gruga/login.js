/*
| Default design for the login form.
*/
'use strict';


tim.define( module, ( def ) => {


const form_login = require( '../form/login' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_size = require( '../gleam/size' );

const gruga_genericButton = require( '../gruga/genericButton' );

const gruga_genericInput = require( '../gruga/genericInput' );

const layout_input = require( '../layout/input' );

const shell_fontPool = require( '../shell/fontPool' );

const widget_button = require( '../widget/button' );

const widget_input = require( '../widget/input' );

const widget_label = require( '../widget/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_login.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'Log In',
				'font', shell_fontPool.get( 22, 'la' ),
				'pos', gleam_point.xy( -225, -112 )
			),
		'twig:add',
		'usernameLabel',
			widget_label.abstract(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos', gleam_point.xy( -175, -49 )
			),
		'twig:add',
		'passwordLabel',
			widget_label.abstract(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos', gleam_point.xy( -175, -9 )
			),
		'twig:add',
		'errorLabel',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'pos', gleam_point.xy( -20, -83 )
			),
		'twig:add',
		'userInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
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
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
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
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.posSize(
						gleam_point.xy( 95, 28 ),
						gleam_size.wh( 70, 70 )
					),
				'text', 'log in',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.posSize(
						gleam_point.xy( 180, 38 ),
						gleam_size.wh( 50, 50 )
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);

} );

