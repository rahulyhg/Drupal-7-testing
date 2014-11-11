<?php 
/**
 *@get text
 *
 */
 $t1 = db_query("select name  from {horoscope_signs} where name = :name", array(':name' => $sign))->rowCount();
 if(!$t1){drupal_not_found();drupal_exit();}
 $fdow = mktime(0, 0, 0, date("n"), date("j") - date("N") + 1);//for day of week as monday.
 $ldow = mktime(0, 0, 0, date("n"), date("j") - date("N") + 7);// to the last day of week that is sunday.
 $horoscope = variable_get('horoscope_default', 1);
 $query = db_select('horoscope_signs', 'h')
   ->fields('h', array('id','icon','name','date_range_from','date_range_to','about_sign'))
   ->condition('name', $sign)
   ->condition('horoscope_id ', $horoscope)
   ->execute();
 $row = $query->fetchObject();
 $about_sign =substr($row->about_sign,0,strpos($row->about_sign,'.',600));
 $fromdate = explode('/',$row->date_range_from);
 $todate = explode('/',$row->date_range_to);
 $frommonth = $fromdate[0];
 $fromday = $fromdate[1];
 $tomonth = $todate[0];
 $today = $todate[1];
 $lsign = drupal_strtolower($sign);
 $img = '<img src="'.file_create_url($row->icon). '" alt="' . $row->name .'" height="75'.'" width="75'. '"  />';
 ?>
 <?php
   print "<h1>".l(t($row->name),'horoscope/'.drupal_strtolower($row->name))."</h1>";
   print l($img,'horoscope/'.drupal_strtolower($row->name),array('html' => TRUE));
   print "<h4>".date('M, j',mktime(0,0,0,$frommonth,$fromday)).' - '.date('M, j',mktime(0,0,0,$tomonth,$today))."</h4>";
   print ($about_sign.'.');
   print l('  Read more ','horoscope/'.$lsign);
 ?>
 <div id="horoscope" class="horoscope-hlink">
 <?php
   print "<li>".l('Horoscope for Day','horoscope/'.$lsign.'/day')."</li>";
   print "<li>".l('Horoscope for Week','horoscope/'.$lsign.'/week')."</li>";
   print "<li>".l('Horoscope for Month','horoscope/'.$lsign.'/month')."</li>";
   print "<li>".l('Horoscope for Year','horoscope/'.$lsign.'/year')."</li>";
 ?>
 </div>
