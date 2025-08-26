-- Fix Vietnamese translations with proper translations instead of "(VN)" suffix
UPDATE events 
SET 
  title_translations = jsonb_set(
    title_translations,
    '{vi}',
    to_jsonb(
      CASE 
        WHEN title LIKE '%Caribbean%' THEN 'Lễ hội Caribe Dorchester'
        WHEN title LIKE '%Beach Day%' THEN 'Ngày Biển Dorchester'
        WHEN title LIKE '%Poetry%' THEN 'Thơ Ca Roxbury'
        WHEN title LIKE '%Jazz%' THEN 'Đêm Jazz và Soul Roxbury'
        WHEN title LIKE '%Music on%' THEN 'Âm nhạc tại Quảng trường Mattapan'
        WHEN title LIKE '%Cross-Country%' THEN 'Khai mạc Mùa Chạy Việt dã Franklin Park'
        WHEN title LIKE '%Unity 5K%' THEN 'Chạy bộ Đoàn kết Mattapan 5K'
        WHEN title LIKE '%Movie Night%' THEN 'Đêm Phim tại Công viên Mattapan'
        WHEN title LIKE '%Back-to-School%' THEN 'Lễ hội Trở lại Trường Dorchester'
        WHEN title LIKE '%Open Studios%' THEN 'Phòng Tranh Mở Jamaica Plain'
        WHEN title LIKE '%Energy Walk%' THEN 'Đi bộ Năng lượng MitoAction'
        WHEN title LIKE '%Garden Hours%' THEN 'Giờ Vườn Thư viện Mattapan'
        WHEN title LIKE '%Performance%' THEN 'Biểu diễn tại Hibernian Hall'
        WHEN title LIKE '%Wolfpack 5K%' THEN 'Chạy 5K Wolfpack Boston Latin'
        WHEN title LIKE '%Jazz Night%' THEN 'Đêm Jazz tại Long Live Roxbury'
        ELSE title || ' (Sự kiện)'
      END
    )
  ),
  description_translations = jsonb_set(
    description_translations, 
    '{vi}',
    to_jsonb(
      CASE 
        WHEN description LIKE '%Caribbean%' THEN 'Lễ kỷ niệm văn hóa Caribe với âm nhạc, khiêu vũ, ẩm thực và các gian hàng.'
        WHEN description LIKE '%Beach%' THEN 'Các hoạt động bãi biển, trò chơi và vui chơi cộng đồng cho mọi lứa tuổi.'
        WHEN description LIKE '%poetry%' THEN 'Cuộc thi thơ ca với tài năng địa phương.'
        WHEN description LIKE '%jazz%' THEN 'Một đêm nhạc jazz và soul trực tiếp với các nghệ sĩ địa phương.'
        WHEN description LIKE '%music%' THEN 'Đêm nhạc sống với các ban nhạc địa phương và quầy ăn.'
        WHEN description LIKE '%walk%' OR description LIKE '%run%' THEN 'Hoạt động đi bộ và chạy bộ cộng đồng 5K mang lại lợi ích cho các sáng kiến sức khỏe địa phương.'
        WHEN description LIKE '%movie%' THEN 'Chiếu phim ngoài trời cho gia đình với bỏng ngô miễn phí.'
        WHEN description LIKE '%school%' THEN 'Đồ dùng học tập miễn phí, trò chơi, thức ăn và tài nguyên địa phương cho các gia đình.'
        WHEN description LIKE '%garden%' THEN 'Giờ vườn mở cho cộng đồng.'
        WHEN description LIKE '%performance%' THEN 'Buổi biểu diễn tại Hibernian Hall.'
        ELSE description || ' (Mô tả bằng tiếng Việt)'
      END
    )
  );

UPDATE business 
SET 
  title_translations = jsonb_set(
    title_translations,
    '{vi}',
    to_jsonb(
      CASE 
        WHEN title ILIKE '%vietnamese%' OR title ILIKE '%pho%' OR title ILIKE '%viet%' THEN 
          CASE 
            WHEN title LIKE '%Pho Hoa%' THEN 'Nhà hàng Phở Hòa'
            WHEN title LIKE '%Viet''s Cafe%' OR title LIKE '%Viets Cafe%' THEN 'Quán Cà phê Việt'
            ELSE title
          END
        WHEN title ILIKE '%jamaican%' THEN 
          CASE 
            WHEN title LIKE '%Only One%' THEN 'Nhà hàng Jamaica Duy nhất'
            WHEN title LIKE '%Irie%' THEN 'Nhà hàng Phong cách Jamaica Irie'
            ELSE title || ' (Nhà hàng Jamaica)'
          END
        WHEN title ILIKE '%restaurant%' THEN REPLACE(title, 'Restaurant', 'Nhà hàng')
        WHEN title ILIKE '%cafe%' THEN REPLACE(title, 'Cafe', 'Quán cà phê')
        WHEN title ILIKE '%pizzeria%' THEN REPLACE(title, 'Pizzeria', 'Tiệm Pizza')
        WHEN title ILIKE '%bakery%' THEN REPLACE(title, 'Bakery', 'Tiệm Bánh')
        WHEN title ILIKE '%market%' THEN REPLACE(title, 'Market', 'Chợ')
        WHEN title ILIKE '%bar%' THEN REPLACE(title, 'Bar', 'Quán Bar')
        WHEN title ILIKE '%auto%' OR title ILIKE '%repair%' THEN title || ' (Sửa chữa ô tô)'
        WHEN title ILIKE '%cycles%' OR title ILIKE '%bike%' THEN title || ' (Cửa hàng xe đạp)'
        WHEN title ILIKE '%boutique%' THEN REPLACE(title, 'Boutique', 'Cửa hàng thời trang')
        WHEN title ILIKE '%roller%' OR title ILIKE '%skating%' THEN title || ' (Sân trượt patin)'
        ELSE title || ' (Doanh nghiệp)'
      END
    )
  ),
  description_translations = jsonb_set(
    description_translations,
    '{vi}', 
    to_jsonb(
      CASE 
        WHEN description ILIKE '%vietnamese%' AND description ILIKE '%pho%' THEN 'Nhà hàng Việt Nam nổi tiếng với món phở chính hiệu và các món ăn truyền thống Việt Nam.'
        WHEN description ILIKE '%vietnamese%' AND description ILIKE '%coffee%' THEN 'Quán cà phê Việt Nam thân thiện phục vụ phở, bún và cà phê Việt Nam trong không khí thân thiện.'
        WHEN description ILIKE '%jamaican%' AND description ILIKE '%jerk%' THEN 'Ẩm thực Jamaica chính hiệu với gà jerk, cà ri dê và các món ưa thích truyền thống của đảo.'
        WHEN description ILIKE '%takeout%' AND description ILIKE '%island%' THEN 'Địa điểm thư giãn bán đồ ăn mang về với chỗ ngồi hạn chế phục vụ đồ ăn đảo.'
        WHEN description ILIKE '%auto%' OR description ILIKE '%repair%' THEN 'Dịch vụ sửa chữa ô tô chuyên nghiệp.'
        WHEN description ILIKE '%bike%' OR description ILIKE '%cycling%' THEN 'Cửa hàng xe đạp và dịch vụ sửa chữa.'
        WHEN description ILIKE '%boutique%' OR description ILIKE '%fashion%' THEN 'Cửa hàng thời trang và phụ kiện.'
        WHEN description ILIKE '%roller%' OR description ILIKE '%skating%' THEN 'Sân trượt patin cho giải trí và tập luyện.'
        WHEN description ILIKE '%bakery%' THEN 'Tiệm bánh với bánh mì và bánh ngọt tươi hàng ngày.'
        WHEN description ILIKE '%pizzeria%' THEN 'Tiệm pizza với các món pizza truyền thống và hiện đại.'
        ELSE description || ' (Mô tả bằng tiếng Việt)'
      END
    )
  );

UPDATE local_resources 
SET 
  name_translations = jsonb_set(
    name_translations,
    '{vi}',
    to_jsonb(
      CASE 
        WHEN name ILIKE '%center%' THEN REPLACE(name, 'Center', 'Trung tâm')
        WHEN name ILIKE '%house%' THEN REPLACE(name, 'House', 'Ngôi nhà')
        WHEN name ILIKE '%institute%' THEN REPLACE(name, 'Institute', 'Viện')
        WHEN name ILIKE '%project%' THEN REPLACE(name, 'Project', 'Dự án')
        WHEN name ILIKE '%peace%' THEN REPLACE(name, 'Peace', 'Hòa bình')
        WHEN name ILIKE '%nature%' THEN REPLACE(name, 'Nature', 'Thiên nhiên')
        WHEN name ILIKE '%farming%' THEN REPLACE(name, 'Farming', 'Nông nghiệp')
        ELSE name || ' (Tài nguyên cộng đồng)'
      END
    )
  ),
  description_translations = jsonb_set(
    description_translations,
    '{vi}',
    to_jsonb(
      CASE 
        WHEN description ILIKE '%community%' AND description ILIKE '%housing%' THEN 'Tổ chức cộng đồng cung cấp nhà ở, chương trình thực phẩm và quán cà phê doanh nghiệp xã hội.'
        WHEN description ILIKE '%wildlife%' AND description ILIKE '%sanctuary%' THEN 'Khu bảo tồn động vật hoang dã cung cấp các chương trình môi trường và đường mòn đi bộ.'
        WHEN description ILIKE '%farming%' AND description ILIKE '%urban%' THEN 'Khuyến khích nông nghiệp đô thị, tiếp cận thực phẩm và hội thảo cộng đồng.'
        WHEN description ILIKE '%education%' AND description ILIKE '%tutoring%' THEN 'Chương trình giáo dục làm việc với học sinh để chuẩn bị cho các trường thi, cung cấp gia sư một-một và các lớp học khác.'
        WHEN description ILIKE '%survivors%' AND description ILIKE '%homicide%' THEN 'Tài nguyên ở Boston cho những người sống sót sau nạn nhân giết người.'
        ELSE COALESCE(description, '') || ' (Mô tả bằng tiếng Việt)'
      END
    )
  );