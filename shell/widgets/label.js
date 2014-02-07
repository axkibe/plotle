/*
| A label.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;

Widgets =
	Widgets || { };


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Label',
		unit :
			'Widgets',
		attributes :
			{
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'Boolean',
						allowNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				designPos :
					{
						comment :
							'designed position of the text',
						type :
							'AnchorPoint'
					},
				// FIXME deduce from hoverPath
				hoverAccent :
					{
						comment :
							'true if the widget is hovered on',
						type :
							'Boolean',
						allowNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				font :
					{
						comment :
							'font of the text',
						type :
							'Font',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						allowNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				newline :
					{
						comment :
							'vertical distance of newline',
						type :
							'Number',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'Path',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'Rect',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				text :
					{
						comment :
							'the label text',
						type :
							'String'
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						allowNull :
							true,
						defaultVal :
							'null',
						assign :
							null
					},
				visible :
					{
						comment :
							'if false the button is hidden',
						type :
							'Boolean',
						defaultVal :
							'true'
					}
			},
		subclass :
			'Widgets.Widget',
		init :
			[
				'traitSet'
			]
	};
}


var
	Label =
		Widgets.Label;


/*
| Initializes the widget.
*/
Label.prototype._init =
	function(
		traitSet
	)
{
	if( this.superFrame )
	{
		this.pos =
			this.designPos.compute(
				this.superFrame
			);
	}
	else
	{
		this.pos =
			null;
	}

	if( traitSet )
	{
		for(
			var a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( this.path )
			)
			{
				switch( t.key )
				{
					case 'text' :

						this.text =
							t.val;

						break;

					case 'visible' :

						this.visible =
							t.val;

						break;

					default :

						throw new Error(
							CHECK
							&&
							( 'unknown trait: ' + t.key )
						);
				}
			}
		}
	}
};


/*
| Draws the label on the fabric.
|
| FIXME use _fabric
*/
Label.prototype.draw =
	function(
		fabric
	)
{
	if( !this.visible )
	{
		return;
	}

	fabric.paintText(
		'text',
			this.text,
		'p',
			this.pos,
		'font',
			this.font
	);
};


/*
| User is hovering his/her pointer ( mouse move )
*/
Label.prototype.pointingHover =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


/*
| User clicked.
*/
Label.prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


/*
| FIXME remove
*/
Label.prototype._$grown =
	true;


} ) ( );
