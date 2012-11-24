/*
|
| Parent of all panels.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Dash;
Dash = Dash || { };


/*
| Imports
*/
var Disc;
var Euclid;
var Jools;
var Proc;
var shell;
var system;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor
*/
var Board = Dash.Board =
	function( )
{
	this.fabric       = system.fabric;
	this.curPanelName = 'MainPanel';

	this.panels =
		{
			MainPanel  : null,
			MainDisc   : null,
			LoginPanel : null,
			RegPanel   : null,
			HelpPanel  : null
		};

	this.$curSpace = null;
	this.$showHelp = false;
	this.$autoHelp = true;
};


/*
| Sends a message to the chat component.
*/
Board.prototype.message =
	function( message )
{
	this.getPanel( 'MainPanel' ).
		$sub.
		chat.
		addMessage(message);
};


/*
| Returns the panel by its name.
*/
Board.prototype.getPanel =
	function( name )
{
	var fabric = this.fabric;
	var cpanel = this.panels[ name ];

	if(! Jools.is( cpanel ) )
	{
		throw new Error( 'invalid panelname: ' + name );
	}

	if (
		cpanel &&
		cpanel.screensize.x === fabric.width &&
		cpanel.screensize.y === fabric.height
	)
	{
		return cpanel;
	}

	var panel;
	switch( name )
	{
		case 'MainPanel' :
			panel = new Proc.MainPanel(
				name,
				cpanel,
				this,
				new Euclid.Point(
					fabric.width,
					fabric.height
				)
			);
			break;

		case 'HelpPanel' :
			panel = new Proc.HelpPanel(
				name,
				cpanel,
				this,
				new Euclid.Point(
					fabric.width,
					fabric.height
				)
			);
			break;

		case 'MainDisc' :
			panel = new Disc.MainDisc(
				cpanel,
				new Euclid.Point(
					fabric.width,
					fabric.height
				)
			);
			break;

		default :
			panel = new Dash.Panel(
				name,
				cpanel,
				this,
				new Euclid.Point(
					fabric.width,
					fabric.height
				)
			);
			break;
	}

	return this.panels[name] = panel;
};


/*
| Returns the current panel.
| TODO rename and private
*/
Board.prototype.curPanel =
	function( )
{
	return this.getPanel( this.curPanelName );
};


/*
| Sets the current panel.
| TODO rename and private
*/
Board.prototype.setCurPanel =
	function( panelName )
{
	var caret = shell.$caret;

	if (caret.section === 'board' &&
		caret.sign &&
		caret.sign.path.get( 0 ) === this.curPanelName
	)
	{
		caret = shell.setCaret( null, null );
	}

	this.curPanelName = panelName;
	shell.redraw = true;
};


/*
| Sets the space name displayed on the main panel.
*/
Board.prototype.setCurSpace =
	function( space, access )
{
	this.$curSpace = space;
	this.$access   = access;
	this.getPanel( 'MainPanel' ).
		setCurSpace(space, access);

	if (
		space === 'meshcraft:sandbox' &&
		this.$autoHelp
	)
	{
		this.$autoHelp = false;
		this.setShowHelp( true );
	}
};


/*
| Sets the user greeted on the main panel.
*/
Board.prototype.setUser =
	function( userName )
{
	this.$amVisitor = userName.substring( 0, 5) === 'visit';

	var mainPanel = this.getPanel ('MainPanel' );
	mainPanel.setUser( userName );

	var leftB = mainPanel.$sub.leftB;
	leftB.$captionText = this.$amVisitor ? 'log in' : 'log out';
	leftB.poke( );

	var left2B = mainPanel.$sub.left2B;
	left2B.$visible = this.$amVisitor;
	left2B.poke( );
};


/*
| Sets the zoom level for the current space shown on the mainPanel.
*/
Board.prototype.setSpaceZoom =
	function( zf )
{
	this.getPanel( 'MainPanel' ).setSpaceZoom( zf );
};


/*
| Redraws the dashboard.
*/
Board.prototype.draw =
	function( )
{
	var fabric = this.fabric;

	if( this.$showHelp )
	{
		var helpPanel = this.getPanel( 'HelpPanel' );
		helpPanel.setAccess( this.$access );
		helpPanel.draw( fabric );
	}

	this.curPanel( ).draw( fabric );

	var mainDisc = this.getPanel( 'MainDisc' );
	mainDisc.draw( fabric );
};


/*
| Force clears all caches.
*/
Board.prototype.knock =
	function( )
{
	for( var p in this.panels )
	{
		var po = this.panels[ p ];

		if( po )
			{ po.knock( ); }
	}
};


/*
| Draws the caret.
*/
Board.prototype.positionCaret =
	function( )
{
	if ( shell.$caret.sign.path.get( 0 ) !== this.curPanelName )
		{ throw new Error( 'Caret path( 0 ) !== this.curPanelName' ); }

	this.curPanel( ).
		positionCaret( Euclid.View.proper );
};


/*
| User is entering text.
*/
Board.prototype.input =
	function( text )
{
	this.curPanel( ).input( text );
};


/*
| User is pressing a special key.
*/
Board.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	this.curPanel( ).specialKey( key, shift, ctrl );
};


/*
| User is hovering his/her pointing device ( mouse move )
*/
Board.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var cursor = this.curPanel( ).pointingHover( p, shift, ctrl );

	if( cursor )
	{
		this.getPanel( 'MainDisc' ).
			pointingHover( null, shift, ctrl );
	}
	else
	{
		cursor = this.getPanel( 'MainDisc' ).
			pointingHover( p, shift, ctrl );
	}

	if( this.$showHelp )
	{
		if( cursor )
		{
			this.getPanel( 'HelpPanel' ).
				pointingHover( null, shift, ctrl );
		}
		else
		{
			cursor = this.getPanel( 'HelpPanel' ).
				pointingHover( p, shift, ctrl );
		}
	}

	return cursor;
};


/*
| Start of a dragging operation.
*/
Board.prototype.dragStart =
	function( p, shift, ctrl )
{
	return null;
};


/*
| Ongoing dragging operation.
*/
Board.prototype.actionmove =
	function( p, shift, ctrl )
{
	return null;
};


/*
| End of an action.
*/
Board.prototype.actionstop =
	function(
		p,
		shift,
		ctrl
	)
{
	var action = shell.bridge.action( );
	var path   = action.itemPath;
	var panel  = this.getPanel( path.get( 0 ) );
	var c      = panel.$sub[ path.get( 1 ) ];

	return c.actionstop( p, shift, ctrl );
};


/*
| pointing device is starting a point ( mouse down, touch start )
*/
Board.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var r;

	r = this.getPanel( 'MainDisc' ).
			pointingStart( p, shift. ctrl) ;

	if( r !== null )
		{ return r; }

	if( this.$showHelp )
	{
		r = this.getPanel( 'HelpPanel' ).
			pointingStart( p, shift. ctrl) ;

		if( r !== null )
			{ return r; }
	}

	r = this.curPanel( ).
		pointingStart( p, shift. ctrl );

	if( r === null )
		{ return null; }

	this.curPanel( ).
		pointingHover( p, shift, ctrl );

	return r;
};


/*
| Returns an entity by its path.
*/
Board.prototype.getSub = function( path )
{
	var panel = this.getPanel( path.get( 0 ) );

	return panel.$sub[ path.get( 1 ) ];
};


/*
| Shows or hides the help panel.
*/
Board.prototype.setShowHelp = function( showHelp )
{
	if( this.$showHelp === showHelp )
		{ return; }

	this.$showHelp = showHelp;

	this.getPanel( 'MainPanel' ).setShowHelp( showHelp );
	shell.redraw = true;
};

} )( );
