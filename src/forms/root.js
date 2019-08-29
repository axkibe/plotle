/*
| The form root is the master of all forms.
*/
'use strict';


tim.define( module, ( def, forms_root ) => {


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types' ] },

		// space has grid
		hasGrid : { type : [ 'undefined', 'boolean' ] },

		// space has guides
		hasGuides : { type : [ 'undefined', 'boolean' ] },

		// space has snapping on grid
		hasSnapping : { type : [ 'undefined', 'boolean' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the reference of current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.group =
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

const trace_root = tim.require( '../trace/root' );


/*
| Adjusts forms.
*/
def.adjust.get =
	function(
		name,
		form
	)
{
	const trace = forms_root.trace.appendForm( name );

	let mark = this.mark;

	if( mark && !mark.encompasses( trace ) ) mark = undefined;

	const spaceRef = form.concernsSpaceRef( this.spaceRef );

	const user = form.concernsUser( this.user );

	const hasGrid = form.concernsHasGrid( this.hasGrid );

	const hasGuides = form.concernsHasGuides( this.hasGuides );

	const hasSnapping = form.concernsHasSnapping( this.hasSnapping );

	const userSpaceList = form.concernsUserSpaceList( this.userSpaceList );

	let hover = this.hover;

	if( hover && !hover.hasTrace( trace ) ) hover = undefined;

	return(
		form.create(
			'action', this.action,
			'hasGrid', hasGrid,
			'hasGuides', hasGuides,
			'hasSnapping', hasSnapping,
			'hover', hover,
			'mark', mark,
			'spaceRef', spaceRef,
			'trace', trace,
			'user', user,
			'userSpaceList', userSpaceList,
			'viewSize', this.viewSize
		)
	);
};


/*
| Returns the hover if the form root concerns about it.
*/
def.static.concernsHover =
	( hover ) => hover && hover.traceForms ? hover : undefined;

/*
| Returns the mark if the form root concerns about it.
*/
def.static.concernsMark =
	function(
		mark
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	if( mark && mark.encompasses( forms_root.trace ) ) return mark;
};


/*
| Cycles the focus in a form
*/
def.proto.cycleFocus =
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
def.proto.dragStartButton =
	function(
		trace
	)
{
	return false;
};


/*
| A button has been pushed.
*/
def.proto.pushButton =
	function(
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( !trace.hasTrace( forms_root.trace ) ) throw new Error( );
/**/}

	// FUTURE honor shift / ctrl states
	return this.get( trace.traceForm.key ).pushButton( trace, false, false );
};


/*
| The trace into the forms root.
*/
def.staticLazy.trace =
	( ) => trace_root.singleton.appendForms;


/*
| A checkbox has been toggled.
*/
def.proto.toggleCheckbox =
	function(
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( !trace.hasTrace( forms_root.trace ) ) throw new Error( );
/**/}

	const form = this.get( trace.traceForm.key );

	form.toggleCheckbox( trace );
};


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.hover && this.hover.isEmpty ) throw new Error( );
/**/}
};


} );
