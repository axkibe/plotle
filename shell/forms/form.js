/*
| A form
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


/*
| Imports
*/
var config;
var Caret;
var Curve;
var Design;
var Euclid;
var Jools;
//var Proc;
var Sign;
var shell;
var system;
var theme;
var Tree;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined')
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor
*/
var Form =
Forms.Form =
	function(
		// free strings
	)
{
	var fabric =
	this.fabric =
		system.fabric;

	this.iframe =
		new Euclid.Rect(
			'pse',
			new Euclid.Point(
				fabric.width,
				fabric.height
			)
		);

	var tree =
	this.tree =
		new Tree(
			this.layout,
			Forms.LayoutPattern
		);

	// hinder direct access of the layout
	this.layout =
		null;

	// the caret or a caret less component
	// having the focus (for example a button)
	this.$caret =
		new Caret(
			null,
			null,
			false
		);

	// all components of the form
	this.$sub =
		{ };

	var inherit =
		null;

	// the component the pointer is hovering above
	this.$hover =
		inherit ? inherit.$hover : null;

	var root =
		tree.root;

	var ranks =
		root.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var name =
			ranks[ a ];

		var twig =
			root.copse[ name ];

		this.$sub[ name ] =
			this.newComponent(
				name,
				twig,
				inherit && inherit.$sub[ name ]
			);
	}
};


/*
| Creates a new component
*/
Form.prototype.newComponent =
	function(
		name,
		twig,
		inherit
	)
{
	/*
	if( twig.code && twig.code !== '' )
	{
		var Proto =
			Proc[ twig.code ];

		if( Proto )
		{
			return new Proto( twig, this, inherit, name );
		}
		else
		{
			throw new Error( 'No prototype for :' + twig.code );
		}
	}
	*/

	switch( twig.type )
	{
		case 'Button' :

			return new Forms.Button(
				name,
				twig,
				this,
				inherit
			);

//		case 'CheckBox' :
//			return new Forms.CheckBox( twig, this, inherit, name );

		case 'Input' :

			return new Forms.Input(
				name,
				twig,
				this,
				inherit
			);

		case 'Label' :

			return new Forms.Label(
				name,
				twig,
				this,
				inherit
			);

		default :

			throw new Error( 'Invalid component type: ' + twig.type );
	}
};

/*
| Returns the focused item.
*/
Form.prototype.getFocus =
	function( )
{
	var caret =
		this.$caret;

	var sign =
		caret.sign;

	if( !sign )
	{
		return null;
	}

	var path =
		sign.path;

	if( path.get( 0 ) !== this.name )
	{
		throw new Error( 'this caret not on this form!' );
	}

	return this.$sub[ path.get( 1 ) ] || null;
};


/*
| Force clears all caches.
*/
Form.prototype.knock =
	function( )
{
	this.$fabric =
		null;

	for( var c in this.$sub )
	{
		this.$sub[ c ].knock( );
	}
};


/*
| Draws the panels contents.
*/
/*
Panel.prototype._weave =
	function( )
{
	if( this.$fabric && !config.debug.noCache )
		{ return this.$fabric; }

	var iframe = this.iframe;
	var fabric = this.$fabric = new Euclid.Fabric(iframe);
	var style = Forms.getStyle(this.tree.root.style);
	if( !style )
		{ throw new Error('no style!'); }

	fabric.fill( style.fill, this, 'sketch', Euclid.View.proper );
	var layout = this.tree.root.layout;

	var focus = this.getFocus( );
	for( var a = layout.length - 1; a >= 0; a-- )
	{
		var name = layout.ranks[a];
		var c = this.$sub[name];
		c.draw(fabric, Forms.Accent.state(name === this.$hover || c.$active, c === focus));
	}
	fabric.edge( style.edge, this, 'sketch', Euclid.View.proper );

	return fabric;
};
*/


/*
| Draws the form.
*/
Form.prototype.draw =
	function(  )
{
	var fabric = this.fabric;

	fabric.paint(
		theme.forms.style,
		fabric,
		'sketch',
		Euclid.View.proper
	);

//	var style = Forms.getStyle(this.tree.root.style);
//	if( !style )
//		{ throw new Error('no style!'); }

	var root =
		this.tree.root;

	var ranks =
		root.ranks;

	var focus =
		this.getFocus( );

	for(
		var a = ranks.length - 1;
		a >= 0;
		a--
	)
	{
		var name =
			ranks[ a ];

		var comp =
			this.$sub[ name ];

		comp.draw(
			fabric,
			Forms.Accent.state(
				name === this.$hover,
				focus ? name === focus.name : false
			)
		);
	}

	this.$caret.display( );
};


/*
| Positions the caret.
*/
Form.prototype.positionCaret =
	function( )
{
	var caret =
		this.$caret;

	var name =
		caret.sign.path.get( 1 );

	var ce =
		this.$sub[ name ];

	if( !ce )
	{
		throw new Error('Caret component does not exist!');
	}

	if( ce.positionCaret )
	{
		ce.positionCaret(
			Euclid.View.proper
		);
	}
	else
	{
		caret.$screenPos =
		caret.$heigh =
			null;
	}
};


/*
| Returns true if point is on this panel.
*/
Form.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	if( p === null )
	{
		this.setHover( null );

		return;
	}

	var a, aZ;

	var cursor =
		null;

	var layout =
		this.tree.root;
	
	var ranks =
		layout.ranks;

	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var name =
			ranks[ a ];

		var comp =
			this.$sub[ name ];

		if( cursor )
		{
			comp.pointingHover(
				null,
				shift,
				ctrl
			);
		}
		else
		{
			cursor =
				comp.pointingHover(
					p,
					shift,
					ctrl
				);
		}
	}

	if ( cursor === null )
	{
		this.setHover( null );
	}

	return cursor || 'default';
};


/*
| User clicked
*/
Form.prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	// nada
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
Form.prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return false;
};


/*
| Pointing device starts pointing
| ( mouse down, touch start )
|
| Returns the pointing state code,
| wheter this is a click/drag or yet undecided.
*/
Form.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var layout =
		this.tree.root;

	var ranks =
		layout.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var name =
			ranks[ a ];

		var ce =
			this.$sub[ name ];

		var r =
			ce.pointingStart(
				p,
				shift,
				ctrl
			);

		if( r !== null )
		{
			return r;
		}
	}

	// otherwise ...

	this.setHover( null );

	return false;
};


/*
| User is inputing text.
*/
Form.prototype.input =
	function( text )
{
	var focus =
		this.getFocus( );

	if( !focus )
	{
		return;
	}

	focus.input( text );
};


/*
| Cycles the focus
*/
Form.prototype.cycleFocus =
	function(
		dir
	)
{
	var root =
		this.tree.root;

	var focus =
		this.getFocus( );

	if( !focus )
	{
		return;
	}

	var rank =
		root.rankOf( focus.name );

	var rs =
		rank;

	var name;
	var ve;

	while( true )
	{
		rank =
			( rank + dir + root.length ) % root.length;

		if( rank === rs )
		{
			shell.dropFocus( );
		}

		name =
			root.ranks[ rank ];

		ve =
			this.$sub[ name ];

		if( ve.grepFocus( ) )
		{
			break;
		}
	}
};


/*
| User is pressing a special key.
*/
Form.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var focus =
		this.getFocus( );

	if( !focus )
	{
		return;
	}

	if( key === 'tab' )
	{
		this.cycleFocus(
			shift ? -1 : 1
		);

		return;
	}

	focus.specialKey(
		key,
		shift,
		ctrl
	);
};


/*
| Clears caches.
*/
Form.prototype.poke =
	function( )
{
	this.$fabric =
		null;

	shell.redraw =
		true;
};


/*
| Sets the caret position.
*/
Form.prototype.setCaret =
	function(
		sign
	)
{
	switch( sign && sign.constructor )
	{
		case null :
		case Sign :

			break;

		case Object :

			sign =
				new Sign( sign );

			break;

		default :

			throw new Error(
				'Space.setCaret: invalid sign'
			);
	}

	var entity;

	if(
		this.$caret.sign &&
		this.$caret.sign.path !== sign.path
	)
	{
		entity =
			this._getCaretEntity(
				this.$caret.sign.path
			);

		if( entity )
		{
			entity.knock( );
		}

		this.redraw = true;
	}

	this.$caret =
		new Caret(
			sign,
			null,
			this.$caret.$shown
		);

	if( sign )
	{
		entity =
			this._getCaretEntity(
				sign.path
			);

		if( entity )
		{
			entity.knock( );
		}

		this.redraw = true;
	}

	return this.$caret;
};




/*
| Sets the hovered component.
*/
Form.prototype.setHover =
	function( name )
{
	if( this.$hover === name )
	{
		return;
	}

	this.poke();

	if( this.$hover )
	{
		this.$sub[ this.$hover ].knock( );
	}

	if( name )
	{
		this.$sub[ name ].knock( );
	}

	this.$hover =
		name;

	return;
};

/*
| The shell got the systems focus.
*/
Form.prototype.systemFocus =
	function( )
{
	var caret =
		this.$caret;

	caret.show( );

	caret.display( );
};



/*
| The shell lost the systems focus.
*/
Form.prototype.systemBlur =
	function( )
{
	var caret =
		this.$caret;

	caret.hide( );

	caret.display( );
};


/*
| Blinks the caret (if shown)
*/
Form.prototype.blink =
	function( )
{
	this.$caret.blink( );
};


/*
| Returns the first entity a caret can be in
*/
Form.prototype._getCaretEntity =
	function(
		path
	)
{
	if( path.length !== 2 ) {
		throw new Error('Form._getCaretEntity, path.length expected to be 1');
	}

	if( path.get( 0 ) !== this.name ) {
		throw new Error('Caret path mismatch');
	}

	return this.$sub[ path.get( 1 ) ];
};


} )( );
