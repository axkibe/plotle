/*
| The disc root is the master of all discs.
*/
'use strict';


tim.define( module, ( def, disc_root ) => {


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

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// path of the disc
		path : { type : 'tim.js/path' },

		// currently form/disc shown
		show : { type : [ '< ../show/types' ] },

		// currently loaded space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	// FUTURE make a group instead of a twig
	def.twig =
	[
		'./main',
		'./create',
		'./zoom',
	];
}


const disc_disc = tim.require( './disc' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const show_create = tim.require( '../show/create' );

const show_zoom = tim.require( '../show/zoom' );


/*
| Returns the hover path if the disc root concerns about it.
*/
def.static.concernsHover =
	function(
		hover
	)
{
	// FUTURE beautify
	return(
		hover && hover.get( 0 ) === 'disc'
		? hover
		: undefined
	);
};


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		const hover = this.hover;
/**/
/**/		if( hover && hover.isEmpty ) throw new Error( );
/**/	};
/**/}


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

	const hover = disc_disc.concernsHover( this.hover, disc.path );

	const show = disc.concernsShow( this.show );

	const spaceRef = disc.concernsSpaceRef( this.spaceRef );

	const user = disc.concernsUser( this.user );

	return(
		disc.create(
			'access', this.access,
			'action', this.action,
			'controlTransform', ct,
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
| A button of the main disc has been pushed.
*/
def.proto.dragStartButton =
	function(
		path,
		shift,
		ctrl
	)
{
	const discName = path.get( 2 );

	return this.get( discName ).dragStartButton( path, shift, ctrl );
};



/*
| A button of the main disc has been pushed.
*/
def.proto.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
	const discName = path.get( 2 );

	return this.get( discName ).pushButton( path, shift, ctrl );
};


} );
