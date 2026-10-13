
import { useEffect, useState } from "react";

// Gọi API thông qua Nginx reverse proxy
const API_URL = "/api";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách sinh viên
  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/students`);

      if (!response.ok) {
        throw new Error(`Không thể lấy dữ liệu (HTTP ${response.status})`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu sinh viên trả về không hợp lệ");
      }

      setStudents(data);
    } catch (err) {
      console.error("Lỗi GET:", err);
      setError(err.message || "Không thể tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Xóa nội dung form
  const resetForm = () => {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedStudentId = studentId.trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedStudentId || !trimmedName || !trimmedEmail) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/students/${editingId}`
        : `${API_URL}/students`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: trimmedStudentId,
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Yêu cầu thất bại (HTTP ${response.status})`
        );
      }

      alert(
        isEditing
          ? "Cập nhật sinh viên thành công!"
          : "Thêm sinh viên thành công!"
      );

      resetForm();
      await loadStudents();
    } catch (err) {
      console.error("Lỗi thêm/sửa:", err);
      alert(err.message || "Không thể kết nối đến Backend!");
    } finally {
      setSaving(false);
    }
  };

  // Chọn sinh viên để sửa
  const editStudent = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId || "");
    setName(student.name || "");
    setEmail(student.email || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Hủy sửa
  const cancelEdit = () => {
    resetForm();
  };

  // Xóa sinh viên
  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Xóa thất bại (HTTP ${response.status})`
        );
      }

      alert("Xóa sinh viên thành công!");

      if (editingId === id) {
        resetForm();
      }

      await loadStudents();
    } catch (err) {
      console.error("Lỗi DELETE:", err);
      alert(err.message || "Không thể kết nối đến Backend!");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Quản lý sinh viên - Version 3.0</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={saving}
            required
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
            disabled={saving}
            required
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
            disabled={saving}
            required
            style={{
              padding: "10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 20px",
            cursor: saving ? "wait" : "pointer",
            marginRight: "10px",
          }}
        >
          {saving
            ? "Đang xử lý..."
            : editingId !== null
              ? "Cập nhật sinh viên"
              : "Thêm sinh viên"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={saving}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Hủy sửa
          </button>
        )}
      </form>

      <hr style={{ margin: "25px 0" }} />

      <h2>Danh sách sinh viên</h2>

      <button
        type="button"
        onClick={loadStudents}
        disabled={loading}
        style={{
          padding: "8px 14px",
          marginBottom: "15px",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Đang tải..." : "Tải lại danh sách"}
      </button>

      {error && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
          }}
        >
          <p>{error}</p>
          <p>
            Hãy kiểm tra cấu hình Nginx và trạng thái Backend trên Render.
          </p>
        </div>
      )}

      {loading && students.length === 0 ? (
        <p>Đang tải danh sách sinh viên...</p>
      ) : students.length === 0 && !error ? (
        <p>Chưa có sinh viên.</p>
      ) : students.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
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
                      type="button"
                      onClick={() => editStudent(student)}
                      style={{
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteStudent(student._id)}
                      style={{ cursor: "pointer" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default App;
