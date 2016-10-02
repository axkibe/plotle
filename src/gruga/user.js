/*
| Default design for the space form.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	form_user,
	gruga_genericButton,
	gruga_user,
	shell_fontPool,
	widget_button,
	widget_label;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	closeButton;


/*
| Close control
*/
closeButton =
{
	width : 50,
	height : 50,
	w : 180,
	n : 38
};


/*
| Layout
*/
gruga_user =
	form_user.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'Hello',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add',
		'visitor1',
			widget_label.abstract(
				'text', 'You\'re currently an anonymous visitor!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add',
		'visitor2',
			widget_label.abstract(
				'text', 'Click on "sign up" or "log in"',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos', euclid_anchor_point.c
			),
		'twig:add',
		'visitor3',
			widget_label.abstract(
				'text', 'on the control disc to the left',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 20
					)
			),
		'twig:add',
		'visitor4',
			widget_label.abstract(
				'text', 'to register as an user.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 40
					)
			),
		'twig:add',
		'greeting1',
			widget_label.abstract(
				'text', 'This is your profile page!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add',
		'greeting2',
			widget_label.abstract(
				'text', 'In future you will be able to do stuff here,',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -10
					)
			),
		'twig:add',
		'greeting3',
			widget_label.abstract(
				'text', 'like for example change your password.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 10
					)
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
