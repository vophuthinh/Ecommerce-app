// sentimentAnalysis.js
const axios = require("axios");

const API_TOKEN = "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";
const API_URL =
  "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis";

// Kiểm tra trạng thái mô hình
async function checkModelStatus() {
  try {
    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
    };
    const response = await axios.get(API_URL, { headers });
    if (response.data.loading) {
      console.log("Mô hình đang tải, vui lòng chờ...");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Không thể kiểm tra trạng thái mô hình:", error.message);
    return false;
  }
}

// Phân tích cảm xúc cho một review
async function analyzeSentiment(review) {
  try {
    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
    };
    const response = await axios.post(API_URL, { inputs: review }, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi phân tích cảm xúc:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// Lấy nhãn cảm xúc chính
function getDominantLabel(result) {
  const labels = result[0];
  const dominant = labels.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev
  );
  return { label: dominant.label, score: dominant.score };
}

module.exports = {
  checkModelStatus,
  analyzeSentiment,
  getDominantLabel,
};
