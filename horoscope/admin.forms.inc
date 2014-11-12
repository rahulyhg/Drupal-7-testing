<?php
/**
 * @file
 * Administration Forms and submit functions
 */

/*
 * select birth day form
 */

 function _get_birth_sign_form() {
   $form['dob'] = array(
     '#type' => 'date', 
     '#title' => t('Select Date of Birth'),
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Find'),
   );
   return $form;
 }

 function _get_birth_sign_form_submit($form_id, $form_values) {
   $day = $form_values['values']['dob']['day'];
   $month = $form_values['values']['dob']['month'];
   $query = db_select('horoscope_signs', 'h')
    ->fields('h', array('id', 'name','date_range_from','date_range_to'))
    ->execute();
   while ($row = $query->fetchObject()) { 
     $fdate = explode('/',$row->date_range_from);
     $tdate = explode('/',$row->date_range_to);
     if($month==$fdate[0] && $day>=$fdate[1] || $month==$tdate[0] && $day<=$tdate[1]) {
       drupal_goto('horoscope/'.drupal_strtolower($row->name).'/sunsign');
       break;
     }
   }
 }

/*
 * Edit Horoscope Form
 */

 function horoscope_edit_form($form_state,$form_id, $arg) {
   $horoscope = _get_horoscope_array($arg);
   $form['id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $horoscope['id']
   );
   $form['name'] = array(
     '#type' => 'textfield',
     '#default_value' => $horoscope['name'],
     '#title' => t('Name'),
     '#required' => TRUE,
   );
   $form['enabled'] = array(
     '#type' => 'checkbox',
     '#default_value' => $horoscope['enabled'],
     '#title' => t('Enabled'),
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Save'),
   );
   return $form;
 }
 function horoscope_edit_form_submit($form_id, $form_values) {
   $exists = db_query("SELECT *  FROM {horoscope} WHERE id = :id", array(':id' => $form_values['values']['id']));
   if ($exists->fetchAssoc()) {
     db_update('horoscope')
       ->fields(array(
         'name' => $form_values['values']['name'],
         'enabled' => $form_values['values']['enabled'],
       ))
       ->condition('id',$form_values['values']['id'], '=')
       ->execute();
     drupal_set_message(t('Updated !name: !enabled',array('!name' => check_plain($form_values['values']['name']), '!enabled' => $form_values['values']['enabled'])));
   }
 }

/**
 * Add Horoscope Form, edit name and availability
 */

 function horoscope_add_form() {
   $form['name'] = array(
     '#type' => 'textfield',
     '#title' => t('Name'),
     '#required' => TRUE,
   );
   $form['enabled'] = array(
     '#type' => 'checkbox',
     '#title' => t('Enabled'),
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Save'),
   );
   return $form;
 }
 
 function horoscope_add_form_submit($form_id, $form_values) {
   $result = db_query("SELECT name FROM {horoscope} WHERE name = :name ",array(':name' =>$form_values['values']['name']));
   if($result->rowCount()>0) {
     drupal_set_message("Horoscope ".$form_values['values']['name'].' already exists','error');
   }
   else {
     db_insert('horoscope')
       ->fields(array(
         'name' => $form_values['values']['name'],
         'enabled' => $form_values['values']['enabled']
       ))
       ->execute();
     drupal_set_message(t('horoscope !name creted ', array('!name' => check_plain($form_values['values']['name']))));
   }
   //checking form enable/disable horoscope.
   if($form_values['values']['enabled']) {
     $result = db_query("SELECT id FROM {horoscope} WHERE name = :name ",array(':name' =>$form_values['values']['name']));
     $row = $result->fetchObject();
     db_update('horoscope')
       ->fields(array(
          'enabled' => 0,
       ))
       ->condition('id',$row->id, '!=')
       ->execute();
     variable_set('horoscope_default', $row->id);
     }
 } 

/**
 * Delete Horoscope Sign Form
 */

 function horoscope_delete_sign_form($form_state,$form_id, $arg3) {
   $horoscope_sign = _horoscope_sign_array($arg3);
   $destination = 'admin/config/horoscope/list/'.$horoscope_sign['horoscope_id'];
   if($horoscope_sign['horoscope_id'] == 1) {
     drupal_set_message('You can\'t delete this sing','error');
     drupal_goto($destination);
   }
   $form['id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $horoscope_sign['id']
   );
   $form['name'] = array(
     '#type' => 'hidden', 
     '#default_value' => $horoscope_sign['name']
   );
   $form['horoscope_id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $horoscope_sign['horoscope_id']
   );
   $form['notes'] = array(
     '#type' => 'markup',
     '#markup' => 'Are you sure you want to delete ?',
   );
   $form['delete'] = array(
     '#type' => 'submit', 
     '#value' => t('Delete'),
   );
   $form['cancel'] = array(
     '#markup' => l(t('Cancel'), $destination),
   );
  return $form;
 }
 function horoscope_delete_sign_form_submit($form_id, $form_values) {
   $and = db_and()->condition('id', $form_values['values']['id'])->condition('horoscope_id', $form_values['values']['horoscope_id']);
   db_delete('horoscope_signs')->condition($and)->execute();
   drupal_set_message("Sing ".$form_values['values']['name'].' Deleted');
   $destination = 'admin/config/horoscope/list/'.$form_values['values']['horoscope_id'];
   drupal_goto($destination);
 }

/**
 * Edit Horoscope Sign Form
 */

 function horoscope_edit_sign_form($form_state,$form_id, $arg3) {
   $horoscope_sign = _horoscope_sign_array($arg3);
   if($horoscope_sign['horoscope_id'] == 1) {
     $bool = TRUE;
   }
   else {
     $bool = FALSE;   
   }
   $form['id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $horoscope_sign['id']
   );
   $form['horoscope_id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $horoscope_sign['horoscope_id']
   );
   $form['name'] = array(
     '#type' => 'textfield',
     '#default_value' => $horoscope_sign['name'],
     '#title' => t('Name'),
     '#required' => TRUE,
     '#disabled' =>$bool,
   );
   $form['icon'] = array(
     '#type' => 'file',
     '#default_value' => $horoscope_sign['icon'],
     '#title' => t('icon'),
   );
   $form['from_date'] = array(
     '#type' => 'textfield',
     '#title' => t('From date (MM/DD)'),
     '#default_value' => $horoscope_sign['date_range_from'],
     '#required' => TRUE,
     '#disabled' =>$bool,
   );
   $form['to_date'] = array(
     '#type' => 'textfield',
     '#title' => t('To date (MM/DD)'),
     '#default_value' => $horoscope_sign['date_range_to'],
     '#required' => TRUE,
     '#disabled' =>$bool,
   );
   $form['about'] = array(
     '#type' => 'textarea',
     '#title' => t('Text about this sign'),
     '#default_value' => $horoscope_sign['about_sign'],
     '#required' => TRUE,
     '#disabled' =>$bool,
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Update'),
   );
   return $form;
 }
 
 function horoscope_edit_sign_form_validate(&$form_id, &$form_values) {
   $from_date = explode('/',$form_values['values']['from_date']);
   $to_date = explode('/',$form_values['values']['to_date']);
   if(($from_date[0]<=0 || $from_date[0]>12) || ($from_date[1]<=0 || $from_date[1]>31)){
     form_set_error('from_date', 'Invalid date.');
     $form_values['rebuild'] = TRUE;
   }
   if(($to_date[0]<=0 || $to_date[0]>12) || ($to_date[1]<=0 || $to_date[1]>31)){
     form_set_error('to_date', 'Invalid date.');
     $form_values['rebuild'] = TRUE;
   }
 }
 
 function horoscope_edit_sign_form_submit($form_id, $form_values) {
   $file_path = 'public://horoscope/image';
   file_prepare_directory($file_path, FILE_CREATE_DIRECTORY);
   $validators = array();
   if ($file = file_save_upload('icon', $validators,$file_path,FILE_EXISTS_REPLACE)) {
     $file->status = FILE_STATUS_PERMANENT;
     db_update('horoscope_signs') // Table name no longer needs {}
       ->fields(array(
         'name' => $form_values['values']['name'],
         'icon' => $file->uri,
         'date_range_from'=> $form_values['values']['from_date'],
         'date_range_to'=> $form_values['values']['to_date'],
         'about_sign'=> $form_values['values']['about']
       ))
       ->condition('id',$form_values['values']['id'], '=')
       ->condition('horoscope_id',$form_values['values']['horoscope_id'], '=')
       ->execute();
     file_save($file);
     drupal_set_message(t('Updated !name', array('!name' => check_plain($form_values['values']['name']))));
   }
   else {
     db_update('horoscope_signs') // Table name no longer needs {}
       ->fields(array(
         'name' => $form_values['values']['name'],
         'date_range_from'=> $form_values['values']['from_date'],
         'date_range_to'=> $form_values['values']['to_date'],
         'about_sign'=> $form_values['values']['about']
       ))
       ->condition('id',$form_values['values']['id'], '=')
       ->condition('horoscope_id',$form_values['values']['horoscope_id'], '=')
       ->execute();
     drupal_set_message(t('Updated !name', array('!name' => check_plain($form_values['values']['name']))));
   }
 }

/**
 * Add Horoscope Sign Form
 */

 function horoscope_add_sign_form($form_state,$form_id, $arg) {
   if($arg == 1) {
     drupal_set_message('No more sign can be added','error');
     drupal_goto('admin/config/horoscope/list');
   }
   $module_path = drupal_get_path('module', 'horoscope') ;
   $form['horoscope_id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $arg,//variable_get('horoscope_default', 1),
   ); 
   $form['name'] = array(
     '#type' => 'textfield',
     '#title' => t('Name'),
     '#required' => TRUE,
   );
   $form['icon'] = array(
     '#type' => 'file',
     '#title' => t('icon'),
   );
   $form['from_date'] = array(
     '#type' => 'textfield',
     '#title' => t('From date (MM/DD)'),
     '#required' => TRUE,
   );
   $form['to_date'] = array(
     '#type' => 'textfield',
     '#title' => t('To date (MM/DD)'),
     '#required' => TRUE,
   );
   $form['about'] = array(
     '#type' => 'textarea',
     '#title' => t('Note: text must be 500 character long.'),
     '#required' => TRUE,
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Save'),
    );
   return $form;
 }

 function horoscope_add_sign_form_validate(&$form_id, &$form_values) {
   $fv = $form_values['values']['from_date'];
   $tv = $form_values['values']['to_date'];
   if (preg_match("/^[0-9]{1,2}\/[0-9]{1,2}$/",$fv) && preg_match("/^[0-9]{1,2}\/[0-9]{1,2}$/",$tv)) {
     $from_date = explode('/',$fv);
     $to_date = explode('/',$tv);
     if(($from_date[0]<=0 || $from_date[0]>12) || ($from_date[1]<=0 || $from_date[1]>31)){
       form_set_error('from_date', 'Invalid date.');
       $form_values['rebuild'] = TRUE;
     }
     if(($to_date[0]<=0 || $to_date[0]>12) || ($to_date[1]<=0 || $to_date[1]>31)){
       form_set_error('to_date', 'Invalid date.');
       $form_values['rebuild'] = TRUE;
     }
   }
   else {
     form_set_error('to_date', 'Invalid date format should be (MM/DD).');
     form_set_error('from_date', 'Invalid date format should be (MM/DD)');
   }
   if(strlen($form_values['values']['about'])<250) {
      form_set_error('about', 'Text must be 250 character long and terminate with (.)');
       $form_values['rebuild'] = TRUE;
   }
 }
 function horoscope_add_sign_form_submit($form_id, $form_values) {
   //@TODO validator
   $file_path = 'public://horoscope/image';
   $validators = array();
   $exists = db_query("SELECT name  FROM {horoscope_signs} WHERE name = :name",array(':name' => $form_values['values']['name']));
   if($exists->rowCount()>0) {
     drupal_set_message("Oops! sign already exists.",'error');
   }
   else {
     file_prepare_directory($file_path, FILE_CREATE_DIRECTORY);
     if ($file = file_save_upload('icon', $validators,$file_path,FILE_EXISTS_REPLACE)) {
       $file->status = FILE_STATUS_PERMANENT;
       db_insert('horoscope_signs')
         ->fields(array( 
           'horoscope_id' => $form_values['values']['horoscope_id'],
           'name' => $form_values['values']['name'],
           'icon'=> $file->uri,
           'date_range_from'=> $form_values['values']['from_date'],
           'date_range_to'=> $form_values['values']['to_date'],
           'about_sign'=> $form_values['values']['about']
         ))
         ->execute();
       file_save($file);
       drupal_set_message(t('Inserted !name:', array('!name' => check_plain($form_values['values']['name']))));
   }
   else {
     db_insert('horoscope_signs')
       ->fields(array(
         'horoscope_id' => $form_values['values']['horoscope_id'],
         'name' => $form_values['values']['name'],
         'date_range_from'=> $form_values['values']['from_date'],
         'date_range_to'=> $form_values['values']['to_date'],
         'about_sign'=> $form_values['values']['about']
       ))
       ->execute();
     drupal_set_message(t('Inserted !name:', array('!name' => check_plain($form_values['values']['name']))));
   }
  }
 }

/**
 * horoscope_delete_form
 */

 function horoscope_delete_form($form_state,$form_id, $arg) {
   if($arg == 1) {
     drupal_set_message('You can\'t delete this Horoscope','error');
     drupal_goto('admin/config/horoscope/list');
//     drupal_exit();
   }
   $form['id'] = array(
     '#type' => 'hidden', 
     '#default_value' => $arg,
   );
   $form['notes'] = array(
     '#type' => 'markup',
     '#markup' => 'Are you sure you want to delete ?',
   );
   $form['delete'] = array(
     '#type' => 'submit',
     '#value' => t('Delete'),
   );
   $form['cancel'] = array(
     '#markup' => l(t('Cancel'), 'admin/config/horoscope/list'),
   );
   return $form;
 }

 function horoscope_delete_form_submit($form_id, $form_values) {
   $result = db_query("SELECT enabled,name FROM {horoscope} WHERE id = :id ",array(':id' =>$form_values['values']['id']));
   $row = $result->fetchObject();
   if($row->enabled) {
     db_update('horoscope')
       ->fields(array(
          'enabled' => 1,
       ))
       ->condition('id',1, '=')
       ->execute();
     variable_set('horoscope_default', 1);
   }
   $result = db_query("DELETE FROM {horoscope} WHERE id = :id",array(':id' =>$form_values['values']['id']));
   if($result->rowCount()) {
       drupal_set_message("Horoscope ".$row->name." Deleted !");
       drupal_goto('admin/config/horoscope/list');
     }
 }

/**
 * Add Text 
 */

 function horoscope_add_text_form($form_id,$form_values, $arg1, $arg2) {
   /*Only day and week format uses datepicker*/
   /*Jquery UI Theme not included by default*/  
   drupal_add_library('system', 'ui.datepicker');
   drupal_add_js(drupal_get_path('module' , 'horoscope') . '/js/add_text.js');
   switch (variable_get('horoscope_format', 'day')) {
     default:
     case 'day':
       $format = 'z';
       $value  = array(
         '#type' => 'textfield', 
         '#title' => t('Select Day'),
         '#required' => TRUE
       );
     break;
     case 'week':
       $format = 'W';
       $value  = array(
         '#type' => 'textfield', 
         '#title' => t('Select Week'),
         '#required' => TRUE
       );
     break;
     case 'month':
       $format = 'n';
       $value  = array(
         '#type' => 'select',
         '#title' => t('Select Month'),
         '#options' => months_array()
       );
     break;      
     case 'year':
       $format = 'o';
       $value  = array(
         '#type' => 'select', 
         '#title' => t('Select Year'),
         '#options' => years_array()
       );
     break;
 }
   $options = _horoscope_sign_array($arg2); //variable_get('horoscope_default', 1) );
   $form['label'] = array(
     '#markup' => t($options['name']),
   );
   $form['horoscope_sign_id'] = array(
     '#type' => 'hidden',
     '#default_value' => $arg2, 
   );
   $form['format_character'] = array(
     '#type' => 'hidden',
     '#default_value' => $format, 
   );
   $form['value'] = $value;
   $form['text'] = array(
     '#type' => 'textarea',
     '#title' => t('Enter Text'),
     '#required' => TRUE,
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Save'),
   );
  return $form;
 }

 function horoscope_add_text_form_submit($form_id, $form_values) {
   $values = $form_values['values'];
   switch ($values['format_character']) {
     case 'z':
       $date = explode('/', $values['value']);//get day and month: mm-dd
       $post_date = mktime(0,0,0,$date[0],$date[1],$date[2]);
       $month = $date[0];
       $day = $date[1];
       $date = date('z',mktime(0,0,0,$month,$day)); //get day number of the year
       $date_message=dayofyear2date($date + 1,'l j F');
     break;
     case 'W':
       $date = explode('/', $values['value']);//get day and month: mm-dd
       $post_date = mktime(0,0,0,$date[0],$date[1],$date[2]);
       $month = $date[0];
       $day = $date[1];
       $date = date('W',mktime(0,0,0,$month,$day)); //get week number of the year
       $date_message = 'week ' .date('j, M',mktime(0, 0, 0, date("n",$post_date), date("j",$post_date) - date("N",$post_date))).' to ';
       $date_message .= date('j, M',mktime(0, 0, 0, date("n",$post_date), date("j",$post_date) - date("N",$post_date)+6));
     break;
     case 'n':
       $date = $values['value'];//get day and month: mm-dd
       $post_date = mktime(0,0,0,$date);
       $date = $values['value'];
       $date_message = 'month ' . date('n', mktime(0, 0, 0, $values['value']));
     break;  
     case 'o':
       $date = $values['value'];//get day and month: mm-dd
       $post_date = mktime(0,0,0,1,1,$date);
       $date = $values['value'];
       $date_message = 'year ' . $values['value'];
     break;
   }  
   $result = db_query("SELECT id, horoscope_sign_id FROM {horoscope_text} WHERE horoscope_sign_id = :hsid and format_character = :fc and value = :vl",array(':hsid' =>  $values['horoscope_sign_id'],':fc' =>$values['format_character'],':vl' => $date));
   if($result->rowCount()) {
     $row = $result->fetchObject();
     variable_set('text', $values['text']);
    drupal_set_message("There is already data for this ".variable_get('horoscope_format')." would you like to update? &nbsp;".l('Yes','admin/config/horoscope/sign/'.$row->id.'/edit_text').'&nbsp;&nbsp;&nbsp;'.l('No','admin/config/horoscope/list/'.$row->horoscope_sign_id),'warning');
   }
   else {
     db_insert('horoscope_text')
       ->fields(array(
         'horoscope_sign_id' => $values['horoscope_sign_id'],
         'format_character' => $values['format_character'],
         'value'=> $date,
         'text'=> $values['text'],
         'post_date'=> $post_date
       ))
       ->execute();
     drupal_set_message(t('Text added for !date', array('!date' => check_plain( $date_message ))));
   }
 }

/**
 * Horoscope search text form.
 */
 function horoscope_search_text_form($form_id, $form_value,$horoscope_id) {
   drupal_add_library('system', 'ui.datepicker');
   drupal_add_js(drupal_get_path('module' , 'horoscope') . '/js/add_text.js');
   $format = variable_get('horoscope_format', 'day');
   $options = _horoscope_sign_list_array($horoscope_id);
   $form['fordate'] = array(
     '#type' => 'fieldset', 
     '#title' => t('SHOW ONLY ITEMS WHERE'),
   ); 
   switch ($format) {
     default:
     case 'day':
       $value  = array(
         '#type' => 'textfield', 
         '#title' => t('Day'),
         '#required' => TRUE,
         '#default_value' => variable_get('cdate',date('m/d/Y'))
       );
       $sign_id  = array(
         '#type' => 'select', 
         '#title' => t('Sign'),
         '#options' => $options,
         '#default_value' =>variable_get('sign_id', 0)
       );
     break;
     case 'week':
       $format = 'W';
       $value  = array(
         '#type' => 'textfield', 
         '#title' => t('Week'),
         '#required' => TRUE,
         '#default_value' => variable_get('cdate',date('m/d/Y'))
       );
       $sign_id  = array(
         '#type' => 'select', 
         '#title' => t('Sign'),
         '#options' => $options,
         '#default_value' =>variable_get('sign_id', 0)
       );
     break;
     case 'month':
       $value  = array(
         '#type' => 'select',
         '#title' => t('Month'),
         '#options' => months_array(),
         '#default_value' => variable_get('cdate',date('n'))
       );
       $sign_id  = array(
         '#type' => 'select', 
         '#title' => t('Sign'),
         '#options' => $options,
         '#default_value' =>variable_get('sign_id', 0)
       );
     break;      
     case 'year':
       $value  = array(
         '#type' => 'select', 
         '#title' => t('Year'),
         '#options' => years_array(),
         '#default_value' => variable_get('cdate',date('o'))
       );
       $sign_id  = array(
         '#type' => 'select', 
         '#title' => t('Sign'),
         '#options' => $options,
         '#default_value' =>variable_get('sign_id', 0)
       );
     break;
   }
   $form['fordate']['sign_id'] = $sign_id;
   $form['fordate']['value'] = $value;
   $form['fordate']['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Find'),
   );
   $form['item'] = array(
     '#markup' => t('Search result for '.variable_get('horoscope_format', 'day').' - '.variable_get('cdate',date('m/d/Y'))),
   );
   return $form;
 }
 function horoscope_search_text_form_validate($form_id, $form_value) {
   $date = $form_value['values']['value'];
   $format = variable_get('horoscope_format', 'day');
   if($format == 'day' || $format == 'week') {
     if (preg_match("/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/",$date)) {
       $newdate = explode('/',$form_value['values']['value']);
       if(!checkdate($newdate[0],$newdate[1],$newdate[2])) {
         form_set_error('value', 'Invalid date format should be (MM/DD/YYYY)');
       }
     }
     else {
       form_set_error('value', 'Invalid date format should be (MM/DD/YYYY)');
     }
   }
 }
 function horoscope_search_text_form_submit($form_id, $form_value) {
   $cdate = $form_value['values']['value'];
   $sign_id = $form_value['values']['sign_id'];
   variable_set('cdate',$cdate);
   variable_set('sign_id',$sign_id);
 }

/**
 * edit text.
 */

 function horoscope_edit_text_form($form_id,$form_value,$arg) {
   $value = _get_horoscope_sign_text($arg);
   $form['id'] = array(
     '#type' => 'hidden',
     '#default_value' => $arg,
   );
   $form['text'] = array(
     '#type' => 'textarea',
     '#title' => t('Enter Text'),
     '#default_value' => $value['text'],
     '#required' => TRUE,
   );
   $form['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Save'),
   );
   return $form;
 }
 function horoscope_edit_text_form_submit($form_id,$form_value) {
   db_update('horoscope_text')
     ->fields(array(
       'text' => $form_value['values']['text'],
     ))
     ->condition('id',$form_value['values']['id'], '=')
     ->execute();
   drupal_set_message("Data updated !");
   drupal_goto('admin/config/horoscope/list');
 }
/**
 * Set Default Horoscope
 * Set Default Format (to define if we show horoscope per day, week, month or year)
 * Default Horoscope: Zodiac (id=1)
 * Default format: day
 * 
 */

 function horoscope_set_default_form() {
   $form['item'] = array(
     '#type' => 'fieldset',
     '#title' => t('Default format to display horoscope'),
   );
   $formats = array(
     'day' => t('Day'),
     'week' => t('Week'),
     'month' => t('Month'),
     'year' => t('Year')
   );
   $form['item']['format_character'] = array(
     '#type' => 'select', 
     '#title' => t('Format'),
     '#options' => $formats,
     '#default_value' => variable_get('horoscope_format', 'day'),
   );
   $options = _get_horoscope_list_array();
   $form['item']['horoscope'] = array(
     '#type' => 'select', 
     '#title' => t('Horoscope'),
     '#options' => $options,
     '#default_value' => variable_get('horoscope_default', 1),
   );
   $form['item']['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Set'),
   );
   return $form;
 }
 
 function horoscope_set_default_form_submit($form_id, $form_values) {
   switch($form_values['values']['format_character']) {
     case 'day':
     $cdate = date('m/d/Y');
     break;
     case 'week':
     $cdate = date('m/d/Y');
     break;
     case 'month':
     $cdate = date('n',mktime(0,0,0,date('m'),date('d'),date('y')));
     break;
     case 'year':
     $cdate = date('o',mktime(0,0,0,date('m'),date('d'),date('y')));
     break;

   }
  $result = db_query("SELECT id,name FROM {horoscope} WHERE id = :id ",array(':id' =>$form_values['values']['horoscope']));
  $row = $result->fetchObject();
  db_update('horoscope')
    ->fields(array(
      'enabled' => 0,
    ))
    ->execute();
  db_update('horoscope')
    ->fields(array(
      'enabled' => 1,
    ))
    ->condition('id',$row->id, '=')
    ->execute();

   variable_set('sign_id',0);
   variable_set('cdate', $cdate);
   variable_set('horoscope_default', $form_values['values']['horoscope']);
   variable_set('horoscope_format', $form_values['values']['format_character']);
   drupal_set_message(t('Success, Default Horoscope(!horoscope) will be show per !format',array('!horoscope' => $row->name, '!format' => $form_values['values']['format_character'])));
 }
