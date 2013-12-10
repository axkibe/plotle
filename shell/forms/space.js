/*
| The user's form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	Design,
	Jools,
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
| The login form
*/
var Space =
Forms.Space =
	function(
		tag,
		inherit,
		screensize,
		traitSet,
		mark
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

	// TODO
	this.tree =
		shellverse.grow( Design.SpaceForm );

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark
	);
};


Jools.subclass(
	Space,
	Forms.Form
);


/*
| A button of the form has been pushed.
*/
Space.prototype.pushButton =
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
		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}

	shell.redraw =
		true;
};



/*
| Name of the form.
*/
Space.prototype.name =
	'space';


/*
| Finished loading a space.
*/
Space.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag
		// access
	)
{
	this.setText(
		'headline',
		spaceUser + ':' + spaceTag
	);
};

} )( );

