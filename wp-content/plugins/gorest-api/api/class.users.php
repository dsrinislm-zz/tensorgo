<?php
header('Content-Type: application/json');

class UsersApi extends WP_REST_Controller{

    public function __construct() {
        global $wpdb;
        $this->db = $wpdb;
		$this->namespace = 'gorest/v1';
        $this->apiUrl = 'https://gorest.co.in/public-api/users';
	}

    public function gorest_users(){
        $query = "SELECT *, IF(status, 'Active', 'InActive') as status FROM `wp_tensorgo`.`wp_gorest_users`;";
        return $this->db->get_results($query);
    }  

    public function gorest_sync_new_users(){
        $usersList  = $this->fetch_gorest_api();
        if(count($usersList)){
            $this->db->query($this->build_data_query($usersList,true));
            $rowscount = $this->db->get_results('SELECT ROW_COUNT() as affected;');

        }
        return ['message' => 'success',
            'usersCount' => $rowscount[0]->affected,
            'users'=> $this->gorest_users()];
    }

    private function truncate(){
        return $this->db->query('TRUNCATE `wp_tensorgo`.`wp_gorest_users`;');
    }

    private function transaction($statement){
        $this->db->query("START TRANSACTION");
        $this->truncate();
        $this->db->query($statement);
        $this->db->query("COMMIT");
    }

    private function build_data_query($users, $ignore = false){
        $query = $ignore ? 'INSERT IGNORE ' : 'INSERT '; 
        $query  .= 'INTO `wp_tensorgo`.`wp_gorest_users` (id, name, email, gender, status, created_at, updated_at) VALUES ';
        foreach ( $users as $user ) {
            $query .=$this->db->prepare(
                "(%d, %s, %s, %s, %d, CONVERT_TZ(%s, %s, @@global.time_zone), CONVERT_TZ(%s, %s, @@global.time_zone)),",
                $user->id, $user->name, $user->email,  $user->gender,  $user->status === 'Active' ? 1 : 0, substr($user->created_at,0,19), substr($user->created_at,-6), substr($user->updated_at,0,19), substr($user->updated_at,-6),
            );
        }
        $query = rtrim( $query, ',' ) . ';';
        return $query;
    }
    
    private function fetch_gorest_api(){
        $usersList = [];
        $page = 1;
        $pages = 0;
        $cURLConnection = curl_init();
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);   
        do {
           curl_setopt($cURLConnection, CURLOPT_URL, $this->apiUrl.'?page='.$page);
            $curlResponse = json_decode(curl_exec($cURLConnection));
            $usersList = (array) array_merge((array) $usersList, (array) $curlResponse->data);
            $pages = intval($curlResponse->meta->pagination->pages) +1;
            $page = intval($page) + 1;
        } while ($page < $pages);
        curl_close($cURLConnection);
        return $usersList;
    }

    public function gorest_sync_db(){
        $usersList  = $this->fetch_gorest_api();
        if(count($usersList)){
            $this->transaction($this->build_data_query($usersList));
        }
        return ['message' => 'success',
            'usersCount' => count($usersList),
        'users'=> $this->gorest_users(),
        ];
    }
    public function gorest_get_user($data){
        $userId = $data['id'];
        $query = $this->db->prepare("SELECT *, IF(status, 'Active', 'InActive') as status FROM `wp_tensorgo`.`wp_gorest_users` where id = %d",$userId);
        $user = $this->db->get_results($query);
        return ['status' => 'success',
            'user' => count($user)? $user[0] : null,
        ];
    }
    public function gorest_save_user($data){
        $userId = $data['id'];
        $bindValues = [];
        $bindKeys = [];
        $bindQuery = "";
        $parameters = $data->get_params();
        if(isset($parameters['name'])){
            $bindQuery = " name=%s,";
            $bindKeys[] = 'name';
            $bindValues[] = $parameters['name'];
        }
        if(isset($parameters['email'])){
            $bindQuery .= " email=%s,";
            $bindKeys[] = 'email';
            $bindValues[] = $parameters['email'];
        }
        if(isset($parameters['gender'])){
            $bindQuery .= " gender=%s,";
            $bindKeys[] = 'gender';
            $bindValues[] = $parameters['gender'];
        }
        if(isset($parameters['status'])){
            $bindQuery .= " status=%d,";
            $bindKeys[] = 'status';
            $bindValues[] = $parameters['status'];
        }
        if($bindQuery===""){
            return ['status' => 'error', 'message' => "missing input parameters"];
        }else{
            $bindKeys[] = 'id';
            $bindValues[] = $userId;
        }
        $query = $this->db->prepare("UPDATE `wp_tensorgo`.`wp_gorest_users` SET $bindQuery updated_at=NOW() WHERE id=%d",  ...$bindValues);
        $success = $this->db->query($query);
        return $success  ? array_merge($this->gorest_get_user($data), array('message' => 'User updated successfully!!!')) :['status' => 'error',
            'message' => 'User not available',
            'user' => array_combine($bindKeys, $bindValues)];
    }
    
    public function register_routes() {
		register_rest_route( $this->namespace, '/users', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'gorest_users' ),
			),
			'schema' => null,
		));
        register_rest_route( $this->namespace, '/sync-new-users', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'gorest_sync_new_users' ),
			),
			'schema' => null,
		));
        register_rest_route( $this->namespace, '/sync-db', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'gorest_sync_db' ),
			),
			'schema' => null,
		));
        register_rest_route( $this->namespace, '/user/(?P<id>\d+)', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'gorest_get_user' ),
			),
			'schema' => null,
		));
        register_rest_route( $this->namespace, '/user/(?P<id>\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'gorest_save_user' ),
			),
			'schema' => null,
		));
	}
}