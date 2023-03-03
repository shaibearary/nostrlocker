import { nip19, getBlankEvent, SimplePool } from "nostr-tools";

export function getValue() {
	
	var form = document.getElementById("myForm");
	const formRowContainers = form.getElementsByClassName("form-row-container");
	const formDataArray = []
	// Loop through each form row container
	for (let i = 0; i < formRowContainers.length; i++) {
	  const formRowContainer = formRowContainers[i];
	  const oneRawData = []
	  // Get the value of the Relay input
	  let relayInput = formRowContainer.querySelector('input[name="relay"]').value;
		
	  // Get the value of the Read checkbox
	  let readCheckbox = formRowContainer.querySelector('input[name="read"]').checked;
	
	  // Get the value of the Write checkbox
	  let writeCheckbox = formRowContainer.querySelector('input[name="write"]').checked;
	  oneRawData.push('r',relayInput)
	 
	  if(readCheckbox==true){
		oneRawData.push('read')
	  }
	  if(writeCheckbox==true){
		oneRawData.push('write')
	  }

	  formDataArray.push(oneRawData)
	}

	return formDataArray;
}

export function addRow() {
	var rowsDiv = document.getElementById("myForm");

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

	var deleteButton= document.createElement("a");
	deleteButton.setAttribute("href", "#");
	deleteButton.setAttribute("role", "button");
	deleteButton.textContent = "Delete";
	
	// Add an event listener to the link element
	deleteButton.addEventListener("click", function() {
		deleteRow(newRowDiv);
	});

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
