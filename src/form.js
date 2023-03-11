

export function getValue() {
	console.log('try?')
	// var form = document.getElementById("table");

	const trElements = document.querySelectorAll('table tbody tr');
	const formDataArray = []
// Loop through the tr elements and get the values of their td elements
	for (let i = 0; i < trElements.length; i++) {
		const tdValues = [];
		const tdElements = trElements[i].querySelectorAll('td');
		let relay = tdElements[0].querySelector("input").value;
	
		tdValues.push('r');
		tdValues.push(relay);
		if (tdElements[1].querySelector("input").checked==true){
			tdValues.push('read');
		}
		if (tdElements[2].querySelector("input").checked==true){
			tdValues.push('write');
			}
		formDataArray.push(tdValues)
		}
	
	return formDataArray;
}
export function addRowTable() {
	var tableRow = document.getElementById("table");
	var tbodyRow =  tableRow.querySelector("tbody");
	var row = document.createElement("tr");
	var cell1 = document.createElement("td");
	var cell2 = document.createElement("td");
	var cell3 = document.createElement("td");
	var cell4 = document.createElement("td");
	cell1.innerHTML =`<input type="text" id="relayInput" name="relay">`;
	cell2.innerHTML = `<input type="checkbox" id="readCheckbox" name="read">`;
	cell3.innerHTML = `<input type="checkbox" id="readCheckbox" name="write">`;
	const deleteButton = document.createElement('a');
	deleteButton.href = '#';
	deleteButton.role = 'button';
	deleteButton.textContent = 'Delete';
	cell4.appendChild(deleteButton)
	deleteButton.addEventListener("click", function() {
		// deleteRow(newRowDiv);
		row.remove()
	});

	row.appendChild(cell1);
	row.appendChild(cell2);
	row.appendChild(cell3);
	row.appendChild(cell4);
	tbodyRow.appendChild(row);
}
