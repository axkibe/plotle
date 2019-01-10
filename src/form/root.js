/*
| The form root is the master of all forms.
*/
'use strict';


tim.define( module, ( def, form_root ) => {


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// space has grid
		hasGrid : { type : [ 'undefined', 'boolean' ] },

		// space has snapping on grid
		hasSnapping : { type : [ 'undefined', 'boolean' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

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
}


const form_form = require( './form' );

const tim_path = tim.import( 'tim.js', 'path' );


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
def.transform.get =
	function(
		name,
		form
	)
{
	const path = form.path || this.path.append( 'twig' ).append( name );

	const mark = form_form.concernsMark( this.mark, path );

	const spaceRef = form.concernsSpaceRef( this.spaceRef );

	const user = form.concernsUser( this.user );

	const hasGrid = form.concernsHasGrid( this.hasGrid );

	const hasSnapping = form.concernsHasSnapping( this.hasSnapping );

	const userSpaceList = form.concernsUserSpaceList( this.userSpaceList );

	return(
		form.create(
			'action', this.action,
			'hasGrid', hasGrid,
			'hasSnapping', hasSnapping,
			'hover', this.hover,
			'mark', mark,
			'path', path,
			'spaceRef', spaceRef,
			'user', user,
			'userSpaceList', userSpaceList,
			'viewSize', this.viewSize
		)
	);
};


/*
| Path of the form root
*/
def.staticLazy.path = ( ) => tim_path.empty.append( 'form' );


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

/*
| Returns the mark if the form root concerns about it.
*/
def.static.concernsMark =
	mark =>
	(
		mark && mark.containsPath( form_root.path )
		? mark
		: undefined
	);


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


/*
| A checkbox has been toggled.
*/
def.func.toggleCheckbox =
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

	const formKey = path.get( 2 );

	const form = this.get( formKey );

	if( !form.toggleCheckbox )
	{
		const widgetKey = path.get( 4 );

		const checked = form.get( widgetKey ).checked;

		root.setPath( path.append( 'checked' ), !checked );

		return;
	}

	form.toggleCheckbox( path );
};


} );

