<?php

/**
 * Generate user validate link.
 */
function sps_user_validate_url($account_by){
	return url("sps/validate/users/" . md5($account_by), array('absolute' => TRUE));
}

function sps_validate_users_form($form, &$form_state, $hashed_ac_by){
  $query = db_select('sps_user_invitation', 'u')
    ->fields('u')
    ->condition('invitee_tok', $hashed_ac_by,'=')
    ->condition('inviter_approval', 0,'=')
    ->execute();
  if($query->rowCount()>0){
    $form['message'] = array(
      '#markup' => t('<p>Please let us know about the following applicant(s):</p>')
    );
  }else{
  	drupal_set_title("Expired/Invalid token");
  	$form['message'] = array(
      '#markup' => t('<p><h3>Oops!</h3> It seems token has expired or user has been removed</p>')
    );
  }
  $i = 1;
  $attributes = array('class' => 'use-ajax');
  drupal_add_library('system', 'drupal.ajax');
  while ($row = $query->fetchObject()) {
    
    $inviter_info =  user_load($row->uid);
    if(!empty($inviter_info->picture->uri)){
      $form['image-'.$i] = array(
        '#markup' => theme('image_style', array('style_name' => 'thumbnail', 'path' => $inviter_info->picture->uri))
      );
    }else{
      $form['mail-'.$i] = array(
        '#markup' => t('<p> <strong>%mail </strong> is %name, an SPS alumnus</p>',array('%mail'=>$inviter_info->mail,'%name' => $inviter_info->name))
      );
    }
    $form['yes-'.$i] = array(
      '#markup' => '<div id="validate-'.$row->uid.'">'.l(t('Yes, I am sure'), 'sps/user/'.$row->uid.'/validate/nojs/' . $hashed_ac_by,
      	array('attributes' => $attributes,'query' => array('act' => 'yes')))
    );
    $form['no-'.$i] = array(
      '#markup' => l(t('No/Not sure'), 'sps/user/'.$row->uid.'/validate/nojs/' . $hashed_ac_by,array('attributes' => $attributes,'query' => array('act' => 'no'))).'</div>'
    );
    $i++;
  }
  
  if($query->rowCount()>0){
  	$form['note'] = array(
      '#markup' => t('<p> <strong>NOTE: </strong> Please continue ONLY after your final responses above. If you do not identify yourself in the next pages, we will be unable to accept your responses above.')
    );
    $form['actions'] = array('#type' => 'actions');
    $form['actions']['submit'] = array('#type' => 'submit', '#value' => t('Next'));
    $form['#action'] = url("user/register");
  }
  return $form;
}
/**
 * Allow user to validate sps user using their email account.
 */

function sps_user_validate($uid, $ajax, $hashed_ac_by) {
  $query = db_select('sps_user_invitation', 'u')
    ->fields('u')
    ->condition('invitee_tok', $hashed_ac_by,'=')
    ->condition('uid', $uid,'=')
    ->execute();
    $result = $query->fetchObject();
  if($_GET['act'] == 'yes' && !empty($result)){
    db_update('sps_user_invitation')
      ->fields(array(
      	'inviter_approval' => 1,
      	'invitee_tok' => 'approved',
      ))
      ->condition('id', $result->id,'=')
      ->execute();
  }elseif($_GET['act'] == 'no' && !empty($result)){
    db_update('sps_user_invitation')
      ->fields(array(
      	'invitee_tok' => 'inapproved',
      ))
      ->condition('id', $result->id,'=')
      ->execute();
  }
  if ($ajax == 'ajax') {
    $commands = array();
    // replace the id content with the text "Request processed"
    $commands[] = ajax_command_replace('#validate-'.$uid, "Request processed!");
    ajax_deliver(array('#type' => 'ajax', '#commands' => $commands));

  }else{drupal_set_message("Processed!");}
}

/**
 * Allow user to access sps user registration page for first time that is default.
 */
function has_user_visited_sps_registration() {
  global $user;
  $result = db_select('sps_user_reg_status', 'u')
    ->fields('u')
    ->condition('uid', $user->uid,'=')
    ->condition('accs_reg_link', 0,'=')
    ->execute()
    ->fetchObject();
    if(!empty($result) || !$user->uid || in_array("administrator", $user->roles)){
      return TRUE; // return TRUE to allow access
    }else{
      return FALSE; // return FALSE to deny
    }
}

/**
 * Allow user to access success and falure roaster information.
 */
function has_user_roaster_info(){
  global $user;
  $result = db_select('sps_user_reg_status', 'u')
    ->fields('u')
    ->condition('uid', $user->uid,'=')
    ->condition('ref_nid', 0,'!=')
    ->execute()
    ->fetchObject();
    if(!empty($result)){
      return TRUE; // return TRUE to allow access
    }else{
      return FALSE; // return FALSE to to deny
    }
}

/**
 * Allow user to access success and falure roaster information.
 */
function has_user_roaster_no_info(){
  global $user;
  $result = db_select('sps_user_reg_status', 'u')
    ->fields('u')
    ->condition('uid', $user->uid,'=')
    ->condition('ref_nid', 0,'=')
    ->condition('accs_reg_link', 1,'=')
    ->execute()
    ->fetchObject();
    if(!empty($result)){
      return TRUE; // return TRUE to allow access
    }else{
      return FALSE; // return FALSE to to deny
    } 
}

/**
 * Get user information
 */
function get_user_data($data_field){
  global $user;

  if(!$user->uid){
    return;  
  }
  $user_info = user_load($user->uid);
  $uwrapper = entity_metadata_wrapper('user', $user_info);
  if($data_field=='field_date_of_birth'){
    // drupal_set_message("<pre>".print_r($data_field.' : '.$uwrapper->$data_field->value(),'true')."</pre>");
    return $uwrapper->$data_field->value();
    //return date(1356978600);
  }
   // drupal_set_message("<pre>".print_r($data_field.' : '.$uwrapper->$data_field->value(),'true')."</pre>");
  return $uwrapper->$data_field->value();
}

/**
 * Thank you callback.
 */

function sps_register_thanku(){
 return "thank-you";
}

/**
 * checks that user has join sps or not.
 */
function has_user_sps_registration($uid){
  $check_user = db_select('sps_user_reg_status', 'u')
      ->fields('u')
      ->condition('uid', $uid,'=')
      ->execute()
      ->fetchObject();
      if(isset($check_user))
        return true;
      return false;
}

/**
 * Send validation link to invitee email address.
 */
function sps_user_validate_notify($from , $to, $msg) {
  
  $user_validate_link = sps_user_validate_url($to);
  $subject = "SPS validate user"; // subject of e-mail
  $body = $msg;
  $body .= "<p> This is token link to validate user : </p>".$user_validate_link; //it might be any variable from the form eg. $form_state['values']['your_field']
 
  $params = array(  //params is the array passed to hook_mail().
    'subject' => $subject,
    'body' => $body,
  );
  drupal_mail('sps_register', 'validate', $to, language_default(), $params, $from->mail);
}

