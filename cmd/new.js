{
  cmd: 'alter',
  time: -1,
  src: {
    val: {
      type: 'Note',
      zone: {
        pnw : { x: 400, y: 100 },
        pse : { x: 500, y: 200 },
      },
      doc: {
         alley : [
          {
            type: 'Para',
            text: 'Muhkuh',
          },
        ],
      },
	},
  },
  trg: {
    path: ['welcome', 'items', '$new'],
  },
}

