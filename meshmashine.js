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
| This is the client-side script for the user interface.
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
	this.repository = { z: [] };
	this.history = [];
	this.idfactory = 1;
	this.ifail = ifail;
}

/**
| Each meshmashine node must be of one of these types.
*/
MeshMashine.types = {
	// --- build in primes ---
	// whole-number
	int        : true,

	// an array of node ids
	trail      : true,

	// an area where partial changes may done
	// this is the place where causal consistency /
	// operation tranformation must take place
	field      : true,

	// --- collectives ---

	point : {
		x : { required : true, type : 'int'},
		y : { required : true, type : 'int'},
	},


	note : {
		pnw   : { required: true,  type: 'point' },
		pse   : { required: true,  type: 'point' },
		dtree : { required: false, type: 'trail'},
	}
};

/**
| Checks if an meshmashine object matches in a meshmashine type.
*/
MeshMashine.prototype.check = function(obj, type) {
	if (typeof(type) === 'undefined') {
		// this is a root object.
		if (!obj.type) return 'type missing';
		type = obj.type;
	}
	var typedesc = MeshMashine.types[type];
	switch(typeof(typedesc)) {
	case 'undefined' :
		return ' unknown type "'+type+'"';
	case 'boolean' :
		// a primitve
		switch(type) {
		case 'int' :
			return typeof(obj) !== 'number' ? ' not a number' :
				(Math.floor(obj) !== obj ? ' number not integer' : true);
		case 'trail' :
			return typeof(obj) !== 'array' ? ' not a trail' : true;
		case 'field' :
			return typeof(obj) !== 'object' || !obj.substr ? ' not a field' : true;
		default :
			ifail('unknown primitve '+type);
		}
	case 'object' :
		// a collective
		for(var key in obj) {
			if (key === 'id' || key === 'type') continue;
			if (!typedesc[key]) return '.'+key+' not in type';
			var asw = this.check(obj[key], typedesc[key].type);
			if (asw !== true) {
				return '.' + key + asw;
			}
		}
		for(var key in typedesc) {
			if (typedesc[key].required && typeof(obj[key]) === 'undefined') {
				return '.' + key + ' required but missing';
			}
		}
		return true;
	}
}


/**
| Creates a node to be added in repository.
| An id will be added.
*/
MeshMashine.prototype.create = function(histpos, node) {
	if (!node.type) {
		return {code: false, message: 'node has no type'};
	}
	if (!MeshMashine.types[node.type]) {
		return {code: false, message: 'unknown node type'};
	}
	if (node.id) {
		return {code: false, message: 'node already has an id'};
	}

	var check = this.check(node);
	if (check !== true) {
		return {code: false, message: check};
	}

	node = clone(node);
	var id = node.id = this.idfactory++;
	this.repository[id] = node;
	this.history.push({cmd: 'create', id: id, node: node});
	return {code: true, histpos: histpos, id: id};
}

/**
| Removes a node from the repository.
*/
MeshMashine.prototype.remove = function(histpos, id) {
	if (typeof(histpos) !== 'number' || histpos > this.history.length || histpos < 0) {
		return {code: false, message: 'invalid histpos'};
	}
	if (typeof(id) !== 'number') {
		return {code: false, message: 'invalid id type'};
	}

	// checks if the node is there at histpos
	// this is a double-check can be cut out.
	var there = !!this.repository[id];
	for(var hi = this.history.length - 1; hi >= histpos; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create' :
			if (h.id === id) there = false;
			break;
		case 'remove' :
			if (h.id === id) there = true;
			break;
		}
	}
	if (!there) {
		return {code: false, message: 'node not there'};
	}

	// if anyway not in current repository this is a null action.
	if (!this.repository[id]) {
		// not in the current respository.
		return {code: true };
	}

	this.history.push({cmd: 'remove', id: id, save: this.repository[id]});
	delete this.repository[id]; // or set null?
	return {code: true, histpos: histpos};
}

/**
| Returns a copy of the repository at histpos
*/
MeshMashine.prototype.reflect = function(histpos) {
	if (typeof(histpos) !== 'number' || histpos > this.history.length || histpos < 0) {
		return {code: false, message: 'invalid histpos'};
	}
	var reflect = clone(this.repository);

	for(var hi = this.history.length - 1; hi >= histpos; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create':
			if (!reflect[h.node.id]) {
				this.ifail('history mismatch, created node not there.');
			}
			delete reflect[h.node.id];
			break;
		case 'remove':
			if (reflect[h.id]) {
				this.ifail('history mismatch, removed node there.');
			}
			reflect[h.id] = clone(h.save);
			break;
		default:
			this.ifail('history mismatch, unknown command.');
		}
	}

	return {code: true, histpos: histpos, reflect : reflect};

}

MeshMashine.prototype.update = function(histpos) {
	if (typeof(histpos) !== 'number' || histpos > this.history.length || histpos < 0) {
		return {code: false, message: 'invalid histpos'};
	}
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
	console.log('internal fail:' + message);
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
		var json = /\s*\S+\s*(.*)/g.exec(line)[1];
		var js;
		try {
			js = JSON.parse(json);
		} catch(err) {
			out.write('Argument not a valid json: '+err.message+'\n');
			return true;
		}
		var asw = mm.create(context.histpos, js);
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

	'show' : function(out, context, line, args) {
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

