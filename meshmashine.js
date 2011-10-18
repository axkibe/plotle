/**     __  __   ___         __.....__               .
       |  |/  `.'   `.   .-''         '.           .'|
       |   .-.  .-.   ' /     .-''"'-.  `.        <  |
       |  |  |  |  |  |/     /________\   \        | |         .----------.
       |  |  |  |  |  ||                  |    _   | | .'''-. /            \
       |  |  |  |  |  |\    .-------------'  .' |  | |/.'''. \\            /
       |  |  |  |  |  | \    '-.____...---. .   | /|  /    | | '----------'
       |__|  |__|  |__|  `.             .'.'.'| |//| |     | |
                           `''-...... -'.'.'.-'  / | |     | |
                                        .'   \_.'  | '.    | '.
                                                   '---'   '---'
  __  __   ___                          .        .--.   _..._         __.....__
 |  |/  `.'   `.                      .'|        |__| .'     '.   .-''         '.
 |   .-.  .-.   '                    <  |        .--..   .-.   . /     .-''"'-.  `.
 |  |  |  |  |  |    __               | |        |  ||  '   '  |/     /________\   \
 |  |  |  |  |  | .:--.'.         _   | | .'''-. |  ||  |   |  ||                  |
 |  |  |  |  |  |/ |   \ |      .' |  | |/.'''. \|  ||  |   |  |\    .-------------'
 |  |  |  |  |  |`" __ | |     .   | /|  /    | ||  ||  |   |  | \    '-.____...---.
 |__|  |__|  |__| .'.''| |   .'.'| |//| |     | ||__||  |   |  |  `.             .'
                 / /   | |_.'.'.-'  / | |     | |    |  |   |  |    `''-...... -'
                 \ \._,\ '/.'   \_.'  | '.    | '.   |  |   |  |
                  `--'  `"            '---'   '---'  '--'   ''*/
/**
| The causal consistency / operation transformation engine for meshcraft.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/


/**
| Deep copies an object.
*/
function clone(original) {
	if(typeof(original) !== 'object' || original === null) {
		return original;
	}
	if (original instanceof Array) {
		return original.slice();
	}

	var copy = {}
	for(var i in original) {
		copy[i] = clone(original[i]);
	}
	return copy;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.           .   ,-,-,-.           .
 `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
   | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
   '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Sets the value of an entry.
| This functions makes no checks anymore.
| Returns node (possibly changed)
|
| node:  the repo or part of
| path:  path to the value (relative to node)
| value: the new value to set
| save:  if not null sets here the old value as .save
*/
function mmSet(node, path, value, save) {
	if (path.length === 0) {
		if (save) save.save = node;
		return value;
	}

	var subnode = node;
	for(var i = 0; i < path.length - 1; i++) {
		subnode = subnode[path[i]];
	}

	var last = path[path.length -1];
	var save = subnode[last];
	subnode[last] = value;
	return node;
}

function mmGet(node, path) {
	var subnode = node;
	for (var i = 0; i < path.length; i++) {
		subnode = subnode[path[i]];
	}
	return subnode;
}

/**
| Constructor.
|
| ifail: function(message), called on internal fail of meshmashine.
*/
function MeshMashine(ifail) {
	this.repository = { _grow : 1 };
	this.history    = [];
	this.idfactory  = 1;
	this.ifail      = ifail;
}

/**
| Returns true if the root node of path exists at time.
*/
MeshMashine.prototype._isRootThere = function(time, path) {
	var there = !!this.repository[ida[0]];
	for(var hi = this.history.length - 1; hi >= time; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create' :
			if (h.path[0] === path[0]) there = false;
			break;
		case 'remove' :
			if (h.path[0] === path[0]) there = true;
			break;
		}
	}
	return there;
}

/**
| Returns true if time is valid.
*/
MeshMashine.prototype._isValidTime = function(time) {
	return typeof(time) === 'number' && time >= 0 && time <= this.history.length;
}

/**
| Returns true if path is valid.
*/
MeshMashine.prototype._isValidPath = function(path) {
	if (!path instanceof Array || path.length === 0) return false;
	for (var pi = 0; pi < path.length; pi++) {
		var p = path[pi];
		if (!p) return false;
		if (p[0] === '_') return false;
	}
	return true;
}

/**
| Reflects the state of the repository at time.
| If ida is not null it cares only to rebuild what is necessary to see the ida.
*/
// todo partial reflects
MeshMashine.prototype._reflect = function(time, path) {
	var reflect = clone(this.repository);

	// playback
	for(var hi = this.history.length - 1; hi >= time; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create':
			if (!reflect[h.path[0]]) this.ifail('history mismatch, created node not there.');
			reflect[h.path[0]].node = null;
			break;
		case 'remove':
			if (reflect[h.path[0]]) this.ifail('history mismatch, removed node there.');
			reflect[h.path[0]] = clone(h.save);
			break;
		case 'set' :
			mmSet(reflect, h.path, h.save);
			break;
		default:
			this.ifail('history mismatch, unknown command.');
		}
	}
	return reflect;
}


/**
| Creates a root node to be added in repository.
| Returns the rood id.
*/
MeshMashine.prototype.create = function(time, node) {
	if (node === null) return {code: false, message: 'null node'};
	var path = [this.ridfactory++];
	this.repository[path[0]] = node;
	this.history.push({cmd: 'create', path: path, node: node});
	return {code: true, time: time, path: path};
}

/**
| Gets a node or entry.
*/
MeshMashine.prototype.get = function(time, path) {
	if (!this._isValidTime(time)) return {code: false, message: 'invalid time'};

	var reflect = this._reflect(time, path);

	return {code: true, time: time, entry: mmGet(reflect, path) };
}

/**
| Returns a complete copy of the repository at time
*/
MeshMashine.prototype.reflect = function(time) {
	if (!this._isValidTime(time))   return {code: false, message: 'invalid time'};

	var reflect = this._reflect(time);

	for(var key in reflect) {
		if (reflect[key] === null) delete reflect[key];
	}

	return {code: true, time: time, reflect : reflect};
}

/**
| Sets a setable entry.
*/
MeshMashine.prototype.set = function(time, path, value) {
	if (!this._isValidTime(time)) return {code: false, message: 'invalid time'};
	if (!this._isValidPath(time)) return {code: false, message: 'invalid path'};


	var node = this.repository;
	var pi;
	for (pi = 0; pi < path.length - 1; pi++) {
		node = node[path[pi]];
		if (typeof(node) === 'undefined') return {code: false, message: 'path points nowhere'};
	}

	if (path[pi] === -1) {
		// append to end.
		if (!node._grow) return {code: false, message: 'node not growable'};
		path[pi] = node._grow++;
	}

	var save = node[path[pi]] || null;
	node[path[pi]] = value;

	this.history.push({cmd: 'set', path: path, save: save, value : value});
	return {code: true, time: time, path: path, save: save};
}

/**
| Returns all changes from time to now.
*/
MeshMashine.prototype.update = function(time) {
	if (!this._isValidTime(time))   return {code: false, message: 'invalid time'};
	var update = [];
	for(var ti = time; ti < this.history.length; ti++) {
		update.push((this.history[ti]));
	}
	return {code: true, time: this.history.length, update: update };
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'      .
 `- | ,-. ,-. |- . ,-. ,-.
  , | |-' `-. |  | | | | |
  `-' `-' `-' `' ' ' ' `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Turns a JSON String to object.
*/
function j2o(json) {
	try {
		return JSON.parse(json);
	} catch(err) {
		j2o.message = err.message;
		return null;
	}
}

function mmfail(message) {
	console.log('internal fail: '+message);
	process.exit(-1);
}
var mm = new MeshMashine(mmfail);

var fs         = require('fs');
var net        = require('net');
var readline   = require('readline');
var util       = require('util');

// loads command history
var fhist = fs.readFileSync('./cmdhistory.txt').toString().split('\n');
var chist = [];
for (var fi = fhist.length - 2; fi >= 0; fi--) {
	chist.push(fhist[fi]);
}

var cmdhistory = fs.createWriteStream('./cmdhistory.txt', {'flags': 'a'});

var shell = {
	'time' : function(out, context, line, args) {
		if (typeof(args[1]) === 'undefined') {
			out.write('time: '+context.time+'\n');
			return true;
		}
		var time = parseInt(args[1]);
		if (time !== time) {
			out.write('"'+args[1]+'" not a number'+'\n');
			return true;
		}
		context.time = time;
		out.write('time:='+context.time+'\n');
		return true;
	},

	'reflect' : function(out, context, line, args) {
		var asw = mm.reflect(context.time);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'set' : function(out, context, line, args) {
		//var reg = /\s*\S+\s+(\[[^\]]*\]|\S+)\s+(.*)/g.exec(line);
		var reg = /\s*\S+\s+(\[[^\]]*\])\s+(.*)/g.exec(line);
		var path, value;
		if (!reg ||
			(path  = j2o(reg[1])) === null ||
			(value = j2o(reg[2])) === null)
		{
			out.write('syntax: set PATH VALUE.\n');
			return true;
		}
		var asw = mm.set(context.time, path, value);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'get' : function(out, context, line, args) {
		var reg = /\s*\S+\s+(.*)/g.exec(line);
		var path;
		if (!reg || (path = j2o(reg[1])) === null) {
			out.write('syntax: get PATH.\n');
			return true;
		}
		var asw = mm.get(context.time, path);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'update' : function(out, context, line, args) {
		var asw = mm.update(context.time);
		out.write(util.inspect(asw, false, null)+'\n');
		if (asw.code) context.time = asw.time;
		return true;
	},


	'quit' : function(out, context, line, args) {
		return false;
	},
};

function completer(sub) {
	var sublist = [];
	for (var s in shell) {
		if (s.substr(0, sub.length) === sub) {
			sublist.push(s+' ');
		}
	}
	return [sublist, sub];
}

function parsePrompt(out, context, line) {
	var commandlist = context.commandlist;
	var reg = /\s*(\S+)\s*/g;
	var args = [];
	for(var ca = reg.exec(line); ca != null; ca = reg.exec(line)) {
		args.push(ca[1]);
	}
	if (typeof(args[0]) === 'undefined') return true;
	cmdhistory.write(line+'\n');
	if (shell[args[0]]) return shell[args[0]](out, context, line, args);
	out.write('unknown command "'+args[0]+'"\n"');
	return true;
}

function createShell(input, output, closer) {
	var shell = readline.createInterface(input, output, completer);

	shell.history = chist;

	shell.prompt();
	context = { time : 0 };
	shell.on('line', function (line) {
		if (!parsePrompt(output, context, line)) {
			shell.close();
			input.destroy();
			return;
		}
		shell.prompt();
	});
	if (closer) shell.on('close', closer);
	return shell;
}


createShell(process.stdin, process.stdout, function() {
	process.stdout.write('\n');
	process.stdin.destroy();
});

