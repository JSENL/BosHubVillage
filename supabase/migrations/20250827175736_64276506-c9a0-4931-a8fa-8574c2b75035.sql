-- Add Portuguese, Italian, and Arabic translations for all businesses
UPDATE business 
SET 
  title_translations = jsonb_set(
    jsonb_set(
      jsonb_set(title_translations, '{pt}', 
        CASE 
          WHEN title = 'The Local Hand' THEN '"A Mão Local"'::jsonb
          WHEN title = 'Antonio''s Pizzeria' THEN '"Pizzaria do Antonio"'::jsonb
          WHEN title = 'Pho Hoa Restaurant' THEN '"Restaurante Pho Hoa"'::jsonb
          WHEN title = 'Googly-Moogly''s' THEN '"Googly-Moogly''s"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN title = 'The Local Hand' THEN '"La Mano Locale"'::jsonb
          WHEN title = 'Antonio''s Pizzeria' THEN '"Pizzeria di Antonio"'::jsonb
          WHEN title = 'Pho Hoa Restaurant' THEN '"Ristorante Pho Hoa"'::jsonb
          WHEN title = 'Googly-Moogly''s' THEN '"Googly-Moogly''s"'::jsonb
          ELSE ('"' || title || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN title = 'The Local Hand' THEN '"اليد المحلية"'::jsonb
        WHEN title = 'Antonio''s Pizzeria' THEN '"بيتزيريا أنطونيو"'::jsonb
        WHEN title = 'Pho Hoa Restaurant' THEN '"مطعم فو هوا"'::jsonb
        WHEN title = 'Googly-Moogly''s' THEN '"جوجلي موجلي"'::jsonb
        ELSE ('"' || title || '"')::jsonb
      END
  ),
  description_translations = jsonb_set(
    jsonb_set(
      jsonb_set(description_translations, '{pt}', 
        CASE 
          WHEN description = 'Local New England store that sells Local Artist arts and crafts. Have classes and other community-inspired events.' THEN '"Loja local da Nova Inglaterra que vende artes e artesanatos de artistas locais. Oferece aulas e outros eventos inspirados na comunidade."'::jsonb
          WHEN description = 'Family-owned pizzeria serving pizza, pasta, and subs.' THEN '"Pizzaria familiar servindo pizza, massas e sanduíches."'::jsonb
          WHEN description = 'Popular Vietnamese restaurant known for its authentic pho and traditional Vietnamese dishes.' THEN '"Popular restaurante vietnamita conhecido por seu pho autêntico e pratos tradicionais vietnamitas."'::jsonb
          ELSE ('"' || description || '"')::jsonb
        END
      ),
      '{it}', 
        CASE 
          WHEN description = 'Local New England store that sells Local Artist arts and crafts. Have classes and other community-inspired events.' THEN '"Negozio locale del New England che vende arti e mestieri di artisti locali. Offre corsi e altri eventi ispirati alla comunità."'::jsonb
          WHEN description = 'Family-owned pizzeria serving pizza, pasta, and subs.' THEN '"Pizzeria a conduzione familiare che serve pizza, pasta e panini."'::jsonb
          WHEN description = 'Popular Vietnamese restaurant known for its authentic pho and traditional Vietnamese dishes.' THEN '"Popolare ristorante vietnamita noto per il suo pho autentico e i piatti tradizionali vietnamiti."'::jsonb
          ELSE ('"' || description || '"')::jsonb
        END
    ),
    '{ar}', 
      CASE 
        WHEN description = 'Local New England store that sells Local Artist arts and crafts. Have classes and other community-inspired events.' THEN '"متجر محلي في نيو إنجلاند يبيع الفنون والحرف اليدوية للفنانين المحليين. يقدم دروساً وفعاليات أخرى مستوحاة من المجتمع."'::jsonb
        WHEN description = 'Family-owned pizzeria serving pizza, pasta, and subs.' THEN '"بيتزيريا عائلية تقدم البيتزا والمعكرونة والساندويتشات."'::jsonb
        WHEN description = 'Popular Vietnamese restaurant known for its authentic pho and traditional Vietnamese dishes.' THEN '"مطعم فيتنامي شهير معروف بفو الأصيل والأطباق الفيتنامية التقليدية."'::jsonb
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