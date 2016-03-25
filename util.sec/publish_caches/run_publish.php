<?php
/**
 * This script publishes the cache if its activation_date was set
 */

use Utils\Database\XDb;

$rootpath = '../../';
require_once('settings.inc.php');
require_once($rootpath . 'lib/eventhandler.inc.php');

/* begin db connect */
db_connect();
if ($dblink === false) {
    echo 'Unable to connect to database';
    exit;
}
/* end db connect */

$rsPublish = XDb::xSql(
                "SELECT `cache_id`, `user_id`
                FROM `caches`
                WHERE `status` = 5
                  AND `date_activate` != 0
                  AND `date_activate` <= NOW()");

while ($rPublish = XDb::xFetchArray($rsPublish)) {
    $userid = $rPublish['user_id'];
    $cacheid = $rPublish['cache_id'];

    // update cache status to active
    XDb::xSql("UPDATE `caches` SET `status`=1, `date_activate`=NULL, `last_modified`=NOW() WHERE `cache_id`= ? ", $cacheid);

    // send events
    touchCache($cacheid);
    event_new_cache($userid);
    event_notify_new_cache($cacheid);
}
XDb::xFreeResults($rsPublish);

