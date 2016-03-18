/*
| Default design for the signup form.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
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
			widget_label.create(
				'text', 'Sign Up',
				'font', shell_fontPool.get( 22, 'la' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -245,
						'y', -165
					)
			),
		'twig:add',
		'usernameLabel',
			widget_label.create(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'ra' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -98,
						'y', -102
					)
			),
		'twig:add',
		'emailLabel',
			widget_label.create(
				'text', 'email',
				'font', shell_fontPool.get( 16, 'ra' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -98,
						'y', -62
					)
			),
		'twig:add',
		'passwordLabel',
			widget_label.create(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -98,
						'y', -22
					)
			),
		'twig:add',
		'password2Label',
			widget_label.create(
				'text', 'repeat password',
				'font', shell_fontPool.get( 16, 'ra' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -98,
						'y', 18
					)
			),
		'twig:add',
		'newsletterLabel',
			widget_label.create(
				'text', 'newsletter',
				'font', shell_fontPool.get( 16, 'ra' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -98,
						'y', 58
					)
			),
		'twig:add',
		'errorLabel',
			widget_label.create(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -20,
						'y', -136
					)
			),
		'twig:add',
		'userInput',
			widget_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -80,
								'y', -120
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', 130,
								'y', -95
							)
					)
			),
		'twig:add',
		'emailInput',
			widget_input.create(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -80,
								'y', -80
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', 130,
								'y', -55
							)
					)
			),
		'twig:add',
		'passwordInput',
			widget_input.create(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -80,
								'y', -40
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', 130,
								'y', -15
							)
					)
			),
		'twig:add',
		'password2Input',
			widget_input.create(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -80,
								'y', 0
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', 130,
								'y', 25
							)
					)
			),
		'twig:add',
		'newsletterCheckBox',
			widget_checkbox.create(
				'facets', gruga_genericCheckbox.facets,
				'checked', true,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -75,
								'y', 45
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -59,
								'y', 60
							)
					)
			),
		'twig:add',
		'newsletter2Label',
			widget_label.create(
				'text', 'Updates and News',
				'font', shell_fontPool.get( 12, 'la' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -45,
						'y', 57
					)
			),
		'twig:add',
		'newsletter3Label',
			widget_label.create(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font', shell_fontPool.get( 12, 'la' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -45,
						'y', 77
					)
			),
		'twig:add',
		'signupButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', signupButton.w,
								'y', signupButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', signupButton.w + signupButton.width,
								'y', signupButton.n + signupButton.height
							)
					),
				'text', 'sign up',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape', euclid_anchor_ellipse.fullSkewNW
			),
		'twig:add',
		'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'designArea',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape', euclid_anchor_ellipse.fullSkewNW
			)
	);

} )( );
