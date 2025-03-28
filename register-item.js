function cleqrFields() {
    document.getElementById("year").value = "";
    document.getElementById("branch").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemColor").value = "";
    document.getElementById("category").value = "";
    document.getElementById("modelNumber").value = "";
    document.getElementById("modelName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("markIdentification").value = "";
    document.getElementById("imageUpload").value = "";
}
function toggleElectronicFields() {
    const category = document.getElementById("category").value;
    const electronicFields = document.getElementById("electronicFields");
    if (category === "electronic") {
        electronicFields.classList.remove("hidden");
    } else {
        electronicFields.classList.add("hidden");
    }
}

function redirectToQRPage() {
    const year = document.getElementById("year").value;
    const branch = document.getElementById("branch").value;
    const itemName = document.getElementById("itemName").value;
    const itemColor = document.getElementById("itemColor").value;
    const category = document.getElementById("category").value;
    // const modelNumber = document.getElementById("modelNumber") ? document.getElementById("modelNumber").value : "N/A";
    // const modelName = document.getElementById("modelName") ? document.getElementById("modelName").value : "N/A";
    const description = document.getElementById("description").value;
    const markIdentification = document.getElementById("markIdentification").value;
    const imageUpload = document.getElementById("imageUpload").files.length;
    // const timestamp = new Date().toLocaleString();
    let modelNumber = "N/A";
    let modelName = "N/A";

    if (category === "electronic") {
        modelNumber = document.getElementById("modelNumber")?.value || "N/A";
        modelName = document.getElementById("modelName")?.value || "N/A";
    }

    // Validate required fields
    if (!year || !branch || !itemName || !itemColor || !description || !markIdentification || imageUpload === 0) {
        alert("Please fill in all required fields and upload at least one image.");
        return;
    }

    // const qrData = JSON.stringify({
    //     year, branch, itemName, itemColor, category, modelNumber, modelName, description, markIdentification, timestamp
    // });



  document.getElementById('registrationForm').addEventListener('submit' , async function(event) {
    event.preventDefault();
    // If valid, submit the form
    const formData = new FormData();
    formData.append('year', document.getElementById('year').value);
    formData.append('branch', document.getElementById('branch').value);
    formData.append('itemName', document.getElementById('itemName').value);
    formData.append('itemColor', document.getElementById('itemColor').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('modelNumber', document.getElementById('modelNumber').value);
    formData.append('modelName', document.getElementById('modelName').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('markIdentification', document.getElementById('markIdentification').value);
    

    // Vehicle Images (allowing up to 7)
    const itemImages = document.getElementById('imageUpload').files;
    for (let i = 0; i < itemImages.length; i++) {
        formData.append('itemImages', itemImages[i]);
    }

    try {
        const response = await fetch('http://localhost:3000/api/item', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            // window.location.href = "index.html";
            cleqrFields();
            console.log('item successfully upload');
            alert('item details uploaded successfully');
            // Generate QR Data
            const qrData = JSON.stringify({
                year, branch, itemName, itemColor, category, modelNumber, modelName, description, markIdentification, timestamp: new Date().toLocaleString()
            });

            // Redirect only after success
            window.location.href = `qrpage.html?data=${encodeURIComponent(qrData)}`;
        } else {
            alert('Error uploading details: ' + result.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to connect to the server. Please try again later.');
    }

  }); 
//   window.location.href = `qrpage.html?data=${encodeURIComponent(qrData)}`;
}