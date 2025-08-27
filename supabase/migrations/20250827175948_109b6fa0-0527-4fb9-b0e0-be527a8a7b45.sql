-- Add Portuguese, Italian, and Arabic translations for all news
UPDATE news 
SET 
  title_translations = jsonb_set(
    jsonb_set(
      jsonb_set(title_translations, '{pt}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"3 pessoas baleadas em Dorchester; sem prisões"'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"9 pessoas feridas após colapso de terraço em casa em Dorchester"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"3 persone ferite a colpi di arma da fuoco a Dorchester; nessun arresto"'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"9 persone ferite dopo il crollo di una terrazza in una casa a Dorchester"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN title = '3 people shot in Dorchester; no arrests' THEN '"إطلاق نار على 3 أشخاص في دورتشيستر؛ لا اعتقالات"'::jsonb
        WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"إصابة 9 أشخاص بعد انهيار شرفة في منزل بدورتشيستر"'::jsonb
        ELSE ('"' || title || '"')::jsonb
      END
  ),
  content_translations = jsonb_set(
    jsonb_set(
      jsonb_set(content_translations, '{pt}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"Três pessoas foram levadas ao hospital na noite de domingo após serem baleadas em um bairro de Boston perto da linha Dorchester/Roxbury. A polícia de Boston disse que os oficiais responderam por volta das 21h25 a um relatório de pessoa baleada na área da 81 Wayland Street em Dorchester..."'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"Nove pessoas ficaram feridas depois que uma varanda desabou em uma casa no bairro de Dorchester, em Boston, na noite de sexta-feira, confirmou o corpo de bombeiros da cidade. A varanda desabou durante uma grande reunião em uma casa na Harwood Street pouco antes das 22h..."'::jsonb
          ELSE ('"' || left(content, 200) || '..."')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"Tre persone sono state portate in ospedale domenica sera dopo essere state colpite da armi da fuoco in un quartiere di Boston vicino al confine Dorchester/Roxbury. La polizia di Boston dice che gli agenti hanno risposto intorno alle 21:25 a un rapporto di persona ferita da arma da fuoco nell''area di 81 Wayland Street a Dorchester..."'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"Nove persone sono rimaste ferite dopo che una terrazza è crollata in una casa nel quartiere Dorchester di Boston venerdì sera, ha confermato il dipartimento dei vigili del fuoco della città. La terrazza è crollata durante un grande raduno in una casa su Harwood Street poco prima delle 22:00..."'::jsonb
          ELSE ('"' || left(content, 200) || '..."')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN title = '3 people shot in Dorchester; no arrests' THEN '"تم نقل ثلاثة أشخاص إلى المستشفى مساء الأحد بعد إطلاق النار عليهم في حي بوسطن بالقرب من خط دورتشيستر/روكسبري. تقول شرطة بوسطن إن الضباط استجابوا حوالي الساعة 9:25 مساءً لتقرير عن شخص أصيب بطلق ناري في منطقة 81 شارع وايلاند في دورتشيستر..."'::jsonb
        WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"أصيب تسعة أشخاص بعد انهيار شرفة في منزل في حي دورتشيستر ببوسطن ليلة الجمعة، أكدت إدارة الإطفاء في المدينة. انهارت الشرفة أثناء تجمع كبير في منزل في شارع هاروود قبل الساعة 10 مساءً بقليل..."'::jsonb
        ELSE ('"' || left(content, 200) || '..."')::jsonb
      END
  ),
  location_translations = jsonb_set(
    jsonb_set(
      jsonb_set(location_translations, '{pt}', ('"' || location || '"')::jsonb),
      '{it}', ('"' || location || '"')::jsonb
    ),
    '{ar}', ('"' || location || '"')::jsonb
  );