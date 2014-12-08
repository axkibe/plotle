/*
| Default design of the creation disc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	discs,
	fontPool,
	gruga_createDisc,
	widgets_button;

/*
| Capsule
*/
( function( ) {
'use strict';

/*
| All important design variables for convenience.
*/
var
	dv;

dv =
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

gruga_createDisc =
	discs.createDisc.create(
		'twig:add',
		'createNote',
			widgets_button.create(
				'style', 'createButton',
				'text', 'Note',
				'font', dv.generic.font,
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.note.x,
								'y', dv.note.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.note.x + dv.generic.width,
								'y', dv.note.y + dv.generic.height
							)
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'createLabel',
			widgets_button.create(
				'style', 'createButton',
				'text', 'Label',
				'font', dv.generic.font,
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.label.x,
								'y', dv.label.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.label.x + dv.generic.width,
								'y', dv.label.y + dv.generic.height
							)
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'createRelation',
			widgets_button.create(
				'style', 'createButton',
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'font', dv.generic.font,
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.relation.x,
								'y', dv.relation.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.relation.x + dv.generic.width,
								'y', dv.relation.y + dv.generic.height
							)
					),
				'shape',
					design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'createPortal',
			widgets_button.create(
				'style', 'createButton',
				'text', 'Portal',
				'font', dv.generic.font,
				'textDesignPos', design_anchorPoint.PC,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.portal.x,
								'y', dv.portal.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.portal.x + dv.generic.width,
								'y', dv.portal.y + dv.generic.height
							)
					),
				'shape', design_anchorEllipse.fullSkewNW
			)
	);


} )( );
