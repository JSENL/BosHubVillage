-- Add sample translations to existing events for testing
UPDATE events 
SET 
  title_translations = jsonb_build_object(
    'es', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribeño de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Día de Playa de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poesía de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Noches de Jazz y Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Música en la Plaza de Mattapan'
      ELSE title
    END,
    'fr', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribéen de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Journée de Plage de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poésie de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Nuits Jazz et Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Musique sur la Place de Mattapan'
      ELSE title
    END,
    'zh', CASE 
      WHEN title LIKE '%Caribbean%' THEN '多切斯特加勒比海节'
      WHEN title LIKE '%Beach Day%' THEN '多切斯特海滩日'
      WHEN title LIKE '%Poetry%' THEN '罗克斯伯里诗歌比赛'
      WHEN title LIKE '%Jazz%' THEN '罗克斯伯里爵士和灵魂夏夜'
      WHEN title LIKE '%Music on%' THEN '马塔潘广场音乐'
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
      ELSE description
    END,
    'fr', CASE 
      WHEN description LIKE '%Caribbean%' THEN 'Célébration de la culture caribéenne avec musique, danse, nourriture et vendeurs.'
      WHEN description LIKE '%Beach%' THEN 'Activités de plage, jeux et plaisir communautaire pour tous les âges.'
      WHEN description LIKE '%poetry%' THEN 'Slam de poésie parlée mettant en vedette les talents locaux.'
      WHEN description LIKE '%jazz%' THEN 'Une soirée de jazz et de soul en direct avec des artistes locaux.'
      WHEN description LIKE '%music%' THEN 'Soirée de musique live avec des groupes locaux et des vendeurs de nourriture.'
      ELSE description
    END,
    'zh', CASE 
      WHEN description LIKE '%Caribbean%' THEN '庆祝加勒比海文化，包括音乐、舞蹈、美食和摊贩。'
      WHEN description LIKE '%Beach%' THEN '海滩活动、游戏和适合所有年龄的社区娱乐。'
      WHEN description LIKE '%poetry%' THEN '展示本地才华的口语诗歌比赛。'
      WHEN description LIKE '%jazz%' THEN '本地艺术家现场爵士和灵魂音乐之夜。'
      WHEN description LIKE '%music%' THEN '本地乐队和美食摊贩的现场音乐之夜。'
      ELSE description
    END
  ),
  location_translations = jsonb_build_object(
    'es', CASE 
      WHEN location LIKE '%Franklin Park%' THEN 'Franklin Park Playstead'
      WHEN location LIKE '%Malibu%' THEN 'Playa Malibu'
      WHEN location LIKE '%Hibernian%' THEN 'Hibernian Hall'
      WHEN location LIKE '%Heritage%' THEN 'Parque Estatal Heritage de Roxbury'
      WHEN location LIKE '%Square%' THEN 'Plaza Mattapan'
      ELSE location
    END,
    'fr', CASE 
      WHEN location LIKE '%Franklin Park%' THEN 'Franklin Park Playstead'
      WHEN location LIKE '%Malibu%' THEN 'Plage Malibu'
      WHEN location LIKE '%Hibernian%' THEN 'Hibernian Hall'
      WHEN location LIKE '%Heritage%' THEN 'Parc d''État Heritage de Roxbury'
      WHEN location LIKE '%Square%' THEN 'Place Mattapan'
      ELSE location
    END,
    'zh', CASE 
      WHEN location LIKE '%Franklin Park%' THEN '富兰克林公园游乐场'
      WHEN location LIKE '%Malibu%' THEN '马里布海滩'
      WHEN location LIKE '%Hibernian%' THEN '爱尔兰大厅'
      WHEN location LIKE '%Heritage%' THEN '罗克斯伯里遗产州立公园'
      WHEN location LIKE '%Square%' THEN '马塔潘广场'
      ELSE location
    END
  ),
  category_translations = jsonb_build_object(
    'es', CASE 
      WHEN category LIKE '%Cultural%' THEN 'Festival Cultural'
      WHEN category LIKE '%Family%' THEN 'Familiar / Al aire libre'
      WHEN category LIKE '%Arts%' THEN 'Artes / Palabra hablada'
      WHEN category LIKE '%Music%' AND category LIKE '%Cultural%' THEN 'Música / Cultural'
      WHEN category LIKE '%Music%' AND category LIKE '%Community%' THEN 'Música / Comunidad'
      ELSE category
    END,
    'fr', CASE 
      WHEN category LIKE '%Cultural%' THEN 'Festival Culturel'
      WHEN category LIKE '%Family%' THEN 'Famille / Extérieur'
      WHEN category LIKE '%Arts%' THEN 'Arts / Parole'
      WHEN category LIKE '%Music%' AND category LIKE '%Cultural%' THEN 'Musique / Culturel'
      WHEN category LIKE '%Music%' AND category LIKE '%Community%' THEN 'Musique / Communauté'
      ELSE category
    END,
    'zh', CASE 
      WHEN category LIKE '%Cultural%' THEN '文化节'
      WHEN category LIKE '%Family%' THEN '家庭 / 户外'
      WHEN category LIKE '%Arts%' THEN '艺术 / 口语'
      WHEN category LIKE '%Music%' AND category LIKE '%Cultural%' THEN '音乐 / 文化'
      WHEN category LIKE '%Music%' AND category LIKE '%Community%' THEN '音乐 / 社区'
      ELSE category
    END
  );