import os
import json

def generate_books_json():
    # Lấy đường dẫn thư mục gốc (nơi đặt file auto_book.py)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Đường dẫn tới thư mục chứa PDF và file JSON xuất ra
    pdf_dir = os.path.join(base_dir, "docs", "content", "pdf")
    json_file = os.path.join(base_dir, "docs", "content", "books.json")

    # Kiểm tra xem thư mục pdf có tồn tại chưa
    if not os.path.exists(pdf_dir):
        print(f"[LỖI] Không tìm thấy thư mục {pdf_dir}")
        print("Vui lòng tạo thư mục 'docs/content/pdf' và bỏ file PDF vào đó trước.")
        return

    # Quét lấy tất cả file PDF
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith('.pdf')]
    
    books = []
    for file in pdf_files:
        file_id = os.path.splitext(file)[0]
        # Viết hoa chữ cái đầu và xóa gạch ngang để làm tên sách đẹp hơn
        label = file_id.replace('-', ' ').replace('_', ' ').title()
        
        books.append({
            "filename": file,
            "label": label
        })

    # Đảm bảo thư mục content tồn tại trước khi ghi
    os.makedirs(os.path.dirname(json_file), exist_ok=True)
    
    # Ghi đè file books.json
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    
    print(f"✅ HOÀN TẤT! Đã quét và lưu {len(books)} cuốn sách vào {json_file}")

if __name__ == "__main__":
    generate_books_json()