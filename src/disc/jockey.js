/*
| The disc jockey is the master of all discs.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'disc_jockey',
		attributes :
		{
			access :
			{
				comment : 'users access to current space',
				type : [ 'undefined', 'string' ]
			},
			action :
			{
				comment : 'currently active action',
				type :
					require( '../action/typemap' )
					.concat( [ 'undefined' ] )
			},
			controlTransform :
			{
				comment : 'the current transform of controls',
				type : 'gleam_transform'
			},
			hover :
			{
				comment : 'the widget hovered upon',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'disc_jockey.concernsMark( mark )',
				type :
					require( '../visual/mark/typemap' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'path of the disc',
				type : 'jion$path'
			},
			show :
			{
				comment : 'currently form/disc shown',
				type : require ( '../show/typemap' )
			},
			spaceRef :
			{
				comment : 'currently loaded space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'gleam_size'
			}
		},
		init : [ 'twigDup' ],
		twig :
		[
			'disc_mainDisc',
			'disc_mainDisc:abstract',
			'disc_createDisc',
			'disc_createDisc:abstract',
			'disc_zoomDisc',
			'disc_zoomDisc:abstract'
		]
	};
}


var
	disc_jockey,
	gleam_glint_ray,
	jion;

/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = disc_jockey.prototype;


/*
| Returns the mark if the disc jockey concerns a mark.
*/
disc_jockey.concernsMark =
	function(
		mark
	)
{
	// discs concerns about all, since they provide
	// additional information.

	return mark;
};


/*
| Returns the hover path if the disc jockey concerns about it.
*/
disc_jockey.concernsHover =
	function(
		hover
	)
{
	return(
		hover && hover.get( 0 ) === 'disc'
		? hover
		: undefined
	);
};


/*
| Initializes the disc jockey.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		a,
		access,
		aZ,
		b,
		bZ,
		disc,
		key,
		ranks,
		show,
		twig;

/**/if( CHECK )
/**/{
/**/	if( this.hover && this.hover.isEmpty ) throw new Error( );
/**/}

	ranks = this._ranks;

	twig = twigDup ? this._twig : jion.copy( this._twig );

	access = this.access;

	show = this.show;

	// FIXME lift other this. variables from loop

	for( a = 0, aZ = ranks.length; a < aZ; a++ )
	{
		key = ranks[ a ];

		disc = twig[ key ];

		if( disc.isAbstract )
		{
			for( b = 0, bZ = disc.length; b < bZ; b++ )
			{
				disc =
					disc.abstract(
						'twig:set',
						disc.getKey( b ),
						disc.atRank( b ).create(
							'transform', this.controlTransform
						)
					);
			}
		}

		twig[ key ] =
			disc.create(
				'access', access,
				'action', this.action,
				'controlTransform', this.controlTransform,
				'hover', this.hover,
				'mark', this.mark,
				'show', show,
				'spaceRef', this.spaceRef,
				'user', this.user,
				'viewSize', this.viewSize
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*
| Move during a dragging operation.
*/
prototype.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble;

	bubble = this.get( 'mainDisc' ).dragMove( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).dragMove( p, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).dragMove( p, shift, ctrl );
	}
};


/*
| Start of a dragging operation.
*/
prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble;

	bubble = this.get( 'mainDisc' ).dragStart( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).dragStart( p, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).dragStart( p, shift, ctrl );
	}
};


/*
| Stop of a dragging operation.
*/
prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble;

	bubble = this.get( 'mainDisc' ).dragStop( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).dragStop( p, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).dragStop( p, shift, ctrl );
	}
};


/*
| Updates the glint twig.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		gLen,
		gRay;

	gRay = [ ];

	gLen = 0;

	switch( this.show.reflect )
	{
		case 'show_create' :

			gRay[ gLen++ ] = this.get( 'createDisc' ).glint;

			break;

		case 'show_zoom' :

			gRay[ gLen++ ] = this.get( 'zoomDisc' ).glint;

			break;
	}


	gRay[ gLen++ ] = this.get( 'mainDisc' ).glint;

	return gleam_glint_ray.create( 'ray:init', gRay );
}
);



/*
| Mouse wheel.
*/
prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	var
		bubble;

	bubble = this.get( 'mainDisc' ).mousewheel( p, dir, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).mousewheel( p, dir, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).mousewheel( p, dir, shift, ctrl );
	}


	return;
};


/*
| Returns true if point is on the disc panel.
*/
prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		hover;

	hover = this.get( 'mainDisc' ).pointingHover( p, shift, ctrl );

	if( hover ) return hover;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).pointingHover( p, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).pointingHover( p, shift, ctrl );
	}
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
prototype.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble;

	bubble = this.get( 'mainDisc' ).probeClickDrag( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).probeClickDrag( p, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).probeClickDrag( p, shift, ctrl );
	}
};


/*
| Returns true if point is on this panel.
*/
prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		start;

	start = this.get( 'mainDisc' ).click( p, shift, ctrl );

	if( start ) return start;

	switch( this.show.reflect )
	{
		case 'show_create' :

			return this.get( 'createDisc' ).click( p, shift, ctrl );

		case 'show_zoom' :

			return this.get( 'zoomDisc' ).click( p, shift, ctrl );
	}
};


/*
| A button of the main disc has been pushed.
*/
prototype.dragStartButton =
	function(
		path,
		shift,
		ctrl
	)
{
	var
		discName;

	discName = path.get( 2 );

	return this.get( discName ).dragStartButton( path, shift, ctrl );
};



/*
| A button of the main disc has been pushed.
*/
prototype.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
	var
		discName;

	discName = path.get( 2 );

	return this.get( discName ).pushButton( path, shift, ctrl );
};


} )( );
