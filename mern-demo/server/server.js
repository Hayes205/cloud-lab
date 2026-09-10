const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const Student = require("./student.model");

// Đọc file .env ở thư mục gốc mern-demo
dotenv.config({
  path: path.join(__dirname, "..", ".env")
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra biến môi trường
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "Đã đọc" : "KHÔNG ĐỌC ĐƯỢC"
);

console.log("PORT:", process.env.PORT);

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Kết nối MongoDB Atlas thành công!");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

// =========================
// Câu 22 - API test
// =========================
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend đang hoạt động!"
  });
});

// =========================
// Câu 36 - GET students
// =========================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi lấy danh sách sinh viên"
    });
  }
});

// =========================
// Câu 37 - POST students
// =========================
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin"
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email
    });

    res.status(201).json({
      message: "Thêm sinh viên thành công",
      student
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "studentId đã tồn tại"
      });
    }

    res.status(500).json({
      message: "Lỗi thêm sinh viên"
    });
  }
});

// =========================
// Câu 38 - PUT students
// =========================
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, name, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      {
        studentId,
        name,
        email
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên"
      });
    }

    res.json({
      message: "Cập nhật sinh viên thành công",
      student
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi cập nhật sinh viên"
    });
  }
});

// =========================
// Câu 39 - DELETE students
// =========================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên"
      });
    }

    res.json({
      message: "Xóa sinh viên thành công",
      student
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi xóa sinh viên"
    });
  }
});

// =========================
// Start server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend đang chạy tại port ${PORT}`);
});