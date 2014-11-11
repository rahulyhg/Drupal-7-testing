<?php 
/*
 * horoscope template file which shows content in block with image 
 * and horoscope sing name.
 */
 drupal_add_css(drupal_get_path('module', 'horoscope') . '/css/horoscope.css');
 $t1 = db_query("select name,horoscope_id  from {horoscope_signs} where name = :name", array(':name' => $sign))->rowCount();
 $hid = db_query("select horoscope_id  from {horoscope_signs} where name = :name", array(':name' => $sign));
 if(!$t1){drupal_not_found();drupal_exit();}
 $horoscope = $hid->fetchObject();//variable_get('horoscope_default', 1);
 $query = db_select('horoscope_signs', 'h')
   ->fields('h', array('about_sign','icon','date_range_from','date_range_to','name'))
   ->condition('name', $sign)
   ->condition('horoscope_id ', $horoscope->horoscope_id)
   ->execute();
 $row = $query->fetchObject();
 $about_sign = $row->about_sign;//substr($row->about_sign,0,strrpos($row->about_sign,'.',0));
 $fromdate = explode('/',$row->date_range_from);
 $todate = explode('/',$row->date_range_to);
 $frommonth = $fromdate[0];
 $fromday = $fromdate[1];
 $tomonth = $todate[0];
 $today = $todate[1];
 print "<h4>".date('j, F',mktime(0,0,0,$frommonth,$fromday)).' - '.date('j, F',mktime(0,0,0,$tomonth,$today))."</h4>";
 print '<img src="'.file_create_url($row->icon). '" alt="' . $row->name .'" height="75'.'" width="75'. '"  />';
?>
 <div id="horoscope" class="horoscope-text">
     <p><?php print t($about_sign);?></p>
 </div>

 <div id="horoscope" class="horoscope-date">
    <p><?php print l('Find your Sun-Sign','horoscope/birth_sign');?></p>
 </div>
