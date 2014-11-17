<?php
/**
 * @file
 * Administration Forms and submit functions
 */

/**
 * Implementation of  hook_form().
 **/

function smart_office_admin_form($form, &$form_state) {

   $form['smartofc'] = array(
     '#type' => 'fieldset', 
     '#title' => t('ADD/REPLACE USER INFOMATION FOR SMARTOFFICE'),
   );

   $form['smartofc']['user_id'] = array(
     '#type' => 'select',
     '#title' => t('Select user'),
     '#options' =>listAllUsers(),
     '#required' => TRUE,
   ); 
   $form['smartofc']['Office'] = array(
     '#type' => 'hidden',
     '#title' => t('Office'),
     '#default_value' => 'AdvisorsChoiceInsSvc',
   ); 

   $form['smartofc']['User'] = array(
     '#type' => 'textfield',
     '#title' => t('User'),
     '#default_value' => '',
     '#required' => TRUE,
   ); 

   $form['smartofc']['Pwd'] = array(
     '#type' => 'password',
     '#title' => t('Password'),
     '#default_value' => '',
     '#required' => TRUE,
   ); 
   $form['smartofc']['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Add info'),
   ); 
   return $form;
}

function smart_office_admin_form_submit($form_id, &$form_state){
    $uid = $form_state['values']['user_id'];
	$existing = user_load($uid);
    $edit = (array) $existing;
    $edit['field_smartoffice_user']['und'][0]['value'] = $form_state['values']['User'];
    $edit['field_smartoffice_password']['und'][0]['value'] = $form_state['values']['Pwd'];
    $edit['field_smartoffice_office']['und'][0]['value'] = $form_state['values']['Office'];
    unset($edit['pass']);
    user_save($existing, $edit);
	drupal_set_message("information added !");
}
/**
 * surance bay admin form
 **/
function surance_bay_admin_form($form, &$form_state){

	$form['surancebay'] = array(
     '#type' => 'fieldset', 
     '#title' => t('ADD/REPLACE USER INFOMATION FOR SURANCEBAY'),
    ); 
    $form['surancebay']['user_id'] = array(
     '#type' => 'select',
     '#title' => t('Select user'),
     '#options' =>listAllUsers(),
     '#required' => TRUE,
    );
    $form['surancebay']['gaIdValue'] = array(
     '#type' => 'hidden',
     '#title' => t('gaIdValue'),
     '#default_value' => 307,
    ); 
    $form['surancebay']['emailValue'] = array(
     '#type' => 'textfield',
     '#title' => t('Email'),
     '#default_value' => $user->mail,
    );

    $form['surancebay']['passwordValue'] = array(
     '#type' => 'textfield',
     '#title' => t('Password'),
     '#default_value' => '',//$user->pass,
    );

    $form['surancebay']['submit'] = array(
     '#type' => 'submit',
     '#value' => t('Add info'),
    ); 
    return $form;
}
function surance_bay_admin_form_submit($form, &$form_state){
	$uid = $form_state['values']['user_id'];
	$existing = user_load($uid);
    $edit = (array) $existing;
    $edit['field_surancebay_email']['und'][0]['value'] = $form_state['values']['emailValue'];
    $edit['field_surancebay_paasword']['und'][0]['value'] = $form_state['values']['passwordValue'];
    $edit['field_surancebay_gaidvalue']['und'][0]['value'] = $form_state['values']['gaIdValue'];
    unset($edit['pass']);
    user_save($existing, $edit);
	drupal_set_message("information added !");
}