 <?php
 //creating collection field item to node.
    $fc_item = entity_create('field_collection_item', array('field_name' => 'field_monday'));
    // Get field collection item value.
    $fc_item->setHostEntity('node', $node);

    $fc_item->field__lunch[LANGUAGE_NONE][]['nid'] = $ref_nid;
    $fc_item->save();

//updating collection field item to node.
    
$raw_node = node_load(117);
// Wrap it with Entity API
$node = entity_metadata_wrapper('node', $raw_node);
// Get the first item from the muli-value field collection
$raw_collection = $node->field_monday[0]->value();
// Wrap it with Entity API
$collection = entity_metadata_wrapper('field_collection_item', $raw_collection);
//dsm the old value
pr($raw_collection);
// Set a new value on the field_example textfield.
$collection->field__snack_1->set(array(13));
$collection->field__snack_2->set(array(13,7));
// Save the changes to the entity
$collection->save();