/*
| Default design for the the move-to-form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	gruga;

gruga = gruga || { };


/*
| Imports
*/
var
	design,
	fontPool,
	forms,
	widgets;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	ideoloomHomeButton =
	{
		w :
			-145,
		n :
			-100,
		width :
			130,
		height :
			130
	},
	ideoloomSandboxButton =
	{
		w :
			15,
		n :
			-100,
		width :
			130,
		height :
			130
	},
	userHomeButton =
	{
		w :
			-145,
		n :
			60,
		width :
			130,
		height :
			130
	};


/*
| Layout
*/
gruga.moveTo =
	forms.moveTo.create(
		'twig:add',
		'headline',
			widgets.Label.create(
				'text',
					'move to another space',
				'font',
					fontPool.get( 22, 'ca' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-150
					)
			),
		'twig:add',
		'ideoloomHomeButton',
			widgets.Button.create(
				'style',
					'portalButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									ideoloomHomeButton.w,
								'y',
									ideoloomHomeButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									ideoloomHomeButton.w +
									ideoloomHomeButton.width,
								'y',
									ideoloomHomeButton.n +
									ideoloomHomeButton.height
							)
					),
				'text',
					'ideoloom\nhome',
				'textNewline',
					25,
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					),
				'shape',
					design.anchorEllipse.fullSkewNW
			),
		'twig:add',
		'ideoloomSandboxButton',
			widgets.Button.create(
				'style',
					'portalButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									ideoloomSandboxButton.w,
								'y',
									ideoloomSandboxButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
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
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					),
				'shape',
					design.anchorEllipse.fullSkewNW
			),
		'twig:add',
		'userHomeButton',
			widgets.Button.create(
				'style',
					'portalButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									userHomeButton.w,
								'y',
									userHomeButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									userHomeButton.w +
									userHomeButton.width,
								'y',
									userHomeButton.n +
									userHomeButton.height
							)
					),
				'text',
					'your\nhome',
				'textNewline',
					25,
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					),
				'shape',
					design.anchorEllipse.fullSkewNW
			)
	);

} )( );
