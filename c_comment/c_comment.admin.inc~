<?php
/**
* @file
* Administration page callbacks for the custom comment module.
*
* Form builder. Configure custom comment.
*
* @ingroup forms
* @see system_settings_form().
*/
 function c_comment_admin_settings() {
 // Get an array of node types with internal names as keys and
 // "friendly names" as values. E.g.,
 // array('page' => ’Basic Page, 'article' => 'Articles')
   $types = node_type_get_types();
     foreach($types as $node_type) {
       $options[$node_type->type] = $node_type->name;
     }
     $form['c_comment_node_types'] = array(
       '#type' => 'checkboxes',
       '#title' => t('Users can use custom comment for listed content types'),
       '#options' => $options,
       '#default_value' => variable_get('c_comment_node_types', array('page')),
       '#description' => t('A text field will be available on these content types to
       make user-specific notes.'),
     );
     $form['#submit'][] = 'c_comment_admin_settings_submit';
 return system_settings_form($form);
 }

