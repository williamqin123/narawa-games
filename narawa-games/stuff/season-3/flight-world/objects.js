function create() {

	var universalBasicObjectMaterial = new THREE.MeshLambertMaterial({
		side: THREE.DoubleSide,
		castShadow: true,
		receiveShadow: true
	});

	objects = {
		grass: {
			geometry: new THREE.PlaneGeometry(50000, 50000, 500),
			material: clone(universalBasicObjectMaterial),
			position: {
				x: 0,
				y: 0,
				z: 0
			},
			code: function() {

			}
		},
		rock: {
			geometry: new THREE.PlaneGeometry(50000, 50000, 500),
			material: clone(universalBasicObjectMaterial),
			position: {
				x: 0,
				y: 0,
				z: 0
			},
			code: function() {

			}
		},
		ocean: {
			geometry: new THREE.PlaneGeometry(100000, 100000),
			material: clone(universalBasicObjectMaterial),
			position: {
				x: 0,
				y: 0,
				z: 0
			},
			code: function() {
				objects.grass.material.transparent = true;
				objects.grass.material.opacity = 0.5;
				objects.grass.material.map = textures["textures/water-texture.png"];
			}
		}
	};
}