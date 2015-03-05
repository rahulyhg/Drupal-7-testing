<?php
	
	require_once '../lib/phpMailer/class.phpmailer.php';
	$mail = new PHPMailer();
	
	$mail->IsSMTP();
	$mail->Port = 587;
	$mail->Host = "smtp.mandrillapp.com";
	$mail->SMTPAuth = true;
	$mail->SetFrom("noreply@agrimate.com.au","no-reply");
	$mail->AddAddress($_POST['receiverEmail']);
	$mail->Username = "sysadmin@go1.com.au";
	$mail->Password = "R5w-BtWiZIL49U2GW1hGag";
	$mail->SMTPSecure = 'tls';
	$mail->Subject= $_POST['subject'];

	//template for enquiry mail
    if($_POST['msg_type'] == "enquiries"){
	$mail->Body = "Hi ".$_POST['receiverName'].",\r\n";
	$mail->Body .="You have a new message on AgriMate from ".$_POST['senderName']."\r\n";
	$mail->Body .="The message is below but you will need to go to http://agrimate.com.au to reply\n\n\n";
	$mail->Body .="Message:\n";
	$mail->Body .=$_POST['message']."\n\n";
	$mail->Body .="Thanks,\nThe AgriMate Team";

	}else{  //template for order confirm mail
    $mail->Body = "Hi ".$_POST['receiverName'].",\r\n";
	$mail->Body .=$_POST['message']."\n\n";
	$mail->Body .="Thanks,\nThe AgriMate Team";
	}
	
	
	if(!$mail->send()){
		$data=array('success'=>false,'message'=>'Email not Sent');
		echo json_encode($data);
	}else{
		$data=array('success'=>true,'message'=>'Email Sent');
		echo json_encode($data);
	}
?>