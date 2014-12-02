/*
| Default design for the non-existing-space form.
*/


var
	design,
	fontPool,
	forms,
	gruga_nonExistingSpace,
	widgets;


/*
| Capsule
*/
( function( ) {
'use strict';

var
	// 'no' control
	noButton =
	{
		width :
			75,
		height :
			75,
		w :
			-100,
		n :
			28
	},

	// yes control
	yesButton =
	{
		width :
			75,
		height :
			75,
		w :
			25,
		n :
			28
	};


/*
| Layout
*/
gruga_nonExistingSpace =
	forms.nonExistingSpace.create(
		'twig:add',
		'headline',
			widgets.label.create(
				'text',
					'',
				'font',
					fontPool.get( 22, 'ca' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-120
					)
			),
		'twig:add',
		'message1',
			widgets.label.create(
				'text',
					'Do you want to create it?',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
								'c',
						'x',
							0,
						'y',
							-50
					)
			),
		'twig:add',
		'noButton',
			widgets.button.create(
				'style',
					'genericButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									noButton.w,
								'y',
									noButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									noButton.w +
									noButton.width,
								'y',
									noButton.n +
									noButton.height
							)
					),
				'text',
					'No',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.PC,
				'shape',
					design.anchorEllipse.fullSkewNW
			),
		'twig:add',
		'yesButton',
			widgets.button.create(
				'style',
					'genericButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									yesButton.w,
								'y',
									yesButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									yesButton.w +
									yesButton.width,
								'y',
									yesButton.n +
									yesButton.height
							)
					),
				'text',
					'Yes',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.PC,
				'shape',
					design.anchorEllipse.fullSkewNW
			)
	);

} )( );
