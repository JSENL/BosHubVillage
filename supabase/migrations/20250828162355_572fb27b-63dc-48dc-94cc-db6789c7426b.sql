-- Update the event description translations for all languages
UPDATE events 
SET description_translations = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(description_translations, '{pt}', '"Hora do conto adequada para famílias na filial Fields Corner da BPL."'::jsonb),
              '{it}', '"Ora della storia per famiglie presso la filiale Fields Corner BPL."'::jsonb
            ),
            '{ar}', '"وقت القصة المناسب للعائلات في فرع مكتبة بوسطن العامة فيلدز كورنر."'::jsonb
          ),
          '{es}', '"Hora del cuento familiar en la sucursal Fields Corner de BPL."'::jsonb
        ),
        '{fr}', '"Heure du conte familiale à la succursale Fields Corner de BPL."'::jsonb
      ),
      '{vi}', '"Giờ kể chuyện thân thiện với gia đình tại chi nhánh Fields Corner BPL."'::jsonb
    ),
    '{zh}', '"在Fields Corner BPL分馆举办的适合家庭的故事时间。"'::jsonb
  ),
  '{kea}', '"Ora di istoria pa familia na filial Fields Corner di BPL."'::jsonb
)
WHERE id = 'bc6baac5-a58f-4c7c-a6ac-34a449b4363c';