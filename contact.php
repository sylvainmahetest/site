<?php

$to = "sylvainmahe4815@gmail.com"
$from = htmlspecialchars ($_POST ["from"], ENT_QUOTES, "UTF-8", true);
$subject = htmlspecialchars ($_POST ["subject"], ENT_QUOTES, "UTF-8", true);
$message = htmlspecialchars ($_POST ["message"], ENT_QUOTES, "UTF-8", true);
$submit = false;
$sent = false;
$error = false;

if (isset ($_POST ["submit"]) == true && empty ($_POST ["from"]) == false && empty ($_POST ["subject"]) == false && empty ($_POST ["message"]) == false)
{
	$submit = true;
	$header = "From:" . $from;
	
	if (mail ($to, $subject, $message, $header) == true)
	{
		$sent = false;
	}
	else
	{
		$error = true;
	}
}

if ($sent == false)
{
	echo "<subtitle_>Pour me contacter</subtitle_>\n";
	echo "<paragraph1_>Contactez-moi en remplissant le formulaire ci-après.</paragraph1_>\n";
	
	if ($error == true)
	{
		echo "<paragraph4_>Votre message n'a pas été envoyé à cause d'un problème technique, veuillez réésayer. &#128565;</paragraph4_>\n";
	}
	
	echo "<form action=\"contact.php\" method=\"post\">\n";
	
	if (isset ($_POST ["submit"]) == true && empty ($_POST ["from"]) == true)
	{
		echo "<paragraph1_><bold_>&#10132;&#160;Veuillez indiquer votre adresse de courier électronique&#160;:</bold_></paragraph1_>\n";
		echo "<input type=\"text\" name=\"from\" placeholder=\"&#9888;&#160;exemple@gmail.com\"></input>\n";
	}
	else
	{
		echo "<paragraph1_>Votre adresse de courier électronique&#160;:</paragraph1_>\n";
		echo "<input type=\"text\" name=\"from\" placeholder=\"exemple@gmail.com\"></input>\n";
	}
	
	if (isset ($_POST ["submit"]) == true && empty ($_POST ["subject"]) == true)
	{
		echo "<paragraph1_><bold_>&#10132;&#160;Veuillez indiquer le sujet de votre message&#160;:</bold_></paragraph1_>\n";
		echo "<input type=\"text\" name=\"from\" placeholder=\"&#9888;&#160;...\"></input>\n";
	}
	else
	{
		echo "<paragraph1_>Le sujet de votre message&#160;:</paragraph1_>\n";
		echo "<input type=\"text\" name=\"subject\" placeholder=\"...\"></input>\n";
	}
	
	if (isset ($_POST ["submit"]) == true && empty ($_POST ["message"]) == true)
	{
		echo "<paragraph1_><bold_>&#10132;&#160;Veuillez écrire votre message&#160;:</bold_></paragraph1_>\n";
		echo "<textarea name=\"message\" rows=\"10\" placeholder=\"&#9888;&#160;...\"></textarea>\n";
	}
	else
	{
		echo "<paragraph1_>Votre message&#160;:</paragraph1_>\n";
		echo "<textarea name=\"message\" rows=\"10\" placeholder=\"...\"></textarea>\n";
	}
	
	echo "<input type=\"submit\" name=\"submit\" value=\"Envoyer votre message\"></input>\n";
	echo "</form>\n";
}
else
{
	echo "<paragraph4_>Votre message a été envoyé ! &#128578;</paragraph4_>\n";
	echo "<paragraph2_>Le personnel chargé de la communication vous répondra prochainement.</paragraph2_>\n";
}

?>
