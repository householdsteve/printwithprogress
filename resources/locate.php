<?php
include('ip2locationlite.class.php');
 
//Load the class
$ipLite = new ip2location_lite;
$ipLite->setKey('8ef8f30a803dad6fd963f2352a7cd64f78f0569efff2a283824929031089e62b');
 
//Get errors and locations
$locations = $ipLite->getCountry($_SERVER['REMOTE_ADDR']);
$errors = $ipLite->getError();
 
//Getting the result
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($locations);
?>