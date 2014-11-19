/*
| Default design for no-access-to-space form.
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
	/*
	| Close control
	*/
	okButton =
	{
		width :
			50,
		height :
			50,
		w :
			180,
		n :
			38
	};


/*
| Layout
*/
gruga.noAccessToSpace =
	forms.noAccessToSpace.create(
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
					'Sorry, you cannot port to this space or create it.',
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
		'okButton',
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
									okButton.w,
								'y',
									okButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									okButton.w +
									okButton.width,
								'y',
									okButton.n +
									okButton.height
							)
					),
				'text',
					'ok',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.PC,
				'shape',
					design.anchorEllipse.fullSkewNW
			)
	);


} )( );
