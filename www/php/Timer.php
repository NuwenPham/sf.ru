<?php
class PTimer 
{
	function Start($delay_seconds, $relative_path)
	{
		$iterations = 0;
		while(true)
		{		
			if( $iterations < $delay_seconds )
			{
				usleep(1000000);
			}
			else
			{				
				$http = fsockopen('starfight.ru',80);
				fputs($http, "GET http://starfight.ru/".$relative_path." HTTP/1.0\r\n");
				fputs($http, "Host: starfight.ru\r\n");
				fputs($http, "\r\n");
				fclose($http);
				break;
			}
			$iterations++;			
		}
	}		
}

