/*
| Default design for the login form.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_point = tim.require( '../../gleam/point' );
const gleam_rect = tim.require( '../../gleam/rect' );
const gleam_size = tim.require( '../../gleam/size' );
const gruga_font = tim.require( '../font' );
const gruga_genericButton = tim.require( '../../gruga/genericButton' );
const gruga_genericInput = tim.require( '../../gruga/genericInput' );
const layout_button = tim.require( '../../layout/button' );
const layout_form = tim.require( '../../layout/form' );
const layout_input = tim.require( '../../layout/input' );
const layout_label = tim.require( '../../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'text', 'Log In',
				'fontFace', gruga_font.standard( 22 ),
				'pos', gleam_point.createXY( -225, -112 )
			),
		'twig:add',
		'usernameLabel',
			layout_label.create(
				'text', 'username',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -175, -49 )
			),
		'twig:add',
		'passwordLabel',
			layout_label.create(
				'text', 'password',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -175, -9 )
			),
		'twig:add',
		'errorLabel',
			layout_label.create(
				'align', 'center',
				'text', '',
				'fontFace', gruga_font.standardRed( 14 ),
				'pos', gleam_point.createXY( -20, -83 )
			),
		'twig:add',
		'userInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'fontFace', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -80, -67 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'passwordInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'password', true,
				'fontFace', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -80, -27 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'loginButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.createPosSize(
						gleam_point.createXY( 95, 28 ),
						gleam_size.wh( 70, 70 )
					),
				'text', 'log in',
				'fontFace', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.createPosSize(
						gleam_point.createXY( 180, 38 ),
						gleam_size.wh( 50, 50 )
					),
				'text', 'close',
				'fontFace', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			)
	);

} );
