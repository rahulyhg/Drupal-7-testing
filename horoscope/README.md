OVERVIEW
--------

This module create a default horoscope named 'Zodiac' it consists 12 sign with their information,
to use this default horoscope, admin user can simply create text for the same according to the format selected,
it also adds blocks to display lists of sign from a particular horoscope that is selected default to display.
default format can be selected from "www.example.com/admin/config/horoscope/list", there is option to create
new horoscope and their associated sign, that can be added from "www.example.com/admin/config/horoscope/add".
only administrator can use the features described above.

 Default format			 
 * day.
 
 Default Horoscope               
 * Zodiac


 Available format
 * Day.
 * Week.
 * Month.
 * Year.

 Available Horoscope
 * Zodiac
 * More can be created.
 
 1. There is already data about the sign belonging to zodiac horoscope.
 2. Block named "List Horoscope" will show all available sing with thier logos from default selected horoscope
    (default is zodiac) while other can be choosen or created as well;
 3. Default format is 'day,zodiac',while other can be choosen by admin to show default horoscope and format.
 4. user can check their horoscop for day, week, month, and year.
 5. user can find their sugn sign by simply entering their date of birth.

INSTALLATION
------------

Install module from https://drupal.org/project/horoscope or you directly put your extracted horoscope module folder to
"site/all/module/custom" and enable module by visiting the URL: "www.example.com/admin/modules". After installing module 
you can visit horoscope setting page using this URL: www.example/admin/config/horoscope. there will be two links
"add horoscope" and "list horscope" by selecting "list horoscope" you will find available horoscope named "Zodiac",
there is 12 sign already added for this horscope you can check it by clicking on link "list sign". You can add text for 
particular sign to display for it for day,week,month,and year wise. Format can be choosen by www.example.com/admin/config/horoscope/list.

"add horoscope" link can create new fresh horoscope and after creating it there will be link available to add sing,list text,edit,delete.
first add sign for newly created horscope and later add text for the sign belonging to the same. user can check text for particular day,week,month,year and for selecte sign. by clicking on link list text.

it will create a block name  "horoscope list" place it in any region of your site, now it is ready for you.


ADMINISTRATIVE INTERFACE
------------------------

 1. Multiple horoscope and their associated sing can be add/edit/delete.
 2. Select default format to see and perform operation for a particular horoscope.
 3. You can only create/add text for the current year for default selected horoscope and format.
 4. If you add text "A" for January 1, in January 1 of the next year you might get text "A".
 5. When year changed; and if you creating/adding text "A" for current year 1st january then
    it will ask to update the text "B" of 1st january of previous year if text "B" exists.
 6. It will also ask to update the content of a particular date if its being created/added twice.
 7. Text can be added for current year only.
 8. Entered text for particular horoscope sings can be viewed sign wise for the selected date (format will be default selected).

USER INTERFACE
--------------

 1. Users can check their horoscop for day, week, month, and year wise.
 2. They can find their horoscope sign (sun-sign) by entering the date of birth.

 
REFERENCE
---------

 Horoscope data are taken from this site :
 1. http://www.astrology.com/ 
 2. http://shine.yahoo.com/horoscope/
