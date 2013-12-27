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


if( CHECK && typeof( window ) === 'undefined')
{
	throw new Error(
		'this code needs a browser!'
	);
}


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
		hover,
		mode,
		screensize
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	this.mode =
		mode;

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

			// TODO enhance this.path
			path =
				new Path(
					[
						'disc',
						this.reflect,
						wname
					]
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

	// TODO remove

	this.$active =
		inherit && inherit.$active;

	this.buttons =
		buttons;

	Jools.immute( this );
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
	var
		action =
			shell.bridge.action( );

	if( CHECK )
	{
		var
			discname =
				path.get( 1 );

		if( discname !== this.reflect )
		{
			throw new Error(
				'invalid discname: ' + discname
			);
		}
	}

	var
		buttonName =
			path.get( 2 );

	if( action && action.type === buttonName )
	{
		// already in this action

		return;
	}

	shell.redraw = true;

	if( action )
	{
		shell.bridge.stopAction( );
	}

	switch( buttonName )
	{
		case 'createLabel' :
		case 'createNote' :
		case 'createPortal' :

			shell.bridge.startAction( buttonName );

			return;

		case 'createRelation' :

			shell.bridge.startAction(
				'createRelation',
				'relationState',
					'start'
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
| Sets the active button
*/
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


} )( );
