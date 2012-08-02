Installing a MeshCraft instance
===============================

* Have Node.js installed, version >= 0.8, see http://nodejs.org

* Have mongodb installed

* Clone the meshcraft repository and go into that directory
```shell
git clone XXX
cd meshcraft
```

* Install streamline (an awesome utility to simply Node.js coding) It has a global and a local part, so you have to call npm twice
```shell
sudo npm -g install streamline
npm install streamline
```

* Install following node modules in the MeshCraft directory
```shell
npm install mongodb
npm install uglify-js
```

* Edit config.js with your favorite editor.
You likely want to rename the admin user. By default MeshCraft uses port 8833, if you want to run on the standard web port, change it to 80. In that case it needs to run with root priviledges.

* Start a screen to be keep the Node.js process running if you close the terminal. Can be skipped for development/shorttermed use
```shell
screen
```

* Start the MeshCraft process
```shell
./run
```

* If you did not skip ```screen```, you can detach the screen with CTRL+A D

* Take your browser and surf to ```http://localhost:8833/``` (assuming default settings)

* Register your admin user. The admin user is the only one who can edit the "meshcraft:home" space.

* Done!

Note that http://localhost:8833/devel.html serves a non-compressed version of the shell, useful for debugging. This one is also not cached so that always the newest version on disc will be delivered.
