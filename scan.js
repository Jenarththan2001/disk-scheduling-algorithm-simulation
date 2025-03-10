// Function to validate input values
function isValidInputNumbers(requestSequence, head) {
  return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// SCAN Disk Scheduling Algorithm (Correct Order)
function scan_man(requestSequenceScan, headScan, direction) {
  let requestFinalOrderScan = [headScan];
  let totalSeekCountScan = 0;

  // Sort the request sequence in ascending order
  let requestSequenceScanSorted = [...requestSequenceScan].sort((a, b) => a - b);
  let splitIndex = requestSequenceScanSorted.findIndex(num => num >= headScan);

  if (direction === "Left") {
      // Process requests to the left of head first
      let leftRequests = requestSequenceScanSorted.slice(0, splitIndex).reverse();
      let rightRequests = requestSequenceScanSorted.slice(splitIndex);

      requestFinalOrderScan.push(...leftRequests);

      // If head doesn't reach 0, add 0
      if (leftRequests.length > 0 && leftRequests[leftRequests.length - 1] !== 0) {
          requestFinalOrderScan.push(0);
      }

      requestFinalOrderScan.push(...rightRequests);
      totalSeekCountScan = Math.abs(headScan - 0) + Math.abs(0 - requestFinalOrderScan[requestFinalOrderScan.length - 1]);
  } 
  else {
      // Process requests to the right of head first
      let rightRequests = requestSequenceScanSorted.slice(splitIndex);
      let leftRequests = requestSequenceScanSorted.slice(0, splitIndex).reverse();

      requestFinalOrderScan.push(...rightRequests);

      // If head doesn't reach 199, add 199
      if (rightRequests.length > 0 && rightRequests[rightRequests.length - 1] !== 199) {
          requestFinalOrderScan.push(199);
      }

      requestFinalOrderScan.push(...leftRequests);
      totalSeekCountScan = Math.abs(headScan - 199) + Math.abs(199 - requestFinalOrderScan[requestFinalOrderScan.length - 1]);
  }

  return [totalSeekCountScan, requestFinalOrderScan];
}

// Reset output values
function resetScanResult() {
  document.getElementById('scan_totalSeekCount').innerText = '';
  document.getElementById('scan_finalOrder').innerText = '';
  document.getElementById('scan_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}

// SCAN Algorithm Execution Function
function scan_click() {
  let requestSequenceScan = document.getElementById("Sequence").value;
  let headScan = document.getElementById("Head").value;
  let direction = document.getElementById("Direction").value;

  // Validate input
  requestSequenceScan = requestSequenceScan.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
  headScan = headScan.trim();

  if (!headScan || isNaN(headScan) || headScan < 0 || headScan > 199) {
      alert("Invalid input! Head position must be an integer between 0 and 199.");
      return;
  }

  if (requestSequenceScan.length === 0 || requestSequenceScan.some(num => isNaN(num) || num < 0 || num > 199)) {
      alert("Invalid input! Requests must be integers between 0 and 199.");
      return;
  }

  // Convert inputs to integers
  headScan = parseInt(headScan, 10);
  requestSequenceScan = requestSequenceScan.map(num => parseInt(num, 10));

  // Ensure valid range
  if (!isValidInputNumbers(requestSequenceScan, headScan)) {
      alert("Invalid input! Values must be in the range 0 - 199.");
      return;
  }

  // Execute SCAN Algorithm
  const result = scan_man(requestSequenceScan, headScan, direction);

  // Display Total Seek Time
  document.getElementById('scan_totalSeekCount').innerText = result[0];

  // Display Execution Sequence in One Line
  document.getElementById('scan_finalOrder').innerText = result[1].join(", ");

  // Display Average Seek Time
  document.getElementById('scan_averageSeekCount').innerText = (result[0] / requestSequenceScan.length).toFixed(2);

  // Show Graph
  document.getElementById('chartContainer').style.display = 'block';

  // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
  let dataPoints = result[1].map((value, index) => ({ x: value, y: index }));

  // Render Graph with X-Axis Labels at the Top
  let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      zoomEnabled: true,
      title: { text: "SCAN Disk Scheduling Graph" },
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

//Clear function
function clearScan() {
    document.getElementById('Sequence').value = '';
    document.getElementById('Head').value = '';
    document.getElementById('scan_totalSeekCount').innerText = '';
    document.getElementById('scan_finalOrder').innerText = '';
    document.getElementById('scan_averageSeekCount').innerText = '';
    document.getElementById('chartContainer').style.display = 'none';
}
