# IRDA Backend

A Node.js/Express backend for a real-time chat and file upload application with Cloudinary integration and RabbitMQ message queue.

## Features

- 🚀 Real-time messaging with RabbitMQ
- 📁 File upload to Cloudinary (images & PDFs)
- 📊 Server-Sent Events (SSE) for real-time upload progress
- 🗑️ File and message management (CRUD operations)
- 📄 PDF inline viewing support
- 💾 MongoDB database integration
- 🔒 CORS configured for production and development

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Message Queue:** RabbitMQ (amqplib)
- **File Storage:** Cloudinary
- **File Upload:** Multer
- **Environment:** dotenv

## Prerequisites

- Node.js (v20 or higher)
- MongoDB instance (local or cloud)
- RabbitMQ server
- Cloudinary account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AnisurRahman06046/idra_backend.git
cd idra_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
RABBITMQ_URL=amqp://localhost
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000` (or your specified PORT).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `RABBITMQ_URL` | RabbitMQ server URL | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## API Endpoints

### Messages

#### Send Message
```http
POST /api/send
Content-Type: application/json

{
  "message": "Hello World"
}
```

#### Get All Messages
```http
GET /api/messages
```

#### Update Message
```http
PUT /api/messages/:id
Content-Type: application/json

{
  "text": "Updated message"
}
```

#### Delete Message
```http
DELETE /api/messages/:id
```

### File Upload

#### Upload File (Standard)
```http
POST /file/api/upload
Content-Type: multipart/form-data

file: <binary>
```

#### Upload File (With Progress)
```http
POST /file/api/upload-progress
Content-Type: multipart/form-data

file: <binary>
```
Returns: Server-Sent Events stream with progress updates

#### Get Upload Signature
```http
GET /file/api/signature?resource_type=auto
```

#### Save File Metadata
```http
POST /file/api/save
Content-Type: application/json

{
  "url": "cloudinary_url",
  "type": "image|raw",
  "mimetype": "image/png",
  "originalName": "file.png"
}
```

#### Get All Files
```http
GET /file/api/all
```

#### Get PDF (Inline View)
```http
GET /file/api/pdf/:id
```

#### Delete File
```http
DELETE /file/api/:id
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── db.js               # MongoDB connection
│   │   └── rabbit.js           # RabbitMQ connection
│   ├── consumers/
│   │   └── message.consumer.js # RabbitMQ consumer
│   ├── controllers/
│   │   └── message.controller.js # Message logic
│   ├── models/
│   │   ├── file.model.js       # File schema
│   │   └── message.model.js    # Message schema
│   ├── routes/
│   │   ├── message.routes.js   # Message endpoints
│   │   └── upload.routes.js    # File upload endpoints
│   └── index.js                # Entry point
├── .env                        # Environment variables
├── package.json
└── README.md
```

## Features in Detail

### Real-time Upload Progress

The `/file/api/upload-progress` endpoint uses Server-Sent Events (SSE) to stream real-time progress updates:

- **0-30%**: Client to backend upload
- **30-90%**: Backend to Cloudinary upload (tracked via stream chunks)
- **90-95%**: Database save
- **95-100%**: Completion

### PDF Inline Viewing

PDFs are served through a proxy endpoint that sets the correct `Content-Disposition` header to enable inline viewing in browsers instead of downloading.

### File Deletion

When deleting files, the backend:
1. Removes the file from Cloudinary
2. Deletes the database record
3. Returns success confirmation

## CORS Configuration

The backend is configured to accept requests from:
- `https://demo-idra-chat.netlify.app` (production)
- `http://localhost:5173` (development)
- `http://localhost:5174` (alternative dev port)

To add more origins, update the `corsOptions` in `src/index.js`:
```javascript
const corsOptions = {
  origin: [
    "https://demo-idra-chat.netlify.app",
    "http://localhost:5173",
    // Add your origins here
  ],
  credentials: true,
};
```

## Deployment

This backend is deployed on [Render](https://render.com/). To deploy your own instance:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render dashboard
5. Deploy

**Live Backend:** `https://idra-backend.onrender.com`

## Scripts

- `npm start` - Start the server

## Error Handling

All endpoints include try-catch error handling and return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request
- `404` - Not found
- `500` - Server error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

## Author

**Anisur Rahman**
- GitHub: [@AnisurRahman06046](https://github.com/AnisurRahman06046)

## Links

- **Frontend Repository:** [https://github.com/AnisurRahman06046/idra_frontend](https://github.com/AnisurRahman06046/idra_frontend)
- **Live Demo:** [https://demo-idra-chat.netlify.app](https://demo-idra-chat.netlify.app)
