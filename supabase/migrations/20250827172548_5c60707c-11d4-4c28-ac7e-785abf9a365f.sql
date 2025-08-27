-- Fix specific translation issues for the JP Historical Society event
-- Update the title translations to have proper fallbacks
UPDATE events 
SET title_translations = jsonb_build_object(
  'es', 'Sociedad Histórica de JP: Tour a Pie de Verano (Sábado)',
  'fr', 'Société Historique de JP : Visite à Pied d''Été (Samedi)',
  'zh', 'JP历史学会：夏季步行游览（周六）',
  'ar', 'جمعية JP التاريخية: جولة مشي صيفية (السبت)',
  'it', 'Società Storica di JP: Tour a Piedi Estivo (Sabato)',
  'pt', 'Sociedade Histórica de JP: Tour a Pé de Verão (Sábado)',
  'vi', 'Hội Lịch Sử JP: Tour Đi Bộ Mùa Hè (Thứ Bảy)',
  'kea', 'Sosiedadi Istoriku di JP: Tour di kaminhada di Veran (Sabadu)'
)
WHERE id = '77619439-2806-4879-978b-57ca5d7394d7';

-- Update the description translations to match the original description
UPDATE events 
SET description_translations = jsonb_build_object(
  'es', 'Tour a pie semanal de historia de Jamaica Plain (temporada de junio a septiembre).',
  'fr', 'Visite à pied hebdomadaire de l''histoire de Jamaica Plain (saison de juin à septembre).',
  'zh', '牙买加平原历史周度步行游览（季节为6月至9月）。',
  'ar', 'جولة مشي أسبوعية لتاريخ جامايكا بلين (الموسم من يونيو إلى سبتمبر).',
  'it', 'Tour a piedi settimanale della storia di Jamaica Plain (stagione da giugno a settembre).',
  'pt', 'Tour a pé semanal da história de Jamaica Plain (temporada de junho a setembro).',
  'vi', 'Tour đi bộ lịch sử hàng tuần của Jamaica Plain (mùa từ tháng 6 đến tháng 9).',
  'kea', 'Tour di kaminhada semanal di istoria di Jamaica Plain (temporada di Junhu-Setembru).'
)
WHERE id = '77619439-2806-4879-978b-57ca5d7394d7';

-- Also update location translations to be more meaningful
UPDATE events 
SET location_translations = jsonb_build_object(
  'es', 'Varios puntos de partida (ver sitio web)',
  'fr', 'Divers points de départ (voir le site)',
  'zh', '各种起点（见网站）',
  'ar', 'نقاط انطلاق مختلفة (انظر الموقع)',
  'it', 'Vari punti di partenza (vedi sito)',
  'pt', 'Vários pontos de partida (ver site)',
  'vi', 'Các điểm khởi hành khác nhau (xem trang web)',
  'kea', 'Pontu di partida diferenti (odja na site)'
)
WHERE id = '77619439-2806-4879-978b-57ca5d7394d7';