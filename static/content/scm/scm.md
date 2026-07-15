MD['scm'] = `
# Supply Chain Management

## 1. Tổng quan
### Định nghĩa
#### Mạng lưới các tổ chức, con người, hoạt động, thông tin và nguồn lực liên quan đến việc cung cấp sản phẩm / dịch vụ từ nhà cung cấp đến khách hàng cuối
#### Quản lý dòng chảy: vật liệu, thông tin và tài chính
#### Mục tiêu: đúng sản phẩm – đúng nơi – đúng lúc – chi phí tối ưu
### Tầm quan trọng
#### Chi phí chuỗi cung ứng chiếm 50–70% doanh thu trong sản xuất
#### Chuỗi cung ứng yếu → không thể duy trì Lean / JIT
#### Lợi thế cạnh tranh ngày càng đến từ chuỗi cung ứng, không chỉ sản phẩm
### Ba dòng chảy trong Supply Chain
#### Material Flow – dòng vật liệu (từ nhà cung cấp đến khách hàng)
#### Information Flow – dòng thông tin (2 chiều)
#### Financial Flow – dòng tiền (từ khách hàng ngược về nhà cung cấp)

## 2. Cấu trúc chuỗi cung ứng
### Upstream (Thượng nguồn)
#### Nhà cung cấp cấp 1 (Tier 1 Suppliers) – cung cấp trực tiếp
#### Nhà cung cấp cấp 2 (Tier 2) – cung cấp cho Tier 1
#### Nhà cung cấp cấp 3+ – nguyên liệu thô
### Focal Company (Doanh nghiệp trung tâm)
#### Nhà sản xuất hoặc nhà cung cấp dịch vụ chính
#### Điều phối toàn bộ chuỗi cung ứng
### Downstream (Hạ nguồn)
#### Nhà phân phối (Distributors)
#### Nhà bán lẻ (Retailers)
#### Khách hàng cuối (End Customers)
### Các loại chuỗi cung ứng
#### Lean Supply Chain – tối thiểu lãng phí, hiệu quả cao
#### Agile Supply Chain – linh hoạt, phản ứng nhanh với biến động
#### Leagile Supply Chain – kết hợp Lean và Agile
#### Resilient Supply Chain – khả năng phục hồi sau gián đoạn

## 3. Hoạch định chuỗi cung ứng (Supply Chain Planning)
### Demand Planning (Dự báo nhu cầu)
#### Dự báo nhu cầu khách hàng ngắn / trung / dài hạn
#### Phương pháp: định lượng (time series, regression) và định tính (expert judgment)
#### Demand Sensing – dùng dữ liệu real-time để tinh chỉnh dự báo
### Supply Planning (Hoạch định cung ứng)
#### Đảm bảo đủ năng lực sản xuất và nguyên vật liệu
#### Cân bằng cung – cầu
### S&OP – Sales & Operations Planning
#### Quy trình đồng bộ kế hoạch kinh doanh, bán hàng và vận hành
#### Họp S&OP hàng tháng – lãnh đạo các bộ phận tham gia
#### Đầu ra: kế hoạch sản xuất và tồn kho tổng thể
### MRP – Material Requirements Planning
#### Tính toán nhu cầu nguyên vật liệu dựa trên kế hoạch sản xuất
#### Đầu vào: Master Production Schedule, Bill of Materials, Inventory Records
### MRP II & ERP
#### MRP II – mở rộng sang năng lực máy móc và nguồn lực
#### ERP (SAP, Oracle) – tích hợp toàn bộ hoạch định doanh nghiệp

## 4. Quản lý tồn kho (Inventory Management)
### Các loại tồn kho
#### Raw Materials – nguyên vật liệu
#### Work In Progress (WIP) – bán thành phẩm
#### Finished Goods – thành phẩm
#### MRO – vật tư bảo trì, sửa chữa, vận hành
### Mục đích tồn kho
#### Buffer Stock – đệm biến động cung / cầu
#### Cycle Stock – phục vụ sản xuất / bán hàng bình thường
#### Safety Stock – dự phòng bất thường
### Chi phí tồn kho
#### Holding Cost – chi phí lưu giữ (vốn, kho, bảo hiểm, hao hụt)
#### Ordering Cost – chi phí đặt hàng
#### Stockout Cost – chi phí thiếu hàng (mất doanh thu, phạt)
### Mô hình tồn kho
#### EOQ – Economic Order Quantity (lượng đặt hàng tối ưu)
#### Reorder Point – điểm tái đặt hàng
#### Min-Max System
#### Just-In-Time – tối thiểu hóa tồn kho
### KPI tồn kho
#### Inventory Turnover (Vòng quay tồn kho)
#### Days on Hand (Số ngày tồn kho)
#### Fill Rate (Tỷ lệ đáp ứng đơn hàng)
#### Inventory Accuracy

## 5. Mua hàng & Quản lý nhà cung cấp (Procurement & SRM)
### Chiến lược mua hàng
#### Strategic Sourcing – lựa chọn nhà cung cấp có tính chiến lược dài hạn
#### Ma trận Kraljic – phân loại vật tư theo tầm quan trọng & rủi ro cung ứng
##### Leverage Items – nhiều nhà cung cấp, đàm phán giá tốt
##### Strategic Items – quan trọng, ít nhà cung cấp → quan hệ đối tác
##### Routine Items – tự động hóa mua hàng
##### Bottleneck Items – rủi ro cao → dự trữ an toàn
### Lựa chọn nhà cung cấp
#### Tiêu chí: chất lượng, giá, giao hàng, năng lực, tài chính, ESG
#### RFQ (Request for Quotation) – yêu cầu báo giá
#### RFP (Request for Proposal) – yêu cầu đề xuất
### Supplier Relationship Management (SRM)
#### Phân loại nhà cung cấp: Transactional / Preferred / Strategic Partner
#### Supplier Development – đào tạo và hỗ trợ nhà cung cấp cải tiến
#### Supplier Scorecard – đánh giá hiệu suất định kỳ (OTIF, chất lượng, giá)
### OTIF – On Time In Full
#### Giao đúng hạn và đúng số lượng
#### KPI quan trọng nhất đánh giá nhà cung cấp

## 6. Logistics & Phân phối
### Inbound Logistics (Logistics đầu vào)
#### Vận chuyển nguyên vật liệu từ nhà cung cấp về nhà máy
#### Quản lý bốc dỡ, kiểm tra và nhập kho
### Outbound Logistics (Logistics đầu ra)
#### Vận chuyển thành phẩm đến khách hàng
#### Order fulfillment, picking, packing, shipping
### Các phương thức vận chuyển
#### Đường bộ (Road) – linh hoạt, phổ biến nội địa
#### Đường biển (Sea) – chi phí thấp, thời gian dài
#### Đường hàng không (Air) – nhanh, chi phí cao
#### Đường sắt (Rail) – phù hợp hàng nặng, cự ly dài
#### Multimodal – kết hợp nhiều phương thức
### Warehouse Management (Quản lý kho)
#### Bố trí kho: ABC Analysis theo tần suất xuất nhập
#### FIFO / FEFO (First Expired First Out)
#### WMS – Warehouse Management System
#### Cross-docking – hàng qua kho không lưu trữ
### Last Mile Delivery
#### Chặng cuối từ trung tâm phân phối đến tay khách hàng
#### Chi phí cao nhất trong chuỗi logistics
#### Thách thức lớn trong thương mại điện tử

## 7. Rủi ro chuỗi cung ứng (Supply Chain Risk)
### Phân loại rủi ro
#### Supply Risk – nhà cung cấp gặp vấn đề
#### Demand Risk – nhu cầu biến động đột ngột
#### Operational Risk – lỗi nội bộ, tai nạn, hỏng máy
#### Disruption Risk – thiên tai, dịch bệnh, chiến tranh, địa chính trị
### Hiệu ứng Bullwhip (Bullwhip Effect)
#### Biến động nhỏ ở nhu cầu khách hàng → khuếch đại lớn ngược về nhà cung cấp
#### Nguyên nhân: dự báo sai, đặt hàng theo lô, trì hoãn thông tin
#### Giải pháp: chia sẻ dữ liệu real-time, VMI, rút ngắn chu kỳ đặt hàng
### Supply Chain Resilience (Khả năng phục hồi)
#### Redundancy – có nhà cung cấp dự phòng
#### Flexibility – năng lực chuyển đổi nhanh
#### Visibility – nhìn thấy toàn chuỗi theo thời gian thực
#### Collaboration – hợp tác chặt với đối tác
### Business Continuity Planning (BCP)
#### Kế hoạch duy trì hoạt động khi có gián đoạn
#### Kịch bản: nhà cung cấp ngừng hoạt động, thiên tai, dịch bệnh

## 8. Lean Supply Chain
### Nguyên tắc Lean áp dụng vào chuỗi cung ứng
#### Loại bỏ lãng phí trong toàn chuỗi – không chỉ nội bộ
#### Pull System – kéo từ nhu cầu thực tế
#### Takt Time – đồng bộ nhịp sản xuất với nhịp giao hàng
### VMI – Vendor Managed Inventory
#### Nhà cung cấp tự quản lý tồn kho tại kho khách hàng
#### Giảm stockout, giảm chi phí đặt hàng, tối ưu mức tồn kho
### Collaborative Planning, Forecasting & Replenishment (CPFR)
#### Chia sẻ kế hoạch và dự báo giữa nhà cung cấp và khách hàng
#### Giảm Bullwhip Effect
### Milk Run
#### Xe tải thu gom hàng từ nhiều nhà cung cấp theo lộ trình cố định
#### Giảm chi phí vận chuyển, tăng tần suất giao hàng nhỏ

## 9. Công nghệ trong Supply Chain
### ERP (Enterprise Resource Planning)
#### SAP, Oracle – tích hợp toàn bộ hoạch định
### TMS – Transportation Management System
#### Tối ưu lộ trình, theo dõi vận chuyển
### WMS – Warehouse Management System
#### Quản lý kho tự động, barcode / RFID
### Supply Chain Visibility Platform
#### Nhìn thấy trạng thái toàn chuỗi real-time
### IoT & Track and Trace
#### Cảm biến theo dõi vị trí, nhiệt độ, độ ẩm hàng hóa
### AI & Machine Learning
#### Dự báo nhu cầu chính xác hơn
#### Tối ưu tồn kho tự động
#### Phát hiện rủi ro chuỗi cung ứng sớm
### Blockchain
#### Truy xuất nguồn gốc minh bạch
#### Smart Contract tự động thanh toán khi giao hàng

## 10. KPI chuỗi cung ứng
### Chỉ số giao hàng
#### OTIF – On Time In Full
#### Order Cycle Time – thời gian từ đặt hàng đến nhận hàng
#### Perfect Order Rate – đơn hàng hoàn hảo (đúng – đủ – đúng hạn – không hỏng)
### Chỉ số tồn kho
#### Inventory Turnover
#### Days Sales of Inventory (DSI)
#### Inventory Accuracy
### Chỉ số chi phí
#### Total Supply Chain Cost / Revenue
#### Freight Cost per Unit
#### Warehousing Cost per Unit
### Chỉ số chất lượng nhà cung cấp
#### Supplier OTIF
#### Incoming Defect Rate
#### Supplier Lead Time
### SCOR Model KPIs
#### Reliability, Responsiveness, Agility, Cost, Asset Management

## 11. Sustainability trong Supply Chain
### ESG trong chuỗi cung ứng
#### Environmental – giảm carbon footprint, năng lượng tái tạo
#### Social – điều kiện lao động nhà cung cấp, không dùng lao động cưỡng bức
#### Governance – minh bạch, chống tham nhũng
### Green Supply Chain
#### Thiết kế sản phẩm dễ tái chế
#### Tối ưu tuyến đường vận chuyển giảm khí thải
#### Bao bì thân thiện môi trường
### Circular Supply Chain
#### Kinh tế tuần hoàn – tái sử dụng, tái chế, tái sản xuất
#### Reverse Logistics – thu hồi sản phẩm cuối vòng đời
`;