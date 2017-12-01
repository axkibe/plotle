/*
| The form root is the master of all forms.
*/
'use strict';


tim.define( module, 'form_root', ( def, form_root ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		action :
		{
			// current action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] )
		},
		hover :
		{
			// the widget hovered upon
			type : [ 'undefined', 'jion$path' ],
			prepare : 'form_root.concernsHover( hover )'
		},
		mark :
		{
			// the users mark
			type :
				require( '../visual/mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// the path of the form root
			type : 'jion$path'
		},
		spaceRef :
		{
			// the reference of current space
			type : [ 'undefined', 'ref_space' ]
		},
		user :
		{
			// currently logged in user
			type : [ 'undefined', 'user_creds' ]
		},
		userSpaceList :
		{
			// list of spaces belonging to user
			type : [ 'undefined', 'ref_spaceList' ]
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		}
	};

	def.init = [ 'twigDup' ];

	// FUTURE make a group instead of twig
	def.twig =
	[
		'form_loading',
		'form_login',
		'form_moveTo',
		'form_noAccessToSpace',
		'form_nonExistingSpace',
		'form_signUp',
		'form_space',
		'form_user',
		'form_welcome'
	];
}


/*
| Initializer.
*/
def.func._init =
	function(
		twigDup
	)
{
/**/if( CHECK )
/**/{
/**/	if( this.hover && this.hover.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	const twig =
		twigDup
		? this._twig
		: tim.copy( this._twig );

	const ranks = this._ranks;

	// FIXME make this somehow lazy

	for( let a = 0, aZ = ranks.length; a < aZ; a++ )
	{
		const name = ranks[ a ];

		const form = twig[ name ];

		const path =
			form.path
			? pass
			: this.path.append( 'twig' ).append( name );

		twig[ name ] =
			form.create(
				'action', this.action,
				'hover', this.hover,
				'mark', this.mark,
				'path', path,
				'spaceRef', this.spaceRef,
				'user', this.user,
				'userSpaceList', this.userSpaceList,
				'viewSize', this.viewSize
			);

/**/	if( CHECK )
/**/	{
/**/		if( twig[ name ].reflectName !== name ) throw new Error( );
/**/	}
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns the mark if the form root concerns a mark.
*/
def.static.concernsMark =
	mark =>
	(
		mark.containsPath( form_root.path )
		? mark
		: undefined
	);


/*
| Returns the hover path if the form root concerns about it.
*/
def.static.concernsHover =
	hover =>
	(
		hover && hover.get( 0 ) === 'form'
		? hover
		: undefined
	);


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Cycles the focus in a form
*/
def.func.cycleFocus =
	function(
		formName,
		dir
	)
{
	const form = this.get( formName );

/**/if( CHECK )
/**/{
/**/	if( !form ) throw new Error( );
/**/}

	return form.cycleFocus( dir );
};


/*
| A button has been dragStarted.
*/
def.func.dragStartButton =
	function(
		path
	)
{
	return false;
};


/*
| A button has been pushed.
*/
def.func.pushButton =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		path.length < 3
/**/		|| path.get( 0 ) !== 'form'
/**/		|| path.get( 1 ) !== 'twig'
/**/		|| !this.get( path.get( 2 ) )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		this.get( path.get( 2 ) ).pushButton(
			path,
			false, // FUTURE honor shift / ctrl states
			false
		)
	);
};


} );
