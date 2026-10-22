# MedStudy AI — Website starter

Bản khởi đầu giao diện cho trợ lý ôn thi Y khoa. Đây là **prototype frontend**, chưa kết nối mô hình AI, chưa có đăng nhập, chưa lưu dữ liệu người dùng và chưa nạp đề cương/lịch thi.

## Chạy thử trên máy

1. Tải và giải nén thư mục này.
2. Mở `index.html` bằng trình duyệt. Không cần cài thư viện để xem giao diện.
3. Các nút điều hướng và khung chat là tương tác mẫu; phản hồi trong chat được đánh dấu là demo.

## Đưa lên GitHub

1. Đăng nhập tại https://github.com/
2. Bấm nút `+` ở góc trên bên phải → `New repository`.
3. Đặt tên `medstudy-ai`, chọn `Public` nếu muốn mã nguồn công khai hoặc `Private` nếu muốn giữ riêng.
4. Chọn `Add a README file` (nếu muốn) rồi bấm `Create repository`.
5. Trong repo, chọn `Add file` → `Upload files`; kéo thả **các file bên trong thư mục** này (`index.html`, `styles.css`, `app.js`, `README.md`, `docs/`), sau đó bấm `Commit changes`.

## Đưa website lên mạng bằng GitHub Pages

1. Vào repo → `Settings` → `Pages`.
2. Trong phần `Build and deployment`, chọn `Deploy from a branch`.
3. Chọn branch `main`, folder `/(root)`, bấm `Save`.
4. Chờ GitHub Pages triển khai xong; URL thường có dạng `https://TEN-TAI-KHOAN.github.io/medstudy-ai/`.

GitHub Pages chỉ host frontend tĩnh. Nó **không** chạy backend AI hoặc xử lý file riêng tư an toàn.

## Kiến trúc khuyến nghị khi phát triển thành bot thật

- Frontend: giữ giao diện hiện tại hoặc chuyển sang React/Next.js sau.
- Backend: FastAPI (Python) hoặc Node.js; giữ khóa API trong biến môi trường phía server, không bao giờ nhúng vào JavaScript gửi cho trình duyệt.
- AI: chọn nhà cung cấp mô hình sau khi so sánh chi phí, giới hạn sử dụng và chính sách dữ liệu.
- Knowledge base (RAG): tải file → trích xuất văn bản → chia đoạn → embeddings/vector store → truy xuất đoạn phù hợp → trả lời kèm tên tài liệu/trang nếu có.
- Lịch thi: lưu dữ liệu có cấu trúc (CSV/JSON/database), kiểm tra ngày giờ và cho phép người dùng sửa.
- Bảo mật: không tải hồ sơ bệnh nhân hoặc dữ liệu cá nhân nhạy cảm lên chatbot; chỉ dùng tài liệu học tập mà bạn có quyền sử dụng.

## Lộ trình

- [x] Khung giao diện và điều hướng
- [x] Khung chat demo, khu vực lịch thi và thư viện
- [ ] Backend gọi mô hình AI
- [ ] Đăng nhập và lưu tiến độ
- [ ] Upload và lập chỉ mục PDF/DOCX/XLSX
- [ ] Trả lời có trích dẫn từ tài liệu đã nạp
- [ ] Sinh trắc nghiệm và kế hoạch ôn tập theo lịch thật

## Lưu ý học thuật

MedStudy AI hỗ trợ học tập, không thay thế giáo trình, giảng viên, phác đồ chính thức hoặc đánh giá chuyên môn lâm sàng. Cần kiểm tra các câu trả lời Y khoa quan trọng với nguồn đáng tin cậy.
