/*
| A checkbox
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
	Accent,
	Euclid,
	shell,
	TraitSet;


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
			'CheckBox',
		unit :
			'Widgets',
		attributes :
			{
				checked :
					{
						comment :
							'true if the checkbox is checked',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				designFrame :
					{
						comment :
							'designed frame (using anchors',
						type :
							'AnchorRect'
					},
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				// FIXME deduce from hoverPath
				hoverAccent :
					{
						comment :
							'true if the widget is hovered on',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						// FIXME do not allow null
						defaultValue :
							'null',
						assign :
							null
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
				style :
					{
						// FIXME put in a real object instead
						comment :
							'name of the style used',
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
	CheckBox =
		Widgets.CheckBox;


/*
| Initializes the widget.
*/
CheckBox.prototype._init =
	function(
		traitSet
	)
{
	if( this.superFrame )
	{
		this.frame =
			this.designFrame.compute(
				this.superFrame
			);
	}
	else
	{
		this.frame =
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
					case 'checked' :

						this.checked =
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
| CheckBoxes are focusable.
*/
CheckBox.prototype.focusable =
	true;


/*
| Mouse hover.
*/
CheckBox.prototype.pointingHover =
	function(
		// p
	)
{
	return null;
};


/*
| Sketches the check
*/
CheckBox.prototype.sketchCheck =
	function(
		fabric
		// border,
		// twist
	)
{
	var
		pc =
			this.frame.pc,

		pcx =
			pc.x,

		pcy =
			pc.y;

	fabric.moveTo(
		pcx -  5,
		pcy -  3
	);

	fabric.lineTo(
		pcx +  2,
		pcy +  5
	);

	fabric.lineTo(
		pcx + 14,
		pcy - 12
	);

	fabric.lineTo(
		pcx +  2,
		pcy -  1
	);

	fabric.lineTo(
		pcx -  5,
		pcy -  3
	);
};


/*
| CheckBox is being changed.
*/
CheckBox.prototype.change =
	function(
		// shift,
		// ctrl
	)
{
	// no default
};


/*
| User clicked.
*/
CheckBox.prototype.click =
	function(
		p
		// shift,
		// ctrl
	)
{
	if( !this.visible )
	{
		return null;
	}

	if(
		this.frame.within(
			Euclid.View.proper,
			p
		)
	)
	{
		shell.setTraits(
			TraitSet.create(
				'trait',
					this.path,
					'checked',
					!this.checked
			)
		);

		return false;
	}
	else
	{
		return null;
	}
};


/*
| Special keys for buttons having focus
*/
CheckBox.prototype.specialKey =
	function(
		key,
		owner
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'down' :

			owner.cycleFocus( +1 );

			return;

		case 'up' :

			owner.cycleFocus( -1 );

			return;

		case 'enter' :

			shell.setTraits(
				TraitSet.create(
					'trait',
						this.path,
						'checked',
						!this.checked
				)
			);

			return;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
CheckBox.prototype.input =
	function(
		// text
	)
{
	shell.setTraits(
		TraitSet.create(
			'trait',
				this.path,
				'checked',
				!this.checked
		)
	);

	return true;
};


/*
| Draws the checkbox.
| FIXME _fabric caching
*/
CheckBox.prototype.draw =
	function(
		fabric
	)
{
	if( !this.visible )
	{
		return;
	}

	var
		style =
			Widgets.getStyle(
				this.style,
				Accent.state(
					this.hoverAccent,
					this.focusAccent
				)
			);

	fabric.paint(
		style,
		this.frame,
		'sketch',
		Euclid.View.proper
	);

	if( this.checked )
	{
		fabric.paint(
			Widgets.getStyle(
				'checkboxCheck',
				Accent.NORMA
			),
			this,
			'sketchCheck',
			Euclid.View.proper
		);
	}
};


/*
| FIXME remove
*/
CheckBox.prototype._$grown =
	true;



} )( );
