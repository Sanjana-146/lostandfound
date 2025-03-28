const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const axios = require('axios');
const { json } = require('body-parser');
const port = 3000;
// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());
// CORS Configuration - Allow multiple origins
const allowedOrigins = ['http://localhost:3000','http://localhost:4000','http://localhost:5000','http://127.0.0.1:5500'
];

app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or server-side requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
    methods: ['GET', 'POST'],
}));
const clientPath = path.join(__dirname, '../../client'); // Adjusted path to go 2 levels up
app.use(express.static(clientPath)); // Serve static files correctly
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'register-item.html')); // Serve HTML file
});

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/register-item-database',{
    useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error: ', err));


// Vehicle Schema
const itemSchema = new mongoose.Schema({
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  year: String,
  branch: String,
  itemName: String,
  itemColor: String,
  category: String,
  modelName: String,
  modelNumber: String,
  description: String,
  markIdentification: String,
  itemImages: [String],
  });
const Item = mongoose.model('Item',itemSchema);


// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });
  

  // POST route for vehicle details submission
app.post('/api/item', upload.fields([
    { name: 'itemImages', maxCount: 5 },
  ]), async (req, res) => {
    console.log('Received request on /api/item');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    try {
      const {year,  branch, itemName, itemColor, category, modelName, modelNumber, description , markIdentification} = req.body;
      const itemImages = req.files && req.files['itemImages'] ? req.files['itemImages'].map(file => file.path) : [];
      const item = new Item({
        // owner: req.session.user._id,
        year,
        branch,
        itemName,
        itemColor,
        category,
        modelName,
        modelNumber,
        description,
        markIdentification,
        itemImages,
      });
      console.log("Final item object to be saved:", item);
      await item.save();
        res.status(200).json({ message: 'Itemsw details uploaded successfully' });
    } catch (error) {
      console.error('Server Error:', error); // Log the full error
  res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


  app.get('/api/item', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
  // Start the server
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });