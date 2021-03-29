<?php

/**
 * The plugin bootstrap file.
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @since             1.0.0
 *
 * @wordpress-plugin
 * Plugin Name:       GoRest API Sync
 * Plugin URI:        https://gorest.co.in/
 * Description:       Syncs the GoRest Users into DB
 * Version:           1.0.0
 * Author:            Srinivasan Dhanapal
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages
 */

// Exit if accessed directly.
if (!defined('ABSPATH')){
    exit;
}

define( 'GOREST_API_VERSION', '1.0.0' );
define( 'GOREST_MAIN_FILE', __FILE__  );

class GoRestUsers {

    public function __construct(){
        global $wpdb;
        $this->db = $wpdb;
        $this->downloadFile = 'data.csv';
        // to be executed one time when the plugin is activated
        register_activation_hook( GOREST_MAIN_FILE, array( $this, 'install' ) );
          
        // to be executed one time when the plugin is deactivated
        register_deactivation_hook( GOREST_MAIN_FILE, array( $this, 'uninstall' ) );
    }

    public function getFile($filename){
        WP_Filesystem();
        global $wp_filesystem;
        if(!is_readable($filename)) {
            echo '- Missing DB Script.';
            wp_die();
        }
        return $wp_filesystem->get_contents($filename);
    }

    public function install() {
        $sql = $this->getFile(__DIR__.'/schema/users.sql');
        $this->db->query($sql);
        add_option( 'GOREST_API_VERSION', GOREST_API_VERSION);
    }

    public function uninstall(){
        $sql = $this->getFile(__DIR__.'/schema/drop.sql');
        $this->db->query($sql);
        delete_option('GOREST_API_VERSION');
    }
    
    static function activate_rest_apis(){
        require_once(__DIR__.'/api/class.users.php');
        $users = new UsersApi;
        $users->register_routes();
    }

    public function gorest_users(){
        $query = "SELECT *, IF(status, 'Active', 'InActive') as status FROM `wp_tensorgo`.`wp_gorest_users`;";
        return $this->db->get_results($query);
    }  

    public function formatCamelCase($string, $capitalizeFirstCharacter = true) 
    {
        $str = str_replace('_', ' ', ucwords($string, '_'));
        if (!$capitalizeFirstCharacter) {
            $str = lcfirst($str);
        }
        return $str;
    }
    public function download_gorest_users() {
        if ($_SERVER['REQUEST_URI']=='/gorest/download') {
            $users = $this->gorest_users();
            $headings = array_map(function($title){return $this->formatCamelCase($title);}, array_keys((array) $users[0]));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header('Content-Description: File Transfer');
            header("Content-Type: application/x-msdownload",true,200);
            header("Content-Disposition: attachment; filename={$this->downloadFile}");
            header("Expires: 0");
            header("Pragma: no-cache");
            $fh = @fopen( 'php://output', 'w' );
            fputcsv($fh, $headings);
            foreach ( $users as $user ) {
                $data = array_values((array) $user);
                // Put the data into the stream
                fputcsv($fh, $data);
            }
            // Close the file
            fseek($fh, 0);
            fclose($fh);
            fpassthru($fh);
            // Make sure nothing else is sent, our file is done
            exit;
        }

    }
}
add_action('rest_api_init', array('GoRestUsers', 'activate_rest_apis'));

$obj = new GoRestUsers();

add_action('template_redirect', array($obj, 'download_gorest_users'));