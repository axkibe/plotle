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

function MeshMashine() {
	this.repo = {};

	/*this.types = {
		z : {
			trail: 'trail',
		},
		note  : {
			pnw : 'point',
			psw : 'point',
			dtree : 'link',
		},
		dtree : {
			trail: 'trail',
		},
		para : {
			trail: 'trail',
		},
		text : {
			text: 'assembly',
		}
	};*/

	this.idfactory = 1;

	this.z = { trail: [] };
}

MeshMashine.prototype.command = function(version, command) {
	//xxx
}

MeshMashine.prototype._create = function(njs) {
	if (!njs.type) return 'error: create node has no type';
	var node = { type: njs.d, id: idfactory++ };
	this.repo[node.id] = node;
	this.repo.z.trail.push(node.id);
	return nid;
}

//-----------------------------------------------------------
// Testing
//-----------------------------------------------------------

var mm = new MeshMashine();

var readline = require('readline');
function showCommand(out, command) {
	out.write('command:\n');
	for(var i = 0; i < command.length; i++) {
		out.write(i, '?\n');
	}
}

// todo remove
function parsePrompt(out, context, line) {
	var command = context.command;
	var reg = /\s*(\S+)\s*/g;
	var para = [];
	for(var ca = reg.exec(line); ca != null; ca = reg.exec(line)) {
		para.push(ca[1]);
	}
	if (typeof(para[0]) === 'undefined') return true;
	switch (para[0]) {
	case 'command' :
		showCommand(command);
		return true;
	case 'create' :
		var js;
		out.write(para[1]);
		try {
			js = JSON.parse(para[1]);
		} catch(err) {
			out.write('not a valid json.\n');
			return true;
		}
		command.push({cmd: 'create', js: js});
		return true;
	case 'q':
	case 'quit':
		return false;
	case 'submit' :
		//mm.command(['create': {}])
		out.write('submit\n');
		return true;
	case 'show' :
		out.write('show.\n');
		return true;
	default :
		out.write('unknown command\n');
		return true;
	}
}

var prompt = readline.createInterface(process.stdin, process.stdout, null);
prompt.prompt();
context = { command: [] };
prompt.on('line', function (line) {
	if (!parsePrompt(process.stdout, context, line)) {
		prompt.close();
		process.stdin.destroy();
	}
	prompt.prompt();
});
prompt.on('close', function() {
	process.stdout.write('\n');
	process.stdin.destroy();
});
