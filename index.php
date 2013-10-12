<?php
set_include_path(dirname(__FILE__).'/resources/');
require_once(__DIR__.'/resources/Zend/Loader.php');
include __DIR__.'/resources/Zend/Cache.php';


  // define cache options
  $frontendOptions = array(
     'lifetime' => 300,
     'automatic_serialization' => true
  );

  $backendOptions = array(
      'cache_dir' => 'cache/output'
  );

  $URLPARTS = (isset($_REQUEST['q'])) ? explode("/",$_REQUEST['q']) : array("index","index");
  
  try {
    // configure cache
    $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);
    $id = $URLPARTS[0];
    
    if($_SERVER["APPCACHE"] == "true"){
        // if data not present in cache // generate and save it to cache for next run
        if(!($content = $cache->load($id))) {
          require_once(__DIR__.'/application.php');
      
          $c = process_page_call($URLPARTS);
      
          $cache->save($c, $id);
          $content = $c;
        }
        echo $content;
    }else{
        require_once(__DIR__.'/application.php');
        echo process_page_call($URLPARTS);
    }
    
  } catch (Exception $e) {
    die ('ERROR: ' . $e->getMessage());
  }
?>