/*
| Default design for the space form.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	forms_user,
	gruga_user,
	shell_fontPool,
	widgets_button,
	widgets_label;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Close control
*/
var closeButton =
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
	forms_user.create(
		'twig:add',
		'headline',
			widgets_label.create(
				'text', 'Hello',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add',
		'visitor1',
			widgets_label.create(
				'text', 'You\'re currently an anonymous visitor!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add',
		'visitor2',
			widgets_label.create(
				'text', 'Click on "sign up" or "log in"',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos', design_anchorPoint.PC
			),
		'twig:add',
		'visitor3',
			widgets_label.create(
				'text', 'on the control disc to the left',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', 20
					)
			),
		'twig:add',
		'visitor4',
			widgets_label.create(
				'text', 'to register as an user.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', 40
					)
			),
		'twig:add',
		'greeting1',
			widgets_label.create(
				'text', 'This is your profile page!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add',
		'greeting2',
			widgets_label.create(
				'text', 'In future you will be able to do stuff here,',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -10
					)
			),
		'twig:add',
		'greeting3',
			widgets_label.create(
				'text', 'like for example change your password.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', 10
					)
			),
		'twig:add',
		'closeButton',
			widgets_button.create(
				'style', 'genericButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'shape', design_anchorEllipse.fullSkewNW
			)
	);

} )( );
