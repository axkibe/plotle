/*
| The creation disc.
|
| Authors: Axel Kittenberger
*/

/*
| Export
*/
var Disc;
Disc = Disc || { };


/*
| Imports
*/
var config;
var Curve;
var Dash;
var Design;
var Euclid;
var Jools;
var Proc;
var shell;
var theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined')
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor
*/
var CreateDisc = Disc.CreateDisc =
	function(
		screensize
	)
{
	this.screensize = screensize;
	this.name = 'create';

	var style = this._style = theme.disc.create;

	var width  = this.width  = style.width;
	var height = this.height = style.height;

	var ew = style.ellipse.width;
	var eh = style.ellipse.height;

	this.pnw = new Euclid.Point(
		0,
		Jools.half( this.screensize.y - this.height )
	);

	this.pse = this.pnw.add(
		width,
		height
	);


	this.silhoutte = new Euclid.Ellipse(
		new Euclid.Point(
			width - 1 - ew,
			0 - Jools.half( eh - height )
		),
		new Euclid.Point(
			width - 1,
			height + Jools.half( eh - height )
		),
		'gradientPC', new Euclid.Point(
			-600,
			Jools.half( height )
		),
		'gradientR0',  0,
		'gradientR1',  650
	);

	this.buttons =
		Jools.immute(
			{
				note :
					new Disc.DiscButton(
						this,
						'note'
					),

				label :
					new Disc.DiscButton(
						this,
						'label'
					),

				relation :
					new Disc.DiscButton(
						this,
						'relation'
					),

				portal :
					new Disc.DiscButton(
						this,
						'portal'
					)
			}
		);

	this.$hover  = null;
};



/*
| Force clears all caches.
*/
CreateDisc.prototype.knock =
	function( )
{
	this.$fabric = null;
};


/*
| Prepares the disc panels contents.
*/
CreateDisc.prototype._weave =
	function( )
{
	var fabric = this.$fabric = new Euclid.Fabric(
		this.width,
		this.height
	);

	fabric.fill(
		this._style.fill,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var buttons = this.buttons;

	var action = shell.bridge.action( );

	for( var name in this.buttons )
	{
		var button = buttons[ name ];

		button.draw(
			fabric,
			this.buttonMatchesAction( button.name, action ),
			this.$hover === name
		);
	}

	fabric.edge(
		this._style.edge,
		this.silhoutte,
		'sketch',
		Euclid.View.proper
	);

	if( config.debug.drawBoxes )
	{
		fabric.paint(
			Dash.getStyle( 'boxes' ),
			new Euclid.Rect(
				'pse',
				new Euclid.Point( this.width - 1, this.height - 1)
			),
			'sketch',
			Euclid.View.proper
		);
	}

	return fabric;
};

/*
| TODO
*/
CreateDisc.prototype.buttonMatchesAction =
	function(
		buttonName, action
	)
{
	if( !action )
	{
		return false;
	}

	switch( buttonName )
	{
		case 'note' :
			return action.type === 'CreateNote';

		case 'label' :
			return action.type === 'CreateLabel';

		case 'relation' :
			return action.type === 'CreateRelation';

		case 'portal' :
			return action.type === 'CreatePortal';

		default :
			throw new Error( 'unknown button:' + buttonName );
	}
};


/*
| Returns the create mode associated with a button
*/
/*
CreateDisc.prototype.getCreateOfButton =
	function(
		buttonName
	)
{
	switch( buttonName )
	{
		case 'note' :
			return 'Note';

		case 'label' :
			return 'Label';

		case 'relation' :
			return 'Relation';

		case 'portal' :
			return 'Portal';

		default :
			throw new Error( 'unknown button:' + buttonName );
	}
};
*/

/*
| A button of the main disc has been pushed.
*/
CreateDisc.prototype.pushButton =
	function(
		buttonName
	)
{
	var action = shell.bridge.action( );

	if ( this.buttonMatchesAction( buttonName, action ) )
	{
		return;
	}

	shell.redraw = true;

	if ( action ) {
		shell.bridge.stopAction( );
	}

	switch( buttonName )
	{
		case 'note' :
			shell.bridge.startAction(
				'CreateNote',
				'space'
			);
			return;

		case 'label' :
			shell.bridge.startAction(
				'CreateLabel',
				'space'
			);
			return;

		case 'relation' :
			shell.bridge.startAction(
				'CreateRelation',
				'space',
				'relationState', 'start'
			);
			return;

		case 'portal' :
			shell.bridge.startAction(
				'CreatePortal',
				'space'
			);
			return;

		default :
			throw new Error( 'unknown button:' + buttonName );
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
		'image', this._weave( ),
		'x', 0,
		'y', Jools.half( this.screensize.y - this.height )
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
	var pnw = this.pnw;
	var pse = this.pse;

	// shortcut if p is not near the panel
	if(
		p === null ||
		p.y < pnw.y ||
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		return this.setHover( null );
	}

	var fabric = this._weave();

	var pp = p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric
	if( !fabric.withinSketch(
			this.silhoutte,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return this.setHover( null );
	}

	// this is on the disc
	var buttons = this.buttons;

	var cursor = null;
	for( var name in buttons )
	{
		cursor = buttons[ name ].
			pointingHover( pp, shift, ctrl );

		if ( cursor )
			{ break; }
	}

	if ( cursor === null )
	{
		this.setHover( null );
	}

	return cursor || 'default';
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
	var pnw = this.pnw;
	var pse = this.pse;

	// shortcut if p is not near the panel
	if(
		p.y < pnw.y ||
		p.y > pse.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
	{
		return null;
	}

	var fabric = this._weave();

	var pp = p.sub(pnw);

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
	var buttons = this.buttons;

	for( var name in buttons )
	{
		var r =
			buttons[ name ].
			pointingStart(
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
	// TODO
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
	throw new Error( 'TODO' );
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
	// TODO
};


/*
| Clears caches.
*/
CreateDisc.prototype.poke =
	function( )
{
	this.$fabric = null;
	shell.redraw = true;
};


/*
| Sets the hovered component.
*/
CreateDisc.prototype.setHover =
	function(
		name
	)
{
	if( this.$hover === name )
	{
		return null;
	}

	this.$fabric = null;
	this.$hover  = name;

	shell.redraw = true;
};


} )( );
