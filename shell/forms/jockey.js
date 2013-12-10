/*
| The form jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms,


Forms =
	Forms || { };


/*
| Imports
*/
var
	Mark;

/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var Jockey =
Forms.Jockey =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		screensize =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a + 1 ];

				break;
		}
	}

	var
		forms =
			[
				'Login',
				'MoveTo',
				'NoAccessToSpace',
				'NonExistingSpace',
				'SignUp',
				'Space',
				'User',
				'Welcome'
			],

		mark =
			Mark.Vacant.create( );

	this._$forms =
		{ };

	var
		formNames =
		this._formNames =
			{ };

	for( var i in forms )
	{
		var
			name =
				forms[ i ],

			form =
				this._$forms[ name ] =
					Forms[ name ].create(
						'screensize',
							screensize,
						'mark',
							mark
					);

		formNames[ form.name ] =
			name;
	}
};


/*
| Returns the appropriate form
*/
Jockey.prototype.get =
	function(
		name,
		screensize
	)
{
	var
		inherit =
			this._$forms[ name ];

	if(
		!screensize.equals(
			inherit.screensize
		)
	)
	{
		this._$forms[ name ] =
			Forms[ name ].create(
				'inherit',
					inherit,
				'screensize',
					screensize
			);
	}

	return this._$forms[ name ];
};


/*
| Sets the mark
|
| TODO remove
*/
Jockey.prototype.setMark =
	function(
		name, // TODO remove
		mark
	)
{
	var
		formname =
			this._formNames[ name ];

	if( CHECK )
	{
		if( !formname )
		{
			throw new Error(
				'invalid form: ' + name
			);
		}

		if( CHECK && !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	this._$forms[ formname ] =
		Forms[ formname ].create(
			'inherit',
				this._$forms[ formname ],
			'mark',
				mark
		);
};


/*
| Cycles the focus in a form
*/
Jockey.prototype.cycleFocus =
	function(
		name,
		dir
	)
{
	var
		formname =
			this._formNames[ name ];

	if( CHECK )
	{
		if( !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return this._$forms.cycleFocus( dir );
};


/*
| A button has been pushed.
*/
Jockey.prototype.pushButton =
	function(
		path
	)
{

	var
		formname =
			this._formNames[ path.get( 0 ) ];

	if( CHECK )
	{
		if( !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return (
		this._$forms[ formname ].pushButton(
			path,
			false, // FIXME honor shift / ctrl states
			false
		)
	);
};


/*
| Sets a hovered component.
*/
Jockey.prototype.setHover =
	function(
		path
	)
{
	var
		formname =
			this._formNames[ path.get( 0 ) ];

	if( CHECK )
	{
		if( !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return (
		this._$forms[ formname ].setHover(
			path.get( 1 )
		)
	);
};


/*
| Sets the value of a form object.
*/
Jockey.prototype.setTraits =
	function(
		traitSet
	)
{
	for(
		var a = 0, aZ = traitSet.length;
		a < aZ;
		a++
	)
	{
		var
			t =
				traitSet.get( a ),

			path = t.path,

			formname =
				this._formNames[ path.get( 0 ) ],

			itemname =
				path.get( 1 );

		if( CHECK && !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}

		switch( t.key )
		{
			case 'value' :

				this._$forms[ formname ].setValue(
					itemname,
					t.val
				);

				break;

			case 'check' :

				this._$forms[ formname ].setChecked(
					itemname,
					t.val
				);

				break;

			default :

				throw new Error(
					'invalid key in setTraits: ' + t.key
				);
		}
	}
};


/*
| Sets the username
|
| TODO remove
*/
Jockey.prototype.setUsername =
	function(
		username
	)
{
	this._$forms.User.setUsername( username );

	this._$forms.Welcome.setUsername( username );

	this._$forms.MoveTo.setUsername( username );
};


/*
| Sets the space information.
*/
Jockey.prototype.setSpace =
	function(
		formname,
		spaceUser,
		spaceTag
	)
{
	this._$forms[ formname ].setSpace(
		spaceUser,
		spaceTag
	);
};


/*
| A space finished loading.
*/
Jockey.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	this._$forms.Space.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);
};


} )( );
