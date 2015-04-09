/*
| The disc jockey is the master of all discs.
*/


var
	disc_jockey,
	jools;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'disc_jockey',
		attributes :
		{
			access :
			{
				comment : 'users access to current space',
				type : 'string',
				defaultValue : 'undefined'
			},
			action :
			{
				comment : 'currently active action',
				type : require( '../typemaps/action' ),
				defaultValue : 'undefined'
			},
			hover :
			{
				comment : 'the widget hovered upon',
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'disc_jockey.concernsMark( mark )',
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined'
			},
			mode :
			{
				comment : 'current mode the UI is in',
				type : 'string'
			},
			path :
			{
				comment : 'path of the disc',
				type : 'jion_path'
			},
			spaceRef :
			{
				comment : 'currently loaded space',
				type : 'fabric_spaceRef',
				defaultValue : 'undefined'
			},
			user :
			{
				comment : 'currently logged in user',
				type : 'user_creds',
				defaultValue : 'undefined'
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view'
			}
		},
		init : [ ],
		twig :
		[
			'disc_mainDisc',
			'disc_mainDisc:abstract',
			'disc_createDisc',
			'disc_createDisc:abstract'
		]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = disc_jockey.prototype;


/*
| Returns the mark if the form jockey concerns a mark.
|
| FIXME go into markItemPath
*/
disc_jockey.concernsMark =
	function(
		mark
	)
{
	return mark;
};


/*
| Initializes the disc jockey.
*/
prototype._init =
	function( )
{
	var
		a,
		aZ,
		name,
		proto,
		ranks,
		twig;

/**/if( CHECK )
/**/{
/**/	if( this.hover && this.hover.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	ranks = this.ranks;

	// FIXME do not copy when inherit.twig !== this.twig
	twig = jools.copy( this.twig );

	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		name = ranks[ a ];

		proto = twig[ name ];

		twig[ name ] =
			proto.create(
				'access', this.access,
				'action', this.action,
				'hover', this.hover,
				'mark', this.mark,
				'mode', this.mode,
				'view', this.view,
				'spaceRef', this.spaceRef,
				'user', this.user
			);
	}

	this.twig = twig;
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

	bubble = this.twig.mainDisc.dragStart( p, shift, ctrl );

	if( bubble ) return bubble;

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.dragStart( p, shift, ctrl );
	}

	return;
};


/*
| Dispalys the disc panel.
*/
prototype.draw =
	function(
		display
	)
{
	if( this.mode === 'create' )
	{
		this.twig.createDisc.draw( display );
	}

	this.twig.mainDisc.draw( display );
};


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

	bubble = this.twig.mainDisc.mousewheel( p, dir, shift, ctrl );

	if( bubble ) return bubble;

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.mousewheel( p, dir, shift, ctrl );
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

	hover = this.twig.mainDisc.pointingHover( p, shift, ctrl );

	if( hover )
	{
		return hover;
	}

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.pointingHover( p, shift, ctrl );
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

	start = this.twig.mainDisc.click( p, shift, ctrl );

	if( start )
	{
		return start;
	}

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.click( p, shift, ctrl );
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

			return this.twig.createDisc.pushButton( path, shift, ctrl );

		case 'mainDisc' :

			return this.twig.mainDisc.pushButton( path, shift, ctrl );

		default :

			throw new Error( );
	}
};


} )( );
