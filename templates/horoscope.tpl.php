<?php 
/*
 * horoscope template file which shows content in block with image 
 * and horoscope sing name.
 */
 global $user;
 drupal_add_css(drupal_get_path('module', 'horoscope') . '/css/horoscope.css');
 $horoscope=variable_get('horoscope_default', 1);
 $query = query_all_signs($horoscope); 
 $p = ''; 
 if($query->rowCount()) {
   while ($row = $query->fetchObject()) {
     $img_name = '<img src="'.file_create_url($row->icon). '" alt="' . $row->name .'" height="20'.'" width="20'. '"  />'.$row->name;
     $p .= '<p>'.l(t($img_name),'horoscope/' . drupal_strtolower($row->name) . '/' . variable_get('horoscope_format', 'day'),array('html' => TRUE)).'</p>';
   }
 } 
 else {
   if(user_access('administer')) {
     $p = "The default selected horoscope does not cotains any sing, please add one or more sign to display here.".'&nbsp;&nbsp;&nbsp;&nbsp;'.'<li>';
     $p .= l(t('Add sign'), 'admin/config/horoscope/list/' . variable_get('horoscope_default') . '/add_sign').'</li>';
     $p .= "Or to choose different horoscope.".'<li>'.l(t('Choose Horoscope'), 'admin/config/horoscope/list').'</li>';
   }
   else {
     $p = "The default selected horoscope does not cotains any sing, please contact site administer for the same.";
   }
 }
?>
 <div id="horoscope" class="horoscope-block">
   <?php print t($p); ?>
 </div>
