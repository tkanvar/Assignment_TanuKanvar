// Model
class DBData
{
// Private	
	constructor(data)
	{
		this.jsonData = data;
		this.colNames = [];		// This variable is to keep track of the order of the columns displayed in head. This will be used to fetch data for table body in that order
		this.fullData = [];		// After json parse and sorting
		this.data = null;		// After sorting / Search
		this.indxInJsonDataWithMaxCols = 0;
		this.sortColOrder = [];	// 1 is ascending and 0 is descending
		
		this.findMaxColJsonDataRow();
		this.parseJsonData();
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
	
	parseJsonData()
	{
		var i = 0;
		for (var key in this.jsonData[this.indxInJsonDataWithMaxCols]) 
		{
			if (this.jsonData[this.indxInJsonDataWithMaxCols].hasOwnProperty(key)) 
			{
				this.colNames.push(key);				
				this.sortColOrder.push(1);
			}
		}
		
		for (i = 0; i < this.jsonData.length; i++)
		{
			var cellData = [];
			for (var j = 0; j < this.colNames.length; j++) 
			{
				var returndata = {"data": ""};
				this.collectDataForTable(this.jsonData[i][this.colNames[j]], returndata);
				cellData.push(returndata["data"]);
			}
			this.fullData.push(cellData);
		}
		
		this.data = this.fullData;
	}
	
	findMaxColJsonDataRow()
	{
		var maxColCount = 0;
		for (var i = 0; i < this.jsonData.length; i++)
		{
			var colCount = 0;
			for (var key in this.jsonData[i])
			{
				if(this.jsonData[i].hasOwnProperty(key))
					colCount += 1;
				
				if (colCount > maxColCount) 
				{
					maxColCount = colCount;
					this.indxInJsonDataWithMaxCols = i;
				}
			}
		}
	}
	
// Public
	getData()
	{
		return this.data;
	}
	getHeadColNames()
	{
		return this.colNames;
	}
	
	searchData(searchItems)
	{
		var searchedData = [];
		this.data = this.fullData;
		for (var i = 0; i < this.data.length; i++)
		{
			var displayRowTableSearch = false;
			var displayRowColumnSearch = [];
			
			for (var j = 0; j < this.data[i].length; j++)
			{
				var txtValue = this.data[i][j];
				
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
						if (searchItems[j][k]["FilterType"] == "Table") 
							displayRowTableSearch = true;
					}
					else
					{
						if (searchItems[j][k]["FilterType"] == "Column") 
							displayRowColumnSearch.push(false);
					}
				}
			}
			var displayRow = displayRowTableSearch && !(displayRowColumnSearch.indexOf(false) != -1);
			if (displayRow)
				searchedData.push(this.data[i]);
		}
		
		this.data = searchedData;
	}
	
	sortColumn(colIndx)
	{
		var ascending = this.sortColOrder[colIndx];
		if (this.sortColOrder[colIndx]) this.sortColOrder[colIndx] = 0;
		else this.sortColOrder[colIndx] = 1;
		var elements = [];
		
		// PLACE ROW ELEMENTS IN AN ARRAY
		for(var r = 0; r < this.data.length; r += 1) { elements.push(this.data[r]); }

		elements.sort( function(a, b) {
			// SORT FUNCTION
			var cell_a_text = a[colIndx];
			var cell_b_text = b[colIndx]

			if(cell_a_text != cell_b_text)
			{
				cell_a_text = cell_a_text.toUpperCase();
				cell_b_text = cell_b_text.toUpperCase();
				if(ascending == 1)    // IF SO, SORT ALPHABETICALLY ascending OR descending
					return (([cell_a_text, cell_b_text].sort().reverse()[0] == cell_a_text) * 2 - 1)
				else 
					return (([cell_a_text, cell_b_text].sort()[0] == cell_a_text) * 2 - 1);
			}
			else
				return 0;
		});
	
		this.data = elements;
		this.fullData = elements;
	}
};

// View
class DBTable
{
// Private
	constructor(controllerContext)
	{
		this.filterColumns = [{"ColNo": -1, "ColName": "NAME"}, {"ColNo": -1, "ColName": "EMAIL"}];
		
		this.pageNo = 1;
		this.totalPages = 1;
		
		this.numRows = 0;
		this.numCols = 0;
		
		this.numRowsInPage = 25;
		this.numPages = 1;
		
		this.controller = controllerContext;
	}
	
	getPageNum()
	{
		var num = document.getElementById("pageText").value;
		if (num == "")
			return 1;
		else
			return parseInt(num);
	}
	
	getPageData(fullData)
	{
		var numRows = fullData.length;
		var pageNum = this.getPageNum();
		
		if (pageNum > this.numPages)
		{
			this.setPageNum(1);
			this.controller.changePageNum();
			return;
		}
		
		var dataIndxStart = (pageNum - 1) * this.numRowsInPage;
		var dataIndxEnd = (((pageNum - 1) * this.numRowsInPage + this.numRowsInPage) > numRows) ? numRows : ((pageNum - 1) * this.numRowsInPage + this.numRowsInPage);
		
		var returnData = [];
		for (var i = dataIndxStart; i < dataIndxEnd; i++)
			returnData.push(fullData[i]);
		
		return returnData;
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
	
	fillExistingTable(data)
	{
		var tablebody = document.getElementById("datatable-tbody")
		for (var i = 0; i < data.length; i++)
		{
			for (var j = 0; j < data[i].length; j++) 
				tablebody.childNodes[i].childNodes[j].innerText = data[i][j];
			
			tablebody.childNodes[i].style.display = "table-row";
		}
		
		for (var i = data.length; i < tablebody.childNodes.length; i++)
		{
			tablebody.childNodes[i].style.display = "none";
		}
	}
	
	fillNewTable(data, headColNames)
	{
		var tablehead = document.getElementById("datatable-thead")
		var tablebody = document.getElementById("datatable-tbody")

		///////// HEADER TO TABLE
		var row = tablehead.insertRow(-1);
		// insert cells to row
		for (var i = 0; i < headColNames.length; i++)
		{
			var c1 = row.insertCell(i);
			c1.innerText = headColNames[i].toUpperCase();
			c1.sortAscending = 1;
			var context = this;
			c1.onclick = function(event) { 
				context.controller.sortColumn(event.srcElement.cellIndex); 
			}
		}
		var row = tablehead.insertRow(-1);
		for (var i = 0; i < headColNames.length; i++)
		{			
			var c1 = row.insertCell(i);
			
			// Add filters to columns
			for (var l = 0; l < this.filterColumns.length; l++)
			{
				if (this.filterColumns[l]["ColName"] == headColNames[i].toUpperCase())
				{
					this.filterColumns[l]["ColNo"] = i;
					
					var c1_srch = document.createElement("input");
					c1_srch.id = headColNames[i].toUpperCase() + "_filterbox";
					c1.appendChild(c1_srch);
				}
			}
		}
		this.numCols = headColNames.length;
	
		///////// ADD BODY TO TABLE
		for (var i = 0; i < data.length; i++)
		{
			var row = tablebody.insertRow(-1);
			this.numRows += 1;
		
			for (var j = 0; j < data[i].length; j++) 
			{
				var c1 = row.insertCell(j);
				c1.innerText = data[i][j];
			}
			
			row.style.display = "table-row";
		}
		
		// Display search input box
		document.getElementById("searchInput").style.display = "block";
		document.getElementById("unit_test_number").style.display = "none";
		document.getElementById("label_unit_test_number").style.display = "none";
		document.getElementById("pageInfo").style.display = "block";
		
		var context = this;
		document.getElementById("searchPage").onclick = function() { 
			context.controller.changePageNum(); 
		}
		
		// Change functionality of initial button
		var btn = document.getElementById("fetch-filter-button")
		btn.innerText = "Filter";
		btn.onclick = function() { context.controller.searchData(); }
	}
	
// Public
	calculateNumPages(data)
	{
		this.numPages = (data.length > this.numRowsInPage) ? Math.ceil(data.length / this.numRowsInPage) : 1;
		document.getElementById("numpages").innerText = this.numPages.toString();
	}
	getDataToSearch()
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
		
		return searchItems;
	}

	fillData(fulldata, headColNames)
	{
		var data = this.getPageData(fulldata);
		
		var tablehead = document.getElementById("datatable-thead");
		if (tablehead.childNodes.length == 0)
		{
			this.calculateNumPages(fulldata);
			this.fillNewTable(data, headColNames);
		}
		else
			this.fillExistingTable(data);
		
		this.setAlternateRowColor();
	}
	
	setPageNum(pageNum)
	{
		document.getElementById("pageText").value = pageNum.toString();
	}
};

// Controller
class DBController
{
	constructor()
	{
		this.dbTable = new DBTable(this);
		this.dbData;
	}
	
	fillData(data)
	{
		this.dbData = new DBData(data);
		
		var data = this.dbData.getData();
		var headColNames = this.dbData.getHeadColNames();
		this.dbTable.fillData(data, headColNames);
	}
	
	searchData()
	{
		var dataToSearch = this.dbTable.getDataToSearch();
		this.dbData.searchData(dataToSearch);
		var data = this.dbData.getData();
		this.dbTable.calculateNumPages(data);
		this.dbTable.fillData(data);
	}
	
	sortColumn(colIndx)
	{
		this.dbData.sortColumn(colIndx);
		var data = this.dbData.getData();
		this.dbTable.fillData(data);
	}
	
	changePageNum()
	{
		var data = this.dbData.getData();
		this.dbTable.fillData(data);
	}
}

var dbController = new DBController();
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
		dbController.fillData(data);
		
		break;
	}
}
