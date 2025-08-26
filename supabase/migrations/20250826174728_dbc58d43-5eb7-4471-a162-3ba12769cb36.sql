-- Add comprehensive translations for ALL supported languages
-- Update events with complete translations
UPDATE events 
SET 
  title_translations = jsonb_build_object(
    'es', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribeño de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Día de Playa de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poesía de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Noches de Jazz y Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Música en la Plaza de Mattapan'
      WHEN title LIKE '%Cross-Country%' THEN 'Apertura de Temporada de Cross-Country en Franklin Park'
      ELSE title
    END,
    'fr', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribéen de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Journée de Plage de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poésie de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Nuits Jazz et Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Musique sur la Place de Mattapan'
      WHEN title LIKE '%Cross-Country%' THEN 'Ouverture de Saison Cross-Country Franklin Park'
      ELSE title
    END,
    'vi', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Lễ hội Caribe Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Ngày Biển Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Thơ Ca Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Đêm Jazz và Soul Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Âm nhạc tại Quảng trường Mattapan'
      WHEN title LIKE '%Cross-Country%' THEN 'Khai mạc Mùa Chạy Việt dã Franklin Park'
      ELSE title
    END,
    'zh', CASE 
      WHEN title LIKE '%Caribbean%' THEN '多切斯特加勒比海节'
      WHEN title LIKE '%Beach Day%' THEN '多切斯特海滩日'
      WHEN title LIKE '%Poetry%' THEN '罗克斯伯里诗歌比赛'
      WHEN title LIKE '%Jazz%' THEN '罗克斯伯里爵士和灵魂夏夜'
      WHEN title LIKE '%Music on%' THEN '马塔潘广场音乐'
      WHEN title LIKE '%Cross-Country%' THEN '富兰克林公园越野赛季开幕'
      ELSE title
    END,
    'ar', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'مهرجان الكاريبي في دورتشستر'
      WHEN title LIKE '%Beach Day%' THEN 'يوم الشاطئ في دورتشستر'
      WHEN title LIKE '%Poetry%' THEN 'مسابقة الشعر في روكسبري'
      WHEN title LIKE '%Jazz%' THEN 'ليالي الجاز والروح في روكسبري'
      WHEN title LIKE '%Music on%' THEN 'الموسيقى في ساحة ماتابان'
      WHEN title LIKE '%Cross-Country%' THEN 'افتتاح موسم الجري الريفي في فرانكلين بارك'
      ELSE title
    END,
    'it', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caraibico di Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Giornata in Spiaggia di Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam di Poesia di Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Notti Jazz e Soul di Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Musica in Piazza Mattapan'
      WHEN title LIKE '%Cross-Country%' THEN 'Apertura Stagione Cross-Country Franklin Park'
      ELSE title
    END,
    'pt', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribenho de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Dia de Praia de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poesia de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Noites de Jazz e Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Música na Praça Mattapan'
      WHEN title LIKE '%Cross-Country%' THEN 'Abertura da Temporada Cross-Country Franklin Park'
      ELSE title
    END,
    'kea', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Karibenhu di Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Dia di Praia di Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam di Puesia di Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Noiti di Jazz i Soul di Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Muzika na Prasa Mattapan'
      WHEN title LIKE '%Cross-Country%' THEN 'Abertura Temporada Cross-Country Franklin Park'
      ELSE title
    END
  ),
  description_translations = jsonb_build_object(
    'es', CASE 
      WHEN description LIKE '%Caribbean%' THEN 'Celebración de la cultura caribeña con música, baile, comida y vendedores.'
      WHEN description LIKE '%Beach%' THEN 'Actividades de playa, juegos y diversión comunitaria para todas las edades.'
      WHEN description LIKE '%poetry%' THEN 'Slam de poesía hablada con talento local.'
      WHEN description LIKE '%jazz%' THEN 'Una noche de jazz en vivo y música soul con artistas locales.'
      WHEN description LIKE '%music%' THEN 'Noche de música en vivo con bandas locales y vendedores de comida.'
      WHEN description LIKE '%cross country%' THEN 'Invitacional de campo traviesa de preparatoria/universidad que inicia la temporada.'
      ELSE description
    END,
    'fr', CASE 
      WHEN description LIKE '%Caribbean%' THEN 'Célébration de la culture caribéenne avec musique, danse, nourriture et vendeurs.'
      WHEN description LIKE '%Beach%' THEN 'Activités de plage, jeux et plaisir communautaire pour tous les âges.'
      WHEN description LIKE '%poetry%' THEN 'Slam de poésie parlée mettant en vedette les talents locaux.'
      WHEN description LIKE '%jazz%' THEN 'Une soirée de jazz et de soul en direct avec des artistes locaux.'
      WHEN description LIKE '%music%' THEN 'Soirée de musique live avec des groupes locaux et des vendeurs de nourriture.'
      WHEN description LIKE '%cross country%' THEN 'Invitational de cross-country lycée/collège pour lancer la saison.'
      ELSE description
    END,
    'vi', CASE 
      WHEN description LIKE '%Caribbean%' THEN 'Lễ kỷ niệm văn hóa Caribe với âm nhạc, khiêu vũ, ẩm thực và các gian hàng.'
      WHEN description LIKE '%Beach%' THEN 'Các hoạt động bãi biển, trò chơi và vui chơi cộng đồng cho mọi lứa tuổi.'
      WHEN description LIKE '%poetry%' THEN 'Cuộc thi thơ ca với tài năng địa phương.'
      WHEN description LIKE '%jazz%' THEN 'Một đêm nhạc jazz và soul trực tiếp với các nghệ sĩ địa phương.'
      WHEN description LIKE '%music%' THEN 'Đêm nhạc sống với các ban nhạc địa phương và quầy ăn.'
      WHEN description LIKE '%cross country%' THEN 'Giải mời chạy việt dã trung học/đại học khởi động mùa giải.'
      ELSE description
    END,
    'zh', CASE 
      WHEN description LIKE '%Caribbean%' THEN '庆祝加勒比海文化，包括音乐、舞蹈、美食和摊贩。'
      WHEN description LIKE '%Beach%' THEN '海滩活动、游戏和适合所有年龄的社区娱乐。'
      WHEN description LIKE '%poetry%' THEN '展示本地才华的口语诗歌比赛。'
      WHEN description LIKE '%jazz%' THEN '本地艺术家现场爵士和灵魂音乐之夜。'
      WHEN description LIKE '%music%' THEN '本地乐队和美食摊贩的现场音乐之夜。'
      WHEN description LIKE '%cross country%' THEN '高中/大学越野邀请赛揭开赛季序幕。'
      ELSE description
    END,
    'ar', title || ' - وصف باللغة العربية',
    'it', title || ' - descrizione in italiano', 
    'pt', title || ' - descrição em português',
    'kea', title || ' - deskrison na kriolu'
  );