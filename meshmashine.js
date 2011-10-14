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
/*
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
	var copy = {}
	for(var i in original) {
		copy[i] = clone(original[i]);
	}
	return copy;
}

/**
| Returns true is s is a string.
*/
function isString(s) {
	return typeof(s) === 'string' || s instanceof String;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.           .   ,-,-,-.           .
 `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
   | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
   '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| ifail: function(message), called on internal fail of meshmashine.
*/
function MeshMashine(ifail) {
	this.repository = {};
	this.history    = [];
	this.ridfactory = 1;
	this.ifail      = ifail;
	this.types      = MeshMashine.types;
}

/**
| Each meshmashine node must be of one of these types.
*/
MeshMashine.types = {
	/********************
	| Build in primes.
	********************/

	/**
	| an integer number.
	|
	| valid functions:
	|    set
	*/
	int        : true,

	/**
	| An array of node ids
	|
	| valid functions:
	|   enqueue
	|   dequeue
	*/
	trail      : true,

	/**
	| An area where partial changes may done.
	|
	| This is the place where most of the causal consistency,
	| operation tranformation takes place.
	| valid functions:
	|    transform
	*/
	field      : true,

	/********************
	| Collectives.
	********************/

	point : {
		x : { required : true, typename : 'int'},
		y : { required : true, typename : 'int'},
	},

	note : {
		pnw   : { required: true,  typename: 'point' },
		pse   : { required: true,  typename: 'point' },
		dtree : { required: false, typename: 'trail' },
	}
};

/**
| Checks if an meshmashine object matches in a meshmashine type.
|
| obj:      the object to check
| type:     the typename of the object
*/
MeshMashine.prototype._typecheck = function(obj, typename) {
	var type = this.types[typename];
	switch(typeof(type)) {
	case 'undefined' :
		return ' unknown type "'+typename+'"';
	case 'boolean' :
		// a primitve
		switch(typename) {
		case 'int' :
			return typeof(obj) !== 'number' ? ' not a number' :
				(Math.floor(obj) !== obj ? ' number not integer' : true);
		case 'trail' :
			return typeof(obj) !== 'object' ? ' not a trail' : true;
		case 'field' :
			return typeof(obj) !== 'object' || !obj instanceof String ? ' not a field' : true;
		default :
			this.ifail('unknown primitve '+type);
		}
	case 'object' :
		// a collective
		for(var key in obj) {
			if (key === 'id' || key === 'type') continue;
			if (!type[key]) return '.'+key+' not in type';
			var asw = this._typecheck(obj[key], type[key].typename);
			if (asw !== true) {
				return '.' + key + asw;
			}
		}
		for(var key in type) {
			if (type[key].required && typeof(obj[key]) === 'undefined') {
				return '.' + key + ' required but missing';
			}
		}
		return true;
	}
}

/**
| Returns true if the root node with 'rid' exists at histpos.
*/
MeshMashine.prototype._isNodeThere = function(histpos, rid) {
	var there = !!this.repository[rid].node;
	for(var hi = this.history.length - 1; hi >= histpos; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create' :
			if (h.rid === rid) there = false;
			break;
		case 'remove' :
			if (h.rid === rid) there = true;
			break;
		}
	}
	return there;
}

/**
| Returns true if histpos is valid.
*/
MeshMashine.prototype._isValidHistpos = function(histpos) {
	return typeof(histpos) === 'number' && histpos <= this.history.length && histpos >= 0;
}

/**
| Returns the root id of an id(array)
*/
MeshMashine.prototype._getRID = function(ida) {
	if (typeof(ida) === 'number') return ida;
	if (typeof(ida) !== 'object') return null;
	var rid = ida[0];
	if (typeof(rid) !== 'number') return null;
	return rid;
}

/**
| Returns the type an id(array) points to
*/
MeshMashine.prototype._getType = function(ida) {
	var rid = typeof(ida) === 'number' ? ida : ida[0];
	if (!this.repository[rid]) return null;
	var typename = this.repository[rid].typename;
	var type = this.types[typename];
	if (!type) this.ifail('invalid type in repository: '+typename);
	if (typeof(ida) === 'number') return type;
	for(var i = 1; i < ida.length; i++) {
		if (!type[ida[i]]) return null;
		var typename = type[ida[i]].typename;
		var type = this.types[typename];
		if (!type) this.ifail('invalid type in repository: '+typename);
	}
	return type;
}

/**
| Creates a node to be added in repository.
| Returns the rood id.
*/
MeshMashine.prototype.create = function(histpos, typename, node) {
	var type = this.types[typename];
	if (!type)   return {code: false, message: 'unknown node type'};
	if (!node)   return {code: false, message: 'invalid node'};
	var typecheck = this._typecheck(node, typename);
	if (typecheck !== true) return {code: false, message: typecheck};

	node = clone(node);
	var rid = this.ridfactory++;
	this.repository[rid] = {typename: typename, node : node};
	this.history.push({cmd: 'create', rid: rid, node: node});
	return {code: true, histpos: histpos, rid: rid};
}

/**
| Removes a node from the repository.
*/
MeshMashine.prototype.remove = function(histpos, rid) {
	if (!this._isValidHistpos(histpos))   return {code: false, message: 'invalid histpos'};
	if (typeof(rid) !== 'number')         return {code: false, message: 'invalid root id type'};
	if (!this._isNodeThere(histpos, rid)) return {code: false, message: 'node not there'};
	if (!this.repository[rid].node)       return {code: true,  message: 'already removed'};

	this.history.push({cmd: 'remove', rid: rid, save: this.repository[rid].node});
	this.repository[id].node = null;
	return {code: true, histpos: histpos};
}

/**
| Returns a complete copy of the repository at histpos
*/
MeshMashine.prototype.reflect = function(histpos) {
	if (!this._isValidHistpos(histpos))   return {code: false, message: 'invalid histpos'};

	var reflect = clone(this.repository);
	for(var hi = this.history.length - 1; hi >= histpos; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create':
			if (!reflect[h.rid].node) {
				this.ifail('history mismatch, created node not there.');
			}
			reflect[h.rid].node = null;
			break;
		case 'remove':
			if (reflect[h.rid].node) {
				this.ifail('history mismatch, removed node there.');
			}
			reflect[h.rid].node = clone(h.save);
			break;
		default:
			this.ifail('history mismatch, unknown command.');
		}
	}

	// remove empty entries
	for(var i in reflect) if (reflect[i].node === null) delete reflect[i];

	return {code: true, histpos: histpos, reflect : reflect};
}

/**
| Gets a node or entry.
*/
MeshMashine.prototype.get = function(histpos, ida) {
	if (!this._isValidHistpos(histpos)) return {code: false, message: 'invalid histpos'};
	var rid = this._getRID(ida);
	if (rid === null) return {code: false, message: 'invalid id'};
	var type = this._getType(ida);
	if (!type) return {code: false, message: 'invalid ida'};

	var typename = this.repository[rid].typename;
	var node = this.repository[rid].node;

	// todo history.

	if (typeof(ida) === 'number') return {code: true, histpos: histpos, entry: node};
	for(var i = 1; i < ida.length; i++) {
		node = node[ida[i]];
		if (typeof(node) !== 'object') return {code: true, histpos: histpos, entry: node};
	}
	return {code: true, histpos: histpos, entry: node};
}

/**
| Sets a settable entry.
*/
MeshMashine.prototype.set = function(histpos, ida, value) {
	/*
	if (typeof(histpos) !== 'number' || histpos > this.history.length || histpos < 0) {
		return {code: false, message: 'invalid histpos'};
	}
	var rid;
	switch(typeof(ida)) {
	case 'number' :
		rid = ida;
		break;
	case 'array' :
		rid = ida[0];
		if (typeof(rid) !== 'number') {
			return {code: false, message: 'id faulty'};
		}
		break;
	default :
		return {code: false, message: 'id faulty'};
	}

	if (!this._isNodeThere(histpos, rid)) {
		return {code: false, message: 'node not there'};
	}
	var node = this.repository[rid];
	if (!node) {
		return {code: true, message: 'node was removed'};
	}

	var check = this.checkValue(node.type, ida,


	if (this._checkValueType(ida, value)) {

	}
*/
}

/**
| Returns all changes from histpos to now.
*/
MeshMashine.prototype.update = function(histpos) {
	if (!this._isValidHistpos(histpos))   return {code: false, message: 'invalid histpos'};
	var update = [];
	for(var hi = histpos; hi < this.history.length; hi++) {
		update.push(clone(this.history[hi]));
	}
	return {code: true, histpos: this.history.length, update: update };
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'      .
 `- | ,-. ,-. |- . ,-. ,-.
  , | |-' `-. |  | | | | |
  `-' `-' `-' `' ' ' ' `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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
	'create' : function(out, context, line, args) {
		var reg = /\s*\S+\s+(\S+)\s+(.*)/g.exec(line);
		if (!reg) {
			out.write('syntax: create TYPE JSON.\n');
			return true;
		}
		var type = reg[1];
		var json = reg[2];
		var js;
		try {
			js = JSON.parse(json);
		} catch(err) {
			out.write('not a valid json: '+err.message+'\n');
			return true;
		}
		var asw = mm.create(context.histpos, type, js);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'histpos' : function(out, context, line, args) {
		if (typeof(args[1]) === 'undefined') {
			out.write('histpos: '+context.histpos+'\n');
			return true;
		}
		var histpos = parseInt(args[1]);
		if (histpos !== histpos) {
			out.write('"'+args[1]+'" not a number'+'\n');
			return true;
		}
		context.histpos = histpos;
		out.write('histpos:='+context.histpos+'\n');
		return true;
	},

	'reflect' : function(out, context, line, args) {
		var asw = mm.reflect(context.histpos);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'remove' : function(out, context, line, args) {
		if (typeof(args[1]) === 'undefined') {
			out.write('id missing\n');
			out.write('syntax: remove ID.\n');
			return true;
		}
		var id = parseInt(args[1]);
		if (id !== id) {
			out.write('"'+args[1]+'" not a number'+'\n');
			return true;
		}
		var asw = mm.remove(context.histpos, id);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'set' : function(out, context, line, args) {
		if (typeof(args[1]) === 'undefined') {
			out.write('id missing\n');
			out.write('syntax: set ID JSON.\n');
			return true;
		}
		var json = /\s*\S+\s+\S+\s+(.*)/g.exec(line)[1];
		var js;
		try {
			js = JSON.parse(json);
		} catch(err) {
			out.write('Argument not a valid json: '+err.message+'\n');
			return true;
		}
		var asw = mm.set(context.histpos, id, js);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'get' : function(out, context, line, args) {
		var reg = /\s*\S+\s+(.*)/g.exec(line);
		if (!reg) {
			out.write('syntax: get ID(json).\n');
			return true;
		}
		var idstr = reg[1];
		var jsid;
		try {
			jsid = JSON.parse(idstr);
		} catch(err) {
			out.write('not a valid json: '+err.message+'\n');
			return true;
		}
		var asw = mm.get(context.histpos, jsid);
		out.write(util.inspect(asw, false, null)+'\n');
		return true;
	},

	'update' : function(out, context, line, args) {
		var asw = mm.update(context.histpos);
		out.write(util.inspect(asw, false, null)+'\n');
		if (asw.code) context.histpos = asw.histpos;
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
	context = { histpos : 0 };
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


//var server = net.createServer(function(c) {
//	c.setNoDelay(true);
//	createShell(c, c);
//});
//server.listen(8823, '127.0.0.1');

createShell(process.stdin, process.stdout, function() {
	process.stdout.write('\n');
	process.stdin.destroy();
//	process.exit();
});

