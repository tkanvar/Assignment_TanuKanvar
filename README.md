# Assignment_TanuKanvar
I have done the following:
      1)	Used MVC architecture (Model View Controller). 
      a.	The controller (class DBController) is accessible to outside world. The controller has access to model (class DBData) and view (class DBTable). 
      b.	DBData and DBTable don’t know that each other exist and thus cannot access functions directly.
      c.	DBData is used to make all changes in data (sorting, searching)
      d.	DBTable is used to make changes in table view (display data, collect search data and collect other required data, page number system)
      2)	Dynamically adding columns to table based on the fetched user data
      3)	The html is loaded with the list of unit test cases. Select any one unit test case and press Fetch button.
      4)	Code can also handle user data with variable columns in the same data.
      e.g. following user data is valid – [{id: 1, name: “Tanu”, “email”: “tkan”},
       {id: 2, name: “Tanu”, “email”: “tkan”, “extraccol”: “123”}]
      5)	Per table page maximum 25 rows are allowed. If the user fetched data exceeds 25 then those many pages are formed.
      6)	Data is dynamically loaded based on the current page number. So if millions of data is fetched, the loading table time will be the same.
      7)	Searching and sorting happens on the entire data but rows overflowing to the current page is only visible.
      8)	During searching, sorting (if there was any) is kept intact
      9)	Searching – 
      If text is written in tableSearchTextBox and in Name search box, then I display all rows which have both tableSearchTextBox and Name searchbox.
      10)	New rows and columns are created only the first time the data is loaded. Then throughout this session, I am playing with display property of the rows and replacing the row content with the new data. So no memory and time is wasted in deleting and creating new html elements.
      11)	Rest other features have been implemented as asked in the doc.

Following is the assignment
      Please use javascript and css. DO NOT use any frameworks/libraries such as React, jQuery, Boorstrap etc.
      1.	Create a button to fetch user data. 
      2.	Use api https://jsonplaceholder.typicode.com/users to fetch user details, show the details in the table.
      3.	All the nested columns such as address, company should be combined in one cell. 
      For example: 
      address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
              "lat": "-37.3159",
              "lng": "81.1496"
            }
      In the table address should be 
      Kulas Light, Apt. 556, Gwenborough, 92998-3874, -37.3159,81.1496
      Use same logic to combine all nested columns.
      
      4.	Provide sorting on each column.
      5.	Provide filtering functionality for name and email and for the table, use search using text search and use the same button which you have initially created to fetch user Data to filter the data. 
      User will write text in filter box and search box and click on filter button then filtering will happen
      6.	Ensure the solution is scalable to handle potential future growth in data volume or features.
      7.	Dynamically generate column headers based on the fetched data to adapt to changes. 
      8.	Apply alternating styles to rows for better visual separation and highlight rows on hover.
      9.	Develop comprehensive unit test cases to verify the functionality of the entire feature.
      10.	Maintain high code quality standards throughout development to ensure readability, maintainability, and reliability.
