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
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] )
			},
			// FIXME this should be called simply "view"
			controlView :
			{
				comment : 'the current view of controls',
				type : [ 'undefined', 'euclid_view' ]
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
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'path of the disc',
				type : 'jion$path'
			},
			spaceRef :
			{
				comment : 'currently loaded space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			spaceView :
			{
				comment : 'the current view',
				type : 'euclid_view'
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
			}
		},
		init : [ 'twigDup' ],
		twig :
		[
			'disc_mainDisc',
			'disc_mainDisc:abstract',
			'disc_createDisc',
			'disc_createDisc:abstract'
		]
	};
}


var
	disc_jockey,
	gleam_glint_twig,
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
		aZ,
		b,
		bZ,
		disc,
		key,
		ranks,
		twig;

/**/if( CHECK )
/**/{
/**/	if( this.hover && this.hover.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	ranks = this._ranks;

	twig = twigDup ? this._twig : jion.copy( this._twig );

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
							'view', this.controlView
						)
					);
			}
		}

		twig[ key ] =
			disc.create(
				'access', this.access,
				'action', this.action,
				'controlView', this.controlView,
				'hover', this.hover,
				'mark', this.mark,
				'spaceRef', this.spaceRef,
				'spaceView', this.spaceView,
				'user', this.user
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
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
		action,
		bubble;

	bubble = this.get( 'mainDisc' ).dragStart( p, shift, ctrl );

	if( bubble ) return bubble;

	action = this.action;

	if( action && action.isCreate )
	{
		return this.get( 'createDisc' ).dragStart( p, shift, ctrl );
	}

	return;
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
		action,
		createDisc,
		glint,
		mainDisc;

	// ++ create disc ++

	// TODO inherit glint

	createDisc = this.get( 'createDisc' );

	mainDisc = this.get( 'mainDisc' );

	action = this.action;

	glint = gleam_glint_twig.create( 'key', 'disc', 'view', this.controlView );

	if( action && action.isCreate )
	{
		glint = glint.create( 'twine:set+', createDisc.glint );
	}

	// ++ main disc ++

	glint = glint.create( 'twine:set+', mainDisc.glint );

	return glint;
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
		action,
		bubble;

	bubble = this.get( 'mainDisc' ).mousewheel( p, dir, shift, ctrl );

	if( bubble ) return bubble;

	action = this.action;

	if( action && action.isCreate )
	{
		return this.get( 'createDisc' ).mousewheel( p, dir, shift, ctrl );
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
		action,
		hover;

	hover = this.get( 'mainDisc' ).pointingHover( p, shift, ctrl );

	if( hover ) return hover;

	action = this.action;

	if( action && action.isCreate )
	{
		return this.get( 'createDisc' ).pointingHover( p, shift, ctrl );
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
		action,
		start;

	start = this.get( 'mainDisc' ).click( p, shift, ctrl );

	if( start ) return start;

	action = this.action;

	if( action && action.isCreate )
	{
		return this.get( 'createDisc' ).click( p, shift, ctrl );
	}
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
	switch( path.get( 2 ) )
	{
		case 'createDisc' :

			return this.get( 'createDisc' ).pushButton( path, shift, ctrl );

		case 'mainDisc' :

			return this.get( 'mainDisc' ).pushButton( path, shift, ctrl );

		default :

			throw new Error( );
	}
};


} )( );
