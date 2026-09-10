import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // Câu 47 - GET students
  // =========================
  const loadStudents = async () => {
    try {
      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Chạy khi mở trang
  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // Câu 49 - POST student
  // =========================
  const addStudent = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId,
          name,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Thêm sinh viên thành công!");

      // Xóa form
      setStudentId("");
      setName("");
      setEmail("");

      // Tải lại danh sách
      loadStudents();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Quản lý sinh viên</h1>

      {/* FORM */}
      <form onSubmit={addStudent}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ padding: "10px", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "10px", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Thêm sinh viên
        </button>
      </form>

      <hr />

      {/* DANH SÁCH */}
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th>STT</th>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;