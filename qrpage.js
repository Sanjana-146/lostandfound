function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function generateQRCode(url) {
    const qrElement = document.getElementById("qrCode");
//  qrElement.innerHTML = ""; // Clear previous QR code

    console.log("Generating QR code for:", url);

    new QRCode(qrElement, {
        text: url, // The URL where details are displayed
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.L
    });
}

function displayData() {
    const qrData = getQueryParam("data");
    if (!qrData) {
        alert("No data found!");
        return;
    }

    try {
        const parsedData = JSON.parse(decodeURIComponent(qrData));

        // Create a URL that will show item details when scanned
        const baseUrl = window.location.origin + "/display.html"; // Change to your actual details page URL
        const detailsUrl = `${baseUrl}?data=${encodeURIComponent(qrData)}`;

        generateQRCode(detailsUrl); // QR Code now contains a redirecting URL

        document.getElementById("timestamp").innerText = `Generated on: ${parsedData.timestamp || "N/A"}`;

        window.qrDetails = parsedData; // Store details for PDF

    } catch (error) {
        console.error("Error parsing QR data:", error);
        alert("Invalid QR code data!");
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    html2canvas(document.getElementById("qrContainer")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        doc.text("Lost Item QR Code", 70, 20);
        doc.addImage(imgData, "PNG", 15, 30, 180, 100);
        doc.text(`Name: ${window.qrDetails.fullName}`, 20, 140);
        doc.text(`Phone: ${window.qrDetails.phoneNumber}`, 20, 150);
        doc.text(`Item: ${window.qrDetails.itemName} (${window.qrDetails.itemColor})`, 20, 160);
        doc.text(`Mark: ${window.qrDetails.markIdentification}`, 20, 170);
        doc.text(`Generated on: ${window.qrDetails.timestamp}`, 20, 180);

        doc.save("LostItemQRCode.pdf");
    });
}

window.onload = displayData;