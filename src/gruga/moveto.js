/*
| Default design for the the move-to-form.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	form_moveTo,
	gruga_moveTo,
	shell_fontPool,
	widget_button,
	widget_label;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	ideoloomHomeButton =
	{
		w : -145,
		n : -100,
		width : 130,
		height : 130
	},

	ideoloomSandboxButton =
	{
		w : 15,
		n : -100,
		width : 130,
		height : 130
	},

	userHomeButton =
	{
		w : -145,
		n : 60,
		width : 130,
		height : 130
	};


/*
| Layout
*/
gruga_moveTo =
	form_moveTo.create(
		'twig:add',
		'headline',
			widget_label.create(
				'text', 'move to another space',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -150
					)
			),
		'twig:add',
		'ideoloomHomeButton',
			widget_button.create(
				'style', 'portalButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', ideoloomHomeButton.w,
								'y', ideoloomHomeButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x',
									ideoloomHomeButton.w
									+ ideoloomHomeButton.width,
								'y',
									ideoloomHomeButton.n
									+ ideoloomHomeButton.height
							)
					),
				'text', 'ideoloom\nhome',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'ideoloomSandboxButton',
			widget_button.create(
				'style',
					'portalButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', ideoloomSandboxButton.w,
								'y', ideoloomSandboxButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x',
									ideoloomSandboxButton.w +
									ideoloomSandboxButton.width,
								'y',
									ideoloomSandboxButton.n +
									ideoloomSandboxButton.height
							)
					),
				'text',
					'ideoloom\nsandbox',
				'textNewline',
					25,
				'font',
					shell_fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'userHomeButton',
			widget_button.create(
				'style', 'portalButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', userHomeButton.w,
								'y', userHomeButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', userHomeButton.w + userHomeButton.width,
								'y', userHomeButton.n + userHomeButton.height
							)
					),
				'text', 'your\nhome',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					),
				'shape', design_anchorEllipse.fullSkewNW
			)
	);

} )( );
