import React, { useState } from 'react';
import axios from 'axios';

const UploadChapter = () => {
  const [files, setFiles] = useState([]);
  const [chapNumber, setChapNumber] = useState("");
  const [content, setContent] = useState("");
  const [comicId, setComicId] = useState("");
  const [tenChap, setTenChap] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("chapnumber", chapNumber);
    formData.append("content", content);
    formData.append("comicId", comicId);
    formData.append("tenchap", tenChap);

    try {
      const response = await axios.post("http://localhost:8081/api/upload/chapter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Chapter đã được tải lên thành công!");
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi tải chapter:", error);
      alert("Tải chapter thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Chương số:</label>
        <input
          type="number"
          placeholder="Số chương"
          value={chapNumber}
          onChange={(e) => setChapNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Nội dung:</label>
        <textarea
          placeholder="Nội dung chương"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>ID Truyện:</label>
        <input
          type="text"
          placeholder="ID Truyện"
          value={comicId}
          onChange={(e) => setComicId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tên chương:</label>
        <input
          type="text"
          placeholder="Tên chương"
          value={tenChap}
          onChange={(e) => setTenChap(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Hình ảnh:</label>
        <input type="file" multiple onChange={handleFileChange} required />
      </div>
      <button type="submit">Tải lên chapter</button>
    </form>
  );
};

export default UploadChapter;
