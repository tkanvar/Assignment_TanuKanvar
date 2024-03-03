class DBTable
{
// Private
	constructor()
	{
		this.filterColumns = [{"ColNo": -1, "ColName": "NAME"}, {"ColNo": -1, "ColName": "EMAIL"}];
							
		this.numRows = 0;
		this.numCols = 0;
	}
	
	searchTable(searchItems)
	{		
		var table = document.getElementById("datatable");
		var tr = table.getElementsByTagName("tr");
		
		for (var i = 1; i <= this.numRows; i++)
		{
			var td = tr[i].getElementsByTagName("td")
			if (td.length == 0) continue;
			
			var displayRowTableSearch = false;
			var displayRowColumnSearch = [];
			
			for (var j = 0; j < this.numCols; j++)
			{
				var txtValue = td[j].textContent || td[j].innerText;
				
				for (var k = 0; k < searchItems[j].length; k++)
				{
					if (searchItems[j][k]["Value"] == "" && searchItems[j][k]["FilterType"] == "Column") continue;
					if (searchItems[j][k]["Value"] == "" && searchItems[j][k]["FilterType"] == "Table")
					{
						displayRowTableSearch = true;
						continue;
					}
					if (txtValue.toUpperCase().indexOf(searchItems[j][k]["Value"].toUpperCase()) != -1)
					{
						if (searchItems[j][k]["FilterType"] == "Table") displayRowTableSearch = true;
					}
					else
					{
						if (searchItems[j][k]["FilterType"] == "Column") displayRowColumnSearch.push(false);
					}
				}
			}
			var displayRow = displayRowTableSearch && !(displayRowColumnSearch.indexOf(false) != -1);
			if (displayRow)
				tr[i].style.display = "table-row";
			else
				tr[i].style.display = "none";
		}
		
		this.setAlternateRowColor();
	}
	
	setAlternateRowColor()
	{
		var tablebody = document.getElementById("datatable-tbody")
		var tr = tablebody.getElementsByTagName("tr");
		
		var visible_i = 0;
		for (var i = 0; i < this.numRows; i++)
		{
			if (tr[i].style.display != "none")
			{
				tr[i].className = "customBody ";
				if (visible_i % 2 == 0)
					tr[i].className += "r0 ";
				else
					tr[i].className += "r1 ";
				
				visible_i++;
			}
		}
	}

	collectDataForTable(data, returndata)
	{
		if (typeof data != 'object')
		{
			if (!data)
				returndata["data"] += "";
			else if (typeof data == 'string' || data instanceof String)
				returndata["data"] += data;
			else
				returndata["data"] += data.toString();
		}
		else
		{
			for (var key in data)
			{
				this.collectDataForTable(data[key], returndata);
				returndata["data"] += ", ";
			}
		}
	}
	
// Public
	filterTable()
	{
		// searchItems are in the form {"FilterType", "Value"}.
		var searchItems = [];
		for (var i = 0; i < this.numCols; i++)
			searchItems.push([]);
		
		// Collect data for filterColumns
		for (var i = 0; i < this.filterColumns.length; i++)
		{
			var filterBox = document.getElementById(this.filterColumns[i]["ColName"] + "_filterbox");
			if (!filterBox || filterBox.value == "") continue;
			searchItems[this.filterColumns[i]["ColNo"]].push({"FilterType": "Column", "Value": filterBox.value});
		}
		
		// Collect data for table search
		var inputEle = document.getElementById("searchInput")
		var valToSearch = inputEle.value.toUpperCase();
		
		for (var i = 0; i < this.numCols; i++)
			searchItems[i].push({"FilterType": "Table", "Value": valToSearch});
		
		this.searchTable(searchItems);
	}
	
	sortColumn(colIndx)
	{
		var tablehead = document.getElementById("datatable-thead")
		var row = tablehead.getElementsByTagName('tr')[0];
		var cell = row.getElementsByTagName('td')[colIndx];
		var ascending = cell["sortAscending"];
		cell["sortAscending"] = !cell["sortAscending"];
		var tablebody = document.getElementById("datatable-tbody")
		var rows = tablebody.getElementsByTagName('tr');
		var elements = [];
		
		// PLACE ROW ELEMENTS IN AN ARRAY
		for(var r = 0; r < rows.length; r += 1) { elements.push(rows[r]); }

		elements.sort( function(a, b) {
			// SORT FUNCTION
			var cell_a = a.getElementsByTagName('td')[colIndx];
			var cell_b = b.getElementsByTagName('td')[colIndx]
			if(cell_a) { var cell_a_text = cell_a.innerHTML; }                                 // MAKE SURE VALUE EXISTS IN DYNAMIC className CLASSED <td> A           
			if(cell_b) { var cell_b_text = cell_b.innerHTML; }                                 // MAKE SURE VALUE EXISTS IN DYNAMIC className CLASSED <td> B           

			if(isNaN(cell_a_text)+isNaN(cell_b_text))                                   // CHECK IF EITHER THE FIRST OR SECOND DYNAMIC VALUES ARE TEXT - IF SO, SORT ALPHABETICALLY
			{
				cell_a_text = cell_a_text.toUpperCase();
				cell_b_text = cell_b_text.toUpperCase();
				if(ascending == 1)    // IF SO, SORT ALPHABETICALLY ascending OR descending
					return (([cell_a_text, cell_b_text].sort().reverse()[0] == cell_a_text) * 2 - 1)
				else 
					return (([cell_a_text, cell_b_text].sort()[0] == cell_a_text) * 2 - 1);
			}
			else if(cell_a_text == cell_b_text)                                           // IF VALUES ARE real VALUES, AND BOTH THE SAME
				return 0;
		});

		// REMOVE ELEMENTS FROM TABLE
		for(var i = 0; i < elements.length; i++)
			tablebody.removeChild(tablebody.childNodes[0]);

		// PLACE ELEMENTS BACK IN, ORDERED
		for(var i = 0; i < elements.length; i++)
			tablebody.appendChild(elements[i]);
	
		this.setAlternateRowColor();
	}

	fillData(data)
	{
		var tablehead = document.getElementById("datatable-thead")
		var tablebody = document.getElementById("datatable-tbody")

		///////// HEADER TO TABLE
		// Create a row using the inserRow() method and
		// specify the index where you want to add the row
		var row = tablehead.insertRow(-1);
		
		// Find maximum column data row
		var indxInDataWithMaxCols = -1;
		var maxColCount = 0;
		for (var i = 0; i < data.length; i++)
		{
			var colCount = 0;
			for (var key in data[i])
			{
				if(data[i].hasOwnProperty(key))
				{
					colCount += 1;
				}
				
				if (colCount > maxColCount) 
				{
					maxColCount = colCount;
					indxInDataWithMaxCols = i;
				}
			}
		}
		this.numCols = maxColCount;
		
		// insert cells to row
		var i = 0;
		var colNames = [];		// This variable is to keep track of the order of the columns displayed in head. This will be used to fetch data for table body in that order
		for (var key in data[indxInDataWithMaxCols]) 
		{
			if (data[indxInDataWithMaxCols].hasOwnProperty(key)) 
			{
				var c1 = row.insertCell(i++);
				c1.innerText = key.toUpperCase();
				c1.sortAscending = 1;
				var context = this;
				c1.onclick = function(event) { 
					context.sortColumn(event.srcElement.cellIndex); 
				}
				colNames.push(key);
				
				// Search for column name in this.filterColumns and add relevant information in object
				for (var l = 0; l < this.filterColumns.length; l++)
				{
					if (this.filterColumns[l]["ColName"] == key.toUpperCase())
					{
						this.filterColumns[l]["ColNo"] = i-1;
						
						var c1_srch = document.createElement("input");
						c1_srch.id = key.toUpperCase() + "_filterbox";
						c1.appendChild(c1_srch);
					}
				}
			}
		}
		
		///////// ADD BODY TO TABLE
		for (i = 0; i < data.length; i++)
		{
			var row = tablebody.insertRow(-1);
			this.numRows += 1;
		
			for (var j = 0; j < colNames.length; j++) 
			{
				var c1 = row.insertCell(j);
				var returndata = {"data": ""};
				this.collectDataForTable(data[i][colNames[j]], returndata);
				c1.innerText = returndata["data"];
			}
		}
		
		this.setAlternateRowColor();
	}
};

var dbtable = new DBTable();
function FetchUserData(stage, data)
{
	switch(stage)
	{
	case 0:
		// Fill data in table
		var context = this;
		var unit_test_num = document.getElementById("unit_test_number").selectedIndex;
		var callbackfn = function(data) { context.FetchUserData(stage+1, data); }
		getData(unit_test_num, callbackfn);											// Asynchronous call to Fetch API
		
		break;
		
	case 1:
		dbtable.fillData(data);
		
		// Display search input box
		document.getElementById("searchInput").style.display = "block";
		document.getElementById("unit_test_number").style.display = "none";
		document.getElementById("label_unit_test_number").style.display = "none";
		
		// Change functionality of initial button
		var btn = document.getElementById("fetch-filter-button")
		btn.innerText = "Filter";
		btn.onclick = function() { dbtable.filterTable(); }
		
		break;
	}
}