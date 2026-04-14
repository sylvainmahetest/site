<?php

if (empty ($_POST ["from"]) == false)
{
	$to = "sylvainmahe4815@gmail.com";
	$from = htmlspecialchars ($_POST ["from"], ENT_QUOTES, "UTF-8", true);
	$subject = "FIRST SUBJECT";
	$message = "FIRST MESSAGE";
	
	if (mail ($to, $subject, $message, "From:" . $from) == true)
	{
		echo "mail_true";
	}
	else
	{
		echo "mail_false";
	}
}
else
{
	echo "submit_false";
}

?>
