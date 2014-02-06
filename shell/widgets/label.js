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
| Imports
*/
var
	Jools;


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
						assign :
							null
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
						assign :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						// FIXME do not allow null
						allowNull :
							true,
						assign :
							null
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'Path'
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'Rect'
					},
				text :
					{
						comment :
							'the text written in the button',
						type :
							'String',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				tree :
					{
						comment :
							'the shellverse tree',
						type :
							'Tree'
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
						allowNull :
							true,
						// default taken from tree
						defaultVal :
							'null'
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
	this.pos =
		this.tree.twig.pos.compute(
			this.superFrame
		);

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

	if( this.visible === null )
	{
		this.visible =
			Jools.is( this.tree.twig.visible ) ?
				this.tree.twig.visible
				:
				true;
	}

	if( this.text === null )
	{
		this.text =
			this.tree.twig.text;
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
			this.tree.twig.font
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

} ) ( );
