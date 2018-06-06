function clone(object) {
	return $.extend(true, {}, object);
}
function addObject(name, object) {
	objects[name] = clone(object);
}
function setRelationship(parent, child) {
	parent.children.push(child);
	child.parents.push(parent);
}