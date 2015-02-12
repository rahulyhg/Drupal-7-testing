<?php

/**
 *  sps register description form.
 */

function _sps_register_description_form($form, $form_state) {
  drupal_set_title('Registration');
  $link_text = "I don't have a Facebook account and do not expect to ever use the advanced features or expect access to all photos and comments.";
  $output =  l($link_text, 'sps/user/register',array('attributes' => array('class' => array('user-reg-link'))));
  $form['desc'] = array(
   '#markup' =>'<p><strong>Who can register?&nbsp;</strong>Anyone affiliated to SPS Asansol (alumni, staff, Brothers, students) can register on this site. Also, some of their family members can register - however, they will have limited access and will be shown by their link to an SPS person. Most registrants will be validated instantly (98% of alumni would see their admission number and admission/withdrawal dates) and others by peers/admins.</p>

     <p><strong>Privileges?</strong>&nbsp;Alumni, staff (current, former) and all Christian Brothers have special privileges. Students have limited access, for mentoring &amp; career counseling. Relatives of SPS people, such as spouses, have limited access. Only alumni (ex-students of SPS) are formally considered members.</p>

    <p><strong>NOTE:&nbsp;</strong><strong>Only by logging in via Facebook will you be able to take advantage of the advanced and upcoming features of this site. So to access the most photos, comments, etc you should register below using Facebook.</strong><strong>&nbsp;</strong>If you don\'t have a Facebook account, we would recommend you get one before registering here.</p>'
  );
  $form['facebook-login'] = array(  //integrate facebook login link.
   '#title' =>'Recommend',
   '#markup' => '<div class="fb_login_button_wrapper fb_button_style"><a href="#" onclick="return FB_JS.clientAuth(null, null);">Connect</a></div>'
  ); 
  $form['link'] = array(
    '#markup' => $output
  );

  return $form;
}

/**
 * sps register form, implements custom registration form and their functionality.
 */
function sps_register_form($form, $form_state) {

  $form['desc'] = array(
    '#type' => 'markup',
    '#markup' => '<div class="brief-desc">Most registrants will be verified instantly (alumni/students would see their admission number and admission/withdrawal dates) and others by peers/admins later. We take your data security and privacy seriously. <strong>All fields required.</strong></div>',
  );
  $form['sps-name'] = array(
    '#type' => 'textfield', 
    '#title' => t('Preferred Name for Website, Name Tag(does not need to be your legal name)'), 
    '#size' => 60, 
    '#maxlength' => 128, 
    '#required' => TRUE,
    '#default_value' => get_user_data('name'),
    '#attributes' => array('placeholder'=>t('Frank Gunnion (no Mr, Dr, etc)')),
  );
  $form['sps-email'] = array(
    '#type' => 'textfield', 
    '#title' => t('Email'), 
    '#size' => 60, 
    '#maxlength' => 128, 
    '#required' => TRUE,
    '#default_value' => get_user_data('mail'),
    '#attributes' => array('placeholder'=>t('yourname@gmail.com')),
  );
  $aff_options = array('SPS ex-student', 'Current SPS student','Current/former SPS staff', 'Christian Brothert', 'Not affiliated, but related to SPS person');
  $form['sps-affiliation'] = array(
    '#type' => 'select',
    '#title' => t('Your SPS affiliation'),
    '#options' => array_combine($aff_options, $aff_options),
    '#default_value' => get_user_data('field_sps_affiliation'),
    '#required' => TRUE,
  );
  $rel_options = array('Self', 'Spouse','Sibling', 'Christian BrothertParent/Grandparent', 'Child/Descendant');
  $form['sps-relation'] = array(
    '#type' => 'select',
    '#title' => t('Your Relation to SPS person'),
    '#options' => array_combine($rel_options, $rel_options),
    '#default_value' => get_user_data('field_relationship'),
    '#required' => TRUE,
  );
  $region_options = array('Asansol', 'Kolkata','Rest of Eastern India', 'Rest of North India', 'Rest of Western India', 'Hyderabad', 'Bangalore', 'Chennai','Rest of South India', 'UK and Europe', 'Singapore', 'North America', 'Australia and NZ','Middle East', 'Rest of World');
  $form['sps-close-region'] = array(
    '#type' => 'select',
    '#title' => t('Closest region/city'),
    '#options' => array_combine($region_options, $region_options),
    '#default_value' => get_user_data('field_region_city'),
    '#required' => TRUE,
  );
  $gen = get_user_data('field_gender');
  $form['sps-gender'] = array(
    '#type' =>'radios', 
    '#title' => t('Gender'), 
    '#options' => array('1' => t('Male'), '0' => t('Female')),
    '#default_value' => (strval($gen))?strval($gen):'1',
    '#required' => TRUE,
  );
  $form['sps-mobile'] = array(
    '#type' => 'textfield', 
    '#title' => t('Mobile Phone'), 
    '#size' => 60, 
    '#maxlength' => 128, 
    '#default_value' => get_user_data('field_mobile_phone'),
    '#required' => TRUE,
  );
  $dob = get_user_data('field_date_of_birth');
  $today = ($dob)?date("Y-m-d",$dob):date("Y-m-d");
  $form['sps-dob'] = array(
    '#type' => 'date_select',
    '#title' => "Your Date of Birth",
    '#default_value' => $today,
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'd/m/y',
    '#date_increment' => 1,
    '#date_year_range' => '1891:+5',
    '#date_label_position' => 'within',
    '#required' => TRUE,
  );
  $form['sps-person-detail'] = array(  //SPS Personal details
    '#type' => 'fieldset',
    '#title' => t('SPS Person\'s Details'),
  );
  $form['sps-person-detail']['sps-per-name'] = array(
    '#type' => 'textfield', 
    '#title' => t('Full Name'), 
    '#size' => 60, 
    '#maxlength' => 128, 
    '#default_value' => get_user_data('field_full_name'),
    '#required' => TRUE,
    '#attributes' => array('placeholder'=>t('F. A. Gunnion (exactly as in SPS records)')),
  );
  $sps_first_options = drupal_map_assoc(range(1891,date('Y')+5));
  $form['sps-person-detail']['sps-per-first'] = array(
    '#type' => 'select',
    '#title' => t('First Year at SPS'),
    '#options' => $sps_first_options,
    '#required' => TRUE,
    '#default_value' => get_user_data('field_first_year_at_sps'),
  );
  $sps_last_options = drupal_map_assoc(range(1891,date('Y')+5));
  $form['sps-person-detail']['sps-per-last'] = array(
    '#type' => 'select',
    '#title' => t('Last Year at SPS'),
    '#options' => $sps_last_options,
    '#required' => TRUE,
    '#default_value' => get_user_data('field_last_year_at_sps'),
  );
  $form['sps-social-detail'] = array(
    '#type' => 'fieldset',
    '#title' => t('Social validation'), 
    '#description' => 'In order to verify your claimed affiliation above, we may need to ask SPS people you know. Please invite from Facebook (preferred) or provide emails (at least two required now) of as many SPS alumni, staff (past/present) or students you know. The more contacts we have, the quicker we can validate you. We will also request them to join. They do not need to already have joined, but if they have, validation would be faster. We need at least two validated SPS people to approve such cases.',
  ); 
  $form['sps-social-detail']['invite-msg'] = array(
    '#type' => 'textarea', 
    '#title' => 'Invite message',
    '#required' => TRUE,
    '#description' => 'Before inviting, please write a short note to help them or others verify your claimed SPS affiliation. Mention SPS teachers who taught you, classmates of yours and any other SPS information that may be relevant. This may be viewed by admins to help with validation.',
  );
  if(user_is_logged_in() && module_exists('fb_invite')){
    $form['sps-social-detail']['invite-facebook'] =array(
      'fb_invite' => array( '#input' => FALSE,
      '#process' => array('fb_invite_element_process'), ),
    );
  }
  $cbox = array('attributes' => array('class' => 'colorbox-load'),
   'query' => array('width' => 640, 'height' => 480,'template' => 'colorbox','iframe'=>'true'));

  $form['sps-social-detail']['invite-e-mail'] = array( 
     '#markup' =>t(l('Email Invites','sps/user/invites/by-mail',$cbox)),
  );
  $form['i-agree'] = array(
    '#type' => 'checkbox',
    '#title' => t("I agree"),
    '#default_value' => get_user_data('field_terms_of_service'),
    '#description' => t('I am allowing SPAI to use all content (such as photos) provided by me. If I am an ex-student of SPS, this officially registers me as a member of SPAI (if not one already). If I am a student at SPS, I would automatically become a member upon leaving SPS. I understand I will never be required to give a donation nor pay any fees to be a full member for life. Also, I am free to join any other alumni association. I understand that teachers, Brothers, students and their immediate family members can be part of this online community without being members.'),
  );
  if(user_is_logged_in()){
    $form['submit'] = array(
      '#type' =>'submit',
      '#value'=>t('Update Info'),
    );
  }else{
  	$form['submit'] = array(
      '#type' =>'submit',
      '#value'=>t('Create account'),
    );
  }

  return $form;
}

/**
 * validate handler for sps_register_form
 */

function sps_register_form_validate($form, &$form_state){
  if ($error = user_validate_name($form_state['values']['sps-name'])) {
        form_set_error('sps-name', $error);
  }elseif ((bool) db_select('users')->fields('users', array('uid'))->condition('uid', $GLOBALS['user']->uid, '<>')->condition('name', db_like($form_state['values']['sps-name']), 'LIKE')->range(0, 1)->execute()->fetchField()) {
        form_set_error('sps-name', t('The name %name is already taken.', array('%name' => $form_state['values']['sps-name'])));
  }
  // Trim whitespace from mail, to prevent confusing 'e-mail not valid'
  // warnings often caused by cutting and pasting.
  $mail = trim($form_state['values']['sps-email']);
  form_set_value($form['sps-email'], $mail, $form_state);

  // Validate the e-mail address, and check if it is taken by an existing user.
  if ($error = user_validate_mail($form_state['values']['sps-email'])) {
    form_set_error('sps-email', $error);
  }
  elseif ((bool) db_select('users')->fields('users', array('uid'))->condition('uid', $GLOBALS['user']->uid, '<>')->condition('mail', db_like($form_state['values']['sps-email']), 'LIKE')->range(0, 1)->execute()->fetchField()) {
      // Format error message dependent on whether the user is logged in or not.
      if ($GLOBALS['user']->uid) {
        form_set_error('sps-email', t('The e-mail address %email is already taken.', array('%email' => $form_state['values']['sps-email'])));
      }
      else {
        form_set_error('sps-email', t('The e-mail address %email is already registered. <a href="@password">Have you forgotten your password?</a>', array('%email' => $form_state['values']['sps-email'], '@password' => url('user/password'))));
      }
  }
  if ($form_state['values']['i-agree'] <>1) {
    form_set_error('i-agree', 'You must agree in order to registers');
  }
  if(strlen($form_state['values']['sps-mobile'])!=10 || !is_numeric($form_state['values']['sps-mobile'])){
    form_set_error('sps-mobile', 'Invalid Mobile number');
  }
  if($form_state['values']['invite-msg']===''){
    form_set_error('invite-msg', 'please write a short note to help them or others verify your claimed SPS affiliation');
  }
  if(!isset($_SESSION['list-recepient'])){
    form_set_error('invite-e-mail', 'You must invite some SPS people to get validate your self');
  }
}

/**
 * submit handler for sps_register_form.
 */
function sps_register_form_submit($form_id, &$form_state){
  global $user;
  $list_recepient = & $_SESSION['list-recepient'];
 
  $sps_name = $form_state['values']['sps-name'];
  $sps_email = $form_state['values']['sps-email'];
  $sps_per_name = $form_state['values']['sps-per-name'];
  $sps_affiliation = $form_state['values']['sps-affiliation'];
  $sps_relation = $form_state['values']['sps-relation'];
  $sps_close_region = $form_state['values']['sps-close-region'];
  $sps_gender = $form_state['values']['sps-gender'];
  $sps_mobile = $form_state['values']['sps-mobile'];
  $sps_per_first = $form_state['values']['sps-per-first'];
  $sps_per_last = $form_state['values']['sps-per-last'];
  $i_agree = $form_state['values']['i-agree'];
  $sps_dob = $form_state['values']['sps-dob'];
  $sps_invite_msg =check_plain($form_state['values']['invite-msg']);
  $account = null;

  if($user->uid){  //Update information for existing user
  	$existing = user_load($user->uid);
    $edit = (array) $existing;
    $edit['name'] = $sps_name;
    $edit['mail'] = $sps_email;
    $edit['field_sps_affiliation']['und'][0]['value'] = $sps_affiliation;
    $edit['field_relationship']['und'][0]['value'] = $sps_relation;
    $edit['field_region_city']['und'][0]['value'] = $sps_close_region;
    $edit['field_gender']['und'][0]['value'] = $sps_gender;
    $edit['field_mobile_phone']['und'][0]['value'] = $sps_mobile;
    $edit['field_full_name']['und'][0]['value'] = $sps_per_name;
    $edit['field_first_year_at_sps']['und'][0]['value'] = $sps_per_first;
    $edit['field_last_year_at_sps']['und'][0]['value'] = $sps_per_last;
    $edit['field_terms_of_service']['und'][0]['value'] = $i_agree;
    $edit['field_date_of_birth']['und'][0]['value'] = $sps_dob;

    unset($edit['pass']);//do not update password.
    $account = user_save($existing, $edit);
  }else{   //New registration. 
    $new_user = array(
      'name' => $sps_name, 
      'mail' => $sps_email,
      'init' => $sps_email, 
      'status' => TRUE, 
      'roles' => array(
        DRUPAL_AUTHENTICATED_RID => 'authenticated user',),
      'field_sps_affiliation' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_affiliation))),
      'field_relationship'=> array(LANGUAGE_NONE => array(0 =>array('value' => $sps_relation))),
      'field_region_city' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_close_region))),
      'field_gender' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_gender))),
      'field_mobile_phone' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_mobile))),
      'field_full_name' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_per_name))),
      'field_first_year_at_sps' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_per_first))),
      'field_last_year_at_sps' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_per_last))),
      'field_terms_of_service' => array(LANGUAGE_NONE => array(0 =>array('value' => $i_agree))),
      'field_date_of_birth' => array(LANGUAGE_NONE => array(0 =>array('value' => $sps_dob))),
    );

   $account = user_save('',$new_user);

    drupal_mail('user', 'register_no_approval_required', $account->mail, NULL, array('account' => $account), variable_get('site_mail', 'noreply@spsalumni.org'));
    drupal_set_message("Thank you for registering at SPS Alumni, further instructions have been sent to your e-mail address.");
  }

  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'roster')
    ->fieldCondition('field_roster_f_l_name_only','value',$sps_per_name,'=');
    // ->fieldCondition('field_roster_date_of_birth', 'value', 16215, '=');
  $result = $query->execute();

  if (isset($result['node'])) {
    $ref_nid = array_keys($result['node']);
    
    if(has_user_sps_registration($account->uid)){
      db_update('sps_user_reg_status')
      ->fields(array(
        'cur_path' => 'sps/user/success-roster',
        'ref_nid' => $ref_nid[0],
        'accs_reg_link' =>1,
      ))->condition('uid',$account->uid, '=')->execute();
    }else{
      db_insert('sps_user_reg_status') 
      ->fields(array(
        'cur_path' => 'sps/user/success-roster',
        'uid' => $account->uid,
        'ref_nid' => $ref_nid[0],
        'accs_reg_link' =>1,
      ))->execute();
    }
    //add section to update user role

    if($user->uid){
      $form_state['redirect'] = url('sps/user/success-roster', array('absolute' => true));
    }else{
      $form_state['redirect'] = url('sps/user/thank-you', array('absolute' => true));
    }
  
  }else{

    if(has_user_sps_registration($account->uid)){
      db_update('sps_user_reg_status')
      ->fields(array(
        'cur_path' => 'sps/user/falure-roster',
        'ref_nid' => 0,
        'accs_reg_link' =>1,
      ))->condition('uid',$account->uid, '=')->execute();
    }else{
      db_insert('sps_user_reg_status') 
      ->fields(array(
        'cur_path' => 'sps/user/falure-roster',
        'uid' => $account->uid,
        'ref_nid' => 0,
        'accs_reg_link' =>1,
      ))->execute();
    }
    //send user a validation link and update sps user invitation table.
    $all_recepient = array_filter($list_recepient);
    $from = $account;
    foreach ($all_recepient as $recepient => $value) {
    $to = $value;
    $msg = $sps_invite_msg;
    $invitee_user = user_load_by_mail($to);
     db_insert('sps_user_invitation') 
      ->fields(array(
        'uid' => $account->uid,
        'invitee_mail' => $to,
        'invitee_tok' => md5($to),
        'invitee_status' =>($invitee_user)?1:0,
      ))->execute();
    sps_user_validate_notify($from, $to, $msg);
    }
    unset($_SESSION['list-recepient']);

    if($user->uid){
      $form_state['redirect'] = url('sps/user/falure-roster', array('absolute' => true));
    }else{
      $form_state['redirect'] = url('sps/user/thank-you', array('absolute' => true));
    }
  }
}

/**
 * sps falure roster form.
 */
function sps_falure_roster_form($form, $form_state){
  $form['falure-desc'] = array(
    '#markup' =>'<p>We have been unable to instantly validate you either because of a mismatch with our records, or because of your SPS affiliation type doesn\'t allow instant validation. Don\'t worry, it\'s just a matter of time. While most students and alumni can be instantly validated, other registrants need to be socially validated. Until then, limited access to the site is available. Thank you again and we look forward to your becoming a part of this community. </p>
        <p>To speed up your validation and make this a strong community, we would encourage you to invite more SPS people and their relatives to join:</p>'
  );
  $form['invite-member'] =array(
    'fb_invite' => array( '#input' => FALSE,
    '#process' => array('fb_invite_element_process'), ),
  );

  return $form;
}

/**
 * sps sucess roster form.
 */
function sps_success_roster_form($form, $form_state){
  global $user;
  $result = db_select('sps_user_reg_status', 'u')->fields('u')->condition('uid', $user->uid,'=')->execute()->fetchObject();
  $user_roster_info = node_load($result->ref_nid);
  $f_l_name = $user_roster_info->field_roster_f_l_name_only['und'][0]['value'];
  $admission_no =  $user_roster_info->field_roster_admission_no['und'][0]['value'];
  $addmission_dt = $user_roster_info->field_roster_admission_dt['und'][0]['value'];
  $withdrwal_date = $user_roster_info->field_roster_date_of_withdrawal['und'][0]['value'];
  $addmission_dt1 = ($addmission_dt)?date('jS M, Y',intval($addmission_dt)):'Unknown';
  $withdrwal_date1 = ($withdrwal_date)?date('jS M, Y',intval($withdrwal_date)):'Unknown';

  drupal_set_title('Welcome '.$f_l_name.'!');

  $form['success-desc'] = array(
    '#markup' => 'Your status has been validated against our records. Congratulations, and welcome!'
  );
  $form['addmission-no'] = array(
    '#markup' => '<h2>SPS Admission Number:'.$admission_no.'</h2>'
  );
  $form['add/wid-date'] = array(
    '#markup' => '<h2>Admission/Withdrawal Dates:</h2><h3> '.$addmission_dt1.' to '.$withdrwal_date1.'</h3>'
  );

  $form['sr-next'] = array(
    '#type' => 'submit',
    '#value' => 'Next'
  );

  return $form;
}

/**
 * submit handler for sps success roster form.
 */
function sps_success_roster_form_submit($form_id, &$form_state){ 
  global $user;
  $path = 'profile-additional_details/'.$user->uid.'/edit';
  db_update('sps_user_reg_status')->fields(array('cur_path' => $path))->condition('uid', $user->uid,'=')->execute();
  $form_state['redirect'] = url($path, array('absolute' => true));
  
}

/**
 * sps additional details form i.e singup-2.
 */
function sps_additional_details_form($form, $form_state){

   $form['success-desc'] = array(
    '#markup' => 'Please complete the following so we have complete records. Fields are mandatory unless specified otherwise. We need to make sure your information is up-to-date, so we will display it every 6 months when you log in.<h3>This section is incomplete</h3>'
   );


   //  $handlers = array('address' => 'address');
   //  $context = array('mode' => 'form');
   //  $addresses = addressfield_default_values(null);
   //  //where $account is from user_load

   // $form['address']= addressfield_generate($addresses, $handlers, $context);

   // //need to add sinup-2 details.
  
  return $form;
}

/**
 * submit handler for sps success roster form.
 */
function sps_additional_details_form_submit($form, &$form_state){
global $user;
  //db_update('sps_user_reg_status')->fields(array('cur_path' => 'user'))->condition('uid', $user->uid,'=')->execute();
  drupal_goto();
}

/**
 * sps user invite by email form.
 */
function sps_user_invite_by_mail_form($form, &$form_state){
    $list_recepient = null;
    if(isset($_SESSION['list-recepient'])){
      $list_recepient = & $_SESSION['list-recepient'];
    }

    $form['recipient-1'] = array(
      '#type' => 'textfield', 
      '#required' => TRUE,
      '#default_value' => ($list_recepient)?$list_recepient[0]:'',
      '#attributes' => array('placeholder'=>t('alreadymember1@yahoo.com')),
    );
    $form['recipient-2'] = array(
      '#type' => 'textfield', 
      '#required' => TRUE,
      '#default_value' => ($list_recepient)?$list_recepient[1]:'',
      '#attributes' => array('placeholder'=>t('alreadymember2@yahoo.com')),
    );
    $form['recipient-3'] = array(
      '#type' => 'textfield', 
      '#default_value' => ($list_recepient)?$list_recepient[2]:'',
      '#attributes' => array('placeholder'=>t('alreadymember3@yahoo.com')),
    );
    $form['recipient-4'] = array(
      '#type' => 'textfield', 
      '#default_value' => ($list_recepient)?$list_recepient[3]:'',
      '#attributes' => array('placeholder'=>t('alreadymember4@yahoo.com')),
    );
    $form['recipient-5'] = array(
      '#type' => 'textfield', 
      '#default_value' => ($list_recepient)?$list_recepient[4]:'',
      '#attributes' => array('placeholder'=>t('alreadymember5@yahoo.com')),
    );
    $form['submit'] = array(
      '#type' =>'submit',
      //'#attributes' => array("onclick"=>'parent.jQuery.fn.colorbox.close();'),
      '#value'=>t('Done'),
    );
   
  return $form;
}

/**
 * validate handler for sps user invite by email form.
 */
function sps_user_invite_by_mail_form_validate($form_id, &$form_state){

  if(!valid_email_address(trim($form_state['values']['recipient-1']))){
    form_set_error('recipient-1', 'Invalid email address');
  }
   if(!valid_email_address(trim($form_state['values']['recipient-2']))){
    form_set_error('recipient-2', 'Invalid email address');
  }
  //  if(!valid_email_address(trim($form_state['values']['recipient-3']))){
  //   form_set_error('recipient-3', 'Invalid email address');
  // }
  //  if(!valid_email_address(trim($form_state['values']['recipient-4']))){
  //   form_set_error('recipient-4', 'Invalid email address');
  // }
  //  if(!valid_email_address(trim($form_state['values']['recipient-5']))){
  //   form_set_error('recipient-5', 'Invalid email address');
  // }
}

/**
 * submit handler for sps user invite by email form.
 */
function sps_user_invite_by_mail_form_submit($form_id, &$form_state){
  $list_recepient = array(
    0 => $form_state['values']['recipient-1'],
    1 => $form_state['values']['recipient-2'],
    2 => $form_state['values']['recipient-3'],
    3 => $form_state['values']['recipient-4'],
    4 => $form_state['values']['recipient-5'],
  );
  $_SESSION['list-recepient'] =  $list_recepient;
    drupal_set_message("Recepient added!");
}