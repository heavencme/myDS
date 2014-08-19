<?php
include_once ( "config.php" );
include_once ( "zsdb.php" );

$db = new zsdb ( $dbuser, $dbpassword, $dbname, $dbhost );
$check = $db->exist_name ('root');
//$check = $db->add_one ( 'wb', 'su','199139wb' );
$check = $db->update_userinfo ( 'string', 3, 'name', 'wangbin');

if ( $db->ready )
{
	
}
echo "<div>$dbuser : $db->ready : check-> $check </div> ";


?>
