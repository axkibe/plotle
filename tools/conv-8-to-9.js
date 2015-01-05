#!/bin/bash
set -e
node --harmony src/tools/genjion.js jion/listing-genjion.js
node --harmony src/tools/genjion.js jion/listing-server.js
node --harmony src/tools/conv-8-to-9.js
