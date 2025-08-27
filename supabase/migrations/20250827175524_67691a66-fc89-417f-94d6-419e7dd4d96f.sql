-- Add Portuguese, Italian, and Arabic translations for all events
UPDATE events 
SET 
  title_translations = jsonb_set(
    jsonb_set(
      jsonb_set(title_translations, '{pt}', 
        CASE 
          WHEN title = 'JP Historical Society: Summer Walking Tour (Saturday)' THEN '"Sociedade Histórica JP: Tour a Pé de Verão (Sábado)"'::jsonb
          WHEN title = 'Mattapan Community Yoga' THEN '"Yoga Comunitário de Mattapan"'::jsonb
          WHEN title = 'Roxbury Poetry Slam' THEN '"Slam de Poesia de Roxbury"'::jsonb
          WHEN title = 'Dorchester Beach Day' THEN '"Dia da Praia de Dorchester"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN title = 'JP Historical Society: Summer Walking Tour (Saturday)' THEN '"Società Storica JP: Tour a Piedi Estivo (Sabato)"'::jsonb
          WHEN title = 'Mattapan Community Yoga' THEN '"Yoga Comunitario di Mattapan"'::jsonb
          WHEN title = 'Roxbury Poetry Slam' THEN '"Slam di Poesia di Roxbury"'::jsonb
          WHEN title = 'Dorchester Beach Day' THEN '"Giornata della Spiaggia di Dorchester"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN title = 'JP Historical Society: Summer Walking Tour (Saturday)' THEN '"جمعية JP التاريخية: جولة مشي صيفية (السبت)"'::jsonb
        WHEN title = 'Mattapan Community Yoga' THEN '"يوغا مجتمع ماتابان"'::jsonb
        WHEN title = 'Roxbury Poetry Slam' THEN '"مسابقة شعر روكسبري"'::jsonb
        WHEN title = 'Dorchester Beach Day' THEN '"يوم شاطئ دورشيستر"'::jsonb
        ELSE ('"' || title || '"')::jsonb
      END
  ),
  description_translations = jsonb_set(
    jsonb_set(
      jsonb_set(description_translations, '{pt}', 
        CASE 
          WHEN description = 'Weekly history walking tour of Jamaica Plain (season runs Jun–Sep).' THEN '"Tour histórico semanal a pé de Jamaica Plain (temporada de junho a setembro)."'::jsonb
          WHEN description = 'Free outdoor yoga for all levels, bring your own mat.' THEN '"Yoga gratuito ao ar livre para todos os níveis, traga seu próprio tapete."'::jsonb
          WHEN description = 'Spoken word poetry slam featuring local talent.' THEN '"Slam de poesia falada apresentando talentos locais."'::jsonb
          WHEN description = 'Beach activities, games, and community fun for all ages.' THEN '"Atividades na praia, jogos e diversão comunitária para todas as idades."'::jsonb
          ELSE ('"' || description || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN description = 'Weekly history walking tour of Jamaica Plain (season runs Jun–Sep).' THEN '"Tour storico settimanale a piedi di Jamaica Plain (stagione da giugno a settembre)."'::jsonb
          WHEN description = 'Free outdoor yoga for all levels, bring your own mat.' THEN '"Yoga gratuito all''aperto per tutti i livelli, porta il tuo tappetino."'::jsonb
          WHEN description = 'Spoken word poetry slam featuring local talent.' THEN '"Slam di poesia parlata con talenti locali."'::jsonb
          WHEN description = 'Beach activities, games, and community fun for all ages.' THEN '"Attività sulla spiaggia, giochi e divertimento comunitario per tutte le età."'::jsonb
          ELSE ('"' || description || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN description = 'Weekly history walking tour of Jamaica Plain (season runs Jun–Sep).' THEN '"جولة تاريخية أسبوعية مشياً في جامايكا بلين (الموسم من يونيو إلى سبتمبر)."'::jsonb
        WHEN description = 'Free outdoor yoga for all levels, bring your own mat.' THEN '"يوغا مجانية في الهواء الطلق لجميع المستويات، أحضر حصيرتك الخاصة."'::jsonb
        WHEN description = 'Spoken word poetry slam featuring local talent.' THEN '"مسابقة شعر منطوق تضم مواهب محلية."'::jsonb
        WHEN description = 'Beach activities, games, and community fun for all ages.' THEN '"أنشطة الشاطئ والألعاب والمرح المجتمعي لجميع الأعمار."'::jsonb
        ELSE ('"' || description || '"')::jsonb
      END
  );