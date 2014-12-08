/*
| Default design for the non-existing-space form.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	fontPool,
	forms_nonExistingSpace,
	gruga_nonExistingSpace,
	widgets_button,
	widgets_label;


/*
| Capsule
*/
( function( ) {
'use strict';

var
	// 'no' control
	noButton =
	{
		width : 75,
		height : 75,
		w : -100,
		n : 28
	},

	// yes control
	yesButton =
	{
		width : 75,
		height : 75,
		w : 25,
		n : 28
	};


/*
| Layout
*/
gruga_nonExistingSpace =
	forms_nonExistingSpace.create(
		'twig:add',
		'headline',
			widgets_label.create(
				'text', '',
				'font', fontPool.get( 22, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add',
		'message1',
			widgets_label.create(
				'text',
					'Do you want to create it?',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design_anchorPoint.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add',
		'noButton',
			widgets_button.create(
				'style',
					'genericButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', noButton.w,
								'y', noButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', noButton.w + noButton.width,
								'y', noButton.n + noButton.height
							)
					),
				'text', 'No',
				'font', fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'shape', design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'yesButton',
			widgets_button.create(
				'style', 'genericButton',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', yesButton.w,
								'y', yesButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', yesButton.w + yesButton.width,
								'y', yesButton.n + yesButton.height
							)
					),
				'text', 'Yes',
				'font', fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.PC,
				'shape', design_anchorEllipse.fullSkewNW
			)
	);

} )( );
