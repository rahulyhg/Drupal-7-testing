<?php 
	// print '<pre>';
	// print_r($_POST);
  	require_once '../lib/phpMailer/class.phpmailer.php';
	$mail = new PHPMailer();
	$mail->IsSMTP();
	$mail->Port = 25;
	$mail->Host = "smtp.gmail.com";
	$mail->SMTPAuth = true;
	$mail->SetFrom("noreply@launchpad.com.au","no-reply");
	$mail->AddAddress($_POST['email']);
	$mail->Username = "narendra.rajwar27@gmail.com";
	$mail->Password = "";
	$mail->SMTPSecure = 'tls';
	$mail->Subject = 'Testing Mail';

	$mail->Body = "Hello ".$_POST['mailTo']."\n";
	$mail->Body .= "You are Receiving this email from SAID Enterpreneurship Launchpad App."."\n";
	$mail->Body .= $_POST['sender']." is Sender of this email"."\n";
	$mail->Body .= "The original Message is :"."\n"."'".$_POST['message']."'"."\n";
	$mail->Body .= "Do not reply this mail and visit site";

	
	echo $mail->Body;

	// if(!$mail->send()){
	// 	//$data=array('success'=>false,'message'=>'Email not Sent');
	// 	//echo json_encode($data);
	// 	echo 'failed'.$mail->ErrorInfo;
	// }else{
	// 	// $data=array('success'=>true,'message'=>'Email Sent');
	// 	// echo json_encode($data);
	// 	echo 'sent';
	// }
	
?>