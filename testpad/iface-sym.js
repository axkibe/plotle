/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                             ,-_/                .---.
                             '  | ," ,-. ,-. ,-. \___  . . ,-,-.
                             .^ | |- ,-| |   |-'     \ | | | | |
                             `--' |  `-^ `-' `-' `---' `-| ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ' ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                       `-'
 The interface simulator simulates a server without ever
 talking to one. Used for debugging.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*
| Export
*/
var IFaceSym;


/*
| Imports
*/
var Change;
var ChangeRay;
var MeshMashine;
var Meshverse;
var Path;
var Sign;
var Tree;
var Jools;
var config;
var shell;
var system;


/*
| Capsule
*/
( function( ) {
"use strict";

if( typeof ( window ) === 'undefined' )
	{ throw new Error( 'this code nees a browser!' ); }

/*
| Constructor.
*/
IFaceSym = function( )
{
	// the current space;
	this.$cSpace  =
		new Tree(
			{
				type : 'Space'
			},
			Meshverse
		);

	// current update request
	this.$updateAjax = null;
};


/*
| Sets the current user
*/
IFaceSym.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this.$user     = user;
	this.$passhash = passhash;
};


/*
| Authentication
*/
IFaceSym.prototype.auth =
	function(
		user,
		passhash,
		callback
	)
{
	throw new Error('there are no auths in IFaceSym');
};


/*
| Registers a user.
*/
IFaceSym.prototype.register =
	function(
		user,
		mail,
		passhash,
		news,
		callback
	)
{
	throw new Error('there is no registering in IFaceSym');
};


/*
| Sends a message.
*/
IFaceSym.prototype.sendMessage = function(message)
{
	throw new Error('there are no messages in IFaceSym');
};


/*
| Aquires a space.
*/
IFaceSym.prototype.aquireSpace = function(spacename, callback)
{
	var self = this;
	if( spacename !== 'testpad' ) {
		throw new Error(' IFaceSym only has the space "testpad"');
	}

	self.$spacename = spacename;

	callback(
		null,
		Jools.immute(
			{
				tree   : self.$cSpace,
				name   : spacename,
				access : 'rw'
			}
		)
	);

};


/*
| Gets a twig.
*/
IFaceSym.prototype.get = function(path, len)
{
	return this.$cSpace.getPath(path, len);
};


/*
| Sends an update request to the server and computes its answer.
*/
IFaceSym.prototype._update = function()
{
	var self = this;

	if (self.$updateAjax)
		{ throw new Error('double update?'); }

	var ajax = self.$updateAjax = new XMLHttpRequest();

	ajax.open('POST', '/mm', true);

	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	ajax.onreadystatechange = function()
	{
		if (ajax.readyState !== 4)
			{ return; }

		var a, aZ, asw, b, bZ, chgX;

		// call was willingfull aborted
		if (ajax.$abort)
			{ return; }

		self.$updateAjax = null;

		if (ajax.status !== 200)
		{
			Jools.log( 'iface', 'update.status == ' + ajax.status );
			shell.greenscreen( 'Connection with server failed.', false );
			return;
		}

		try
			{ asw = JSON.parse(ajax.responseText); }
		catch (e)
			{ throw new Error('Server answered no JSON!'); }

		Jools.log('iface', '<-u', asw);

		if (!asw.ok)
		{
			shell.greenscreen('Server not OK: ' + asw.message);
			return;
		}

		var chgs       = asw.chgs;
		var report     = new ChangeRay();
		var gotOwnChgs = false;
		var time       = asw.time;

		if (chgs && chgs.length > 0)
		{
			// this wasn't an empty timeout?
			var postbox = self.$postbox;

			for(a = 0, aZ = chgs.length; a < aZ; a++)
			{
				chgX = new Change(chgs[a].chgX);
				var cid = chgs[a].cid;

				// changes the clients understanding of the server tree
				self.$rSpace = chgX.changeTree( self.$rSpace ).tree;

				if( postbox.length > 0 &&
					postbox[0].cid === cid
				)
				{
					self.$postbox.splice( 0, 1 );
					gotOwnChgs = true;
					continue;
				}

				// alters undo and redo queues.
				var undo = self.$undo;
				var u;
				for( b = 0, bZ = undo.length; b < bZ; b++ )
				{
					u = undo[ b ];
					if( u.time < time + a )
						{ u.chgX = MeshMashine.tfxChgX( u.chgX, chgX ); }
				}

				var redo = self.$redo;
				for( b = 0, bZ = redo.length; b < bZ; b++ )
				{
					u = redo[ b ];
					if( u.time < time + a )
						{ u.chgX = MeshMashine.tfxChgX( u.chgX, chgX ); }
				}

				report.push( chgX );
			}

			// adapts all queued changes
			// and rebuilds the clients understanding of its own tree
			var outbox = self.$outbox;
			var space  = self.$rSpace;

			for( a = 0, aZ = postbox.length; a < aZ; a++ )
				{ space = postbox[ a ].chgX.changeTree( space ).tree; }

			for( a = 0, aZ = outbox.length; a < aZ; a++ )
			{
				chgX = outbox[ a ].chgX;

				for( b = 0, bZ = report.length; b < bZ; b++ )
				{
					chgX = MeshMashine.tfxChgX( chgX, report.get( b ) );
				}

				outbox[a].chgX = chgX;

				space = chgX.changeTree( space ).tree;
			}

			self.$cSpace = space;
		}

		var msgs = asw.msgs;
		if (msgs && self._messageRCV)
		{
			for(a = 0, aZ = msgs.length; a < aZ; a++)
			{
				var m = msgs[a];
				self._messageRCV.messageRCV(m.space, m.user, m.message);
			}
		}

		self.$remoteTime = asw.timeZ;

		var mseqZ        = asw.mseqZ;

		if (Jools.is(mseqZ))
			{ self.$mseq = mseqZ; }

		if (report.length > 0 && self._updateRCV)
			{ self._updateRCV.update(self.$cSpace, report); }

		if (gotOwnChgs)
			{ self.sendChanges(); }

		// issue the following update
		self._update();
	};

	var request = {
		cmd      : 'update',
		passhash : self.$passhash,
		space    : self.$spacename,
		time     : self.$remoteTime,
		mseq     : self.$mseq,
		user     : self.$user
	};

	Jools.log('iface', 'u->', request);

	request = JSON.stringify(request);

	ajax.send(request);
};


/*
| Alters the tree
|
| TODO why doesnt this get a change?
*/
IFaceSym.prototype.alter = function(src, trg)
{
    var r = new Change(
		new Sign( src ),
		new Sign( trg )
	).changeTree( this.$cSpace );

    this.$cSpace = r.tree;
	var chgX     = r.chgX;

	var c = {
		cid  : Jools.uid( ),
		chgX : chgX,
		time : this.$remoteTime
	};

	this.$outbox.push( c );

	this.$redo = [ ];

	var undo  = this.$undo;

	undo.push(c);

	if (undo.length > config.maxUndo)
		{ undo.shift(); }

	this.sendChanges();

    if (this._updateRCV)
		{ this._updateRCV.update(r.tree, chgX); }

    return chgX;
};


/*
| Sends the stored changes to remote meshmashine
*/
IFaceSym.prototype.sendChanges = function()
{
	// already sending?
	if (this.$postbox.length > 0)
		{ return; }

	// nothing to send?
	if (this.$outbox.length === 0)
		{ return; }

	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4)
			{ return; }

		if (ajax.status !== 200)
		{
			shell.greenscreen('Cannot send changes, error code ' + ajax.status);
			return;
		}

		try
			{ asw = JSON.parse(ajax.responseText); }
		catch (e)
		{
			shell.greenscreen('Server answered no JSON!');
			return;
		}

		Jools.log('iface', '<-sc', asw);

		if (!asw.ok)
		{
			shell.greenscreen('Server not OK: ' + asw.message);
			return;
		}
	};

	var c = this.$outbox[0];
	this.$outbox.splice(0, 1);
	this.$postbox.push(c);

	var request = {
		cmd      : 'alter',
		space    : this.$spacename,
		chgX     : c.chgX,
		cid      : c.cid,
		passhash : this.$passhash,
		time     : this.$remoteTime,
		user     : this.$user
	};

	Jools.log('iface', 'sc->', request);

	request = JSON.stringify(request);

	ajax.send(request);
};


/*
| Sends the stored changes to remote meshmashine
*/
IFaceSym.prototype.undo = function()
{
	throw new Error('no undoing in IFaceSym');
};


/*
| Sends the stored changes to remote meshmashine
*/
IFaceSym.prototype.redo = function( )
{
	throw new Error('no redoing in IFaceSym');
};


} )( );
