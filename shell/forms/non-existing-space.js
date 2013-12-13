/*
| User has no access to a space he tried to port to.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	Design,
	Jools,
	Path,
	shell,
	shellverse;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		'FORM-39606038';


/*
| The space does not exist form.
*/
var
	NonExistingSpace =
	Forms.NonExistingSpace =
		function(
			tag,
			inherit,
			screensize,
			traitSet,
			mark,
			hover
		)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'invalid tag'
			);
		}
	}

	this.spaceUser =
		inherit && inherit.spaceUser;

	this.spaceTag =
		inherit && inherit.spaceTag;

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

					case 'spaceUser' :

						this.spaceUser =
							t.val;

						break;

					case 'spaceTag' :

						this.spaceTag =
							t.val;

						break;

					default :

						throw new Error(
							'unknown trait: ' + t.key
						);
				}
			}
		}
	}

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark,
		hover
	);
};


Jools.subclass(
	NonExistingSpace,
	Forms.Form
);


/*
| Reflection.
*/
NonExistingSpace.prototype.reflect =
	'NonExistingSpace';


/*
| Path of the form.
*/
NonExistingSpace.prototype.path =
	new Path(
		[
			NonExistingSpace.prototype.reflect
		]
	);


/*
| The forms tree.
*/
NonExistingSpace.prototype.tree =
	shellverse.grow( Design.NonExistingSpaceForm );


/*
| A button of the form has been pushed.
*/
NonExistingSpace.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	if( CHECK )
	{
		// TODO
	}

	var
		buttonName =
			path.get( 1 );

	switch( buttonName )
	{
		case 'noButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		case 'yesButton' :

			shell.moveToSpace(
				this.spaceUser,
				this.spaceTag,
				true
			);

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}

	shell.redraw =
		true;
};


/*
| Sets the space information.
*/
/*
	TODO remove

NonExistingSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	this.$spaceUser =
		spaceUser;

	this.$spaceTag =
		spaceTag;

	this.setText(
		'headline',
		spaceUser +
		':' +
		spaceTag +
		' does not exist.'
	);
};
*/


} )( );
