/*
| Default design for the space form.
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


/*
| Close control
*/
var closeButton =
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
Gruga.UserForm =
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
				'Hello',

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

		'visitor1' :
		{
			type :
				'LabelWidget',

			text :
				'You\'re currently an anonymous visitor!',

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

		'visitor2' :
		{
			type :
				'LabelWidget',

			text :
				'Click on "sign up" or "log in"',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
				Design.AnchorPoint.PC
		},

		'visitor3' :
		{
			type :
				'LabelWidget',

			text :
				'on the control disc to the left',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						20
				)
		},

		'visitor4' :
		{
			type :
				'LabelWidget',

			text :
				' to register as an user.',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						40
				)
		},

		'greeting1' :
		{
			type :
				'LabelWidget',

			text :
				'This is your profile page!',

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

		'greeting2' :
		{
			type :
				'LabelWidget',

			text :
				'In future you will be able to do stuff here,',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						-10
				)
		},

		'greeting3' :
		{
			type :
				'LabelWidget',

			text :
				'like for example change your password.',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						10
				)
		},

		'closeButton' :
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
			{
				type :
					'Frame',

				pnw :
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							closeButton.w,
						'y',
							closeButton.n
					),

				pse :
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							closeButton.w +
							closeButton.width,
						'y',
							closeButton.n +
							closeButton.height
					)
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'close',

				font :
					fontPool.get( 14, 'cm' ),

				pos :
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
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
			}
		}
	},


	ranks :
	[
		'headline',
		'visitor1',
		'visitor2',
		'visitor3',
		'visitor4',
		'greeting1',
		'greeting2',
		'greeting3',
		'closeButton'
	]
};


} )( );
