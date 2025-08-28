-- Update the specific event with proper translations for Portuguese, Italian, and Arabic
UPDATE events 
SET 
  title_translations = jsonb_set(
    jsonb_set(
      jsonb_set(title_translations, '{pt}', '"Biblioteca Fields Corner: Hora do Conto (Setembro)"'::jsonb),
      '{it}', '"Biblioteca Fields Corner: Ora della Storia (Settembre)"'::jsonb
    ),
    '{ar}', '"مكتبة فيلدز كورنر: وقت القصة (سبتمبر)"'::jsonb
  ),
  description_translations = jsonb_set(
    jsonb_set(
      jsonb_set(description_translations, '{pt}', '"Hora do conto adequada para famílias na filial Fields Corner da BPL."'::jsonb),
      '{it}', '"Ora della storia per famiglie presso la filiale Fields Corner BPL."'::jsonb
    ),
    '{ar}', '"وقت القصة المناسب للعائلات في فرع مكتبة بوسطن العامة فيلدز كورنر."'::jsonb
  ),
  location_translations = jsonb_set(
    jsonb_set(
      jsonb_set(location_translations, '{pt}', '"Biblioteca da Filial Fields Corner"'::jsonb),
      '{it}', '"Biblioteca Filiale Fields Corner"'::jsonb
    ),
    '{ar}', '"مكتبة فرع فيلدز كورنر"'::jsonb
  ),
  category_translations = jsonb_set(
    jsonb_set(
      jsonb_set(category_translations, '{pt}', '"Família/Biblioteca"'::jsonb),
      '{it}', '"Famiglia/Biblioteca"'::jsonb
    ),
    '{ar}', '"عائلة/مكتبة"'::jsonb
  )
WHERE id = 'bc6baac5-a58f-4c7c-a6ac-34a449b4363c';