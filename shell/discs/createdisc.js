/*
| The creation disc.
|
| Authors: Axel Kittenberger
*/

/*
| Export
*/
var
	Discs;

Discs =
	Discs || { };


/*
| Imports
*/
var
	Action,
	Euclid,
	Jools,
	Path,
	shell,
	Widgets;


/*
| Capsule
*/
( function( ) {
'use strict';


/**/if( CHECK && typeof( window ) === 'undefined')
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}


var
	_tag =
		'DISC-11692648';


/*
| Constructor
*/
var CreateDisc =
Discs.CreateDisc =
	function(
		tag,
		inherit,
		access,
		action,
		hover,
		mark,
		mode,
		screensize,
		username
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	this.access =
		access;

	this.action =
		action;

	this.mark =
		mark;

	this.mode =
		mode;

	this.username =
		username;

	Discs.Disc.call(
		this,
		inherit,
		hover,
		screensize
	);

	var
		buttons =
			{ },

		twig =
			this._tree.twig,

		ranks =
			this._tree.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			wname =
				ranks[ r ],

			tree =
				twig[ wname ],

			path =
				this.path.append( wname ),

			focusAccent =
				CreateDisc._isActiveButton(
					action,
					wname
				);

		switch( tree.twig.type )
		{
			case 'ButtonWidget' :

				buttons[ wname ] =
					Widgets.Button.create(
						'path',
							path,
						'superFrame',
							this.frame.zeropnw,
						'inherit',
							inherit && inherit.buttons[ wname ],
						'hoverAccent',
							path.equals( hover ),
						'focusAccent',
							focusAccent,
						'tree',
							tree,
						'icons',
							this._icons
					);

					break;

			default :

				throw new Error(
					'Cannot create widget of type: ' +
						tree.twig.type
				);
		}
	}

	this.buttons =
		buttons;

	Jools.immute( this );
};


/*
| The CreateDisc is a Disc.
*/
Jools.subclass(
	CreateDisc,
	Discs.Disc
);


/*
| (Re)Creates a new disc.
*/
CreateDisc.create =
	function(
		// free strings
	)
{
	var
		a =
			0,

		aZ =
			arguments.length,

		access =
			null,

		action =
			null,

		hover =
			null,

		inherit =
			null,

		mark =
			null,

		mode =
			null,

		screensize =
			null,

		username =
			null;

	while( a < aZ )
	{
		var
			arg =
				arguments[ a++ ];

		switch( arg )
		{
			case 'access' :

				access =
					arguments[ a++ ];

				break;

			case 'action' :

				action =
					arguments[ a++ ];

				break;

			case 'hover' :

				hover =
					arguments[ a++ ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a++ ];

				break;

			case 'mark' :

				mark =
					arguments[ a++ ];

				break;

			case 'mode' :

				mode =
					arguments[ a++ ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a++ ];

				break;

			case 'username' :

				username =
					arguments[ a++ ];

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

	if( inherit )
	{
		if( access === null )
		{
			hover =
				inherit.access;
		}

		if( action === null )
		{
			action =
				inherit.action;
		}

		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		if( mark === null )
		{
			mark =
				inherit.mark;
		}

		if( mode === null )
		{
			mode =
				inherit.mode;
		}

		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}

		if( username === null )
		{
			username =
				inherit.username;
		}

		// TODO use the discs equals mode
	}

	return new CreateDisc(
		_tag,
		inherit,
		access,
		action,
		hover,
		mark,
		mode,
		screensize,
		username
	);
};




/*
| Reflection.
*/
CreateDisc.prototype.reflect =
	'CreateDisc';



/*
| Prepares the disc panels contents.
*/
CreateDisc.prototype._weave =
	function( )
{
	var fabric =
	this.$fabric =
		new Euclid.Fabric(
			this.style.width,
			this.style.height
		);

	fabric.fill(
		this.style,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var
		buttons =
			this.buttons;

	for( var buttonName in this.buttons )
	{
		buttons[ buttonName ].draw( fabric );
	}

	fabric.edge(
		this.style,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	return fabric;
};


/*
| A button of the main disc has been pushed.
*/
CreateDisc.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	var
/**/		discname =
/**/			path.get( 1 );
/**/
/**/	if( discname !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'invalid discname: ' + discname
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 2 );

	shell.redraw =
		true;

	switch( buttonName )
	{
		case 'CreateLabel' :

			shell.setAction(
				Action.CreateGeneric.create(
					'itemType',
						'Label',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'CreateNote' :

			shell.setAction(
				Action.CreateGeneric.create(
					'itemType',
						'Note',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'CreatePortal' :

			shell.setAction(
				Action.CreateGeneric.create(
					'itemType',
						'Portal',
					'model',
						null,
					'start',
						null,
					'transItem',
						null
				)
			);

			return;

		case 'CreateRelation' :

			shell.setAction(
				Action.CreateRelation.create(
					'fromItemPath',
						Path.empty,
					'pan',
						Euclid.Point.zero,
					'relationState',
						'start',
					'start',
						Euclid.Point.zero,
					'toPoint',
						Euclid.Point.zero,
					'toItemPath',
						Path.empty
				)
			);

			return;

		default :

			throw new Error(
				'unknown button:' + buttonName
			);
	}

};


/*
| Draws the disc panel.
*/
CreateDisc.prototype.draw =
	function(
		fabric
	)
{
	fabric.drawImage(
		'image',
			this._weave( ),
		'x',
			0,
		'y',
			Jools.half(
				this.screensize.y - this.style.height
			)
	);
};


/*
| Returns true if point is on the disc panel.
*/
CreateDisc.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	// shortcut if p is not near the panel
	if(
		!this.frame.within(
			null,
			p
		)
	)
	{
		return null;
	}

	var
		fabric =
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	// ENHANCE optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// it's on the disc
	var
		buttons =
			this.buttons;

	for( var buttonName in buttons )
	{
		var
			reply =
				buttons[ buttonName ]
					.pointingHover(
						pp,
						shift,
						ctrl
					);

		if( reply )
		{
			return reply;
		}
	}

	return null;
};


/*
| Returns true if point is on this panel.
*/
CreateDisc.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	// shortcut if p is not near the panel
	if(
		!this.frame.within(
			null,
			p
		)
	)
	{
		return null;
	}

	var
		fabric =
			this._weave( ),

		pp =
			p.sub( this.frame.pnw );

	// FIXME Optimize by reusing the latest path of this.$fabric
	if(
		!fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return null;
	}

	// this is on the disc
	var
		buttons =
			this.buttons;

	for( var buttonName in buttons )
	{
		var r =
			buttons[ buttonName ]
				.pointingStart(
					pp,
					shift,
					ctrl
				);

		if( r )
		{
			return r;
		}
	}

	return false;
};


/*
| User is inputing text.
*/
CreateDisc.prototype.input =
	function(
		// text
	)
{
	return;
};


/*
| Cycles the focus
*/
CreateDisc.prototype.cycleFocus =
	function(
		// dir
	)
{
	throw new Error(
		'not implemented'
	);
};


/*
| User is pressing a special key.
*/
CreateDisc.prototype.specialKey =
	function(
	//	key,
	//	shift,
	//	ctrl
	)
{
	// not implemented
};


/*
| Returns true if the button called 'wname'
| should be highlighted for current 'action'
*/
CreateDisc._isActiveButton =
	function(
		action,  // the action
		wname    // the widget name
	)
{
	switch( action.reflect )
	{
		case 'CreateGeneric' :

			switch( action.itemType )
			{
				case 'Note' :

					return wname === 'CreateNote';

				case 'Label' :

					return wname === 'CreateLabel';

				case 'Portal' :

					return wname === 'CreatePortal';

				default :

					return false;
			}

/**/		if( CHECK )
/**/		{
/**/			throw new Error(
/**/				'invalid execution point reached'
/**/			);
/**/		}

			break;

		case 'CreateRelation' :

			return wname === 'CreateRelation';

		default :

			return false;
	}
};


/*
| Sets the active button
*/
/*
XXX remove
CreateDisc.prototype.setActive =
	function(
		active
	)
{
	if( this.$active === active )
	{
		return;
	}

	this.$fabric =
		null;

	if( this.buttons[ this.$active ] )
	{
		this.buttons[ this.$active ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ this.$active ],
				'focusAccent',
					false
			);
	}

	this.$active =
		active;

	if( this.buttons[ active ] )
	{
		this.buttons[ active ] =
			Widgets.Button.create(
				'inherit',
					this.buttons[ active ],
				'focusAccent',
					true
			);
	}

	shell.redraw =
		true;
};
*/


} )( );
