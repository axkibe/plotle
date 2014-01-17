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
	Jools,
	Mark,
	Path;

/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		'FORM-JOCKEY-42381321',

	_formList =
		Object.freeze(
			[
				'Login',
				'MoveTo',
				'NoAccessToSpace',
				'NonExistingSpace',
				'SignUp',
				'Space',
				'User',
				'Welcome'
			]
		);


/*
| The master of forms.
*/
var Jockey =
Forms.Jockey =
	function(
		tag,
		inherit,
		screensize,
		traitSet,
		mark,
		hover
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/
/**/	if( !hover || hover.reflect !== 'Path' )
/**/	{
/**/		throw new Error(
/**/			'invalid hover'
/**/		);
/**/	}
/**/
/**/	if( !mark )
/**/	{
/**/		throw new Error(
/**/			'invalid mark'
/**/		);
/**/	}
/**/}

	this.mark =
		mark;

	this.hover =
		hover;

	this.path =
		Path.empty.append( 'forms' );

	this.screensize =
		screensize;

	var
		forms =
			{ };

	for( var i in _formList )
	{
		var
			name =
				_formList[ i ],


			path =
				inherit ?
					inherit._forms[ name ].path
					:
					this.path.append( name );

			forms[ name ] =
				Forms.Form.create(
					'name',
						name,
					'inherit',
						inherit && inherit._forms[ name ],
					'path',
						path,
					'screensize',
						screensize,
					'traitSet',
						traitSet,
					'mark',
						mark,
					'hover',
						hover.isEmpty || !path.subPathOf( hover ) ?
							Path.empty
							:
							hover
				);

		if( CHECK )
		{
			if( forms[ name ].reflect !== name )
			{
				throw new Error(
					'form reflextion mismatch: ' +
						forms[ name ].reflect + ' !== ' + name
				);
			}
		}
	}

	this._forms =
		Jools.immute( forms );

	Jools.immute( this );
};


/*
| The forms path
*/
Jockey.path =
Jockey.prototype.path =
	Path.empty.append( 'forms' );


/*
| Creates a new form jockey.
*/
Jockey.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		hover =
			null,

		mark =
			null,

		screensize =
			null,

		traitSet =
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

			case 'hover' :

				hover =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				traitSet =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument'
				);
		}
	}

	if( mark )
	{
		mark =
			Jockey.concernsMark(
				mark
			);
	}

	if( inherit )
	{
		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}

		if( mark === null )
		{
			mark =
				inherit.mark;
		}

		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		if(
			traitSet === null
			&&
			screensize.equals( inherit.screensize )
			&&
			mark.equals( inherit.mark )
			&&
			hover.equals( inherit.hover )
		)
		{
			return inherit;
		}
	}

	return (
		new Jockey(
			_tag,
			inherit,
			screensize,
			traitSet,
			mark,
			hover
		)
	);
};


/*
| Returns the mark if the form jockey concerns a mark.
*/
Jockey.concernsMark =
	function(
		mark
	)
{
	if(
		mark.containsPath(
			Jockey.path
		)
	)
	{
		return mark;
	}
	else
	{
		return Mark.Vacant.create( );
	}
};


/*
| Returns the appropriate form.
*/
Jockey.prototype.get =
	function(
		name
	)
{
	return this._forms[ name ];
};


/*
| Cycles the focus in a form
*/
Jockey.prototype.cycleFocus =
	function(
		formname,
		dir
	)
{
/**/if( CHECK )
/**/{
/**/	if( !this._forms[ formname ] )
/**/	{
/**/		throw new Error(
/**/			'invalid formname: ' + formname
/**/		);
/**/	}
/**/}

	return this._forms.cycleFocus( dir );
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
			path.get( 1 );

/**/if( CHECK )
/**/{
/**/	if( !this._forms[ formname ] )
/**/	{
/**/		throw new Error(
/**/			'invalid formname: ' + formname
/**/		);
/**/	}
/**/}

	return (
		this._forms[ formname ].pushButton(
			path,
			false, // FIXME honor shift / ctrl states
			false
		)
	);
};


} )( );
