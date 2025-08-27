-- Add Portuguese, Italian, and Arabic translations for all local resources
UPDATE local_resources 
SET 
  name_translations = jsonb_set(
    jsonb_set(
      jsonb_set(name_translations, '{pt}', 
        CASE 
          WHEN name = 'First Teacher' THEN '"Primeiro Professor"'::jsonb
          WHEN name = 'Haley House' THEN '"Casa Haley"'::jsonb
          WHEN name = 'Freedom House' THEN '"Casa da Liberdade"'::jsonb
          WHEN name = 'Urban Farming Institute' THEN '"Instituto de Agricultura Urbana"'::jsonb
          WHEN name = 'Project DEEP' THEN '"Projeto DEEP"'::jsonb
          ELSE ('"' || name || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN name = 'First Teacher' THEN '"Primo Insegnante"'::jsonb
          WHEN name = 'Haley House' THEN '"Casa Haley"'::jsonb
          WHEN name = 'Freedom House' THEN '"Casa della Libertà"'::jsonb
          WHEN name = 'Urban Farming Institute' THEN '"Istituto di Agricoltura Urbana"'::jsonb
          WHEN name = 'Project DEEP' THEN '"Progetto DEEP"'::jsonb
          ELSE ('"' || name || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN name = 'First Teacher' THEN '"المعلم الأول"'::jsonb
        WHEN name = 'Haley House' THEN '"بيت هالي"'::jsonb
        WHEN name = 'Freedom House' THEN '"بيت الحرية"'::jsonb
        WHEN name = 'Urban Farming Institute' THEN '"معهد الزراعة الحضرية"'::jsonb
        WHEN name = 'Project DEEP' THEN '"مشروع ديب"'::jsonb
        ELSE ('"' || name || '"')::jsonb
      END
  ),
  description_translations = jsonb_set(
    jsonb_set(
      jsonb_set(description_translations, '{pt}', 
        CASE 
          WHEN description = 'Be your child''s First Teacher!' THEN '"Seja o Primeiro Professor do seu filho!"'::jsonb
          WHEN description = 'Community organization offering housing, food programs, and a social enterprise café.' THEN '"Organização comunitária oferecendo habitação, programas alimentares e um café de empresa social."'::jsonb
          WHEN description = 'Freedom House has been a beacon of change, championing educational equity and economic opportunities for Black, Brown, and immigrant youth across our communities.' THEN '"A Freedom House tem sido um farol de mudança, defendendo a equidade educacional e oportunidades econômicas para jovens negros, pardos e imigrantes em nossas comunidades."'::jsonb
          WHEN description = 'Promotes urban farming, food access, and community workshops.' THEN '"Promove agricultura urbana, acesso a alimentos e oficinas comunitárias."'::jsonb
          WHEN description = 'Education Program that works with students to prepare for Exam Schools, offers one-on-one tutoring and other classes.' THEN '"Programa educacional que trabalha com estudantes para preparar para escolas de exame, oferece tutoria individualizada e outras aulas."'::jsonb
          ELSE ('"' || description || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN description = 'Be your child''s First Teacher!' THEN '"Sii il Primo Insegnante di tuo figlio!"'::jsonb
          WHEN description = 'Community organization offering housing, food programs, and a social enterprise café.' THEN '"Organizzazione comunitaria che offre alloggi, programmi alimentari e un caffè di impresa sociale."'::jsonb
          WHEN description = 'Freedom House has been a beacon of change, championing educational equity and economic opportunities for Black, Brown, and immigrant youth across our communities.' THEN '"Freedom House è stata un faro di cambiamento, sostenendo l''equità educativa e le opportunità economiche per i giovani neri, ispanici e immigrati nelle nostre comunità."'::jsonb
          WHEN description = 'Promotes urban farming, food access, and community workshops.' THEN '"Promuove l''agricoltura urbana, l''accesso al cibo e workshop comunitari."'::jsonb
          WHEN description = 'Education Program that works with students to prepare for Exam Schools, offers one-on-one tutoring and other classes.' THEN '"Programma educativo che lavora con gli studenti per prepararli alle scuole d''esame, offre tutoraggio individuale e altre lezioni."'::jsonb
          ELSE ('"' || description || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN description = 'Be your child''s First Teacher!' THEN '"كن المعلم الأول لطفلك!"'::jsonb
        WHEN description = 'Community organization offering housing, food programs, and a social enterprise café.' THEN '"منظمة مجتمعية تقدم الإسكان وبرامج الطعام ومقهى مؤسسة اجتماعية."'::jsonb
        WHEN description = 'Freedom House has been a beacon of change, championing educational equity and economic opportunities for Black, Brown, and immigrant youth across our communities.' THEN '"كان بيت الحرية منارة للتغيير، يدافع عن العدالة التعليمية والفرص الاقتصادية للشباب السود والبني والمهاجرين في مجتمعاتنا."'::jsonb
        WHEN description = 'Promotes urban farming, food access, and community workshops.' THEN '"يعزز الزراعة الحضرية والوصول إلى الطعام وورش العمل المجتمعية."'::jsonb
        WHEN description = 'Education Program that works with students to prepare for Exam Schools, offers one-on-one tutoring and other classes.' THEN '"برنامج تعليمي يعمل مع الطلاب للتحضير لمدارس الامتحانات، يقدم دروساً خصوصية فردية وفصول أخرى."'::jsonb
        ELSE ('"' || description || '"')::jsonb
      END
  ),
  address_translations = jsonb_set(
    jsonb_set(
      jsonb_set(address_translations, '{pt}', ('"' || address || '"')::jsonb),
      '{it}', ('"' || address || '"')::jsonb
    ),
    '{ar}', ('"' || address || '"')::jsonb
  );