/*
| Default design for the signup form.
*/


var
	euclid_point,
	euclid_rect,
	shell_fontPool,
	form_signUp,
	gruga_genericButton,
	gruga_genericCheckbox,
	gruga_genericInput,
	gruga_signUp,
	widget_button,
	widget_checkbox,
	widget_input,
	widget_label;

/*
| Capsule
*/
( function( ) {
'use strict';

var
	/*
	| Signup control
	*/
	signupButton =
	{
		width : 70,
		height : 70,
		w : 95,
		n : 95
	},

	/*
	| Close control
	*/
	closeButton =
	{
		width : 50,
		height : 50,
		w : 180,
		n : 105
	};


/*
| Layout
*/
gruga_signUp =
	form_signUp.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'Sign Up',
				'font', shell_fontPool.get( 22, 'la' ),
				'pos', euclid_point.xy( -245, -165 )
			),
		'twig:add',
		'usernameLabel',
			widget_label.abstract(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', euclid_point.xy( -98, -102 )
			),
		'twig:add',
		'emailLabel',
			widget_label.abstract(
				'text', 'email',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', euclid_point.xy( -98, -62 )
			),
		'twig:add',
		'passwordLabel',
			widget_label.abstract(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', euclid_point.xy( -98, -22 )
			),
		'twig:add',
		'password2Label',
			widget_label.abstract(
				'text', 'repeat password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', euclid_point.xy( -98, 18 )
			),
		'twig:add',
		'newsletterLabel',
			widget_label.abstract(
				'text', 'newsletter',
				'font', shell_fontPool.get( 16, 'ra' ),
				'pos', euclid_point.xy( -98, 58 )
			),
		'twig:add',
		'errorLabel',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'pos', euclid_point.xy( -20, -136 )
			),
		'twig:add',
		'userInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -80, -120 ),
						'pse', euclid_point.xy( 130, -95 )
					)
			),
		'twig:add',
		'emailInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -80, -80 ),
						'pse', euclid_point.xy( 130, -55 )
					)
			),
		'twig:add',
		'passwordInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -80, -40 ),
						'pse', euclid_point.xy( 130, -15 )
					)
			),
		'twig:add',
		'password2Input',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -80, 0 ),
						'pse', euclid_point.xy( 130, 25 )
					)
			),
		'twig:add',
		'newsletterCheckBox',
			widget_checkbox.abstract(
				'facets', gruga_genericCheckbox.facets,
				'checked', true,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -75, 45 ),
						'pse', euclid_point.xy( -59, 60 )
					)
			),
		'twig:add',
		'newsletter2Label',
			widget_label.abstract(
				'text', 'Updates and News',
				'font', shell_fontPool.get( 12, 'la' ),
				'pos', euclid_point.xy( -45, 57 )
			),
		'twig:add',
		'newsletter3Label',
			widget_label.abstract(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font', shell_fontPool.get( 12, 'la' ),
				'pos', euclid_point.xy( -45, 77 )
			),
		'twig:add',
		'signupButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					euclid_rect.create(
						'pnw',
							euclid_point.xy( signupButton.w, signupButton.n ),
						'pse',
							euclid_point.xy(
								signupButton.w + signupButton.width,
								signupButton.n + signupButton.height
							)
					),
				'text', 'sign up',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					euclid_rect.create(
						'pnw',
							euclid_point.xy(
								closeButton.w,
								closeButton.n
							),
						'pse',
							euclid_point.xy(
								closeButton.w + closeButton.width,
								closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);

} )( );
