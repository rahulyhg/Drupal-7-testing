
lm_paypal_features 1.x for Drupal 7.x
----------------------------
lm_paypal_features module gives site builders a way to export the lm_paypal setting(configuration)
and lm_paypal subscriptions.
This project don't provides an API and a UI, it use features UI.

Installation
------------
lm_paypal_features can be installed like any other Drupal module -- place it in
the modules directory for your site and enable it (and its requirement,
CTools and LM Paypal).


How lm_paypal_features works
-------------------
lm_paypal_features uses also the CTools export API which make `variable` table exportables for LM Paypal settings.
To learn more about exportables and the CTools export API, see more
CTools advanced help on "Exportable objects tool."
Simple export subscriptions into array don't need CTools.

Exporting LM Paypal settings
-------------------
For developer or site builder lm_paypal_features gives tools to export the
settings of LM Paypal in your site database.

If you export settings values, you will need to enable either the [Features][1]
module, [CTools][2] . Features provides a UI for adding settings exports to a
feature.

Exporting LM Paypal subscriptions
-------------------
For developer or site builder lm_paypal_features gives tools to export the
subscriptions of LM Paypal in your site database too.

If you export settings values, you will need to enable only the [Features][1]
module. Features provides a UI for adding settings exports to a
feature.

Maintainers
-----------

- lesia (Olesia Polupan)


[1]: http://drupal.org/project/features
[2]: http://drupal.org/project/ctools
