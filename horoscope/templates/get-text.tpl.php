<?php 
/**
 *@get text
 *
 */
 $horoscope = variable_get('horoscope_default', 1);
 $query = db_select('horoscope_signs', 'h')
   ->fields('h', array('name'))
   ->condition('name', $sign)
   ->condition('horoscope_id ', $horoscope)
   ->execute();
 $t1 = $query->rowCount();
 if(!$t1){drupal_not_found();drupal_exit();}
 $fdow = mktime(0, 0, 0, date("n"), date("j") - date("N"));// +1 for day of week as monday.
 $ldow = mktime(0, 0, 0, date("n"), date("j") - date("N") + 6);// +7 to the last day of week that is sunday.
 $query = db_select('horoscope_signs', 'h')
   ->fields('h', array('id','icon','name','date_range_from','date_range_to','about_sign'))
   ->condition('name', $sign)
   ->condition('horoscope_id ', $horoscope)
   ->execute();
 $row = $query->fetchObject();
 $about_sign =substr($row->about_sign,0,strpos($row->about_sign,'.',500));
 $fromdate = explode('/',$row->date_range_from);
 $todate = explode('/',$row->date_range_to);
 $frommonth = $fromdate[0];
 $fromday = $fromdate[1];
 $tomonth = $todate[0];
 $today = $todate[1];
 $lsign = drupal_strtolower($sign);
 switch($get){
   case 'day':
     $format = 'z';
     $date = date('z');
   break;
   case 'week':
     $format = 'W';
     $date = date('W');
   break;
   case 'month':
     $format = 'n';
     $date = date('n');
   break;
   case 'year':
     $format = 'o';
     $date = date('o');
   break;					
 }

/**
 * @TODO if theres two text for one date, error occurs
 *
 */

 $query1 = db_select('horoscope_text', 'h')
   ->fields('h', array('text','id'))
   ->condition('value', $date)
   ->condition('horoscope_sign_id', $row->id)
   ->condition('format_character', $format)
   ->execute();
 $img = '<img src="'.file_create_url($row->icon). '" alt="' . $row->name .'" height="75'.'" width="75'. '"  />';
 if($format=='z'){$Dformat='l, j F';}elseif($format=='W'){$Dformat='j, F';}elseif($format=='n'){$Dformat='F';}else{$Dformat='o';}
 ?>
 <div id="horoscope" class="horoscope-date">
   <h3><p><?php if($get=='week') {print date($Dformat,$fdow).' to '.date($Dformat,$ldow);}else{print date($Dformat);} ?></p></h3>
 </div>
 <?php
   print "<h1>".l(t($row->name),'horoscope/'.drupal_strtolower($row->name))."</h1>";
   print l($img,'horoscope/'.drupal_strtolower($row->name),array('html' => TRUE));
   print "<h4>".date('M, j',mktime(0,0,0,$frommonth,$fromday)).' - '.date('M, j',mktime(0,0,0,$tomonth,$today))."</h4>";
   if($row1 = $query1->fetchObject()) {
     $text = $row1->text;
   }
   else {
     $text="";
   }
 ?>
 <div id="horoscope" class="horoscope-text">
   <p><?php print t($text); ?></p>
 </div>
 <div id="horoscope" class="horoscope-hlink">
   <?php
     if($get=='day') {
       print "<li>".l('Horoscope for Week','horoscope/'.$lsign.'/week')."</li>";
       print "<li>".l('Horoscope for Month','horoscope/'.$lsign.'/month')."</li>";
       print "<li>".l('Horoscope for Year','horoscope/'.$lsign.'/year')."</li>";
       print "<li>".l('Find your Sun-Sign','horoscope/birth_sign')."</li>";
     }elseif($get=='week') { 
       print "<li>".l('Horoscope for Today','horoscope/'.$lsign.'/day')."</li>";
       print "<li>".l('Horoscope for Month','horoscope/'.$lsign.'/month')."</li>";
       print "<li>".l('Horoscope for Year','horoscope/'.$lsign.'/year')."</li>";
       print "<li>".l('Find your Sun-Sign','horoscope/birth_sign')."</li>";
     }elseif($get=='month') {
       print "<li>".l('Horoscope for Today','horoscope/'.$lsign.'/day')."</li>";
       print "<li>".l('Horoscope for Week','horoscope/'.$lsign.'/week')."</li>";
       print "<li>".l('Horoscope for Year','horoscope/'.$lsign.'/year')."</li>";
       print "<li>".l('Find your Sun-Sign','horoscope/birth_sign')."</li>";
     }else {
       print "<li>".l('Horoscope for Today','horoscope/'.$lsign.'/day')."</li>";
       print "<li>".l('Horoscope for Week','horoscope/'.$lsign.'/week')."</li>";
       print "<li>".l('Horoscope for Month','horoscope/'.$lsign.'/month')."</li>";
       print "<li>".l('Find your Sun-Sign','horoscope/birth_sign')."</li>";
     }
   ?>
 </div>
 <?php 
   print "<h1>".'About the '.l(t($row->name),'horoscope/'.drupal_strtolower($row->name))."</h1>";
   print l($img,'horoscope/'.drupal_strtolower($row->name),array('html' => TRUE));
   print "<h4>".$row->date_range_from.' - '.$row->date_range_to."</h4>";
   print t($about_sign.'.'); 
 ?>
 <div id="horoscope" class="horoscope-date">
   <p><?php print l('Read more ','horoscope/'.$lsign);?></p>
 </div>
