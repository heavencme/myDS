<?php
    class zsdb
    {
        var $ready;
        /*
         database connect is ready===true/false
        */
        
        var $charset;
        /*
         charset
        */
        
        protected $dbuser;
        /*
         database user name
        */
        
        protected $dbname;
        /*
         database name
        */
        
        protected $dbpassword;
        /*
         database password
        */
        
        protected $dbhost;
        /*
         database host
        */
        
        protected $dbh;
        /*
         current query for database;
        */
        
        function get_total_users()
        {
            /*get total user number*/
        }
        
        function db_con()
        {
            @ $this->dbh=new mysqli($this->dbhost, $this->dbuser, $this->dbpassword,$this->dbname);
            if(mysqli_connect_errno())
                {
                    //echo mysqli_connect_errno();
                    return;
                }
            $this->dbh->set_charset("utf8"); //set character set to utf8
            $this->ready = true; //database connection is ready
            //echo "dbconnected!!!";
            
        }
        
        function db_discon()
        {
            if(!$this->dbh)
                {
                    //echo"<h1>no database connection.</h1>";
                    return;
                }
            $this->dbh->close(); //for manually disconnect to the database
            //echo"dbclosed!!!";
            $this->ready=false;
        }
        
        function select($newdbname)
        {
            /*
             change current database connection to a new one
            */
            if(!$this->dbh)
                {
                    //echo"<h1>Error establishing a database connection.</h1>";
                    return;
                }
            if($this->dbh->query("SELECT DATABASE()")===$newdbname)
                return;
            $this->dbh->select_db($newdbname);
        }
        
        function query($query)
        {
            /*
             $query is a sql language string
            */
            return $this->dbh->query($query);
            
        }
        
        function __construct($dbuser,$dbpassword,$dbname,$dbhost)
        {
            $this->dbuser=$dbuser;
            $this->dbpassword=$dbpassword;
            $this->dbname=$dbname;
            $this->dbhost=$dbhost;
            $this->db_con(); //defualt to connect database
        }
        /**check if id exists in user_info TABLE**/
        function exist_uid($uid)
        {
            /*query in the database if the uid exists*/
            $query="SELECT * FROM user_info WHERE uid=$uid";
            $result=$this->query($query);
            if($result!=null)
                $rows=$result->fetch_array();//
            //echo "rowis".$rows;
            if(!empty($rows))    
            {
                
                //echo"$uid"."already exists!".$rows;
                return true;
            }
            else
                return false;
            
        }
        
        /**check if name exists in user_info TABLE**/
        function exist_name($name)
        {
            /*query in the database if the uid exists*/
            $query="SELECT * FROM user_info WHERE name='$name'"; // ' ' is important
            $result=$this->query($query);
            if($result!=null)
                $rows=$result->fetch_array();//
            //echo "rowis".$rows;
            if(!empty($rows))    
            {
                
                //echo"$uid"."already exists!".$rows;
                return true;
            }
            else
                return false;
            
        }
        
        /**
         *向user_info表中添加一条记录
         *包含用户基本信息
         **/
        function add_one( $name, $role, $pw)
        {
            
						$query="insert into user_info (name, role, password) values ('$name', '$role', '".md5($pw)."' )";
						$this->query($query);
						if($this->dbh->error)
						{
								echo $this->dbh->error;
								return false;
						}
						else
						{
							return true;
						}
		
        }
        
        /**
         *在user_info表中删除一条记录
         **/
        function remove_one($type,$uid)
				{
						$query="DELETE FROM usersinfo WHERE ruid=$uid ORDER BY id DESC LIMIT 1";
						$this->query($query);
						if($this->dbh->error)
						{
								echo $this->dbh->error;
								return false;
						}
						else
						{
							return true;
						}
        }
        
        /**
         *修改user_info表中一条记录
				 *@type: 类型
				 *@id
				 *@key: 修改字段
				 *@value: 新值
         **/
        function update_userinfo($type, $uid, $key, $value)
        {
					//$date=strftime("%Y-%m-%d %d %b" ,time());
						switch( $type )
						{
						case 'digit':
								$query="update user_info set $key=$value where uid=$uid";
								break;
						case 'string':
								$query="update user_info set $key='$value' where uid=$uid";
								break;
						case 'password':	
								$query="update user_info set $key='".md5($value)."' where uid=$uid";
								break;
						default :
								break;

						}
						
            $this->query($query);
						if($this->dbh->error)
						{
								echo $this->dbh->error;
								return false;
						}
						else
						{
								return true;
						}
            
        }
        
        /**
         *向auth_role表中的添加一条记录
         *包含用户基本信息
         **/
        function update_roleauth($uid,$name,$sex,$access_token,$rruid)
        {
            //$date=strftime("%Y-%m-%d %d %b" ,time());
            //echo "inserting4".$uid;
            $query="update usersinfo set uid=$uid,name='$name',access_token='$access_token' where ruid=$rruid";
            $this->query($query);
            if($this->dbh->error)
                {
                    //echo $this->dbh->error;
                    return;
                }
            //echo "added!";
            
        }
        
        /**给用户的名，返回用户id**/
        function name2uid($name)
        {
            $query="SELECT uid FROM user_info WHERE name='$name'";
            $result=$this->query($query);
            $id=$result->fetch_array();
            return $id[0];
            
        }
        
        /**给用户id，返回name**/
        function uid2name($uid)
        {
            $query="SELECT name FROM user_info WHERE uid=$uid";
            $result=$this->query($query);
            $name=$result->fetch_array();
            return $name[0];
            
        }
        
        /**向guests表中添加一条记录，包括用户id，date，ip**/
        function aguest($id,$ip)
        {
            $query="insert into guests (date,id,ip) values (CURDATE(),$id,'"."$ip')";
            $this->query($query);
        }
        
        /**向like表中插入一条记录，包括用户id，like1,like2...like9,没有设置的默认为0**/
        function like($id,$likeuid)
        {
            //UPDATE ulike SET like4=444 WHERE id=13
            $exist=0;//标志是否已经like过此人了
            $add_new="insert into ulike (id) values ($id)";
            $add_head="UPDATE ulike SET like";
            $add_tail="=$likeuid WHERE id=$id";
            $query="select * from ulike where id=$id ";//select * from like where id=$id中like非法
            $result=$this->query($query);
            $arr=$result->fetch_array();
            if(empty($arr))
               $this->query($add_new);
            foreach($arr as $item)
                if($likeuid==$item)
                    $exist=1;
                    
            if($exist==0)
            {
                //看看likeN是空的就插入，顺序寻找
                if($arr['like1']==0)
                    $this->query($add_head."1".$add_tail);
                else if($arr['like2']==0)
                    $this->query($add_head."2".$add_tail);
                else if($arr['like3']==0)
                    $this->query($add_head."3".$add_tail);
                else if($arr['like4']==0)
                    $this->query($add_head."4".$add_tail);
                else if($arr['like5']==0)
                    $this->query($add_head."5".$add_tail);
                else if($arr['like6']==0)
                    $this->query($add_head."6".$add_tail);
                else if($arr['like7']==0)
                    $this->query($add_head."7".$add_tail);
                else if($arr['like8']==0)
                    $this->query($add_head."8".$add_tail);
                else if($arr['like9']==0)
                    $this->query($add_head."9".$add_tail);
                else //是一个新的并且此时原来九个已经满了，那么回环插到第一个,形成一个队列
                    {
                        $this->query($add_head."9=".$arr['like8']." WHERE id=$id");
                        $this->query($add_head."8=".$arr['like7']." WHERE id=$id");
                        $this->query($add_head."7=".$arr['like6']." WHERE id=$id");
                        $this->query($add_head."6=".$arr['like5']." WHERE id=$id");
                        $this->query($add_head."5=".$arr['like4']." WHERE id=$id");
                        $this->query($add_head."4=".$arr['like3']." WHERE id=$id");
                        $this->query($add_head."3=".$arr['like2']." WHERE id=$id");
                        $this->query($add_head."2=".$arr['like1']." WHERE id=$id");
                        $this->query($add_head."1".$add_tail);
                    }
            }
        }
        
				/**取回用户列表
				 *注意： 返回的值为多行的，传引用；$start,$end表示查询范围 
				**/
        function fetch_user( &$names, &$pics, &$sellers, $start=1, $end=10)
        {
            $names = array();//存储多行结果
						$roles = array();
						$uids = array();
            $query = "SELECT * FROM user_info LIMIT $start,$end"; 
            $result = $this->query($query);
            while ( $row = $result->fetch_array() )//自动向后移动指针,每次取出一行
            {  
                array_push($names, $row['name']);
                array_push($roles, $row['role']);
                array_push($uids, $row['uid']);
            } 
            if( ( !empty($names) ) && ( !empty($ids) ) )    
            {
                return true;
            }
            else
                return false;
        }
        
        /**
         *找出某个id对应like的用户，返回行
         **/
        function fetchulike($id) 
        {
            $query="SELECT LIKE1,LIKE2,LIKE3,LIKE4,LIKE5,LIKE6,LIKE7,LIKE8,LIKE9 FROM ulike WHERE id=$id";
            $result=$this->query($query);
            $row=$result->fetch_array(MYSQL_NUM);//MYSQL_NUM是int
            /**fetch_array()返回值会多余，MYSQL_ASSOC, MYSQL_NUM, and MYSQL_BOTH（默认）,比如有了uids:Array ( [0] => 1662047260 [LIKE1] => 1662047260 [1] => 0 [LIKE2] => 0 [2] => 0 [LIKE3] => 0 [3] => 0 [LIKE4] => 0 [4] => 0 [LIKE5] => 0 [5] => 0 [LIKE6] => 0 [6] => 0 [LIKE7] => 0 [7] => 0 [LIKE8] => 0 [8] => 0 [LIKE9] => 0 )**/
            if($row)
                return $row;
            else
                return null;
        }
        
        /**
         *随即取出指定数目$num个用户
         **/
        function getsomebody($num)
        {
            $uids=array();
            $query="SELECT uid FROM `user_info` AS t1 JOIN (SELECT ROUND(RAND() * ((SELECT  MAX(uid) FROM `user_info`)-(SELECT MIN(uid) FROM `user_info`))+(SELECT MIN(uid) FROM `user_info`)) AS ranid) AS t2 WHERE t1.uid >= t2.ranid ORDER BY t1.uid LIMIT $num";
            $result=$this->query($query);
            while ($row = $result->fetch_array(MYSQL_NUM))//自动向后移动指针,每次取出一行
            {
                array_push($uids,$row[0]);
            }
            /**
            if(count($uids)==9)
                echo "取出值是九个";
            else
                echo "取出值不是九个";
            **/
            if(!empty($uids))
                return $uids;
            else
                return null;
            
        }
        /*
         *将ctrget.php中数据存入dataset表中为了设置首页图片
         */
        function ctrlset($data,$val)
        {
            $x=count($data,0);//mode=0,默认不检测多维数组
            $query="";
            switch($x)
            {
                case 1:
                    $query="insert into dataset (date,".$data[0][0].",".$data[0][1].",".$data[0][2].") values (CURDATE(),'".$val[0][0]."','".$val[0][1]."','".$val[0][2]."')";
                    break;
                case 2:
                    $query="insert into dataset (date,".$data[0][0].",".$data[0][1].",".$data[0][2].",".$data[1][0].",".$data[1][1].",".$data[1][2].") values (CURDATE(),'".$val[0][0]."','".$val[0][1]."','".$val[0][2]."','".$val[1][0]."','".$val[1][1]."','".$val[1][2]."')";
                    break;
                case 3:
                    $query="insert into dataset (date,".$data[0][0].",".$data[0][1].",".$data[0][2].",".$data[1][0].",".$data[1][1].",".$data[1][2].",".$data[2][0].",".$data[2][1].",".$data[2][2].") values (CURDATE(),'".$val[0][0]."','".$val[0][1]."','".$val[0][2]."','".$val[1][0]."','".$val[1][1]."','".$val[1][2]."','".$val[2][0]."','".$val[2][1]."','".$val[2][2]."')";
                    break;
                case 4:
                    $query="insert into dataset (date,".$data[0][0].",".$data[0][1].",".$data[0][2].",".$data[1][0].",".$data[1][1].",".$data[1][2].",".$data[2][0].",".$data[2][1].",".$data[2][2].",".$data[3][0].",".$data[3][1].",".$data[3][2].") values (CURDATE(),'".$val[0][0]."','".$val[0][1]."','".$val[0][2]."','".$val[1][0]."','".$val[1][1]."','".$val[1][2]."','".$val[2][0]."','".$val[2][1]."','".$val[2][2]."','".$val[3][0]."','".$val[3][1]."','".$val[3][2]."')";
                    break;
                default:
                    break;
            }
            if($query!="")
            {
                $this->query($query);
                if($this->dbh->error)
                {
                        echo $this->dbh->error;
                        return;
                }
                    
            }
        }
        
        /**
         *获取存在数据库中首页图片的信息
         */
        function picget()
        {
            $home=array();
            $query="select * from dataset order by date desc limit 1";
            $result=$this->query($query);
            $home=$result->fetch_array();
            return $home;    
        }
        
        /**
         *用户点开首页某个图片，增加一次访问记录
         *@$i:图片编号
         *@$num:当前记录在数据表中的编号num
         */
        function addpicview($i,$num)
        {
            $query="UPDATE dataset SET pic".$i."view = pic".$i."view+1 WHERE num = $num";
            $this->query($query);
            if($this->dbh->error)
            {
                echo $this->dbh->error;
                return;
	    }
        }
        
        /**
         *用户增加一条like记录
         *@$picnum:图片编号,'pic0'
         *@$num:当前记录在数据表中的编号num
         */
        function addpiclike($picnum,$num)
        {
            $query="UPDATE dataset SET pic".$picnum."like = pic".$picnum."like+1 WHERE num = $num";
            $this->query($query);
            if($this->dbh->error)
            {
                echo $this->dbh->error;
                return;
	    }
        }
        /**
         *更新用户token值
         *@$type:类型是renren还是 
         *@$id:usersinfo中的uid/rruid
         *@$access_token:token值
         **/
        function update_token($type,$uid,$access_token)
        {
            if($type==' ')
            {
                $query="UPDATE usersinfo SET access_token = '$access_token', lastdate = NOW() WHERE uid= $uid";
                $this->query($query);
                if($this->dbh->error)
                {
                    echo $this->dbh->error;
                    return;
                }
            }
            elseif($type=='renren')
            {
                $query="UPDATE usersinfo SET raccess_token = '$access_token', lastdate = NOW() WHERE ruid= $uid";
                $this->query($query);
                if($this->dbh->error)
                {
                    echo $this->dbh->error;
                    return;
                }
            }
        }
        
        
    }
?>




















