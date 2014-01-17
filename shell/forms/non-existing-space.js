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
	shellverse,
	TraitSet;


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
			path,
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

	this.path =
		path;

	var
		spaceUser =
			null,

		spaceTag =
			null;

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

						spaceUser =
							t.val;

						break;

					case 'spaceTag' :

						spaceTag =
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

	if( inherit )
	{
		if( spaceUser === null )
		{
			spaceUser =
				inherit.spaceUser;
		}

		if( spaceTag === null )
		{
			spaceTag =
				inherit.spaceTag;
		}
	}

	this.spaceUser =
		spaceUser;

	this.spaceTag =
		spaceTag;

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'headline' ),
				'text',
				spaceUser +
					':' +
					spaceTag +
					' does not exist.'
		);

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
	Path.empty.append(
		NonExistingSpace.prototype.reflect
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

/**/if( CHECK )
/**/{
/**/	if( path.get( 1 ) !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'path mismatch'
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 2 );

	switch( buttonName )
	{
		case 'noButton' :

			shell.setMode( 'Normal' );

			break;

		case 'yesButton' :

			shell.moveToSpace(
				this.spaceUser,
				this.spaceTag,
				true
			);

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}

	shell.redraw =
		true;
};


} )( );
