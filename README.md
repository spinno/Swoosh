# Swoosh #

Swoosh is a quick declarative way to speed up basic persistent-layer stuff.

To use swoosh, one simple create a yaml file, for example named swoosh.yml
`
	# The database url.
	database: mongodb://<user>:<pass>@host.com:port
	# Here we define all objects.
	objects:
		# Defining the users object.
	    users:
	    	# The objects field.
	        fields:
	            name: String
	            pass: String
	        # What kind of restful request should the object handle?
	        methods:
	            - get
	            - put
	            - post
	        # Optionally you can specify what fields you want to respond with
	        # This for example would make a get-request only deliver the name of the user.
	        public:
	        	- name
`

then to use swoosh in node simply
`
path = require('path');

piece(path.join(__dirname, "piece.yml"), function(err, objects){
	if(err) console.log("Err :(", err);
	else {
		// automatic routing only works with express.
		this.route(app);

		/*
		Swoosh it not only useable when you need to route, but provide
		neat ways to send requests from node aswell.

		For example to create a new user we simply write.
		*/
		objects["users"].post({
			name: "Bob",
			pass: "superSecret"
			}, function(bob) {
				console.log(bob.name);
			});
	}
});
`

Currently swoosh automatically routes to: "/persistent/name" but more flexibility is to be added.

This package is still in a very early stage, but if people find it interesting I would love to improve it further.