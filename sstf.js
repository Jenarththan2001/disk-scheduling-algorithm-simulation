// Validate input values
function isValidInputNumbers(requestSequence, head) {
  return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// ---------- SSTF Disk Scheduling Algorithm ---------------
// Time Complexity: **O(n²)** (Since we need to find the nearest request each time)
function sstf_man(requestSequenceSstf, headSstf) {
  let requestFinalOrderSstf = [headSstf]; // Start from head
  let totalSeekCountSstf = 0;

  while (requestSequenceSstf.length > 0) {
      let minIndex = 0;
      let minSeekTime = Math.abs(requestSequenceSstf[0] - headSstf);

      // Find the request with the shortest seek time
      for (let i = 1; i < requestSequenceSstf.length; i++) {
          let seekTime = Math.abs(requestSequenceSstf[i] - headSstf);
          if (seekTime < minSeekTime) {
              minSeekTime = seekTime;
              minIndex = i;
          }
      }

      // Move head to the closest request
      totalSeekCountSstf += minSeekTime;
      headSstf = requestSequenceSstf[minIndex];
      requestFinalOrderSstf.push(headSstf);

      // Remove the processed request
      requestSequenceSstf.splice(minIndex, 1);
  }

  return [totalSeekCountSstf, requestFinalOrderSstf];
}

// Reset output values
function resetSstfResult() {
  document.getElementById('sstf_totalSeekCount').innerText = '';
  document.getElementById('sstf_finalOrder').innerText = '';
  document.getElementById('sstf_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}

// Main function to handle SSTF execution
function sstf_click() {
  let requestSequenceSstf = document.getElementById("Sequence").value;
  let headSstf = document.getElementById("Head").value;

  // Validate input
  requestSequenceSstf = requestSequenceSstf.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
  headSstf = headSstf.trim();

  if (!headSstf || isNaN(headSstf) || headSstf < 0 || headSstf > 199) {
      alert("Invalid input! Head position must be an integer between 0 and 199.");
      return;
  }

  if (requestSequenceSstf.length === 0 || requestSequenceSstf.some(num => isNaN(num) || num < 0 || num > 199)) {
      alert("Invalid input! Requests must be integers between 0 and 199.");
      return;
  }

  // Convert inputs to integers
  headSstf = parseInt(headSstf, 10);
  requestSequenceSstf = requestSequenceSstf.map(num => parseInt(num, 10));

  // Ensure valid range
  if (!isValidInputNumbers(requestSequenceSstf, headSstf)) {
      alert("Invalid input! Values must be in the range 0 - 199.");
      return;
  }

  // Execute SSTF
  const result = sstf_man(requestSequenceSstf, headSstf);

  // Display Total Seek Time
  document.getElementById('sstf_totalSeekCount').innerText = result[0];

  // Display Execution Sequence in One Line
  document.getElementById('sstf_finalOrder').innerText = result[1].join(", ");

  // Display Average Seek Time
// Display Average Seek Time with Safe Division
document.getElementById('sstf_averageSeekCount').innerText = 
  result[1].length > 1 ? (result[0] / (result[1].length - 1)).toFixed(2) : "0";


  // Show Graph
  document.getElementById('chartContainer').style.display = 'block';

  // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
  let dataPoints = result[1].map((value, index) => ({ x: value, y: index }));

  // Render Graph with X-Axis Labels at the Top
  let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      zoomEnabled: true,
      title: { text: "SSTF Disk Scheduling Graph" },
      axisX: { 
          title: "Disk Numbers", 
          minimum: 0, 
          maximum: 199, 
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

// Function to clear input fields and results
function clearSstf() {
  document.getElementById('Sequence').value = '';
  document.getElementById('Head').value = '';
  document.getElementById('sstf_totalSeekCount').innerText = '';
  document.getElementById('sstf_finalOrder').innerText = '';
  document.getElementById('sstf_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}
