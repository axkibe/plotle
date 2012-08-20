/**
              _....._          .----.     .----  _....._    .
            .´       '.         \    \   /    /.´       '.  .
           /   .-'"'.  \ .-,.--. '   '. /'   //   .-'"'.  \  .-,.--.
          /   /______\  ||  .-. ||    |'    //   /______\  | |  .-. |
       _  |   __________|| |  | ||    ||    ||   __________| | |  | |
     .' | \  (          '| |  | |'.   `'   .'\  (          ' | |  | |
    .   | /\  '-.___..-~.| |  '-  \        /  \  '-.___..-~. | |  '-
  .'.'| |// `         .'.| |       \      /    `         .'.`| |
.'.'.-'  /   `'-.....-.'.| |        '----'      `'-.....-.'. | |
.'   \_.'                |_|                                 |_|


~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The server-side repository.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Capsule
|
| (to make jshint happy)
*/
(function(){

"use strict";

if (typeof(require) === 'undefined')
	{ throw new Error('this code requires node!'); }

/**
| Imports
*/
var Jools       = require('../shared/jools');
var MeshMashine = require('../shared/meshmashine');
var Meshverse   = require('../shared/meshverse');
var Path        = require('../shared/path');
var Resource    = require('./resource');
var Tree        = require('../shared/tree');
var config      = require('../config');
var fs          = require('fs');
var http        = require('http');
var sha1        = require('../shared/sha1');
var mongodb     = require('mongodb');
var uglify      = config.uglify && require('uglify-js');
var url         = require('url');
var zlib        = require('zlib');

/**
| Shortcuts
*/
var is           = Jools.is;
var isArray      = Jools.isArray;
var log          = Jools.log;
var reject       = Jools.reject;

/**
| Server
*/
var Server = function(_) {

	// files served
	this.$resources = {};

	// initializes the database
	var $db = this.$db = {};

	$db.server    = new mongodb.Server(
		config.database.host,
		config.database.port,
		{}
	);

	$db.connector = new mongodb.Db(
		config.database.name,
		this.$db.server,
		{}
	);

	// all messages
	this.$messages = [];

	// all spaces
	this.$spaces  = {};

	// a table of all clients waiting for an update
	this.$upsleep   = {};

	// next upsleepID
	this.$nextSleep = 1;

	// next visitors ID
	this.$nextVisitor = 1000;

	// table of all cached user credentials
	this.$users = {};

	// the list where a user is present
	// user for 'entered' and 'left' messages
	this.$presences = {};

	this.prepareResources(_);

	log('start',
		'connecting to database',
		config.database.host + ':' + config.database.port,
		config.database.name
	);

	$db.connection = $db.connector.open(_);
	$db.users      = $db.connection.collection('users',   _);
	$db.spaces     = $db.connection.collection('spaces',  _);

	this.checkRepositorySchemaVersion(_);

	this.ensureMeshcraftUser(_);

	this.loadSpaces(_);

	log('start',
		'starting server @ http://' +
		(config.ip || '*') + '/:' + config.port
	);

	var self = this;

	http.createServer(
		function(req, res)
			{ self.requestListener(req, res); }
	).listen(config.port, config.ip, _);

	log('start', 'server running');
};

/**
| Ensures the repository schema version fits this server.
*/
Server.prototype.checkRepositorySchemaVersion = function (_)
{
	log('start', 'checking repository schema version');

	var global  = this.$db.connection.collection('global', _);
	var version = global.findOne({ _id : 'version' }, _);

	if (version)
	{
		if (version.version !== 3)
		{
			throw new Error(
				'Wrong repository schema version, expected 3, got '+
				version.version
			);
		}

		return;
	}

	// if there is no global.version variable the database is either
	// empty or a version 2 schema. So check for version 2
	var changes = this.$db.connection.collection('changes', _);
	if (changes.find(_).nextObject(_) !== null)
		{ throw new Error('Found a version 2 schema, expected 3'); }

	// if not, initializes the database repository
	this.initRepository (_);
};

/**
| Initializes a new repository.
*/
Server.prototype.initRepository = function (_)
{
	log('start', 'found no repository, initializing a new one');

	var initSpaces = [
		'meshcraft:home',
		'meshcraft:sandbox'
	];

	for (var $s = 0, sZ = initSpaces.length; $s < sZ; $s++)
	{
		var $space = initSpaces[$s];

		log('start', '  initializing space ' + $space);

		this.$db.spaces.insert(
			{
				_id : $space
			},
		_);
	}

	log('start', '  initializing global.version');

	var $global = this.$db.connection.collection('global', _);
	$global.insert(
		{
			_id     : 'version',
			version : 3
		},
	_);
};


/**
| Ensures there is the meshcraft (root) user
*/
Server.prototype.ensureMeshcraftUser = function (_)
{
	log('start', 'ensuring existence of the "meshcraft" user');

	var mUser = this.$db.users.findOne(
		{ _id : 'meshcraft'},
	_);

	if (!mUser)
	{
		log('start', 'not found! (re)creating the "meshcraft" user');
		var pass = Jools.randomPassword(12);

		mUser = {
			_id       : 'meshcraft',
			pass      : Jools.passhash(pass),
			clearPass : pass,
			mail      : ''
		};

		this.$db.users.insert(mUser, _);
	}

	this.$users.meshcraft = mUser;

	log('start', '"meshcraft" user\'s clear password is: ', mUser.clearPass);

};

/**
| loads all spaces and playbacks all changes from the database
*/
Server.prototype.loadSpaces = function (_)
{
	log('start', 'loading and replaying all spaces');

	var cursor = this.$db.spaces.find({ }, { sort: '_id'}, _);

	for(var $o = cursor.nextObject(_); $o !== null; $o = cursor.nextObject(_))
		{ this.loadSpace($o._id, _); }

};


/**
| load a spaces and playbacks its changes from the database
*/
Server.prototype.loadSpace = function ( spacename, _)
{
	log('start', 'loading and replaying all "' + spacename + '"');

	var $space = this.$spaces[spacename] = {
		$changesDB : this.$db.connection.collection('changes:' + spacename, _),
		$changes   : [ ],
		$tree      : new Tree( { type : 'Space' }, Meshverse),
		$seqZ      : 1
	};

	var cursor = $space.$changesDB.find({ }, { sort : '_id' }, _);

	for(var $o = cursor.nextObject(_); $o !== null; $o = cursor.nextObject(_))
	{
		if ($o._id !== $space.$seqZ)
			{ throw new Error('sequence mismatch'); }

		// FIXME there is something quirky, why isn't *this* a "Change"?
		var $change = {
			cid  : $o.cid,
			chgX : null
		};

		if (!isArray($o.chgX))
			{ $change.chgX = new MeshMashine.Change($o.chgX); }
		else
		{
			$change.chgX = [];
			for(var a = 0, aZ = $o.chgX.length; a < aZ; a++)
			{
				$change.chgX.push(new MeshMashine.Change($o.chgX[a]));
			}
		}

		$space.$seqZ++;
		$space.$tree = MeshMashine.changeTree($space.$tree, $change.chgX).tree;
	}
};

/**
| sends a message
*/
Server.prototype.sendMessage = function(spacename, user, message)
{
	this.$messages.push (
		{
			space   : spacename,
			user    : user,
			message : message
		}
	);

	var self = this;
	process.nextTick(
		function()
			{ self.wake( spacename ); }
	);
};

/**
| Creates a message for a space
*/
Server.prototype.cmdMessage = function(cmd, _)
{
	var space    = cmd.space;
	var message  = cmd.message;
	var username = cmd.user;
	var pass     = cmd.pass;

	if (!is(username))
		{ throw reject('user missing'); }

	if (!is(pass))
		{ throw reject('pass missing'); }

	if (!is(space))
		{ throw reject('space missing'); }

	if (!is(message))
		{ throw reject('message missing'); }

	if (this.$users[username].pass !== pass)
		{ throw reject('invalid pass'); }

	this.sendMessage(space, username, message);

	return { ok : true };
};

/**
| Builds the shells config.js file.
*/
Server.prototype.buildShellConfig = function()
{
	var k;
	var cconfig = [];

	cconfig.push('var config = {\n');
	cconfig.push('\tdevel   : '  + Jools.configSwitch(config.devel, 'shell') + ',\n');
	cconfig.push('\tmaxUndo : '  + config.maxUndo + ',\n');
	cconfig.push('\tdebug   : {\n');

	var first = true;
	for(k in config.debug)
	{
		if (!first)
			{ cconfig.push(',\n'); }
		else
			{ first = false; }

		cconfig.push('\t\t' + k + ' : ' + config.debug[k]);
	}

	cconfig.push('\n\t},\n');
	cconfig.push('\tlog : {\n');
	first = true;

	for(k in config.log)
	{
		if (!first)
			{ cconfig.push(',\n'); }
		else
			{ first = false; }

		cconfig.push('\t\t' + k + ' : ' + Jools.configSwitch(config.log[k], 'shell'));
	}

	cconfig.push('\n\t}\n');
	cconfig.push('};\n');
	return cconfig.join('');
};


/**
| Registers and prepares the resource.
| also builds the bundle for fast-loading.
*/
Server.prototype.prepareResources = function(_)
{
	var r;

	var rlist = [
		'media/favicon.ico',                               'mc',
		'shell/testpad.html',                              'f',
		'shell/testpad.js',                                'f',
		'shell/fonts/webfont.js',                          'mc',

		'shared/jools.js',                                 'fb',
		'shared/sha1.js',                                  'fb',
		'shared/euclid/compass.js',                        'fb',
		'shared/euclid/point.js',                          'fb',
		'shared/euclid/rect.js',                           'fb',
		'shared/euclid/margin.js',                         'fb',
		'shell/euclid/font.js',                            'fb',
		'shell/euclid/fabric.js',                          'fb',
		'shell/euclid/measure.js',                         'fb',
		'shell/euclid/rect.js',                            'fb',
		'shell/euclid/bezirect.js',                        'fb',
		'shell/euclid/oval.js',                            'fb',
		'shell/euclid/ovalslice.js',                       'fb',
		'shell/euclid/ovalflower.js',                      'fb',
		'shell/euclid/line.js',                            'fb',
		'shell/theme.js',                                  'fb',
		'shell/euclid/view.js',                            'fb',
		'shared/meshverse.js',                             'fb',
		'shared/path.js',                                  'fb',
		'shared/twig.js',                                  'fb',
		'shared/tree.js',                                  'fb',
		'shared/sign.js',                                  'fb',
		'shared/change.js',                                'fb',
		'shared/changeray.js',                             'fb',
		'shared/meshmashine.js',                           'fb',
		'shell/iface.js',                                  'fb',
		'shell/peer.js',                                   'fb',
		'shell/design/getfont.js',                         'fb',
		'shell/design/pattern.js',                         'fb',
		'shell/design/mainpanel.js',                       'fb',
		'shell/design/loginpanel.js',                      'fb',
		'shell/design/regpanel.js',                        'fb',
		'shell/design/helppanel.js',                       'fb',
		'shell/dash/accent.js',                            'fb',
		'shell/curve.js',                                  'fb',
		'shell/dash/getstyle.js',                          'fb',
		'shell/dash/button.js',                            'fb',
		'shell/dash/input.js',                             'fb',
		'shell/dash/label.js',                             'fb',
		'shell/dash/chat.js',                              'fb',
		'shell/dash/panel.js',                             'fb',
		'shell/proc/util.js',                              'fb',
		'shell/proc/mainpanel.js',                         'fb',
		'shell/proc/helppanel.js',                         'fb',
		'shell/proc/main-left-button.js',                  'fb',
		'shell/proc/main-left2-button.js',                 'fb',
		'shell/proc/main-switch-button.js',                'fb',
		'shell/proc/main-right-button.js',                 'fb',
		'shell/proc/main-zoom-plus-button.js',             'fb',
		'shell/proc/main-zoom-null-button.js',             'fb',
		'shell/proc/main-zoom-minus-button.js',            'fb',
		'shell/proc/login-login-button.js',                'fb',
		'shell/proc/login-close-button.js',                'fb',
		'shell/proc/login-pass-input.js',                  'fb',
		'shell/proc/reg-close-button.js',                  'fb',
		'shell/proc/reg-register-button.js',               'fb',
		'shell/proc/help-hide-button.js',                  'fb',
		'shell/dash/switchpanel.js',                       'fb',
		'shell/dash/board.js',                             'fb',
		'shell/action.js',                                 'fb',
		'shell/ovalmenu.js',                               'fb',
		'shell/visual/base.js',                            'fb',
		'shell/visual/para.js',                            'fb',
		'shell/visual/scrollbar.js',                       'fb',
		'shell/visual/doc.js',                             'fb',
		'shell/visual/item.js',                            'fb',
		'shell/visual/docitem.js',                         'fb',
		'shell/visual/note.js',                            'fb',
		'shell/visual/label.js',                           'fb',
		'shell/visual/relation.js',                        'fb',
		'shell/visual/portal.js',                          'fb',
		'shell/visual/space.js',                           'fb',
		'shell/system.js',                                 'fb',
		'shell/caret.js',                                  'fb',
		'shell/range.js',                                  'fb',
		'shell/shell.js',                                  'fb',
		'shell/fontloader.js',                             'fb',

		'shell/fonts/dejavu.css',                          'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.eot',  'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.svg',  'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.ttf',  'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.woff', 'mc',
		'shell/fonts/dejavusans-bold-webfont.eot',         'mc',
		'shell/fonts/dejavusans-bold-webfont.svg',         'mc',
		'shell/fonts/dejavusans-bold-webfont.ttf',         'mc',
		'shell/fonts/dejavusans-bold-webfont.woff',        'mc',
		'shell/fonts/dejavusans-oblique-webfont.eot',      'mc',
		'shell/fonts/dejavusans-oblique-webfont.svg',      'mc',
		'shell/fonts/dejavusans-oblique-webfont.ttf',      'mc',
		'shell/fonts/dejavusans-oblique-webfont.woff',     'mc',
		'shell/fonts/dejavusans-webfont.eot',              'mc',
		'shell/fonts/dejavusans-webfont.svg',              'mc',
		'shell/fonts/dejavusans-webfont.ttf',              'mc',
		'shell/fonts/dejavusans-webfont.woff',             'mc'
	];

	// ressources served in the bundle
	var bundleRessources = [];

	// creates the Ressources
	for (var a = 0, aZ = rlist.length; a < aZ; a += 2)
	{
		r = new Resource(rlist[a], rlist[a + 1]);

		if (r.opts.bundle)
			{ bundleRessources.push(r); }

		this.$resources[r.path] = r;
	}

	var path;

	log('start', 'preparing resources');

	for(path in this.$resources)
	{
		r = this.$resources[path];

		if (r.data !== null || !r.opts.memory)
			{ continue; }

		r.data = fs.readFile(r.path, _);
	}

	this.$resources['favicon.ico'] = this.$resources['media/favicon.ico'];

	var cconfig = new Resource('shell/config.js', 'mb');
	bundleRessources.unshift(cconfig);

	this.$resources[cconfig.path] = cconfig;
	cconfig.data = this.buildShellConfig();

	// the bundle itself
	var bundle = [];

	// file listing for devel.html
	var devels = [];

	// loads the to be bundled files
	for(a = 0, aZ = bundleRessources.length; a < aZ; a++)
	{
		r = bundleRessources[a];

		devels.push('<script src="' + r.path + '" type="text/javascript"></script>');

		if (r.data === null)
			{ bundle.push(fs.readFile(r.path, _)); }
		else
			{ bundle.push(r.data); }
	}

	bundle = bundle.join('\n');

	// uglifies the bundle if configured so
	if (config.uglify)
	{
		var ast;
		ast    = uglify.parser.parse(bundle);
		ast    = uglify.uglify.ast_mangle(ast, {toplevel: true});
		ast    = uglify.uglify.ast_lift_variables(ast);
		ast    = uglify.uglify.ast_squeeze(ast);
		bundle = uglify.uglify.gen_code(ast);
	}

	// calculates the hash for the bundle
	var bsha1 = sha1.sha1hex(bundle);

	// registers the bundle as ressource
	var br = new Resource('meshcraft-' + bsha1 + '.js', 'mc');
	br.data = bundle;
	this.$resources[br.path] = br;
	log('start', 'bundle:', bsha1);

	// the devel.html file
	var devel = new Resource('shell/devel.html', 'm');
	devel.data = fs.readFile('shell/devel.html', _) + '';
	devel.data = devel.data.replace(/<!--DEVELPACK.*>/, devels.join('\n'));
	this.$resources['devel.html'] = devel;

	// the index.html file
	var main = new Resource('shell/meshcraft.html', 'm');
	main.data = fs.readFile('shell/meshcraft.html', _) + '';
	main.data = main.data.replace(
		/<!--COPACK.*>/,
		'<script src="' + br.path + '" type="text/javascript"></script>'
	);
	this.$resources['meshcraft.html'] =
	this.$resources['index.html'] =
	this.$resources[''] = main;

	// prepares the zipped versions
	for(path in this.$resources) {
		r = this.$resources[path];
		if (!r.opts.memory)
			{ continue; }
		r.gzip = zlib.gzip(r.data, _);
	}

	log('start', 'uncompressed bundle size is ', br.data.length);
	log('start', '  compressed bundle size is ', br.gzip.length);
};

/**
| Executes an alter command.
*/
Server.prototype.cmdAlter = function(cmd, _)
{
	var time      = cmd.time;
	var chgX      = cmd.chgX;
	var cid       = cmd.cid;
	var spacename = cmd.space;
	var username  = cmd.user;
	var pass      = cmd.pass;

	if (!is(username))
		{ throw reject('user missing');  }

	if (this.$users[username].pass !== pass)
		{ throw reject('invalid pass');  }

	if (!is(spacename))
		{ throw reject('space missing'); }

	if (this.testAccess(username, spacename) !== 'rw')
		{ throw reject('no access');     }

	if (!is(time))
		{ throw reject('time missing');  }

	if (!is(chgX))
		{ throw reject('chgX missing');  }

	if (!is(cid))
		{ throw reject('cid missing');   }


	var $space = this.$spaces[spacename];

	if (!is($space))
		{ throw reject('unknown space'); }

	var $changes = $space.$changes;
	var $seqZ    = $space.$seqZ;

	if (time === -1)
		{ time = $seqZ; }

	if (!(time >= 0 && time <= $seqZ))
		{ throw reject('invalid time'); }

	// fits the cmd into data structures
	try {
		// FIXME
		if (isArray(chgX))
			{ throw new Error('Array chgX not yet supported'); }

		chgX = new MeshMashine.Change(chgX);

	} catch(e)
		{ throw reject( 'invalid cmd: ' + e.message ); }

	// translates the changes if not most recent
	for (var a = time; a < $seqZ; a++)
		{ chgX = MeshMashine.tfxChgX(chgX, $changes[a].chgX); }

	if (chgX === null || chgX.length === 0) {
		return {
			ok   : true,
			chgX : chgX
		};
	}

	// applies the changes
	var r         = MeshMashine.changeTree($space.$tree, chgX);
	$space.$tree  = r.tree;
	chgX          = r.chgX;

	if (chgX === null || chgX.length === 0) {
		return {
			ok: true,
			chgX: chgX
		};
	}

	$changes[$space.$seqZ] =
	{
		cid  : cmd.cid,
		chgX : chgX
	};

	// saves the change in the database
	$space.$changesDB.insert(
		{
			_id  : $seqZ,
			cid  : cmd.cid,
			chgX : JSON.parse(JSON.stringify(chgX)), // FIXME why copy?
			user : cmd.user,
			date : Date.now()
		},
		function(error, count)
		{
			if (error !== null)
				{ throw new Error('Database fail!'); }
		}
	);

	$space.$seqZ++;

	var self = this;
	process.nextTick(
		function()
			{ self.wake( spacename ); }
	);

	return {
		ok   : true,
		chgX : chgX
	};
};

/**
| Executes an auth command.
*/
Server.prototype.cmdAuth = function(cmd, _)
{
	if (!is(cmd.user))
		{ throw reject('user missing'); }

	if (!is(cmd.pass))
		{ throw reject('pass missing');  }

	var $users = this.$users;

	if (cmd.user === 'visitor') {
		var uid;
		do {
			this.$nextVisitor++;
			uid = 'visitor-' + this.$nextVisitor;
		} while ($users[uid]);

		$users[uid] = {
			user    : uid,
			pass    : cmd.pass,
			created : Date.now(),
			use     : Date.now()
		};

		return {
			ok: true,
			user: uid
		};
	}

	if (!$users[cmd.user]) {
		var val = this.$db.users.findOne({ _id : cmd.user}, _);
		if (val === null) { return reject('Username unknown'); }
		$users[cmd.user] = val;
	}

	if ($users[cmd.user].pass !== cmd.pass)
		{ return reject('invalid password'); }

	return {
		ok   : true,
		user : cmd.user
	};
};

/**
| Executes an register command.
*/
Server.prototype.cmdRegister = function(cmd, _)
{
	var username = cmd.user;
	var pass     = cmd.pass;
	var mail     = cmd.mail;

	if (!is(username))
		{ return reject('user missing'); }

	if (!is(pass))
		{ return reject('pass missing'); }

	if (!is(mail))
		{ return reject('mail missing'); }

	if (username.substr(0, 7) === 'visitor')
		{ return reject('Username must not start with "visitor"'); }

	if (username.length < 4)
		{ throw reject('Username too short, min. 4 characters'); }

	var user = this.$db.users.findOne({ _id : username}, _);

	if (user !== null) { return reject('Username already taken'); }

	user = {
		_id  : username,
		pass : pass,
		mail : mail
	};

	this.$db.users.insert(user, _);
	this.$users[username] = user;

	// creates the user's home space
	var spacename = username + ':home';

	this.$spaces[spacename] = {
		$changesDB : this.$db.connection.collection('changes:' + spacename, _),
		$changes   : [],
		$tree      : new Tree({ type : 'Space' }, Meshverse),
		$seqZ      : 1
	};


	this.$db.spaces.insert(
		{
			_id : spacename
		},
	_);

	return {
		ok   : true,
		user : username
	};
};

/**
| Refreshes a users presence timeout.
*/
Server.prototype.refreshPresence = function(user, spacename)
{
	var pres = this.$presences;
	var pu = pres[user];

	if (!pu)
	{
		pu = pres[user] = {
			spaces : { }
		};
	}

	var pus = pu.spaces[spacename];

	if (!pus)
	{
		pus = pu.spaces[spacename] = {
			establish : 0,
			timerID : null
		};

		pus.timerID = setTimeout(this.expirePresence, 5000, this, user, spacename);

		this.sendMessage(spacename, null, user + ' entered "' + spacename + '"');
	}
	else
	{
		if (pus.timerID !== null)
		{
			clearTimeout(pus.timerID);
			pus.timerID = null;
		}

		pus.timerID = setTimeout(this.expirePresence, 5000, this, user, spacename);
	}

};

/**
| Establishes a longer user presence for an update that goes into sleep
*/
Server.prototype.establishPresence = function(user, spacename, sleepID)
{
	var pres = this.$presences;
	var pu = pres[user];

	if (!pu)
		{ pu = pres[user] = { spaces : { } }; }

	var pus = pu.spaces[spacename];

	if (!pus)
	{
		pus = pu.spaces[spacename] = { establish : 1, timerID : null  };
		this.sendMessage(spacename, null, user + ' entered "' + spacename + '"');
	}
	else
	{
		if (pus.timerID !== null)
			{ clearTimeout(pus.timerID); pus.timerID = null; }

		pus.establish++;
	}
};

/**
| Destablishes a longer user presence for an update that went out of sleep.
*/
Server.prototype.destablishPresence = function(user, spacename)
{
	var pres = this.$presences;
	var pu   = pres[user];
	var pus  = pu.spaces[spacename];

	pus.establish--;

	if (pus.establish <= 0)
	{
		if (pus.timerID !== null)
			{ throw new Error("Presence timers mixed up."); }

		pus.timerID = setTimeout(this.expirePresence, 5000, this, user, spacename);
	}

};

/**
| Expires a user presence with zero establishments after timeout
*/
Server.prototype.expirePresence = function(self, user, spacename)
{
	self.sendMessage(spacename, null, user + ' left "' + spacename + '"');

	var pres = self.$presences;
	var pu   = pres[user];

	if (pu.spaces[spacename].establish !== 0)
		{ throw new Error('Something wrong with presences.'); }

	delete pu.spaces[spacename];
};

/**
| Gets new changes or waits for them.
*/
Server.prototype.cmdUpdate = function(cmd, res, _)
{
	var user      = cmd.user;
	var pass      = cmd.pass;
	var spacename = cmd.space;
	var time      = cmd.time;
	var mseq      = cmd.mseq;

	if (!is(user))
		{ throw reject('user missing'); }

	if (!is(pass))
		{ throw reject('pass missing'); }

	if (this.$users[user].pass !== pass)
		{ throw reject('invalid password'); }

	if (!is(spacename))
		{ throw reject('space missing'); }

	var $space = this.$spaces[spacename];
	if (!$space)
		{ throw reject('unknown space'); }

	if (!(time >= 0 && time <= $space.$seqZ))
		{ throw reject('invalid or missing time'); }

	if (mseq < 0)
		{ mseq = this.$messages.length; }

	if (!(mseq <= this.$messages.length))
		{ throw reject('invalid or missing mseq: ' + mseq); }

	this.refreshPresence(user, spacename);

	var asw = this.conveyUpdate(time, mseq, spacename);

	// immediate answer?
	if (asw.chgs.length > 0 || asw.msgs.length > 0)
		{ return asw; }

	// if not immediate puts the request to sleep
	var sleepID = '' + this.$nextSleep++;

	var timerID = setTimeout(this.expireSleep, 60000, this, sleepID);

	this.$upsleep[sleepID] = {
		user      : user,
		time      : time,
		mseq      : mseq,
		timerID   : timerID,
		res       : res,
		spacename : spacename
	};

	res.sleepID = sleepID;

	this.establishPresence(user, spacename, sleepID);

	return null;

};

/**
| A sleeping update expired.
*/
Server.prototype.expireSleep = function(self, sleepID)
{
	var $sleep = self.$upsleep[sleepID];
	var $space = self.$spaces[$sleep.spacename];

	var $seqZ  = $space.$seqZ;
	delete self.$upsleep[sleepID];

	//TODO call it sleep.username
	self.destablishPresence($sleep.user, $sleep.spacename);

	var asw = {
		ok    : true,
		time  : $sleep.time,
		timeZ : $seqZ,
		chgs  : null
	};
	log('ajax', '->', asw);

	var res = $sleep.res;

	res.writeHead(200, {
		'Content-Type'  : 'application/json',
		'Cache-Control' : 'no-cache',
		'Date'          : new Date().toUTCString()
	});

	res.end(JSON.stringify(asw));

};

/**
| A sleeping update closed prematurely.
*/
Server.prototype.closeSleep = function(sleepID)
{
	var $sleep = this.$upsleep[sleepID];

	clearTimeout($sleep.timerID);

	delete this.$upsleep[sleepID];

	this.destablishPresence($sleep.user, $sleep.spacename);
};

/**
| Returns a result for an update operation.
*/
Server.prototype.conveyUpdate = function(time, mseq, spacename)
{
	var $space    = this.$spaces[spacename];
	var $changes  = $space.$changes;

	var $messages = this.$messages;
	var $seqZ     = $space.$seqZ;
	var msgZ      = $messages.length;
	var chgA      = [];
	var msgA      = [];

	for (var c = time; c < $seqZ; c++)
		{ chgA.push( $changes[c] ); }

	for (var m = mseq; m < msgZ; m++)
	{
		if ($messages[m].space !== spacename)
			{ continue; }

		msgA.push( $messages[m] );
	}

	return {
		ok    : true,
		time  : time,
		timeZ : $seqZ,
		chgs  : chgA,
		msgs  : msgA,
		mseq  : mseq,
		mseqZ : msgZ
	};
};

/**
| Wakes up any sleeping updates and gives them data if applicatable.
*/
Server.prototype.wake = function(spacename)
{
	var sleepKeys = Object.keys( this.$upsleep );

	// FIXME cache change lists to answer the same to multiple clients.

	for(var a = 0, aZ = sleepKeys.length; a < aZ; a++)
	{
		var sKey  = sleepKeys[a];
		var sleep = this.$upsleep[sKey];

		if (spacename !== sleep.spacename)
			{ continue; }

		clearTimeout(sleep.timerID);
		delete this.$upsleep[sKey];
		this.destablishPresence(sleep.user, sleep.spacename);

		var asw = this.conveyUpdate(sleep.time, sleep.mseq, sleep.spacename);
		var res = sleep.res;

		log('ajax', '->', asw);
		res.writeHead(200,
			{
				'Content-Type'  : 'application/json',
				'Cache-Control' : 'no-cache',
				'Date'          : new Date().toUTCString()
			}
		);

		res.end(JSON.stringify(asw));
	}
};

/**
| Tests if the user has access to a space.
*/
Server.prototype.testAccess = function(user, spacename)
{
	if (user === 'root')
		{ return 'rw'; }

	if (!Jools.isString(spacename))
		{ return 'no'; }

	switch (spacename)
	{
		case 'meshcraft:sandbox' :
			return 'rw';

		case 'meshcraft:home' :
			return user === config.admin ? 'rw' : 'ro';

		default :
			var sp = spacename.split(':', 2);

			if (sp.length < 2)
				{ return 'no'; }

			if (user == sp[0])
				{ return 'rw'; }

			return 'no';
	}
};

/**
| Executes a get command.
*/
Server.prototype.cmdGet = function(cmd, _)
{
	var time     = cmd.time;
	var user     = cmd.user;

	if (!is(this.$users[user]) || this.$users[user].pass !== cmd.pass)
		{ throw reject('wrong user/password'); }

	// TODO dont call it "time"
	if (!is(cmd.time))
		{ throw reject('time missing'); }

	if (!is(cmd.path))
		{ throw reject('path missing'); }

	var spacename = cmd.space;

	var access = this.testAccess(cmd.user, spacename);
	if (access == 'no')
		{ throw reject('no access'); }

	var $space = this.$spaces[spacename];
	if (!$space)
		{ throw reject('unknown space'); }

	var $changes = $space.$changes;
	var $seqZ    = $space.$seqZ;

	if (time === -1)
		{ time = $seqZ; }
	else if (!(time >= 0 && time <= $seqZ))
		{ throw reject('invalid time'); }

	var $tree = $space.$tree;

	// if the requested tree is not the latest, replay it backwards
	for (var $a = $seqZ - 1; $a >= time; $a--)
	{
		var chgX = $changes[$a].chgX;

		for (var b = 0; b < chgX.length; b++)
			{ $tree = MeshMashine.changeTree($tree, chgX[b].reverse()).tree; }
	}

	// returns the path requested
	var node;
	try
	{
		node = $tree.getPath(new Path(cmd.path));
	}
	catch(e)
	{
		throw reject('cannot get path: '+e.message);
	}

	return {
		ok     : true,
		access : access,
		time   : time,
		node   : node
	};
};


/**
| Logs and returns a web error
*/
Server.prototype.webError = function(res, code, message)
{
	res.writeHead(code, {
		'Content-Type'  : 'text/plain',
		'Cache-Control' : 'no-cache',
		'Date'          : new Date().toUTCString()
	});
	message = code+' '+message;
	log('web', 'error', code, message);
	res.end(message);
};


/**
| Checks if the request should be proxied
| Returns true if the proxy applies, false otherwise.
*/
Server.prototype.webRedirect = function(req, res)
{
	if (!config.redirect)
		{ return false; }

	var host = req.headers.host;
	var loc  = config.redirect[host];

	if (!loc)
		{ return false; }

	var locp = loc + req.url;
	log('web', 'redirect', '->', locp);

	res.writeHead(307, {
		'Content-Type'  : 'text/plain',
		'Cache-Control' : 'max-age=86400',
		'Date'          : new Date().toUTCString(),
		'Location'      : locp
	});
	res.end();

	return true;
};

/**
| Listens to http requests
*/
Server.prototype.requestListener = function(req, res)
{
	var red = url.parse(req.url);

	if (this.webRedirect(req, res))
		{ return; }

	log('web', req.connection.remoteAddress, red.href);

	var pathname = red.pathname.replace(/^[\/]+/g, '');
	if (pathname === 'mm')
		{ return this.webAjax(req, red, res); }

	var r = this.$resources[pathname];
	if (!r)
	{
		this.webError(res, '404 Bad Reqeust');
		return;
	}

	if (r.data)
	{
		var aenc = r.gzip && req.headers['accept-encoding'];
		var header = {
			'Content-Type'     : r.mime,
			'Cache-Control'    : r.opts.cache ? 'max-age=7884000' : 'no-cache',
			'Date'             : new Date().toUTCString()
		};
		if (aenc && aenc.indexOf('gzip') >= 0)
		{
			// delivers compressed
			header['Content-Encoding'] = 'gzip';
			res.writeHead(200, header);
			res.end(r.gzip, 'binary');
		}
		else
		{
			// delivers uncompressed
			res.writeHead(200, header);
			res.end(r.data, r.code);
		}
		return;
	}

	var self = this;

	fs.readFile(
		r.path,
		function(err, data)
		{
			if (err) {
				self.webError(res, 500, 'Internal Server Error');
				log('fail', 'Missing file: ' + r.path);
				return;
			}
			res.writeHead(200, {
				'Content-Type'  : r.mime,
				'Cache-Control' : r.opts.cache ? 'max-age=7884000' : 'no-cache',
				'Date'          : new Date().toUTCString()
			});
			res.end(data, r.code);
		}
	);
};


/**
| Handles ajax requests to the MeshMashine.
*/
Server.prototype.webAjax = function(req, red, res)
{
	var self = this;
	var data = [];

	if (req.method !== 'POST')
	{
		this.webError(res, 400, 'Must use POST');
		return;
	}

	req.on('close',
		function()
		{
			if (res.sleepID)
				{ self.closeSleep(res.sleepID); }
		}
	);

	req.on('data',
		function(chunk)
		{
			data.push(chunk);
		}
	);

	req.on('end',
		function() {
			var query = data.join('');
			var asw, cmd;

			log('ajax', '<-', query);

			try
				{ cmd = JSON.parse(query); }
			catch (err)
			{
				self.webError(res, 400, 'Not valid JSON');
				return;
			}

			asw = self.ajaxCmd(cmd, res,
				function(e, asw) {
					if (e)
					{
						if (e.ok !== false)
							{ throw e; }
						else
						{
							asw = {
								ok : false,
								message : e.message
							};
						}
					}

					if (asw === null)
						{ return; }

					log('ajax', '->', asw);

					res.writeHead( 200,
						{
							'Content-Type'  : 'application/json',
							'Cache-Control' : 'no-cache',
							'Date'          : new Date().toUTCString()
						}
					);
					res.end(JSON.stringify(asw));
				}
			);
		}
	);
};

/**
| Executes an ajaxCmd
*/
Server.prototype.ajaxCmd = function( cmd, res, _)
{
	switch ( cmd.cmd )
	{
		case 'alter'    :
			return this.cmdAlter (cmd, _);

		case 'auth'     :
			return this.cmdAuth (cmd, _);

		case 'get'      :
			return this.cmdGet (cmd, _);

		case 'message'  :
			return this.cmdMessage (cmd, _);

		case 'register' :
			return this.cmdRegister (cmd, _);

		case 'update'   :
			return this.cmdUpdate (cmd, res, _);

		default:
			return reject('unknown command');
	}
};

new Server(
	function(err) {
		if (err)
			{ throw err; }
	}
);

})();
