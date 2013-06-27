settings {
	nodaemon = true,
	delay = 1
}

local command = './jshint'

sync {
	{
		init = function(event)
			spawnShell(event, command)
		end,

		action = function(inlet)
			local list = inlet.getEvents()
			spawnShell(list, command)
		end
	},

	delay = 1,
	maxProcesses = 1,
	source = "./"
}
