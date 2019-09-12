/*
| The disc root is the master of all discs.
*/
'use strict';


tim.define( module, ( def, discs_root ) => {


if( TIM )
{
	def.attributes =
	{
		// users access to current space
		access : { type : [ 'undefined', 'string' ] },

		// currently active action
		action : { type : [ '< ../action/types' ] },

		// the current transform of controls
		controlTransform : { type : '../gleam/transform' },

		// display's device pixel ratio
		devicePixelRatio : { type : 'number' },

		// the widget hovered upon
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// currently form/disc shown
		show : { type : [ '< ../show/types' ] },

		// currently loaded space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.group =
	[
		'./main',
		'./create',
		'./zoom',
	];
}


const action_none = tim.require( '../action/none' );
const discs_base = tim.require( './base' );
const discs_create = tim.require( '../discs/create' );
const discs_main = tim.require( '../discs/main' );
const discs_zoom = tim.require( '../discs/zoom' );
const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_transform = tim.require( '../gleam/transform' );
const gruga_discs_create = tim.require( '../gruga/discs/create' );
const gruga_discs_main = tim.require( '../gruga/discs/main' );
const gruga_discs_zoom = tim.require( '../gruga/discs/zoom' );
const show_create = tim.require( '../show/create' );
const show_zoom = tim.require( '../show/zoom' );


/*
| Creates the discs root.
*/
def.static.createFromLayout =
	function(
		viewSize,          // size of the view (screen)
		show,              // form or space to show
		devicePixelRatio   // display's device pixel ratio
	)
{
	return(
		discs_root.create(
			'action', action_none.singleton,
			'controlTransform', gleam_transform.normal,
			'devicePixelRatio', devicePixelRatio,
			'show', show,
			'viewSize', viewSize,
			'group:set', 'main',
				discs_main.createFromLayout(
					gruga_discs_main.layout,
					'main',
					gleam_transform.normal,
					show,
					viewSize,
					devicePixelRatio
				),
			'group:set', 'create',
				discs_create.createFromLayout(
					gruga_discs_create.layout,
					'create',
					gleam_transform.normal,
					show,
					viewSize,
					devicePixelRatio
				),
			'group:set', 'zoom',
				discs_zoom.createFromLayout(
					gruga_discs_zoom.layout,
					'zoom',
					gleam_transform.normal,
					show,
					viewSize,
					devicePixelRatio
				)
		)
	);
};


/*
| Adjusts the discs.
*/
def.adjust.get =
	function(
		name,
		disc
	)
{
	const ct = this.controlTransform;

	const hover = discs_base.concernsHover( this.hover, disc.trace );

	const show = disc.concernsShow( this.show );

	const spaceRef = disc.concernsSpaceRef( this.spaceRef );

	const user = disc.concernsUser( this.user );

	return(
		disc.create(
			'access', this.access,
			'action', this.action,
			'controlTransform', ct,
			'devicePixelRatio', this.devicePixelRatio,
			'hover', hover,
			'mark', this.mark,
			'show', show,
			'spaceRef', spaceRef,
			'user', user,
			'viewSize', this.viewSize
		)
	);
};


/*
| Updates the glint twig.
*/
def.lazy.glint =
	function( )
{
	const arr = [ ];

	switch( this.show.timtype )
	{
		case show_create : arr.push( this.get( 'create' ).glint ); break;

		case show_zoom : arr.push( this.get( 'zoom' ).glint ); break;
	}

	arr.push( this.get( 'main' ).glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Move during a dragging operation.
*/
def.proto.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'main' ).dragMove( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).dragMove( p, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).dragMove( p, shift, ctrl );
	}
};


/*
| Start of a dragging operation.
*/
def.proto.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'main' ).dragStart( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).dragStart( p, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).dragStart( p, shift, ctrl );
	}
};


/*
| Stop of a dragging operation.
*/
def.proto.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'main' ).dragStop( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).dragStop( p, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).dragStop( p, shift, ctrl );
	}
};


/*
| Mouse wheel.
*/
def.proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'main' ).mousewheel( p, dir, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).mousewheel( p, dir, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).mousewheel( p, dir, shift, ctrl );
	}
};


/*
| Returns true if point is on the disc panel.
*/
def.proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	let hover = this.get( 'main' ).pointingHover( p, shift, ctrl );

	if( hover ) return hover;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).pointingHover( p, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).pointingHover( p, shift, ctrl );
	}
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
def.proto.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'main' ).probeClickDrag( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).probeClickDrag( p, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).probeClickDrag( p, shift, ctrl );
	}
};


/*
| Returns true if some disc accepted the click.
*/
def.proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'main' ).click( p, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'create' ).click( p, shift, ctrl );

		case show_zoom : return this.get( 'zoom' ).click( p, shift, ctrl );
	}
};


/*
| A button has been pushed.
*/
def.proto.dragStartButton =
	function(
		trace,
		shift,
		ctrl
	)
{
	return(
		this.get( trace.traceDisc.key )
		.dragStartButton( trace, shift, ctrl )
	);
};



/*
| A button has been pushed.
*/
def.proto.pushButton =
	function(
		trace,
		shift,
		ctrl
	)
{
	return(
		this.get( trace.traceDisc.key )
		.pushButton( trace, shift, ctrl )
	);
};


} );
