/*
| Default design for the space form.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	forms_space,
	gruga_space,
	shell_fontPool,
	widget_button,
	widget_label;


/*
| Capsule
*/
( function( ) {
'use strict';

var
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
gruga_space =
	forms_space.create(
		'twig:add', 'headline',
			widget_label.create(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add', 'message1',
			widget_label.create(
				'text', 'In future space settings can be altered here.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add', 'closeButton',
			widget_button.create(
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
