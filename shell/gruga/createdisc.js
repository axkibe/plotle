/*
| Default design of the creation disc.
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
| All important design variables for convenience
*/
var
	design =
{

	generic :
	{
		width :
			70,

		height :
			70,

		font :
			fontPool.get( 16, 'cm' )
	},

	note :
	{
		x :
			62,

		y :
			216
	},

	label :
	{
		x :
			81,

		y :
			284
	},

	relation :
	{
		x :
			94,

		y :
			354
	},

	portal :
	{
		x :
			101,

		y :
			425
	}
};

Gruga.CreateDisc =
{
	type :
		'Layout',

	twig :
	{
		'CreateNote' :
		{
			type :
				'ButtonWidget',
			style :
				'createButton',
			text :
				'Note',
			font :
				design.generic.font,
			textDesignPos :
				Design.AnchorPoint.PC,
			designFrame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.note.x,
							'y',
								design.note.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.note.x +
								design.generic.width,
							'y',
								design.note.y +
								design.generic.height
						)
				),
			shape :
				Design.AnchorEllipse.fullSkewNW
		},

		'CreateLabel' :
		{
			type :
				'ButtonWidget',
			style :
				'createButton',
			text :
				'Label',
			font :
				design.generic.font,
			textDesignPos :
				Design.AnchorPoint.PC,
			designFrame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.label.x,
							'y',
								design.label.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.label.x +
								design.generic.width,
							'y',
								design.label.y +
								design.generic.height
						)
				),

			shape :
				Design.AnchorEllipse.fullSkewNW
		},

		'CreateRelation' :
		{
			type :
				'ButtonWidget',
			style :
				'createButton',
			text :
				'Rela-\ntion',
			textNewline :
				20,
			font :
				design.generic.font,
			textDesignPos :
				Design.AnchorPoint.PC,
			designFrame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.relation.x,
							'y',
								design.relation.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.relation.x +
								design.generic.width,
							'y',
								design.relation.y +
								design.generic.height
						)
				),
			shape :
				Design.AnchorEllipse.fullSkewNW
		},

		'CreatePortal' :
		{
			type :
				'ButtonWidget',
			style :
				'createButton',
			text :
				'Portal',
			font :
				design.generic.font,
			textDesignPos :
				Design.AnchorPoint.PC,
			designFrame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.portal.x,
							'y',
								design.portal.y
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'nw',
							'x',
								design.portal.x +
								design.generic.width,
							'y',
								design.portal.y +
								design.generic.height
						)
				),

			shape :
				Design.AnchorEllipse.fullSkewNW
		}
	},

	ranks :
	[
		'CreateNote',
		'CreateLabel',
		'CreateRelation',
		'CreatePortal'
	]
};


} )( );
