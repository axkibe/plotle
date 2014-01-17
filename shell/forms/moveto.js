/*
| The move to form.
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
| The login form
*/
var MoveTo =
Forms.MoveTo =
	function(
		tag,
		inherit,
		path,
		screensize,
		traitSet,
		mark,
		hover,
		username
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
		user;

	if( inherit )
	{
		user =
		this.user =
			inherit.user;
	}
	else
	{
		user =
		this.user =
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

					case 'user' :

						this.user =
						user =
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

	var
		isGuest =
			user === null
			||
			user.substr( 0, 7 ) === 'visitor';

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'userHomeButton' ),
				'visible',
				!isGuest,
			'trait',
				this._widgetPath( 'userHomeButton' ),
				'text',
				user + '\n' + 'home'
		);

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark,
		hover,
		username
	);
};


Jools.subclass(
	MoveTo,
	Forms.Form
);


/*
| Name of the form.
*/
MoveTo.prototype.reflect =
	'MoveTo';


/*
| The forms tree.
*/
MoveTo.prototype.tree =
	shellverse.grow( Design.MoveToForm );


/*
| A button of the form has been pushed.
*/
MoveTo.prototype.pushButton =
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
		case 'meshcraftHomeButton' :

			shell.moveToSpace(
				'meshcraft',
				'home',
				false
			);


			break;

		case 'meshcraftSandboxButton' :

			shell.moveToSpace(
				'meshcraft',
				'sandbox',
				false
			);

			break;

		case 'userHomeButton' :

			shell.moveToSpace(
				this.username,
				'home',
				false
			);

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};

})( );

