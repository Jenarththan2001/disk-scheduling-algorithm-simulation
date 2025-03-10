// Validate input values
function isValidInputNumbers(requestSequence, head) {
  return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// ---------- LOOK Disk Scheduling Algorithm ---------------
function look_man(requestSequenceLook, headLook, direction) {
    let requestFinalOrderLook = [headLook];
    let totalSeekCountLook = 0;
  
    // Sort request sequence in ascending order
    let requestSequenceLookSorted = [...requestSequenceLook].sort((a, b) => a - b);
  
    // Find the split index where requests are greater than the head
    let splitIndex = requestSequenceLookSorted.findIndex(num => num >= headLook);
  
    if (direction === "Right") {
        let rightRequests = requestSequenceLookSorted.slice(splitIndex);
        let leftRequests = requestSequenceLookSorted.slice(0, splitIndex).reverse();
  
        requestFinalOrderLook.push(...rightRequests);
        requestFinalOrderLook.push(...leftRequests);
  
        if (rightRequests.length > 0) {
            totalSeekCountLook = Math.abs(headLook - rightRequests[rightRequests.length - 1]);
  
            if (leftRequests.length > 0) {
                totalSeekCountLook += Math.abs(rightRequests[rightRequests.length - 1] - leftRequests[leftRequests.length - 1]);
            }
        }
    } 
    else {
        let leftRequests = requestSequenceLookSorted.slice(0, splitIndex).reverse();
        let rightRequests = requestSequenceLookSorted.slice(splitIndex);
  
        requestFinalOrderLook.push(...leftRequests);
        requestFinalOrderLook.push(...rightRequests);
  
        if (leftRequests.length > 0) {
            // Movement from head to the last left request (14)
            totalSeekCountLook = Math.abs(headLook - leftRequests[leftRequests.length - 1]);
  
            if (rightRequests.length > 0) {
                // Movement from the last left request (14) to the last right request (183)
                totalSeekCountLook += Math.abs(leftRequests[leftRequests.length - 1] - rightRequests[rightRequests.length - 1]);
            }
        }
    }
  
    return [totalSeekCountLook, requestFinalOrderLook];
  }


// Reset output values
function resetLookResult() {
  document.getElementById('look_totalSeekCount').innerText = '';
  document.getElementById('look_finalOrder').innerText = '';
  document.getElementById('look_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}

// LOOK Algorithm Execution Function
function look_click() {
  let requestSequenceLook = document.getElementById("Sequence").value;
  let headLook = document.getElementById("Head").value;
  let direction = document.getElementById("Direction").value;

  // Validate input
  requestSequenceLook = requestSequenceLook.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
  headLook = headLook.trim();

  if (!headLook || isNaN(headLook) || headLook < 0 || headLook > 199) {
      alert("Invalid input! Head position must be an integer between 0 and 199.");
      return;
  }

  if (requestSequenceLook.length === 0 || requestSequenceLook.some(num => isNaN(num) || num < 0 || num > 199)) {
      alert("Invalid input! Requests must be integers between 0 and 199.");
      return;
  }

  // Convert inputs to integers
  headLook = parseInt(headLook, 10);
  requestSequenceLook = requestSequenceLook.map(num => parseInt(num, 10));

  // Ensure valid range
  if (!isValidInputNumbers(requestSequenceLook, headLook)) {
      alert("Invalid input! Values must be in the range 0 - 199.");
      return;
  }

  // Execute LOOK Algorithm
  const result = look_man(requestSequenceLook, headLook, direction);

  // Display Total Seek Time
  document.getElementById('look_totalSeekCount').innerText = result[0];

  // Display Execution Sequence in One Line
  document.getElementById('look_finalOrder').innerText = result[1].join(", ");

  // Display Average Seek Time
  document.getElementById('look_averageSeekCount').innerText = (result[0] / requestSequenceLook.length).toFixed(2);

  // Show Graph
  document.getElementById('chartContainer').style.display = 'block';

  // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
  let dataPoints = result[1].map((value, index) => ({ x: value, y: index }));

  // Render Graph with X-Axis Labels at the Top
  let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      zoomEnabled: true,
      title: { text: "LOOK Disk Scheduling Graph" },
      axisX: { 
          title: "Disk Numbers", 
          minimum: 0, 
          maximum: 199.5, 
          titleFontSize: 16,
          labelFontSize: 14,
          titleFontWeight: "bold",
          tickPlacement: "inside",
          lineThickness: 2,  
          titleFontColor: "#333",
          labelFontColor: "#333",
          labelAngle: 0,
          tickLength: 0,
          gridThickness: 1,
          crosshair: { enabled: true }
      },
      axisY: { 
          title: "Request Sequence", 
          minimum: -0.5, 
          interval: 1,
          maximum: dataPoints.length - 0.5, 
          reversed: true,
          titleFontSize: 16,
          titleFontColor: "#333",
          labelFontColor: "#333",
          labelFontSize: 14,
          titleFontWeight: "bold"
      },
      data: [{
          type: "line",
          markerType: "circle",
          lineThickness: 2,
          dataPoints: dataPoints
      }]
  });

  chart.render();
}

// Clear function
function clearLook() {
  document.getElementById('Sequence').value = '';
  document.getElementById('Head').value = '';
  document.getElementById('look_totalSeekCount').innerText = '';
  document.getElementById('look_finalOrder').innerText = '';
  document.getElementById('look_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}
