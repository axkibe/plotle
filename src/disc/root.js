/*
| The disc root is the master of all discs.
*/
'use strict';


tim.define( module, ( def, disc_root ) => {


const gleam_glint_list = require( '../gleam/glint/list' );

const show_create = require( '../show/create' );

const show_zoom = require( '../show/zoom' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// users access to current space
		access : { type : [ 'undefined', 'string' ] },

		// currently active action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the current transform of controls
		controlTransform : { type : '../gleam/transform' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		mark :
		{
			// the users mark
			prepare : 'self.concernsMark( mark )',
			type : [ '< ../visual/mark/types', 'undefined' ]
		},

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
		'./mainDisc',
		'./createDisc',
		'./zoomDisc',
	];
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns the mark if the disc root concerns a mark.
*/
def.static.concernsMark =
	function(
		mark
	)
{
	// discs concerns about all, since they provide
	// additional information.

	return mark;
};


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
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		const hover = this.hover;
/**/
/**/		if( hover && hover.isEmpty ) throw new Error( );
/**/	};
/**/}


/*
| Transforms the discs.
*/
def.transform.get =
	function(
		name,
		disc
	)
{
	const ct = this.controlTransform;

	return(
		disc.create(
			'access', this.access,
			'action', this.action,
			'controlTransform', ct,
			'hover', this.hover,
			'mark', this.mark,
			'show', this.show,
			'spaceRef', this.spaceRef,
			'user', this.user,
			'viewSize', this.viewSize
		)
	);
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Updates the glint twig.
*/
def.lazy.glint =
	function( )
{
	const arr = [ ];

	switch( this.show.timtype )
	{
		case show_create : arr.push( this.get( 'createDisc' ).glint ); break;

		case show_zoom : arr.push( this.get( 'zoomDisc' ).glint ); break;
	}

	arr.push( this.get( 'mainDisc' ).glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Move during a dragging operation.
*/
def.func.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).dragMove( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).dragMove( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).dragMove( p, shift, ctrl );
	}
};


/*
| Start of a dragging operation.
*/
def.func.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).dragStart( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).dragStart( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).dragStart( p, shift, ctrl );
	}
};


/*
| Stop of a dragging operation.
*/
def.func.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).dragStop( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).dragStop( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).dragStop( p, shift, ctrl );
	}
};



/*
| Mouse wheel.
*/
def.func.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).mousewheel( p, dir, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).mousewheel( p, dir, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).mousewheel( p, dir, shift, ctrl );
	}
};


/*
| Returns true if point is on the disc panel.
*/
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	let hover = this.get( 'mainDisc' ).pointingHover( p, shift, ctrl );

	if( hover ) return hover;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).pointingHover( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).pointingHover( p, shift, ctrl );
	}
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
def.func.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).probeClickDrag( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).probeClickDrag( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).probeClickDrag( p, shift, ctrl );
	}
};


/*
| Returns true if some disc accepted the click.
*/
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).click( p, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).click( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).click( p, shift, ctrl );
	}
};


/*
| A button of the main disc has been pushed.
*/
def.func.dragStartButton =
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
def.func.pushButton =
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
