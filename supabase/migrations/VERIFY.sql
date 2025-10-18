-- Quick Verification Script
-- Run this to check what's missing in your database

DO $$
DECLARE
  missing_items TEXT := '';
  warning_items TEXT := '';
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🔍 VERIFICACIÓN DE BASE DE DATOS';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';

  -- Check tables
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
    missing_items := missing_items || '❌ Table: categories' || E'\n';
  ELSE
    RAISE NOTICE '✅ Table: categories';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions') THEN
    missing_items := missing_items || '❌ Table: transactions' || E'\n';
  ELSE
    RAISE NOTICE '✅ Table: transactions';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bank_statements') THEN
    missing_items := missing_items || '❌ Table: bank_statements' || E'\n';
  ELSE
    RAISE NOTICE '✅ Table: bank_statements';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categorization_rules') THEN
    missing_items := missing_items || '❌ Table: categorization_rules' || E'\n';
  ELSE
    RAISE NOTICE '✅ Table: categorization_rules';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'template_categorization_rules') THEN
    missing_items := missing_items || '❌ Table: template_categorization_rules' || E'\n';
  ELSE
    RAISE NOTICE '✅ Table: template_categorization_rules';
  END IF;

  RAISE NOTICE '';

  -- Check columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'currency') THEN
    missing_items := missing_items || '❌ Column: transactions.currency' || E'\n';
  ELSE
    RAISE NOTICE '✅ Column: transactions.currency';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'statement_id') THEN
    missing_items := missing_items || '❌ Column: transactions.statement_id' || E'\n';
  ELSE
    RAISE NOTICE '✅ Column: transactions.statement_id';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_statements' AND column_name = 'format') THEN
    missing_items := missing_items || '❌ Column: bank_statements.format' || E'\n';
  ELSE
    RAISE NOTICE '✅ Column: bank_statements.format';
  END IF;

  RAISE NOTICE '';

  -- Check functions
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'copy_template_rules_to_user') THEN
    missing_items := missing_items || '❌ Function: copy_template_rules_to_user()' || E'\n';
  ELSE
    RAISE NOTICE '✅ Function: copy_template_rules_to_user()';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_template_rules_summary') THEN
    missing_items := missing_items || '❌ Function: get_template_rules_summary()' || E'\n';
  ELSE
    RAISE NOTICE '✅ Function: get_template_rules_summary()';
  END IF;

  RAISE NOTICE '';

  -- Check template rules data
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'template_categorization_rules') THEN
    DECLARE
      template_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO template_count FROM template_categorization_rules;

      IF template_count = 0 THEN
        warning_items := warning_items || '⚠️  Template rules table is empty' || E'\n';
      ELSE
        RAISE NOTICE '✅ Template rules: % loaded', template_count;
      END IF;
    END;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';

  IF missing_items = '' AND warning_items = '' THEN
    RAISE NOTICE '🎉 TODO CORRECTO!';
    RAISE NOTICE '';
    RAISE NOTICE 'Tu base de datos está completamente configurada.';
    RAISE NOTICE 'Puedes usar el onboarding sin problemas.';
  ELSE
    RAISE NOTICE '⚠️  FALTAN ELEMENTOS';
    RAISE NOTICE '';

    IF missing_items != '' THEN
      RAISE NOTICE 'Elementos faltantes:';
      RAISE NOTICE '%', missing_items;
    END IF;

    IF warning_items != '' THEN
      RAISE NOTICE 'Advertencias:';
      RAISE NOTICE '%', warning_items;
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '📝 ACCIÓN REQUERIDA:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Ejecuta: complete_setup.sql';
    RAISE NOTICE '2. Si persiste error en funciones: fix_rpc_functions.sql';
    RAISE NOTICE '3. Reinicia tu app Next.js';
    RAISE NOTICE '';
    RAISE NOTICE 'Ver README_SETUP.md para instrucciones completas.';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;
