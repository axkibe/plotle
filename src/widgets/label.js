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
						defaultValue :
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
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'Path',
						defaultValue :
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
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						defaultValue :
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
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'Path',
						defaultValue :
							'null'
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'Rect',
						defaultValue :
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
						defaultValue :
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
						defaultValue :
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
