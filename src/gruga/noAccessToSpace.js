/*
| Default design for no-access-to-space form.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	forms_noAccessToSpace,
	gruga_noAccessToSpace,
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
	okButton =
	{
		width : 50,
		height : 50,
		w : 180,
		n : 38
	};


/*
| Layout
*/
gruga_noAccessToSpace =
	forms_noAccessToSpace.create(
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
				'text', 'Sorry, you cannot port to this space or create it.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add', 'okButton',
			widget_button.create(
				'style', 'genericButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', okButton.w,
								'y', okButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', okButton.w + okButton.width,
								'y', okButton.n + okButton.height
							)
					),
				'text', 'ok',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'shape', design_anchorEllipse.fullSkewNW
			)
	);


} )( );
