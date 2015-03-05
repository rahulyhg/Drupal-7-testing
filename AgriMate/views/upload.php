<?php
	if(isset($_FILES['file'])){
		
		$target_dir="../upload/";
		$target_dir = $target_dir . basename($_FILES["file"]["name"]);
		
		$uploadOk=1;
		
		$file_name = $_FILES['file']['name'];
    	$file_size = $_FILES['file']['size'];
    	$file_tmp = $_FILES['file']['tmp_name'];
    	$file_type = $_FILES['file']['type'];   
    	$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    	
    	$extensions = array("jpeg","doc","xls");  

    	//check for only image files
    	if(in_array($file_ext, $extensions)==false){
    		echo "File has .".$file_ext." extension, choose JPEG,XLS or DOC file.";
    		$uploadOk = 0;
    	}
    	
    	// Check if file already exists
		if(file_exists($target_dir)) {
    		echo $file_name." already exists.";
    		$uploadOk = 0;
    		//$count++;
		}


		if($uploadOk == 0){
			return;
		}
		else{
			if(move_uploaded_file($file_tmp, $target_dir)) {
		    	$data=array('success'=>true,'message'=>'file uploaded','name'=>$file_name,'path'=>$target_dir);
		    	echo json_encode($data);
		    }
		    else{
		    	 echo "Sorry, there was an error uploading your file.";		    	 
		    }
		}
	}
?> 