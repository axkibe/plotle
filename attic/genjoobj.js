/*
| Generates the Joobj for a resource
*/
Server.prototype.generateJoobj =
	function*(
		r
	)
{
	var
		data =
			yield fs.readFile(
				r.filepath,
				resume( )
			),

		joobj =
			vm.runInNewContext(
				data,
				{
					JOOBJ :
						true
				},
				r.filepath
			);

	Jools.log(
		'start',
		'generating ' + r.aliases[ 0 ]
	);

	data =
		joobjGenerator( joobj );

	// updates the generated file
	yield fs.writeFile(
		'joobj/' + r.aliases[ 0 ],
		data,
		resume( )
	);

	return data;
};

