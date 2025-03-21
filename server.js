// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

// Cho phép tất cả các origin (hoặc cấu hình cụ thể)
app.use(cors());
app.use(express.json());

app.post('/api/report', (req, res) => {

  const { filename, content, question_title } = req.body;
  if (!filename || !content || !question_title) {
    return res.status(400).json({ error: 'Missing filename or content' });
  }

  // Đường dẫn thư mục feedback trong src (hoặc bạn có thể chọn thư mục khác)
  const feedbackDir = path.join(__dirname, 'src', 'feedback');

  // Tạo thư mục nếu chưa tồn tại
  if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir, { recursive: true });
  }

  const filePath = path.join(feedbackDir, filename);
  // Tạo nội dung file theo định dạng: question_title: ...\ncontent: ...
  const fileContent = `content: ${content}`;

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to write file' });
    }
    res.json({ message: 'Report saved successfully' });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
