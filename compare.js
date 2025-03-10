// Validate input values
function isValidInputNumbers(requestSequence, head) {
    return requestSequence.every(num => num >= 0 && num <= 199) && head >= 0 && head <= 199;
}

// Reset output values
function resetResult() {
    document.getElementById('fcfs_totalSeekCount').innerText = '-';
    document.getElementById('sstf_totalSeekCount').innerText = '-';
    document.getElementById('scan_totalSeekCount').innerText = '-';
    document.getElementById('cscan_totalSeekCount').innerText = '-';
    document.getElementById('look_totalSeekCount').innerText = '-';
    document.getElementById('clook_totalSeekCount').innerText = '-';
    document.getElementById('chartContainer').style.display = 'none';
}

// FCFS Algorithm
function fcfs_man(requestSequenceFcfs, headFcfs) {
    let requestFinalOrderFcfs = [headFcfs, ...requestSequenceFcfs]; // Start from head
    let totalSeekCountFcfs = 0;

    for (let i = 0; i < requestSequenceFcfs.length; i++) {
        totalSeekCountFcfs += Math.abs(requestSequenceFcfs[i] - (i === 0 ? headFcfs : requestSequenceFcfs[i - 1]));
    }

    return [totalSeekCountFcfs, requestFinalOrderFcfs];
}

// SSTF Algorithm
function sstf_man(requestSequenceSstf, headSstf) {
    let requestFinalOrderSstf = [headSstf];
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

// SCAN Algorithm
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
    } else {
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

// C-SCAN Algorithm
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

        requestFinalOrderCscan.push(...rightRequests);

        // Move to the highest track (199) if not reached
        if (rightRequests.length > 0 && rightRequests[rightRequests.length - 1] !== 199) {
            requestFinalOrderCscan.push(199);
        }

        // Jump to track 0
        requestFinalOrderCscan.push(0);

        requestFinalOrderCscan.push(...leftRequests);

        totalSeekCountCscan = (199 - headCscan) + (199 - 0) + (leftRequests.length > 0 ? leftRequests[leftRequests.length - 1] : 0);
    } else {
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

// LOOK Algorithm
function look_man(requestSequenceLook, headLook, direction) {
    let requestFinalOrderLook = [headLook];
    let totalSeekCountLook = 0;

    // Sort request sequence in ascending order
    let requestSequenceLookSorted = [...requestSequenceLook].sort((a, b) => a - b);
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
    } else {
        let leftRequests = requestSequenceLookSorted.slice(0, splitIndex).reverse();
        let rightRequests = requestSequenceLookSorted.slice(splitIndex);
    
        requestFinalOrderLook.push(...leftRequests);
        requestFinalOrderLook.push(...rightRequests);
    
        if (leftRequests.length > 0) {
            // Movement from head to the last left request
            totalSeekCountLook = Math.abs(headLook - leftRequests[leftRequests.length - 1]);
    
            if (rightRequests.length > 0) {
                // Movement from the last left request to the last right request
                totalSeekCountLook += Math.abs(leftRequests[leftRequests.length - 1] - rightRequests[rightRequests.length - 1]);
            }
        }
    }
    

    return [totalSeekCountLook, requestFinalOrderLook];
}

// C-LOOK Algorithm
function clook_man(requestSequenceClook, headClook, direction) {
    let requestFinalOrderClook = [headClook];
    let totalSeekCountClook = 0;

    // Sort request sequence in ascending order
    let requestSequenceClookSorted = [...requestSequenceClook].sort((a, b) => a - b);
    let splitIndex = requestSequenceClookSorted.findIndex(num => num >= headClook);

    if (direction === "Right") {
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
            (leftRequests.length > 1 ? Math.abs(leftRequests[leftRequests.length - 1] - leftRequests[0]) : 0);
    } else { 
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

// Main function to handle comparison
function runComparison() {
    let requestSequence = document.getElementById("Sequence").value;
    let head = document.getElementById("Head").value;
    let direction = document.getElementById("Direction").value;

    // Validate input
    requestSequence = requestSequence.split(/,|\s+/).map(num => num.trim()).filter(num => num !== "");
    head = head.trim();

    if (!head || isNaN(head) || head < 0 || head > 199) {
        alert("Invalid input! Head position must be an integer between 0 and 199.");
        return;
    }

    if (requestSequence.length === 0 || requestSequence.some(num => isNaN(num) || num < 0 || num > 199)) {
        alert("Invalid input! Requests must be integers between 0 and 199.");
        return;
    }

    // Convert inputs to integers
    head = parseInt(head, 10);
    requestSequence = requestSequence.map(num => parseInt(num, 10));

    // Ensure valid range
    if (!isValidInputNumbers(requestSequence, head)) {
        alert("Invalid input! Values must be in the range 0 - 199.");
        return;
    }

    // Execute all algorithms
    let resultFcfs = fcfs_man([...requestSequence], head);
    let resultSstf = sstf_man([...requestSequence], head);
    let resultScan = scan_man([...requestSequence], head, direction);
    let resultCscan = cscan_man([...requestSequence], head, direction);
    let resultLook = look_man([...requestSequence], head, direction);
    let resultClook = clook_man([...requestSequence], head, direction);


    let results = [
        { name: "FCFS", seekCount: resultFcfs[0], sequence: resultFcfs[1] },
        { name: "SSTF", seekCount: resultSstf[0], sequence: resultSstf[1] },
        { name: "SCAN", seekCount: resultScan[0], sequence: resultScan[1] },
        { name: "C-SCAN", seekCount: resultCscan[0], sequence: resultCscan[1] },
        { name: "LOOK", seekCount: resultLook[0], sequence: resultLook[1] },
        { name: "C-LOOK", seekCount: resultClook[0], sequence: resultClook[1] }
    ];

    // Find the best algorithm (lowest seek time)
    let bestAlgorithm = results.reduce((prev, curr) => (curr.seekCount < prev.seekCount ? curr : prev));

    // Display results
    document.getElementById('fcfs_totalSeekCount').innerText = resultFcfs[0];
    document.getElementById('sstf_totalSeekCount').innerText = resultSstf[0];
    document.getElementById('scan_totalSeekCount').innerText = resultScan[0];
    document.getElementById('cscan_totalSeekCount').innerText = resultCscan[0];
    document.getElementById('look_totalSeekCount').innerText = resultLook[0];
    document.getElementById('clook_totalSeekCount').innerText = resultClook[0];

    document.getElementById('fcfs_sequence').innerText = resultFcfs[1].join(" → ");
    document.getElementById('sstf_sequence').innerText = resultSstf[1].join(" → ");
    document.getElementById('scan_sequence').innerText = resultScan[1].join(" → ");
    document.getElementById('cscan_sequence').innerText = resultCscan[1].join(" → ");
    document.getElementById('look_sequence').innerText = resultLook[1].join(" → ");
    document.getElementById('clook_sequence').innerText = resultClook[1].join(" → ");
    document.getElementById('best_algorithm').innerText = `${bestAlgorithm.name} (Total Seek Time: ${bestAlgorithm.seekCount})`;
    // Show Graph
    document.getElementById('chartContainer').style.display = 'block';

    // Create Data Points for Graph (X-axis: Disk Numbers, Y-axis: Request Sequence)
    let dataPointsFcfs = resultFcfs[1].map((value, index) => ({ x: value, y: index }));
    let dataPointsSstf = resultSstf[1].map((value, index) => ({ x: value, y: index }));
    let dataPointsScan = resultScan[1].map((value, index) => ({ x: value, y: index }));
    let dataPointsCscan = resultCscan[1].map((value, index) => ({ x: value, y: index }));
    let dataPointsLook = resultLook[1].map((value, index) => ({ x: value, y: index }));
    let dataPointsClook = resultClook[1].map((value, index) => ({ x: value, y: index }));

    // Render Graph with X-Axis Labels at the Top
    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        zoomEnabled: true,
        title: { text: "Comparison Chart" },
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
            maximum: Math.max(
                dataPointsFcfs.length,
                dataPointsSstf.length,
                dataPointsScan.length,
                dataPointsCscan.length,
                dataPointsLook.length,
                dataPointsClook.length
            ) - 0.5,
            reversed: true,
            titleFontSize: 16,
            titleFontColor: "#333",
            labelFontColor: "#333",
            labelFontSize: 14,
            titleFontWeight: "bold"
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
            itemclick: function (e) {
                if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            },
        },
        toolTip: {
            shared: true,
        },
        data: [
            {
                type: "line",
                lineColor: "#85ff6e",
                name: "FCFS",
                showInLegend: true,
                dataPoints: dataPointsFcfs,
            },
            {
                type: "line",
                lineColor: "#0b3bfc",
                name: "SSTF",
                showInLegend: true,
                dataPoints: dataPointsSstf,
            },
            {
                type: "line",
                lineColor: "#ff6cfb",
                name: "SCAN",
                showInLegend: true,
                dataPoints: dataPointsScan,
            },
            {
                type: "line",
                lineColor: "#ff413f",
                name: "CSCAN",
                showInLegend: true,
                dataPoints: dataPointsCscan,
            },
            {
                type: "line",
                lineColor: "#ff9b04",
                name: "LOOK",
                showInLegend: true,
                dataPoints: dataPointsLook,
            },
            {
                type: "line",
                lineColor: "#a800f7",
                name: "CLOOK",
                showInLegend: true,
                dataPoints: dataPointsClook,
            },
        ],
    });

    chart.render();
}