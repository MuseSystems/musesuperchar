Qt JavaScript Specification
==============================

## Data Script

### Signals
_All signals use the scriptable emitSignal and as such will be defined as *__sender name, data__*_

* General Considerations:
	1) We need to account for same group, different entities being open at the same time and same entity. different records being open.  The data is stored per entity in the form global scope, and is recorded by entity.  The sender name format encodes the that this is SuperChar related, the action, the entity, entity record and the as such: "UPDATE_"

* (<scdef_internal_name>, 'UPDATE'): Used when an Super Characteristic is updated via it's data script setter.  

## UI Form Backing Script

### Public Slots

* sSave
* sClose
