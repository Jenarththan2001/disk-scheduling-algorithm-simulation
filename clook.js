// Validate input values
function isValidInputNumbers(requestSequence, head) {
  return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// ---------- C-LOOK Disk Scheduling Algorithm (Fixed Version) ---------------
function clook_man(requestSequenceClook, headClook, direction) {
  let requestFinalOrderClook = [headClook];
  let totalSeekCountClook = 0;

  // Sort request sequence in ascending order
  let requestSequenceClookSorted = [...requestSequenceClook].sort((a, b) => a - b);

  // Find the split index where requests are greater than the head
  let splitIndex = requestSequenceClookSorted.findIndex(num => num >= headClook);

  if (direction === "Right") {
      // Process requests to the right first
      let rightRequests = requestSequenceClookSorted.slice(splitIndex);
      let leftRequests = requestSequenceClookSorted.slice(0, splitIndex);

      requestFinalOrderClook.push(...rightRequests);

      // Jump to the lowest request (avoid duplicate entry)
      if (leftRequests.length > 0) {
          requestFinalOrderClook.push(leftRequests[0]);  // Only add once
      }

      requestFinalOrderClook.push(...leftRequests.slice(1)); // Avoid repeating the lowest request

      totalSeekCountClook = Math.abs(headClook - rightRequests[rightRequests.length - 1]) +
          Math.abs(rightRequests[rightRequests.length - 1] - leftRequests[0]) +
          Math.abs(leftRequests[leftRequests.length - 1] - leftRequests[0]);
  } 
  else {
    // Process requests to the left first
    let leftRequests = requestSequenceClookSorted.slice(0, splitIndex).reverse();
    let rightRequests = requestSequenceClookSorted.slice(splitIndex);

    requestFinalOrderClook.push(...leftRequests);

    // Jump to the highest request (avoid duplicate entry)
    if (rightRequests.length > 0) {
        requestFinalOrderClook.push(rightRequests[rightRequests.length - 1]); // Only add once
    }

    // Continue serving requests in the left direction (from the highest request downwards)
    for (let i = rightRequests.length - 2; i >= 0; --i) {
        requestFinalOrderClook.push(rightRequests[i]);
    }

    // Calculate total seek count
    totalSeekCountClook = Math.abs(headClook - leftRequests[leftRequests.length - 1]) + // Head to last left request
        Math.abs(leftRequests[leftRequests.length - 1] - rightRequests[rightRequests.length - 1]) + // Last left to highest request
        Math.abs(rightRequests[rightRequests.length - 1] - rightRequests[0]); // Highest request to first right request
}

  return [totalSeekCountClook, requestFinalOrderClook];
}

// Reset output values
function resetClookResult() {
  document.getElementById('clook_totalSeekCount').innerText = '';
  document.getElementById('clook_finalOrder').innerText = '';
  document.getElementById('clook_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}

// C-LOOK Algorithm Execution Function
function clook_click() {
  let requestSequenceClook = document.getElementById("Sequence").value;
  let headClook = document.getElementById("Head").value;
  let direction = document.getElementById("Direction").value;

  // Validate input
  requestSequenceClook = requestSequenceClook.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
  headClook = headClook.trim();

  if (!headClook || isNaN(headClook) || headClook < 0 || headClook > 199) {
      alert("Invalid input! Head position must be an integer between 0 and 199.");
      return;
  }

  if (requestSequenceClook.length === 0 || requestSequenceClook.some(num => isNaN(num) || num < 0 || num > 199)) {
      alert("Invalid input! Requests must be integers between 0 and 199.");
      return;
  }

  // Convert inputs to integers
  headClook = parseInt(headClook, 10);
  requestSequenceClook = requestSequenceClook.map(num => parseInt(num, 10));

  // Ensure valid range
  if (!isValidInputNumbers(requestSequenceClook, headClook)) {
      alert("Invalid input! Values must be in the range 0 - 199.");
      return;
  }

  // Execute C-LOOK Algorithm
  const result = clook_man(requestSequenceClook, headClook, direction);

  // Display Total Seek Time
  document.getElementById('clook_totalSeekCount').innerText = result[0];

  // Display Execution Sequence in One Line
  document.getElementById('clook_finalOrder').innerText = result[1].join(", ");

  // Display Average Seek Time
  document.getElementById('clook_averageSeekCount').innerText = (result[0] / requestSequenceClook.length).toFixed(2);

  // Show Graph
  document.getElementById('chartContainer').style.display = 'block';

  // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
  let dataPoints = result[1].map((value, index) => ({ x: value, y: index }));

  // Render Graph with X-Axis Labels at the Top
  let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      zoomEnabled: true,
      title: { text: "C-LOOK Disk Scheduling Graph" },
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
function clearClook() {
  document.getElementById('Sequence').value = '';
  document.getElementById('Head').value = '';
  document.getElementById('clook_totalSeekCount').innerText = '';
  document.getElementById('clook_finalOrder').innerText = '';
  document.getElementById('clook_averageSeekCount').innerText = '';
  document.getElementById('chartContainer').style.display = 'none';
}
