// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config(); // nếu bạn có dùng .env

// 🚀 KHỞI TẠO APP
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 KẾT NỐI FIREBASE
const serviceAccount = require('./firebaseServiceKey.json'); // Đảm bảo file đúng vị trí

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://feedback-jp-default-rtdb.asia-southeast1.firebasedatabase.app/" // 🔁 Cập nhật đúng URL
});

const db = admin.database();

// 📩 API: Gửi báo cáo
app.post('/report', (req, res) => {
  const { filename, content, question_title } = req.body;

  if (!filename || !content || !question_title) {
    return res.status(400).json({ error: 'Missing filename, content, or title' });
  }

  const feedbackRef = db.ref('feedbacks'); // 👈 Dữ liệu sẽ nằm trong "feedbacks" node
  const feedbackItem = {
    filename,
    question_title,
    content,
    created_at: new Date().toISOString()
  };

  feedbackRef.push(feedbackItem, (error) => {
    if (error) {
      console.error('Firebase write error:', error);
      return res.status(500).json({ error: 'Failed to save to Firebase' });
    }
    res.json({ message: 'Report saved to Firebase successfully' });
  });
});

// 🔥 SERVER KHỞI CHẠY
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
