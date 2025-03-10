// Validate input values
function isValidInputNumbers(requestSequence, head) {
  return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// ---------- Main FCFS Algorithm ---------------
function fcfs_man(requestSequenceFcfs, headFcfs) {
  let requestFinalOrderFcfs = [headFcfs, ...requestSequenceFcfs]; // Start from head
  let totalSeekCountFcfs = 0;

  for (let i = 0; i < requestSequenceFcfs.length; i++) {
    totalSeekCountFcfs += Math.abs(requestSequenceFcfs[i] - (i === 0 ? headFcfs : requestSequenceFcfs[i - 1]));
  }

  return [totalSeekCountFcfs, requestFinalOrderFcfs];
}

// Reset output values
function resetFcfsResult() {
  document.getElementById('fcfs_totalSeekCount').innerText = '';
  document.getElementById('fcfs_finalOrder').innerText = '';
  document.getElementById('fcfs_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}

// Main function to handle FCFS execution
function fcfs_click() {
  let requestSequenceFcfs = document.getElementById("Sequence").value;
  let headFcfs = document.getElementById("Head").value;

  // Validate input
  requestSequenceFcfs = requestSequenceFcfs.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
  headFcfs = headFcfs.trim();

  if (!headFcfs || isNaN(headFcfs) || headFcfs < 0 || headFcfs > 199) {
    alert("Invalid input! Head position must be an integer between 0 and 199.");
    return;
  }

  if (requestSequenceFcfs.length === 0 || requestSequenceFcfs.some(num => isNaN(num) || num < 0 || num > 199)) {
    alert("Invalid input! Requests must be integers between 0 and 199.");
    return;
  }

  // Convert inputs to integers
  headFcfs = parseInt(headFcfs, 10);
  requestSequenceFcfs = requestSequenceFcfs.map(num => parseInt(num, 10));

  // Ensure valid range
  if (!isValidInputNumbers(requestSequenceFcfs, headFcfs)) {
    alert("Invalid input! Values must be in the range 0 - 199.");
    return;
  }

  // Execute FCFS
  const result = fcfs_man(requestSequenceFcfs, headFcfs);

  // Display Total Seek Time
  document.getElementById('fcfs_totalSeekCount').innerText = result[0];

  // Display Execution Sequence in One Line
  document.getElementById('fcfs_finalOrder').innerText = result[1].join(", ");

  // Display Average Seek Time
  document.getElementById('fcfs_averageSeekCount').innerText = (result[0] / requestSequenceFcfs.length).toFixed(2);

  // Show Graph
  document.getElementById('chartContainer').style.display = 'block';

  // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
  let dataPoints = result[1].map((value, index) => ({ x: value, y: index }));

  // Render Graph with X-Axis Labels at the Top
  let chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    zoomEnabled: true,
    title: { text: "FCFS Disk Scheduling Graph" },
    axisX: { 
      title: "Disk Numbers", 
      minimum: 0, 
      maximum: 199, 
      titleFontSize: 16,
      labelFontSize: 14,
      titleFontWeight: "bold",
      tickPlacement: "inside",
      lineThickness: 2,  // Ensures the line is more visible
      titleFontColor: "#333",
      labelFontColor: "#333",
      labelAngle: 0, // Keep the labels straight
      tickLength: 0,  // Removes default tick marks
      gridThickness: 1, // Removes default gridlines
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
