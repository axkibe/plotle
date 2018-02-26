/*
| Default design for the signup form.
*/
'use strict';


tim.define( module, ( def ) => {


const shell_fontPool = require( '../shell/fontPool' );

const form_signUp = require( '../form/signUp' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( '../gruga/genericButton' );

const gruga_genericCheckbox = require( '../gruga/genericCheckbox' );

const gruga_genericInput = require( '../gruga/genericInput' );

const widget_button = require( '../widget/button' );

const widget_checkbox = require( '../widget/checkbox' );

const widget_input = require( '../widget/input' );

const widget_label = require( '../widget/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_signUp.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'Sign Up',
				'font', shell_fontPool.get( 22, 'la' ),
				'pos', gleam_point.xy( -245, -165 )
			),
		'twig:add',
		'usernameLabel',
			widget_label.abstract(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, -102 )
			),
		'twig:add',
		'emailLabel',
			widget_label.abstract(
				'text', 'email',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, -62 )
			),
		'twig:add',
		'passwordLabel',
			widget_label.abstract(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, -22 )
			),
		'twig:add',
		'password2Label',
			widget_label.abstract(
				'text', 'repeat password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, 18 )
			),
		'twig:add',
		'newsletterLabel',
			widget_label.abstract(
				'text', 'newsletter',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', gleam_point.xy( -98, 58 )
			),
		'twig:add',
		'errorLabel',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'pos', gleam_point.xy( -20, -136 )
			),
		'twig:add',
		'userInput',
			widget_input.abstract(
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
			widget_input.abstract(
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
			widget_input.abstract(
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
			widget_input.abstract(
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
			widget_checkbox.abstract(
				'facets', gruga_genericCheckbox.facets,
				'checked', true,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -75, 45 ),
						'width', 16,
						'height', 15
					)
			),
		'twig:add',
		'newsletter2Label',
			widget_label.abstract(
				'text', 'Updates and News',
				'font', shell_fontPool.get( 12, 'la' ),
				'pos', gleam_point.xy( -45, 57 )
			),
		'twig:add',
		'newsletter3Label',
			widget_label.abstract(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font', shell_fontPool.get( 12, 'la' ),
				'pos', gleam_point.xy( -45, 77 )
			),
		'twig:add',
		'signupButton',
			widget_button.abstract(
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
			widget_button.abstract(
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

