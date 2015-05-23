<?php 
class Router
{
	public function Route($PageName)
	{	$sdfsdf;	
		$pageType = $this->GetPageType($PageName);
		
		if( $pageType == "404" )
		{
			// Load 404 page
			require_once("php/pages/page404.php");
		}
		
		else if( $pageType == 0 )
		{
			require_once("php/pages/".$PageName.".php");
		}
		
		else if( $pageType == 1 )
		{
			require_once("php/pages/".$PageName.".php");
		}
	}
	
	public function ParseUrl($url)
	{
		$url_pre_parsed = explode("?", $url);
		$ParsedURL = new UrlParsed();
		$ParsedURL->File = $url_pre_parsed[0];
		
		if($url_pre_parsed[1] == "")
		{
			$ParsedURL->Error = "Query string is empty";
			$ParsedURL->Error_ID = 1000;
		}
			
		$url_parsed = explode("&", $url_pre_parsed[1]);			
		$page_parsed = explode("=", $url_parsed[0]);			
		$ParsedURL->Page = $page_parsed[1];
		
		return $ParsedURL;
	}
	
	public function LoadPages()
	{
		$pages = array();
		
		$page = new PageData();
		$page->Page_Name = "reg_page";
		$page->Page_Type = 0;		
		array_push($pages, $page);
		
		$page = new PageData();
		$page->Page_Name = "game_main_page";
		$page->Page_Type = 0;		
		array_push($pages, $page);
		
		$page = new PageData();
		$page->Page_Name = "battle_page";
		$page->Page_Type = 0;		
		array_push($pages, $page);	
		
		return $pages;
	}
	
	// Send class PageData
	public function GetPageType($pageName)
	{

		$pages = $this->LoadPages();
		foreach( $pages as $key => $val )
			if( $val->Page_Name == $pageName)
				return $val->Page_Type;
		
		return "404";		
	}
}

class UrlParsed
{
	public $Error = "";
	
	//404 - not found, 1000 - query string is empty;
	public $Error_ID;
	public $File;
	public $Page;
	public $Values;
}

class PageData
{
	public $Page_Name;
	public $Page_Type;
	//====
	// - Types of Pages -
	// 0 - Load php file from name. Eample: <Page_Name>.php
	// 1 - Load page from data base
}
