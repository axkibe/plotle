/*
| Default design for the the move-to-form.
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
	meshcraftHomeButton =
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


	meshcraftSandboxButton =
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
Gruga.MoveToForm =
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
				'move to another space',

			font :
				fontPool.get( 22, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						-150
				)
		},

		'meshcraftHomeButton' :
		{
			type :
				'ButtonWidget',

			style :
				'portalButton',

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								meshcraftHomeButton.w,
							'y',
								meshcraftHomeButton.n
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								meshcraftHomeButton.w +
								meshcraftHomeButton.width,
							'y',
								meshcraftHomeButton.n +
								meshcraftHomeButton.height
						)
				),

			caption :
			{
				type :
					'LabelWidget',

				text :
					'meshraft\nhome',

				newline :
					25,

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					)
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.create(
						'anchor',
							'nw',
						'x',
							0,
						'y',
							0
					),

				pse :
					Design.AnchorPoint.create(
						'anchor',
							'se',
						'x',
							-1,
						'y',
							-1
					)
			}
		},

		'meshcraftSandboxButton' :
		{
			type :
				'ButtonWidget',

			style :
				'portalButton',

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								meshcraftSandboxButton.w,
							'y',
								meshcraftSandboxButton.n
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								meshcraftSandboxButton.w +
								meshcraftSandboxButton.width,
							'y',
								meshcraftSandboxButton.n +
								meshcraftSandboxButton.height
						)
				),

			caption :
			{
				type :
					'LabelWidget',

				text :
					'meshraft\nsandbox',

				newline :
					25,

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					)
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.create(
						'anchor',
							'nw',
						'x',
							0,
						'y',
							0
					),

				pse :
					Design.AnchorPoint.create(
						'anchor',
							'se',
						'x',
							-1,
						'y',
							-1
					)
			}
		},

		'userHomeButton' :
		{
			type :
				'ButtonWidget',

			style :
				'portalButton',

			frame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								userHomeButton.w,
							'y',
								userHomeButton.n
						),
					'pse',
						Design.AnchorPoint.create(
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

			caption :
			{
				type :
					'LabelWidget',

				text :
					'your\nhome',

				newline :
					25,

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					)
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.create(
						'anchor',
							'nw',
						'x',
							0,
						'y',
							0
					),

				pse :
					Design.AnchorPoint.create(
						'anchor',
							'se',
						'x',
							-1,
						'y',
							-1
					)
			}
		}
	},


	ranks :
	[
		'headline',
		'meshcraftHomeButton',
		'meshcraftSandboxButton',
		'userHomeButton'
	]
};


} )( );
