// Function to validate input values
function isValidInputNumbers(requestSequence, head) {
  return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// C-SCAN Disk Scheduling Algorithm
function cscan_man(requestSequenceCscan, headCscan, direction) {
  let requestFinalOrderCscan = [headCscan];
  let totalSeekCountCscan = 0;

  // Sort the request sequence in ascending order
  let requestSequenceCscanSorted = [...requestSequenceCscan].sort((a, b) => a - b);

  let splitIndex = requestSequenceCscanSorted.findIndex(num => num >= headCscan);

if (direction === "Right") {
    // Process requests to the right of head first
    let rightRequests = requestSequenceCscanSorted.slice(splitIndex);
    let leftRequests = requestSequenceCscanSorted.slice(0, splitIndex);

    // Add requests to the right of the head
    requestFinalOrderCscan.push(...rightRequests);

    // Move to the highest track (199) only if it's not already in the sequence
    if (!requestFinalOrderCscan.includes(199)) {
        requestFinalOrderCscan.push(199);
    }

    // Jump to track 0 (only if not already at 0)
    if (!requestFinalOrderCscan.includes(0)) {
        requestFinalOrderCscan.push(0);
    }

    // Add requests to the left of the head (from 0 upwards)
    for (let i = 0; i < leftRequests.length; ++i) {
            requestFinalOrderCscan.push(leftRequests[i]);
        
    }

    // Calculate total seek count
    totalSeekCountCscan = (199 - headCscan) + (199 - 0) + leftRequests[leftRequests.length - 1];
}
else {
    // Process requests to the left of head first
    let leftRequests = requestSequenceCscanSorted.slice(0, splitIndex).reverse();
    let rightRequests = requestSequenceCscanSorted.slice(splitIndex);

    requestFinalOrderCscan.push(...leftRequests);

    // Move to the lowest track (0) if not already at 0
    if (leftRequests.length > 0 && leftRequests[leftRequests.length - 1] !== 0) {
        requestFinalOrderCscan.push(0);
    }

    // Jump to track 199 (only if not already at 199)
    if (requestFinalOrderCscan[requestFinalOrderCscan.length - 1] !== 199) {
        requestFinalOrderCscan.push(199);
    }

    // Continue serving requests in the left direction (from 199 downwards)
    for (let i = requestSequenceCscanSorted.length - 1; i >= splitIndex; --i) {
        
            requestFinalOrderCscan.push(requestSequenceCscanSorted[i]);
        
    }

    totalSeekCountCscan = headCscan + 199 + (199 - requestSequenceCscanSorted[splitIndex]);
}

  return [totalSeekCountCscan, requestFinalOrderCscan];
}

// Reset output values
function resetCscanResult() {
  document.getElementById('cscan_totalSeekCount').innerText = '';
  document.getElementById('cscan_finalOrder').innerText = '';
  document.getElementById('cscan_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}

// Main function to handle C-SCAN execution
function cscan_click() {
  let requestSequenceCscan = document.getElementById("Sequence").value;
  let headCscan = document.getElementById("Head").value;
  let direction = document.getElementById("Direction").value;

  // Validate input
  requestSequenceCscan = requestSequenceCscan.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
  headCscan = headCscan.trim();

  if (!headCscan || isNaN(headCscan) || headCscan < 0 || headCscan > 199) {
      alert("Invalid input! Head position must be an integer between 0 and 199.");
      return;
  }

  if (requestSequenceCscan.length === 0 || requestSequenceCscan.some(num => isNaN(num) || num < 0 || num > 199)) {
      alert("Invalid input! Requests must be integers between 0 and 199.");
      return;
  }

  // Convert inputs to integers
  headCscan = parseInt(headCscan, 10);
  requestSequenceCscan = requestSequenceCscan.map(num => parseInt(num, 10));

  // Ensure valid range
  if (!isValidInputNumbers(requestSequenceCscan, headCscan)) {
      alert("Invalid input! Values must be in the range 0 - 199.");
      return;
  }

  // Execute C-SCAN Algorithm
  const result = cscan_man(requestSequenceCscan, headCscan, direction);

  // Display Total Seek Time
  document.getElementById('cscan_totalSeekCount').innerText = result[0];

  // Display Execution Sequence in One Line
  document.getElementById('cscan_finalOrder').innerText = result[1].join(", ");

  // Display Average Seek Time
  document.getElementById('cscan_averageSeekCount').innerText = (result[0] / requestSequenceCscan.length).toFixed(2);

  // Show Graph
  document.getElementById('chartContainer').style.display = 'block';

  // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
  let dataPoints = result[1].map((value, index) => ({ x: value, y: index }));

  // Render Graph with X-Axis Labels at the Top
  let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      zoomEnabled: true,
      title: { text: "C-SCAN Disk Scheduling Graph" },
      axisX: { 
          title: "Disk Numbers", 
          minimum: 0, 
          maximum: 199.5, 
          titleFontSize: 16,
          labelFontSize: 14,
          titleFontWeight: "bold",
          tickPlacement: "inside",
          lineThickness: 2,  // Ensures the line is more visible
          titleFontColor: "#333",
          labelFontColor: "#333",
          labelAngle: 0, // Keep the labels straight
          tickLength: 0,  // Removes default tick marks
          gridThickness: 1, // Grid lines for clarity
          crosshair: { enabled: true }  // Adds a crosshair for better readability
      },
      axisY: { 
          title: "Request Sequence", 
          minimum: -0.5, 
          interval: 1,
          maximum: dataPoints.length - 0.5, 
          reversed: true,  // Keeps Y-axis in top-down order
          titleFontSize: 16,
          titleFontColor: "#333",
          labelFontColor: "#333",
          labelFontSize: 14,
          titleFontWeight: "bold"
      },
      data: [{
          type: "line",
          markerType: "circle",
          lineThickness: 2,  // Makes the line more visible
          dataPoints: dataPoints
      }]
  });

  chart.render();
}

// Clear function
function clearCscan() {
  document.getElementById('Sequence').value = '';
  document.getElementById('Head').value = '';
  document.getElementById('cscan_totalSeekCount').innerText = '';
  document.getElementById('cscan_finalOrder').innerText = '';
  document.getElementById('cscan_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}
