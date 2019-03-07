/*
| Default design for the signup form.
*/
'use strict';


tim.define( module, ( def ) => {


const shell_fontPool = require( '../shell/fontPool' );

const gleam_color = require( '../gleam/color' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( '../gruga/genericButton' );

const gruga_genericCheckbox = require( '../gruga/genericCheckbox' );

const gruga_genericInput = require( '../gruga/genericInput' );

const layout_button = require( '../layout/button' );

const layout_checkbox = require( '../layout/checkbox' );

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
				'text', 'Sign Up',
				'font', shell_fontPool.get( 22, 'la' ),
				'pos', gleam_point.xy( -245, -165 )
			),
		'twig:add',
		'usernameLabel',
			layout_label.create(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, -102 )
			),
		'twig:add',
		'emailLabel',
			layout_label.create(
				'text', 'email',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, -62 )
			),
		'twig:add',
		'passwordLabel',
			layout_label.create(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, -22 )
			),
		'twig:add',
		'password2Label',
			layout_label.create(
				'text', 'repeat password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, 18 )
			),
		'twig:add',
		'newsletterLabel',
			layout_label.create(
				'text', 'newsletter',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, 58 )
			),
		'twig:add',
		'errorLabel',
			layout_label.create(
				'color', gleam_color.red,
				'text', '',
				'font', shell_fontPool.get( 14, 'ca' ),
				'pos', gleam_point.xy( -20, -136 )
			),
		'twig:add',
		'userInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -120 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'emailInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -80 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'passwordInput',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'password', true,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -40 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'password2Input',
			layout_input.create(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, 0 ),
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
						'pos', gleam_point.xy( -75, 45 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add',
		'newsletter2Label',
			layout_label.create(
				'text', 'Updates and News',
				'font', shell_fontPool.get( 12, 'la' ),
				'pos', gleam_point.xy( -45, 57 )
			),
		'twig:add',
		'newsletter3Label',
			layout_label.create(
				'text', 'Not going to be more than an email a month.',
				'font', shell_fontPool.get( 12, 'la' ),
				'pos', gleam_point.xy( -45, 77 )
			),
		'twig:add',
		'signupButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 95, 95 ),
						'width', 70,
						'height', 70
					),
				'text', 'sign up',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 105 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} );

