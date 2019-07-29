/*
| Default design for the signup form.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_point = tim.require( '../../gleam/point' );
const gleam_rect = tim.require( '../../gleam/rect' );
const gruga_font = tim.require( '../font' );
const gruga_genericButton = tim.require( '../genericButton' );
const gruga_genericCheckbox = tim.require( '../genericCheckbox' );
const gruga_genericInput = tim.require( '../genericInput' );
const layout_button = tim.require( '../../layout/button' );
const layout_checkbox = tim.require( '../../layout/checkbox' );
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
				'fontFace', gruga_font.standard( 22 ),
				'pos', gleam_point.createXY( -245, -165 ),
				'text', 'Sign Up',
			),
		'twig:add',
		'usernameLabel',
			layout_label.create(
				'align', 'right',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -98, -102 ),
				'text', 'username'
			),
		'twig:add',
		'emailLabel',
			layout_label.create(
				'align', 'right',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -98, -62 ),
				'text', 'email',
			),
		'twig:add',
		'passwordLabel',
			layout_label.create(
				'align', 'right',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -98, -22 ),
				'text', 'password'
			),
		'twig:add',
		'password2Label',
			layout_label.create(
				'align', 'right',
				'text', 'repeat password',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -98, 18 )
			),
		'twig:add',
		'newsletterLabel',
			layout_label.create(
				'align', 'right',
				'text', 'newsletter',
				'fontFace', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( -98, 58 )
			),
		'twig:add',
		'errorLabel',
			layout_label.create(
				'align', 'center',
				'fontFace', gruga_font.standardRed( 14 ),
				'pos', gleam_point.createXY( -20, -136 ),
				'text', ''
			),
		'twig:add',
		'userInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'fontFace', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -80, -120 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'emailInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'fontFace', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -80, -80 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'passwordInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'fontFace', gruga_font.standard( 14 ),
				'maxlen', 100,
				'password', true,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -80, -40 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'password2Input',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'password', true,
				'fontFace', gruga_font.standard( 14 ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -80, 0 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'newsletterCheckBox',
			layout_checkbox.create(
				'facets', gruga_genericCheckbox.facets,
				'checked', false,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( -75, 45 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add',
		'newsletter2Label',
			layout_label.create(
				'text', 'Updates and News',
				'fontFace', gruga_font.standard( 12 ),
				'pos', gleam_point.createXY( -45, 57 )
			),
		'twig:add',
		'newsletter3Label',
			layout_label.create(
				'text', 'Not going to be more than an email a month.',
				'fontFace', gruga_font.standard( 12 ),
				'pos', gleam_point.createXY( -45, 77 )
			),
		'twig:add',
		'signupButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( 95, 95 ),
						'width', 70,
						'height', 70
					),
				'text', 'sign up',
				'fontFace', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( 180, 105 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'fontFace', gruga_font.standard( 14 ),
				'shape', 'ellipse'
			)
	);


} );

