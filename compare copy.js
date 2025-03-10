function isValidInputNumbers(requestSequence, head) {
    for (let i = 0; i < requestSequence.length; ++i)
        if (requestSequence[i] > 199 || requestSequence[i] < 0)
            return false;

    if (head > 199 || head < 0)
        return false;

    return true;
}

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
    let requestFinalOrderFcfs = [headFcfs];
    for (let i = 0; i < requestSequenceFcfs.length; ++i) {
        requestFinalOrderFcfs.push(requestSequenceFcfs[i]);
    }
    let totalSeekCountFcfs = Math.abs(requestSequenceFcfs[0] - headFcfs);
    for (let i = 1; i < requestSequenceFcfs.length; ++i) {
        totalSeekCountFcfs += Math.abs(requestSequenceFcfs[i] - requestSequenceFcfs[i - 1]);
    }
    return [totalSeekCountFcfs, requestFinalOrderFcfs];
}

// SSTF Algorithm
function sstf_man(requestSequenceSstf, headSstf) {
    const len = requestSequenceSstf.length;
    let requestFinalOrderSstf = [headSstf];
    let totalSeekCountSstf = 0;

    for (let i = 0; i < len; ++i) {
        let tmp = [];
        for (let j = 0; j < requestSequenceSstf.length; ++j)
            tmp.push(Math.abs(requestFinalOrderSstf[requestFinalOrderSstf.length - 1] - requestSequenceSstf[j]));

        let minIndex = tmp.indexOf(Math.min.apply(null, tmp));
        totalSeekCountSstf += tmp[minIndex];
        requestFinalOrderSstf.push(requestSequenceSstf[minIndex]);
        requestSequenceSstf.splice(minIndex, 1);
    }
    return [totalSeekCountSstf, requestFinalOrderSstf];
}

// SCAN Algorithm
function scan_man(requestSequenceScan, headScan, direction) {
    let requestFinalOrderScan = [headScan];
    let tmp = 0;
    let tmpAry = [];

    for (let i = 0; i < requestSequenceScan.length; ++i)
        tmpAry.push(requestSequenceScan[i]);

    let requestSequenceScanSorted = tmpAry.sort((a, b) => a - b);

    for (let i = 0; i < requestSequenceScanSorted.length; ++i) {
        if (headScan < requestSequenceScanSorted[i]) {
            tmp = i;
            break;
        }
    }

    if (direction === "Left") {
        for (let i = tmp - 1; i >= 0; --i)
            requestFinalOrderScan.push(requestSequenceScanSorted[i]);

        if (requestFinalOrderScan[requestFinalOrderScan.length - 1] !== 0)
            requestFinalOrderScan.push(0);

        for (let i = tmp; i < requestSequenceScanSorted.length; ++i)
            requestFinalOrderScan.push(requestSequenceScanSorted[i]);

        totalSeekCountScan = Math.abs(headScan + requestFinalOrderScan[requestFinalOrderScan.length - 1]);
    } else {
        for (let i = tmp; i < requestSequenceScanSorted.length; ++i)
            requestFinalOrderScan.push(requestSequenceScanSorted[i]);

        if (requestFinalOrderScan[requestFinalOrderScan.length - 1] !== 199)
            requestFinalOrderScan.push(199);

        for (let i = tmp - 1; i >= 0; --i)
            requestFinalOrderScan.push(requestSequenceScanSorted[i]);

        totalSeekCountScan = Math.abs((199 - headScan) + (199 - requestFinalOrderScan[requestFinalOrderScan.length - 1]));
    }

    return [totalSeekCountScan, requestFinalOrderScan];
}

// C-SCAN Algorithm
function cscan_man(requestSequenceCscan, headCscan, direction) {
    let requestFinalOrderCscan = [headCscan];
    let totalSeekCountCscan = 0;

    // Sort the request sequence in ascending order (matching cscan.js)
    let requestSequenceCscanSorted = [...requestSequenceCscan].sort((a, b) => a - b);
    let splitIndex = requestSequenceCscanSorted.findIndex(num => num >= headCscan);

    if (direction === "Right") {
        // Process requests to the right of the head first
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

        // Total Seek Count Calculation
        totalSeekCountCscan = (199 - headCscan) + (199 - 0) + (leftRequests.length > 0 ? leftRequests[leftRequests.length - 1] : 0);
    } 
    else {
        // Process requests to the left of the head first
        let leftRequests = requestSequenceCscanSorted.slice(0, splitIndex).reverse();
        let rightRequests = requestSequenceCscanSorted.slice(splitIndex);

        requestFinalOrderCscan.push(...leftRequests);

        // Move to the lowest track (0) if not reached
        if (leftRequests.length > 0 && leftRequests[leftRequests.length - 1] !== 0) {
            requestFinalOrderCscan.push(0);
        }

        // Jump to track 199
        requestFinalOrderCscan.push(199);

        requestFinalOrderCscan.push(...rightRequests);

        // Total Seek Count Calculation
        totalSeekCountCscan = headCscan + 199 + (rightRequests.length > 0 ? (199 - rightRequests[rightRequests.length - 1]) : 0);
    }

    return [totalSeekCountCscan, requestFinalOrderCscan];
}


// LOOK Algorithm
function look_man(requestSequenceLook, headLook, direction) {
    let requestFinalOrderLook = [headLook];
    let tmp = 0;
    let tmpAry = [];

    for (let i = 0; i < requestSequenceLook.length; ++i) {
        tmpAry.push(requestSequenceLook[i]);
    }

    let requestSequenceLookSorted = tmpAry.sort((a, b) => a - b);

    for (let i = 0; i < requestSequenceLookSorted.length; ++i) {
        if (requestSequenceLookSorted[i] > headLook) {
            tmp = i;
            break;
        }
    }

    if (direction === "Right") {
        for (let i = tmp; i < requestSequenceLookSorted.length; ++i)
            requestFinalOrderLook.push(requestSequenceLookSorted[i]);

        for (let i = tmp - 1; i >= 0; --i)
            requestFinalOrderLook.push(requestSequenceLookSorted[i]);

        totalSeekCountLook = Math.abs(requestSequenceLookSorted[requestSequenceLookSorted.length - 1] - headLook +
            (Math.abs(requestSequenceLookSorted[requestSequenceLookSorted.length - 1] - requestSequenceLookSorted[0])));
    } else {
        for (let i = tmp - 1; i >= 0; --i)
            requestFinalOrderLook.push(requestSequenceLookSorted[i]);

        for (let i = tmp; i < requestSequenceLookSorted.length; ++i)
            requestFinalOrderLook.push(requestSequenceLookSorted[i]);

        totalSeekCountLook = Math.abs(headLook - requestSequenceLookSorted[0]) +
            (Math.abs(requestSequenceLookSorted[requestSequenceLookSorted.length - 1] - requestSequenceLookSorted[0]));
    }

    return [totalSeekCountLook, requestFinalOrderLook];
}

// C-LOOK Algorithm
function clook_man(requestSequenceClook, headClook, direction) {
    let requestFinalOrderClook = [headClook];
    let totalSeekCountClook = 0;

    // Sort request sequence in ascending order (matching clook.js)
    let requestSequenceClookSorted = [...requestSequenceClook].sort((a, b) => a - b);
    let splitIndex = requestSequenceClookSorted.findIndex(num => num >= headClook);

    if (direction === "Right") {
        // Process requests to the right first
        let rightRequests = requestSequenceClookSorted.slice(splitIndex);
        let leftRequests = requestSequenceClookSorted.slice(0, splitIndex);

        requestFinalOrderClook.push(...rightRequests);

        // Jump to the lowest request instead of looping over everything
        if (leftRequests.length > 0) {
            requestFinalOrderClook.push(leftRequests[0]);  // Only add once
        }

        requestFinalOrderClook.push(...leftRequests.slice(1)); // Avoid repeating the lowest request

        // Total Seek Count Calculation
        totalSeekCountClook = Math.abs(headClook - rightRequests[rightRequests.length - 1]) +
            Math.abs(rightRequests[rightRequests.length - 1] - leftRequests[0]) +
            (leftRequests.length > 1 ? Math.abs(leftRequests[leftRequests.length - 1] - leftRequests[0]) : 0);
    } 
    else {
        // Process requests to the left first
        let leftRequests = requestSequenceClookSorted.slice(0, splitIndex).reverse();
        let rightRequests = requestSequenceClookSorted.slice(splitIndex);

        requestFinalOrderClook.push(...leftRequests);

        // Jump to the highest request instead of looping over everything
        if (rightRequests.length > 0) {
            requestFinalOrderClook.push(rightRequests[rightRequests.length - 1]); // Only add once
        }

        requestFinalOrderClook.push(...rightRequests.slice(0, -1)); // Avoid repeating the highest request

        // Total Seek Count Calculation
        totalSeekCountClook = Math.abs(headClook - leftRequests[0]) +
            Math.abs(leftRequests[0] - rightRequests[rightRequests.length - 1]) +
            (rightRequests.length > 1 ? Math.abs(rightRequests[rightRequests.length - 1] - rightRequests[0]) : 0);
    }

    return [totalSeekCountClook, requestFinalOrderClook];
}


function runComparison() {
    let requestSequence = document.getElementById("Sequence").value;
    let head = document.getElementById("Head").value;
    let direction = document.getElementById("Direction").value;

    requestSequence = requestSequence
        .split(/ |,/)
        .filter(function (character) {
            return character !== "";
        });

    if (requestSequence.length === 0) {
        alert("Invalid input!!!");
        return;
    }

    for (let i = 0; i < requestSequence.length; ++i) {
        if (!Number.isInteger(+requestSequence[i]) || !(+requestSequence[i] >= 0)) {
            alert("Invalid input!!! Only integer values are valid");
            return;
        }
    }

    if (head.length === 0) {
        alert("Invalid input!!!");
        return;
    }

    if (!Number.isInteger(+head) || Number.isInteger(+head) < 0) {
        alert("Invalid input!!! Only integer values are valid");
        return;
    }

    head = +head;
    requestSequence = requestSequence
        .toString()
        .split(/ |,/)
        .filter(function (character) {
            return character !== "";
        })
        .map(function (a) {
            return +a;
        });

    if (!isValidInputNumbers(requestSequence, head)) {
        alert("Invalid input!!! Integral value(x) should be in the range 0<=x<=199");
        return;
    }

    let requestSequenceFcfs = requestSequence.slice();
    let requestSequenceSstf = requestSequence.slice();
    let requestSequenceScan = requestSequence.slice();
    let requestSequenceCscan = requestSequence.slice();
    let requestSequenceLook = requestSequence.slice();
    let requestSequenceClook = requestSequence.slice();

    let resultFcfs = fcfs_man(requestSequenceFcfs, head);
    let resultSstf = sstf_man(requestSequenceSstf, head);
    let resultScan = scan_man(requestSequenceScan, head, direction);
    let resultCscan = cscan_man(requestSequenceCscan, head, direction);
    let resultLook = look_man(requestSequenceLook, head, direction);
    let resultClook = clook_man(requestSequenceClook, head, direction);

    document.getElementById('fcfs_totalSeekCount').innerText = resultFcfs[0];
    document.getElementById('sstf_totalSeekCount').innerText = resultSstf[0];
    document.getElementById('scan_totalSeekCount').innerText = resultScan[0];
    document.getElementById('cscan_totalSeekCount').innerText = resultCscan[0];
    document.getElementById('look_totalSeekCount').innerText = resultLook[0];
    document.getElementById('clook_totalSeekCount').innerText = resultClook[0];

    let min_ary = [];
    min_ary.push(resultFcfs[0]);
    min_ary.push(resultSstf[0]);
    min_ary.push(resultScan[0]);
    min_ary.push(resultCscan[0]);
    min_ary.push(resultLook[0]);
    min_ary.push(resultClook[0]);

    let minimum = min_ary[0];
    for (let i = 1; i < min_ary.length; ++i) {
        if (min_ary[i] < minimum) {
            minimum = min_ary[i];
        }
    }

    document.getElementById('chartContainer').style.display = "block";

    let ary = [];
    let bry = [[]];
    let cry = [];

    ary.push(resultFcfs[1]);
    ary.push(resultSstf[1]);
    ary.push(resultScan[1]);
    ary.push(resultCscan[1]);
    ary.push(resultLook[1]);
    ary.push(resultClook[1]);

    let i = 0;
    ary.forEach(function (p) {
        p.forEach(function (q) {
            bry[i].push({ y: q });
        });
        if (i !== 6) {
            bry.push([]);
            ++i;
        }
    });

    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        animationDuration: 5000,
        theme: "light2",
        zoomEnabled: true,
        title: {
            text: "Comparison Chart",
        },
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
            gridThickness: 1, // Grid lines for clarity
            crosshair: { enabled: true }  // Adds a crosshair for better readability
        },
        axisY: {
            title: "Request Sequence",
            minimum: -0.5,
            interval: 1,
            reversed: true,  // Keeps Y-axis in top-down order
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
                if (
                    typeof e.dataSeries.visible === "undefined" ||
                    e.dataSeries.visible
                ) {
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
                indexLabelFontSize: 16,
                name: "FCFS",
                showInLegend: true,
                dataPoints: bry[0].map((point, index) => ({ x: point.y, y: index })), // Swap x and y
            },
            {
                type: "line",
                lineColor: "#0b3bfc",
                indexLabelFontSize: 16,
                name: "SSTF",
                showInLegend: true,
                dataPoints: bry[1].map((point, index) => ({ x: point.y, y: index })), // Swap x and y
            },
            {
                type: "line",
                lineColor: "#ff6cfb",
                indexLabelFontSize: 16,
                name: "SCAN",
                showInLegend: true,
                dataPoints: bry[2].map((point, index) => ({ x: point.y, y: index })), // Swap x and y
            },
            {
                type: "line",
                lineColor: "#ff413f",
                indexLabelFontSize: 16,
                name: "CSCAN",
                showInLegend: true,
                dataPoints: bry[3].map((point, index) => ({ x: point.y, y: index })), // Swap x and y
            },
            {
                type: "line",
                lineColor: "#ff9b04",
                indexLabelFontSize: 16,
                name: "LOOK",
                showInLegend: true,
                dataPoints: bry[4].map((point, index) => ({ x: point.y, y: index })), // Swap x and y
            },
            {
                type: "line",
                lineColor: "#a800f7",
                indexLabelFontSize: 16,
                name: "CLOOK",
                showInLegend: true,
                dataPoints: bry[5].map((point, index) => ({ x: point.y, y: index })), // Swap x and y
            },
        ],
    });
    chart.render();
}