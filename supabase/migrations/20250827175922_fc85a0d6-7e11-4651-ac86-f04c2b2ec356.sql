-- Add Portuguese, Italian, and Arabic translations for all news articles
UPDATE news 
SET 
  title_translations = jsonb_set(
    jsonb_set(
      jsonb_set(title_translations, '{pt}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"3 pessoas baleadas em Dorchester; nenhuma prisão"'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"9 pessoas feridas após colapso de varanda em casa em Dorchester"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"3 persone ferite a colpi di arma da fuoco a Dorchester; nessun arresto"'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"9 persone ferite dopo il crollo di un balcone in una casa a Dorchester"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN title = '3 people shot in Dorchester; no arrests' THEN '"إصابة 3 أشخاص بإطلاق نار في دورشيستر؛ لا توجد اعتقالات"'::jsonb
        WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"إصابة 9 أشخاص بعد انهيار شرفة في منزل في دورشيستر"'::jsonb
        ELSE ('"' || title || '"')::jsonb
      END
  ),
  content_translations = jsonb_set(
    jsonb_set(
      jsonb_set(content_translations, '{pt}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"Três pessoas foram levadas ao hospital na noite de domingo depois de serem baleadas em um bairro de Boston perto da linha Dorchester/Roxbury. A polícia de Boston disse que os policiais responderam por volta das 21h25 a um relatório de pessoa baleada na área da 81 Wayland Street em Dorchester e chegaram para encontrar duas vítimas do sexo masculino sofrendo de aparentes ferimentos de bala. Ambas as vítimas foram levadas a um hospital local com ferimentos que não se acreditava serem fatais neste momento."'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"Nove pessoas ficaram feridas depois que uma varanda desabou em uma casa no bairro de Dorchester, em Boston, na sexta-feira à noite, confirmou o corpo de bombeiros da cidade. A varanda desabou durante uma grande reunião em uma casa na Harwood Street pouco antes das 22h. Autoridades disseram que a varanda estava no último andar da casa de três andares."'::jsonb
          ELSE ('"' || substring(content, 1, 500) || '..."')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN title = '3 people shot in Dorchester; no arrests' THEN '"Tre persone sono state portate in ospedale domenica sera dopo essere state colpite da colpi di arma da fuoco in un quartiere di Boston vicino al confine Dorchester/Roxbury. La polizia di Boston dice che gli agenti hanno risposto intorno alle 21:25 a una segnalazione di persona ferita da arma da fuoco nell''area di 81 Wayland Street a Dorchester e sono arrivati per trovare due vittime maschili che soffrivano di apparenti ferite da arma da fuoco. Entrambe le vittime sono state portate in un ospedale locale con ferite che al momento non si credeva fossero pericolose per la vita."'::jsonb
          WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"Nove persone sono rimaste ferite dopo che un balcone è crollato in una casa nel quartiere di Dorchester a Boston venerdì sera, ha confermato il dipartimento dei vigili del fuoco della città. Il balcone è crollato durante un grande raduno in una casa su Harwood Street poco prima delle 22:00. I funzionari hanno detto che il balcone era all''ultimo piano della casa a tre piani."'::jsonb
          ELSE ('"' || substring(content, 1, 500) || '..."')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN title = '3 people shot in Dorchester; no arrests' THEN '"تم نقل ثلاثة أشخاص إلى المستشفى ليلة الأحد بعد إطلاق النار عليهم في حي بوسطن بالقرب من خط دورشيستر/روكسبري. تقول شرطة بوسطن إن الضباط استجابوا حوالي الساعة 9:25 مساء لتقرير عن شخص أصيب بطلق ناري في منطقة 81 شارع ويلاند في دورشيستر ووصلوا للعثور على ضحيتين من الذكور يعانيان من جروح واضحة من الرصاص. تم نقل كلا الضحيتين إلى مستشفى محلي مع إصابات لا يُعتقد أنها مهددة للحياة في هذا الوقت."'::jsonb
        WHEN title = '9 people injured after deck collapses at home in Dorchester' THEN '"أصيب تسعة أشخاص بعد انهيار شرفة في منزل في حي دورشيستر في بوسطن ليلة الجمعة، كما أكدت إدارة الإطفاء في المدينة. انهارت الشرفة أثناء تجمع كبير في منزل في شارع هاروود قبل الساعة 10:00 مساء بقليل. قال المسؤولون إن الشرفة كانت في الطابق العلوي من المنزل المكون من ثلاثة طوابق."'::jsonb
        ELSE ('"' || substring(content, 1, 500) || '..."')::jsonb
      END
  ),
  location_translations = jsonb_set(
    jsonb_set(
      jsonb_set(location_translations, '{pt}', ('"' || location || '"')::jsonb),
      '{it}', ('"' || location || '"')::jsonb
    ),
    '{ar}', ('"' || location || '"')::jsonb
  );