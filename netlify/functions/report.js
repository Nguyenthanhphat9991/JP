// netlify/functions/report.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('./firebaseServiceKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://feedback-jp-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });
}

const db = admin.database();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { filename, content, question_title } = JSON.parse(event.body);

  if (!filename || !content || !question_title) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing data' }),
    };
  }

  const feedbackRef = db.ref('feedbacks');
  const feedbackItem = {
    filename,
    question_title,
    content,
    created_at: new Date().toISOString()
  };

  try {
    await feedbackRef.push(feedbackItem);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Report saved to Firebase successfully' }),
    };
  } catch (error) {
    console.error("Firebase error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save' }),
    };
  }
};
