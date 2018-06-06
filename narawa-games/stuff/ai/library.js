var library = {
	objects : {
		"cube" : {
			actions : {
				"bend" : library.actions["bend"](library.objects.cube)
			},
			properties : [library.properties["hard"]],
			parents : [],
			events: [],
			children: []
		}
	},
	actions : {
		"bend" : function(actionedObject) {
			actionedObject.properties.push(library.properties["bent"]);
		}
	},
	properties : {
		"hard" : {
			description : "Being hard means you cannot bend this object",
		}
	},
	events : {
		
	},
	locations : {
		"the room" : {
			children: []
		}
	},
	rules : {
		"bend" : {
			reason : "This object is made of a hard material",
			effective : "if (contains(ruledObject.properties, library.properties['hard']))",
			type : "don't"
		}
	}
};
var objects = {
};

//All of this code basically means "make a cube located in 'the room' that is hard which means it cannot be bent."