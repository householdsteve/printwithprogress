<?php
// DO NOT MODIFY THESE FIRST SETTINGS
// Include the composer autoloader
if(!file_exists(__DIR__ .'/vendor/autoload.php')) {
	echo "The 'vendor' folder is missing. You must run 'composer update' to resolve application dependencies.\nPlease see the README for more information.\n";
	exit(1);
}
require __DIR__ . '/vendor/autoload.php';
require __DIR__ .'/resources/base.php';
    
// OK MODIFY AFTER HERE
function process_page_call($URLPARTS){
    $is_page_secure = find_secure_connection();
    


// LOAD TWIG SETTINGS - THIS IS FOR TEMLATEING
    Twig_Autoloader::register();
    $loader = new Twig_Loader_Filesystem(__DIR__.'/templates');
    $twig = new Twig_Environment($loader);

    $numberfilter = new Twig_SimpleFilter('number_format', function ($str,$length=2) {
    	  return number_format($str, $length, '.', '');
    });

    $twig->addFilter($numberfilter);

    // twig template caching
    // $twig = new Twig_Environment($loader, array(
    //     'cache' => __DIR__.'/cache',
    // ));


// THIS GETS DATA FROM THE URL AND PROCESSES IT FOR US
    //$URLPARTS - THIS COMES FROM THE INDEX PAGE.
    $URLARGS = array_slice($URLPARTS, 1);
    

// THESE ARE THE DEFAULT PAGE VARIABLE
    $baseurl = "//localhost/2013/printwithprogress"; // THE BASE URL OF THE SITE
// LOAD THE SITE MAP FILE TO SET PAGES
    $sitemapsource = file_get_contents("sitemap.json");
    $sitemap = json_decode($sitemapsource, true);
// CREATE A NAV OBJECT FROM SITE MAP

    $pagevars = array(
          "appenv"=>$_SERVER["APPENV"], // THIS ALLOWS US TO WRITE VARIABLES BASE ON ENVIRONMENT
          "baseurl"=> $baseurl, // THE BASE URL OF THE SITE
          "secure" => $is_page_secure,
          "nav" => $sitemap, // send an object here
          "args" => $URLARGS, // SEND ALL OF THE ARGUMENTS TO USE USED IN THE PAGE
          "titlebase" => "Progress Custom Screen Printing - ", // THE FIRST PART OF THE PAGE TITLE
          "title"=>"Welcome", // THE SECOND PART OF PAGE TITLE. THIS SHOULD BE EXTENDED BELOW BASED ON CONTENT
          "description" => "XXXXX", // THIS IS FOR META TAGS
          "keywords" => "XXX, YYY", // THIS TOO, THESE BOTH SHOULD BE EXTENDED BASED ON CONTEXT
          "og" => array("image"=> $baseurl."/assets/img/ink-bucket.png",
                        "title"=> "The Title that shows up on facebook") // THESE ARE FOR SOCIAL CHANNELS LIKE FACEBOOK WHERE AN IMAGE IS SHARED.
     );
     
     //echo "<pre>".print_r($sitemap)."</pre>";

// THIS PROCESSES THE FIRST PART OF THE URL TO DELEGATE ACTIONS
    if(count($sitemap[$URLPARTS[0]]) > 0 && !isset($sitemap[$URLPARTS[0]]["manual"])){
      // page exists in site map
      $pagevars = extend($pagevars,$sitemap[$URLPARTS[0]]);
      return $twig->render($URLPARTS[0].'.html', array('pagevars'=> (object) $pagevars));
      
    }else{
      switch($URLPARTS[0]):
        
        case "index":
        default: // INCASE IT DOESNT FIND ANYTHING ELSE AT LEAST DO THIS:
          
            return $twig->render('apparel.html', array('pagevars'=> (object) $pagevars));
        break;
  
      endswitch;
    }
}
?>