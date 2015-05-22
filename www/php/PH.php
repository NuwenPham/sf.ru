<?php
class PH
{
	function Connect($host,$dbname,$password,$user)
	{
		$ret = true;
		$this->links[$dbname] = mysql_connect($host, $user, $password) or die("Could not connect: " . mysql_error());
		if ($this->links[$dbname] === false)
		{
			die("Не соеденило с сервером, бля. Сорри мужик!");
			$ret = false;
		}
		mysql_select_db($dbname, $this->links[$dbname]);
		mysql_query ("set character_set_results='utf8'");
		mysql_query ("set collation_connection='utf8_general_ci'");
		mysql_query ("SET NAMES utf8");
		return $ret;
	}
	function Disconnect($dbname)
	{
		mysql_close($this->links[$dbname]);
	}
	
	
	function Custom($expression)
	{
		$back = mysql_query($expression); 
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	
	function selectSingleField($table, $row, $field)
	{
		$back = mysql_query('select * from `'.$table.'` where id='.$row);

		$ret = mysql_fetch_array($back);

		
		return $ret[$field];
	}
	function selectSingleFieldWhere($table, $row, $founder, $field)
	{
		$back = mysql_query('select * from `'.$table.'` where '.$founder.'='.$row);
		$ret = mysql_fetch_array($back);
		return $ret[$field];
	}
	function selectSingleFieldWhereExtended($table, $field, $expression)
	{
		$back = mysql_query('select * from `'.$table.'` where '.$expression);
		//echo 'select * from `'.$table.'` where '.$expression;
		$ret = @mysql_fetch_array($back);
		return $ret[$field];
	}
	
	function existRow( $table, $expression )
	{
		$res = mysql_query('select * from `'.$table.'` where '.$expression);
		if(mysql_num_rows($res) > 0)
			return 1;
		else
			return 0;
	}
	
	function selectSingleRow($table, $row, $founder)
	{
		$back = mysql_query('select * from `'.$table.'` where '.$founder.'='.$row);
		$ret = mysql_fetch_array($back);
		return $ret;
	}
	
	function selectSingleRowExt($table, $expression)
	{
		$back = mysql_query( 'select * from `'.$table.'` where '.$expression );
		
		if( mysql_num_rows($back) == 0 )
			return "error_row_not_exist";
		
		$ret = mysql_fetch_array($back);
		return $ret;
	}
	
	function selectTableWhere($table, $expression)
	{
		$back = mysql_query('select * from `'.$table.'` where '.$expression);
		
			
		if( mysql_num_rows($back) == 0 )
			return "error_empty_table";
		
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	function selectTableWhereOrder($table, $expression, $column, $order)
	{
		$back = mysql_query('select * from `'.$table.'` where '.$expression.' ORDER BY '.$column.' '.$order );
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	function selectTable($table)
	{
		$back = mysql_query('select * from `'.$table.'`');
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	
	function selectTableOrder($table, $order, $column)
	{
		$back = mysql_query('select * from `'.$table.'`ORDER BY '.$column.' '.$order); // ASC DESC
		//echo 'select * from `'.$table.'`ORDER BY '.$column.' '.$order;
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	
	function selectTableOrderLimit($table, $order, $column, $start, $end)
	{
		$back = mysql_query('select * from `'.$table.'`ORDER BY '.$column.' '.$order.' LIMIT '.$start.','.$end); // ASC DESC
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	
	function selectTableOrderLimitWhere($table, $order, $column, $start, $end, $expression)
	{
		$back = mysql_query('select * from `'.$table.'` where '.$expression.' ORDER BY '.$column.' '.$order.' LIMIT '.$start.','.$end); // ASC DESC
		//echo 'select * from `'.$table.'` where '.$expression.' ORDER BY '.$column.' '.$order.' LIMIT '.$start.','.$end;
		$a = 1;
		while($ret = mysql_fetch_array($back))
		{
			$set[$a] = $ret;
			$a++;
		}
		return $set;
	}
	
	function insertRow($table, $cols, $vals)
	{
		$back = mysql_query('INSERT INTO `'.$table.'` ('.$cols.') VALUES ('.$vals.')') or die(mysql_error());
	}
	function updateField($table, $field, $value, $expression)
	{
		mysql_query('update `'.$table.'` set '.$field.'='.$value.'  WHERE '.$expression) or die(mysql_error());
		//echo 'current: "'.'update `'.$table.'` set '.$exp.'  where '.$if.'"<br>';
		//echo "true: \"update `wev0w_content` set hits=45 WHERE alias='ru-career'\"";
		//mysql_query("update `wev0w_content` set hits=45 WHERE alias='ru-career'") or die(mysql_error());
	}	
	function removeRow($table, $if, $field)
	{
		$back = mysql_query('DELETE FROM `'.$table.'` WHERE `'.$field.'` = '.$if) or die(mysql_error());	
	}
	
	function removeRowExt($table, $where)
	{
		echo 'DELETE FROM `'.$table.'` WHERE '.$where;	
		$back = mysql_query('DELETE FROM `'.$table.'` WHERE '.$where) or die(mysql_error());
		
	}
	
	function insertRowExt($table, $object)
	{
		$cols = '';
		$vals = '';
		$count = 0;
		foreach($object as $column => $value){
			if($count==0){
				$count++;
				$cols .= $column;
				$vals .= $value;
			}else{
				$cols .= ','.$column;
				$vals .= ','.$value;
			}			
		}
		
		//echo 'INSERT INTO `'.$table.'` ('.$cols.') VALUES ('.$vals.')';
		
		$back = mysql_query('INSERT INTO `'.$table.'` ('.$cols.') VALUES ('.$vals.')') or die(mysql_error());
	}


}

