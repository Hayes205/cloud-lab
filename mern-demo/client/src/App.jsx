import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Dùng để biết đang thêm hay đang sửa
  const [editingId, setEditingId] = useState(null);

  // =========================
  // Câu 47 - GET students
  // =========================
  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi GET:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // Câu 75 - POST student
  // Câu 77 - PUT student
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      let response;

      if (editingId) {
        // =========================
        // Câu 77 - PUT
        // =========================
        response = await fetch(`${API_URL}/students/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            name,
            email,
          }),
        });
      } else {
        // =========================
        // Câu 75 - POST
        // =========================
        response = await fetch(`${API_URL}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            name,
            email,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Có lỗi xảy ra!");
        return;
      }

      if (editingId) {
        alert("Cập nhật sinh viên thành công!");
      } else {
        alert("Thêm sinh viên thành công!");
      }

      // Xóa form
      setStudentId("");
      setName("");
      setEmail("");
      setEditingId(null);

      // Tải lại danh sách
      loadStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến Backend!");
    }
  };

  // =========================
  // Câu 77 - Chọn sinh viên để sửa
  // =========================
  const editStudent = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // =========================
  // Hủy sửa
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // =========================
  // Câu 78 - DELETE student
  // =========================
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Xóa sinh viên thất bại!");
        return;
      }

      alert("Xóa sinh viên thành công!");

      // Nếu đang sửa sinh viên vừa bị xóa
      if (editingId === id) {
        cancelEdit();
      }

      // Tải lại danh sách
      loadStudents();
    } catch (error) {
      console.error("Lỗi DELETE:", error);
      alert("Không thể kết nối đến Backend!");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h1>Quản lý sinh viên - Version 2.0</h1>

      {/* =========================
          FORM
      ========================= */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <hr />

      {/* =========================
          DANH SÁCH
      ========================= */}
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>STT</th>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>

                <td>
                  <button
                    onClick={() => editStudent(student)}
                    style={{
                      marginRight: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => deleteStudent(student._id)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;