/*
| The form root is the master of all forms.
*/
'use strict';


tim.define( module, ( def, form_root ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the widget hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			prepare : 'self.concernsHover( hover )'
		},

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form root
		path : { type : 'tim.js/path' },

		// the reference of current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};


	// FUTURE make a group instead of twig
	def.twig =
	[
		'./loading',
		'./login',
		'./moveTo',
		'./noAccessToSpace',
		'./nonExistingSpace',
		'./signUp',
		'./space',
		'./user',
		'./welcome'
	];

	def.check = true;
}


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		if( this.hover && this.hover.isEmpty ) throw new Error( );
/**/	};
/**/}


/*
| Transforms forms.
*/
def.func._transform =
	function(
		name,
		form
	)
{
	const path =
		form.path
		? pass
		: this.path.append( 'twig' ).append( name );

	return(
		form.create(
			'action', this.action,
			'hover', this.hover,
			'mark', this.mark,
			'path', path,
			'spaceRef', this.spaceRef,
			'user', this.user,
			'userSpaceList', this.userSpaceList,
			'viewSize', this.viewSize
		)
	);
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns the mark if the form root concerns a mark.
|
| FIXME this is akward since path is dynamic!!!
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

