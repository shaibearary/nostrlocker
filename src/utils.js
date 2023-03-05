export function getValue() {
	var form = document.getElementById("myForm");
	var relayValue = form.elements["relay"].value;
	var readChecked = form.elements["read"].checked;
	var writeChecked = form.elements["write"].checked;

	alert("Relay: " + relayValue + "\nRead: " + readChecked + "\nWrite: " + writeChecked);
}

export function addRow() {
	var rowsDiv = document.getElementById("myRows");

	var newRowDiv = document.createElement("div");
	newRowDiv.classList.add("form-row-container");

	var rowDiv1 = document.createElement("div");
	rowDiv1.classList.add("form-row");
	rowDiv1.innerHTML = `
		<label for="relayInput">Relay:</label>
		<input type="text" id="relayInput" name="relay">
	`;

	var rowDiv2 = document.createElement("div");
	rowDiv2.classList.add("form-row");
	rowDiv2.innerHTML = `
		<label for="readCheckbox">Read:</label>
		<input type="checkbox" id="readCheckbox" name="read">
	`;

	var rowDiv3 = document.createElement("div");
	rowDiv3.classList.add("form-row");
	rowDiv3.innerHTML = `
		<label for="writeCheckbox">Write:</label>
		<input type="checkbox" id="writeCheckbox" name="write">
	`;

	var deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.value = "Delete";
	deleteButton.onclick = function() {
		deleteRow(newRowDiv);
	};

	newRowDiv.appendChild(rowDiv1);
	newRowDiv.appendChild(rowDiv2);
	newRowDiv.appendChild(rowDiv3);
	newRowDiv.appendChild(deleteButton);

	rowsDiv.appendChild(newRowDiv);
}

export function deleteRow(rowDiv) {
	var rowsDiv = document.getElementById("myRows");
	rowsDiv.removeChild(rowDiv);
}
