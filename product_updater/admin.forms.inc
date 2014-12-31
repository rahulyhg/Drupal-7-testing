<?php

/**
 * Product update information setting form.
 */

function product_updater_setting_form($form, $form_state) {
  $form['product-cron-setting'] = array(
    '#type' => 'fieldset',
    '#title' => t('Cron setting for products'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['product-cron-setting']['setting'] = array(
    '#type' => 'checkbox',
    '#title' => t('Update products price on every cron run.'),
    '#default_value' => variable_get('pcrn_setting',0),
  );
  $form['product-cron-setting']['notes'] = array(
    '#type' => 'markup',
    '#markup' => '<div class="import-notes"><strong>Note:</strong> In order to update product information, you need to upload a csv file of production information from '.l('Update product information.','admin/config/aroyi-product/update-products').'</div>',
  );
  $form['product-cron-setting']['submit'] = array (
    '#type' => 'submit',
    '#value' => t('save configuration'),
  );

  return $form;
}

/**
 * Product update information setting form submit handler.
 */

function product_updater_setting_form_submit($form, $form_state) {
  variable_set('pcrn_setting',$form_state['values']['setting']);
  drupal_set_message("The configuration options have been saved.");
}

/**
 * Builds a form that will allow users to upload csv files
 */

function product_updater_form($form, $form_state) {

  $form['note'] = array(
    '#type' => 'fieldset',
    '#title' => t('Details for Uploding file'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['note']['notes'] = array(
    '#type' => 'markup',
    '#markup' => '<div class="import-notes">A few notes while uploading.
       <ul><li>Make sure the file is in a .csv format.</li>
       <li>Columns should be in [,] order</li>
       <li>Be sure to click the "Upload" button when you select a csv.</li>
       <li>To download demo csv file format '.l('Click Here','sites/default/files/demo.csv').'</li></ul></div>',
  );

  $form['import-file'] = array(
    '#type' => 'fieldset',
    '#title' => t('Import Csv File'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['import-file']['import'] = array(
    '#title' => t('Import'),
    '#type' => 'managed_file',
    '#description' => t('The uploaded csv will be imported and temporarily saved.'),
    '#upload_location' => 'public://tmp/',
    '#upload_validators' => array(
      'file_validate_extensions' => array('csv'),
    ),
  );

  $form['import-file']['submit'] = array (
    '#type' => 'submit',
    '#value' => t('Update products'),
  );

  return $form;
}

/**
 * Submit handler for product updater form
 */

function product_updater_form_submit($form, $form_state) {
  
  $uri = db_query("SELECT uri FROM {file_managed} WHERE fid = :fid", array(
    ':fid' => $form_state['input']['import']['fid'],
  ))->fetchField();  // Check to make sure that the file was uploaded to the server properly

  if(!empty($uri)) {
    if(file_exists(drupal_realpath($uri))) { 
      $handle = fopen(drupal_realpath($uri), "r"); // Open the csv
      // Go through each row in the csv and run a function on it. In this case we are parsing by ',' (comma) characters.

	    $rec_count=FALSE;   //will pass first row of cvs file
      while (($data = fgetcsv($handle, 0, ',', '"')) !== FALSE) {
	      if($rec_count) {                        
            $operations[] = array(
              'product_updater_batch_processing',  // The function to run on each row
              array($data),                    // The row in the csv
            );
		    }
	 	    $rec_count=TRUE;
      }

      // Once everything is gathered and ready set them in a batch for processing
      $batch = array(
        'title' => t('Updating products information...'),
        'operations' => $operations,  // Runs all of the queued processes from the while loop above.
        'finished' => 'product_updater_form_finished', // Function to run when the import is successful
        'error_message' => t('The installation has encountered an error.'),
        'progress_message' => t('Imported @current of @total products.'),
      );
      batch_set($batch);
      fclose($handle);    
    }
  }
  else {
   drupal_set_message(t('There was an error uploading your file. Please contact a System administator.'), 'error');
  }
}