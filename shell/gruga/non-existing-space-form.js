/*
| Default design for the non-existing-space form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Gruga;


Gruga =
	Gruga || { };


/*
| Imports
*/
var
	Design,
	fontPool,
	Widgets;

/*
| Capsule
*/
( function( ) {
'use strict';

var

	/*
	| 'no' control
	*/
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


	/*
	| yes control
	*/
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
Gruga.NonExistingSpaceForm =
{
	type :
		'Layout',

	twig :
	{
		'headline' :
		{
			type :
				'LabelWidget',
			text :
				'',
			font :
				fontPool.get( 22, 'ca' ),
			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						-120
				)
		},

		'message1' :
		{
			type :
				'LabelWidget',
			text :
				'Do you want to create it?',
			font :
				fontPool.get( 16, 'ca' ),
			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						-50
				)
		},
		'noButton' :
			Widgets.Button.create(
				'style',
					'genericButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									noButton.w,
								'y',
									noButton.n
							),
						'pse',
							Design.AnchorPoint.create(
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
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			),
		'yesButton' :
			Widgets.Button.create(
				'style',
					'genericButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									yesButton.w,
								'y',
									yesButton.n
							),
						'pse',
							Design.AnchorPoint.create(
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
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			)
	},

	ranks :
	[
		'headline',
		'message1',
		'noButton',
		'yesButton'
	]
};

} )( );
