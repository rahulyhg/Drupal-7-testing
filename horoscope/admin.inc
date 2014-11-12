<?php 
/**
 * Function to get date from day of the year, ex: 
 * what day is the 251th day of the year?
 * echo dayofyear2date(251,'l'); 
 * Output: Friday
 */

 function dayofyear2date($day, $format = 'Y-m-d'){
   //@TODO we need to add year from database to show correct date of others years, but database doesnt stores year :(
   $date=mktime(0, 0, 0, 1, $day);
   return date($format, $date); 
 }

 function days_array() {
   $days_array = array();
   $i=1;
   while($i<=31){
     $days_array[$i] = $i;
     $i+=1;
   }
   return $days_array;
 }

/**
 * Array of months
 */ 

 function months_array() {
   $months_array = array(
     1 => 'January',
     2 => 'February',
     3 => 'March',
     4 => 'April',
     5 => 'May',
     6 => 'June',
     7 => 'July',
     8 => 'August',
     9 => 'September',
     10 => 'October',
     11 => 'November',
     12 => t('December')
   );
   return $months_array;
 }

/**
 * Array of years, next 10 years
 */

 function years_array() {
   $years_array = array_combine(range(date("Y"), date("Y")+1), range(date("Y"), date("Y")+1));
   return $years_array;
 }

/**
 * Get Horoscope, returns array('id' => int, 'name' => string, 'enabled' => boolean)
 */

 function _get_horoscope_array($horoscope_id) {
   $horoscope  = array();
   $results = db_query("SELECT *  FROM {horoscope} WHERE id = :id", array(':id' => $horoscope_id));
   $horoscope = $results->fetchAssoc();
   return $horoscope;
 }

/**
 * Get Horoscope List, returns array('id' => int, 'name' => string, ..)
 */

 function _get_horoscope_list_array() {
   $query = db_query("SELECT id, name FROM horoscope ");
   $data = array();
   while ($row = $query->fetchObject()) { 
     $data[$row->id] = $row->name;
   }
   return $data;
 }

/**
 * Get Horoscope Sign, returns array('id' => int, 'horoscope_id' => int, 'name' => string, 'icon' => string)
 */

 function _horoscope_sign_array($horoscope_sign_id) {
   $horoscope  = array();
   $results = db_query("SELECT *  FROM {horoscope_signs} WHERE id = :id", array(':id' => $horoscope_sign_id));
   $horoscope = $results->fetchAssoc();
   return $horoscope;
 }

 function _get_horoscope_sign_text($horoscope_sign_id) {
   $horoscope  = array();
   $results = db_query("SELECT *  FROM {horoscope_text} WHERE id = :id", array(':id' => $horoscope_sign_id));
   $horoscope = $results->fetchAssoc();
   return $horoscope;
 }

/**
 * Horoscope Sign list, returns array('id' => int, 'name' => string, ..)
 */

 function _horoscope_sign_list_array($horoscope_id) {
   $query = db_query("SELECT id, name FROM {horoscope_signs} WHERE horoscope_id = :hid", array(':hid' => $horoscope_id));
   $data = array();
   $data[0] = 'ALL';
   while ($row = $query->fetchObject()) { 
     $data[$row->id] = $row->name;
   }
   return $data;
 }

/**
 * List Horoscopes, Return table with all available horoscope names and links to edit and delete them
 */

 function _horoscope_list() {
   $wspace = '&nbsp;&nbsp;&nbsp;&nbsp;';
   $data = array();    
   $query = db_query("SELECT id, name, enabled FROM horoscope ");
   while ($row = $query->fetchObject()) {
     if($row->id == 1) {
       $data[] = array(
         'name' =>l($row->name, 'admin/config/horoscope/list/' . $row->id),
         'enabled' => ($row->enabled == 1) ? t('<b>Enabled</b> (Default)') : t('Disabled'),
         'actions' => l(t('List sign'), 'admin/config/horoscope/list/' . $row->id ) . $wspace .
                      l(t('List text'), 'admin/config/horoscope/list/' .$row->id.'/list_text') 
       ); 
     }
     else {
       $data[] = array(
         'name' =>l($row->name, 'admin/config/horoscope/list/' . $row->id),
         'enabled' => ($row->enabled == 1) ? t('<b>Enabled</b> (Default)') : t('Disabled'),
         'actions' => l(t('List sign'), 'admin/config/horoscope/list/' . $row->id ) . $wspace  .
                      l(t('Add sign'), 'admin/config/horoscope/list/' . $row->id . '/add_sign') . $wspace .
                      l(t('List text'), 'admin/config/horoscope/list/' .$row->id.'/list_text') . $wspace .
                      l(t('edit'), 'admin/config/horoscope/list/' . $row->id . '/edit') . $wspace  .
                      l(t('delete'), 'admin/config/horoscope/list/' . $row->id . '/delete')
       );  
     }
   }
   $output = theme('table',array('header'=>array(t('Name'), t('Status'), t('Actions')), 'rows'=>$data));
   $output .= drupal_render(drupal_get_form('horoscope_set_default_form'));
   return $output;
 }

/**
 * List Horoscopes Signs, Return table with all available Horoscope Signs 
 */

 function _horoscope_list_signs($arg) {
   $data = array();
   $wspace = '&nbsp;&nbsp;&nbsp;&nbsp;';
   $query = query_all_signs($arg);
   while ($row = $query->fetchObject()) {
     $img = '<img src="'.file_create_url($row->icon). '" alt="' . $row -> name.'" height="30'.'" width="30'. '"  />';
     if($arg == 1) {
       $data[] = array(
         'name' => l(t($row->name),'horoscope/'.drupal_strtolower($row->name)),
         'icon' => l($img, 'horoscope/'.drupal_strtolower($row -> name), array('html'=>TRUE)),
         'actions' => l(t('Add text'), 'admin/config/horoscope/list/' .$row->horoscope_id.'/'. $row->id .'/add_text') . $wspace . 
                      l(t('Edit'), 'admin/config/horoscope/list/' .$row->horoscope_id.'/'. $row->id.'/edit')
       );   
     }
     else {
       $data[] = array(
         'name' => l(t($row -> name),'horoscope/'.drupal_strtolower($row -> name)),
         'icon' => l($img, 'horoscope/'.$row -> name, array('html'=>TRUE)),
         'actions' => l(t('Add text'), 'admin/config/horoscope/list/' .$row->horoscope_id.'/'. $row->id .'/add_text') . $wspace . 
                      l(t('Edit'), 'admin/config/horoscope/list/' .$row->horoscope_id.'/'. $row->id.'/edit') . $wspace .
                      l(t('Delete'), 'admin/config/horoscope/list/'.$row->horoscope_id.'/'. $row->id.'/delete')
       );    
     }  
   }
   $headers = array(
     array('data' => t('name')),
     array('data' => t('icon')),
     array('data' => t('action')),
   );
   $table = theme_table(
     array(
       "header" => $headers,
        "rows" => $data,
        "attributes" => array(),
        "sticky" => true, // Table header will be sticky
        "caption" => t('<b>All available signs.</b>'),
        "colgroups" => array(),
        "empty" => t('There is no any sign added yet.').$wspace.l(t('add sign'), 'admin/config/horoscope/list/'.$arg. '/add_sign'),
     ));
   return $table;
 }

/**
 * List Text
 */

 function _horoscope_list_text($horoscope_id) {
   $formater = variable_get('horoscope_format', 'day'); 
   $horoscope_sign = variable_get('sign_id');
   switch($formater){
     case 'day':
       $format = 'z';
       $df = 'Date';
       $newdate = date('m/d/Y');
       $cdate = explode('/',variable_get('cdate',$newdate)); 
       $timestmp = date('z',mktime(0,0,0,$cdate[0],$cdate[1],$cdate[2]));
       if($horoscope_sign) {
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name','horoscope_id'));
         $query-> fields('h', array('id'));
         $query->condition('h.id', $horoscope_id, '=')
         ->condition('hs.id', $horoscope_sign, '=')
         ->condition('ht.format_character',$format,'=')
         ->condition('ht.value',$timestmp,'=')
         ->execute();
       }
       else {
         $subquery = db_select('horoscope', 'h');
         $subquery->join('horoscope_signs', 'hs', 'hs.horoscope_id = h.id');
         $subquery-> fields('hs', array('id'))  //getting list of horoscope sign ids belonging to a particular horoscope.
         ->condition('hs.horoscope_id', $horoscope_id, '=');
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name'));
         $query-> fields('h', array('id'));
         $query->extend('TableSort')->extend('PagerDefault')->limit(5)
         ->condition('h.id', $horoscope_id, '=')
         ->condition('horoscope_sign_id', $subquery, 'IN')
         ->condition('format_character',$format,'=')
         ->condition('value',$timestmp,'=')
         ->execute();
       }
     break;
     case 'week':
       $format = 'W';
       $df = 'week';
       $newdate = date('m/d/Y');
       $cdate = explode('/',variable_get('cdate',$newdate)); 
       $timestmp = date('W',mktime(0,0,0,$cdate[0],$cdate[1]));
       if($horoscope_sign) {
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name','horoscope_id'));
         $query-> fields('h', array('id'));
         $query->condition('h.id', $horoscope_id, '=')
         ->condition('hs.id', $horoscope_sign, '=')
         ->condition('ht.format_character',$format,'=')
         ->condition('ht.value',$timestmp,'=')
         ->execute();
       }
       else {
         $subquery = db_select('horoscope', 'h');
         $subquery->join('horoscope_signs', 'hs', 'hs.horoscope_id = h.id');
         $subquery-> fields('hs', array('id'))  //getting list of horoscope sign ids belonging to a particular horoscope.
         ->condition('hs.horoscope_id', $horoscope_id, '=');
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name'));
         $query-> fields('h', array('id'));
         $query->extend('TableSort')->extend('PagerDefault')->limit(5)
         ->condition('h.id', $horoscope_id, '=')
         ->condition('horoscope_sign_id', $subquery, 'IN')
         ->condition('format_character',$format,'=')
         ->condition('value',$timestmp,'=')
         ->execute();
       }
     break;
     case 'month':
       $format = 'n';
       $df = 'month';
       $timestmp = variable_get('cdate',date('n',mktime(0,0,0,date("m"),date("d"))));//date('n', mktime(0,0,0,$cdate[0],$cdate[1],$cdate[2]));
       if($horoscope_sign) {
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name','horoscope_id'));
         $query-> fields('h', array('id'));
         $query->condition('h.id', $horoscope_id, '=')
         ->condition('hs.id', $horoscope_sign, '=')
         ->condition('ht.format_character',$format,'=')
         ->condition('ht.value',$timestmp,'=')
         ->execute();
       }
       else {
         $subquery = db_select('horoscope', 'h');
         $subquery->join('horoscope_signs', 'hs', 'hs.horoscope_id = h.id');
         $subquery-> fields('hs', array('id'))  //getting list of horoscope sign ids belonging to a particular horoscope.
         ->condition('hs.horoscope_id', $horoscope_id, '=');
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name'));
         $query-> fields('h', array('id'));
         $query->extend('TableSort')->extend('PagerDefault')->limit(5)
         ->condition('h.id', $horoscope_id, '=')
         ->condition('horoscope_sign_id', $subquery, 'IN')
         ->condition('format_character',$format,'=')
         ->condition('value',$timestmp,'=')
         ->execute();
       }
       $month = date('F, Y',mktime(0,0,0,(int)$timestmp,date('d'),date('y')));
     break;
     case 'year':
       $format = 'o';
       $df = 'YEAR';
       $timestmp = variable_get('cdate',date('o',mktime(0,0,0,date("m"),date("d")))); //date('o', mktime(0,0,0,$cdate[0],$cdate[1],$cdate[2]));
       if($horoscope_sign) {
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name','horoscope_id'));
         $query-> fields('h', array('id'));
         $query->condition('h.id', $horoscope_id, '=')
         ->condition('hs.id', $horoscope_sign, '=')
         ->condition('ht.format_character',$format,'=')
         ->condition('ht.value',$timestmp,'=')
         ->execute();
       }
       else {
         $subquery = db_select('horoscope', 'h');
         $subquery->join('horoscope_signs', 'hs', 'hs.horoscope_id = h.id');
         $subquery-> fields('hs', array('id'))  //getting list of horoscope sign ids belonging to a particular horoscope.
         ->condition('hs.horoscope_id', $horoscope_id, '=');
         $query = db_select('horoscope_text', 'ht');
         $query->join('horoscope_signs', 'hs', 'hs.id = ht.horoscope_sign_id');
         $query->join('horoscope', 'h', 'hs.horoscope_id = h.id');
         $query-> fields('ht', array('id', 'text', 'value','horoscope_sign_id','post_date'));
         $query-> fields('hs', array('icon','name'));
         $query-> fields('h', array('id'));
         $query->extend('TableSort')->extend('PagerDefault')->limit(5)
         ->condition('h.id', $horoscope_id, '=')
         ->condition('horoscope_sign_id', $subquery, 'IN')
         ->condition('format_character',$format,'=')
         ->condition('value',$timestmp,'=')
         ->execute();
       }
     break;					
   }
   $headers = array(
     array('data' => t('sign')),
     array('data' => t('text')),
     array('data' => t('for '.$df)),
     array('data' => t('action')),
   );
   $result = $query->execute();
   $rows = array();
  // Loop through each item and add to the $rows array.
   foreach ($result as $row) {
     $img = '<img src="'.file_create_url($row->icon). '" alt="' . $row -> name.'" height="30'.'" width="30'. '"  />';
     $week = date('j, M',mktime(0, 0, 0, date("n",$row->post_date), date("j",$row->post_date) - date("N",$row->post_date))).' to ';
     $week .= date('j, M',mktime(0, 0, 0, date("n",$row->post_date), date("j",$row->post_date) - date("N",$row->post_date)+6));
     $rows[] = array(
       l($img.$row->name, 'horoscope/'.drupal_strtolower($row -> name), array('html'=>TRUE)), 
       t(check_plain($row -> text)), 
       (($formater == 'day') ?date('j M,Y',$row->post_date):(($formater == 'week')?$week:(($formater == 'month')?$month:$timestmp))), 
       l(t('edit'),'admin/config/horoscope/list_text/'.$row -> id.'/edit_text')
     );
   }
   $table = theme_table(
     array(
       "header" => $headers,
        "rows" => $rows,
        "attributes" => array(),
        "sticky" => true, // Table header will be sticky
        "caption" => "Change default format to view different format from setting page ".l(t('change,'),'admin/config/horoscope/list')." currently listing ".$df." wise.",
        "colgroups" => array(),
        "empty" => t("No text found for this ".$df) // The message to be displayed if table is empty
      )).theme("pager");
   $output = drupal_render(drupal_get_form('horoscope_search_text_form',$horoscope_id)).$table;
   return $output;
 }
