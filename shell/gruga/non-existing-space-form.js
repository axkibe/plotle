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
	fontPool;

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
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
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

			caption :
			{
				type :
					'LabelWidget',

				text :
					'No',

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
					Design.AnchorPoint.PC
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
			}
		},

		'yesButton' :
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
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

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Yes',

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
					Design.AnchorPoint.PC
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
			}
		}
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
