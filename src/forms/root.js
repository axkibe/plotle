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

		// display's device pixel ratio
		devicePixelRatio : { type : 'number' },

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


const action_none = tim.require( '../action/none' );
const forms_loading = tim.require( './loading' );
const forms_login = tim.require( './login' );
const forms_moveTo = tim.require( './moveTo' );
const forms_noAccessToSpace = tim.require( './noAccessToSpace' );
const forms_nonExistingSpace = tim.require( './nonExistingSpace' );
const forms_signUp = tim.require( './signUp' );
const forms_space = tim.require( './space' );
const forms_user = tim.require( './user' );
const forms_welcome = tim.require( './welcome' );
const gleam_size = tim.require( '../gleam/size' );
const gleam_transform = tim.require( '../gleam/transform' );
const gruga_forms_loading = tim.require( '../gruga/forms/loading' );
const gruga_forms_login = tim.require( '../gruga/forms/login' );
const gruga_forms_moveTo = tim.require( '../gruga/forms/moveTo' );
const gruga_forms_noAccessToSpace = tim.require( '../gruga/forms/noAccessToSpace' );
const gruga_forms_nonExistingSpace = tim.require( '../gruga/forms/nonExistingSpace' );
const gruga_forms_signUp = tim.require( '../gruga/forms/signUp' );
const gruga_forms_space = tim.require( '../gruga/forms/space' );
const gruga_forms_user = tim.require( '../gruga/forms/user' );
const gruga_forms_welcome = tim.require( '../gruga/forms/welcome' );
const trace_root = tim.require( '../trace/root' );
const widget_factory = tim.require( '../widget/factory' );


/*
| Creates the forms root.
*/
def.static.createFromLayout =
	function(
		viewSize,         // display's view size
		devicePixelRatio  // display's device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/	if( viewSize.timtype !== gleam_size ) throw new Error( );
/**/	if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	const formLayouts =
	{
		loading : [ gruga_forms_loading.layout, forms_loading ],
		login : [ gruga_forms_login.layout, forms_login ],
		moveTo : [ gruga_forms_moveTo.layout, forms_moveTo ],
		noAccessToSpace : [ gruga_forms_noAccessToSpace.layout, forms_noAccessToSpace ],
		nonExistingSpace : [ gruga_forms_nonExistingSpace.layout, forms_nonExistingSpace ],
		signUp : [ gruga_forms_signUp.layout, forms_signUp ],
		space : [ gruga_forms_space.layout, forms_space ],
		user : [ gruga_forms_user.layout, forms_user ],
		welcome : [ gruga_forms_welcome.layout, forms_welcome ],
	};

	let forms = { };

	// FIXME move this from layout creation to forms.root

	for( let name in formLayouts )
	{
		const entry = formLayouts[ name ];

		const layout = entry[ 0 ];

		const formTrace = trace_root.singleton.appendForms.appendForm( name );

		const twig = { };

		for( let wKey of layout.keys )
		{
			const wLayout = layout.get( wKey );

			const trace = formTrace.appendWidget( wKey );

			twig[ wKey ] =
				widget_factory.createFromLayout(
					wLayout,
					trace,
					gleam_transform.normal,
					devicePixelRatio
				);
		}

		forms[ name ] =
			entry[ 1 ].create(
				'action', action_none.singleton,
				'devicePixelRatio', devicePixelRatio,
				'trace', formTrace,
				'viewSize', viewSize,
				'twig:init', twig, layout.keys
			);
	}

	return(
		forms_root.create(
			'action', action_none.singleton,
			'devicePixelRatio', devicePixelRatio,
			'group:init', forms,
			'viewSize', viewSize
		)
	);
};


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
			'devicePixelRatio', this.devicePixelRatio,
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
