# 📚 Documentation

## 🔥 Critical Issues (Dec 28, 2025)

### 1. Frontend UX - Expired Items
**Статус**: ⚠️ Требует исправления (10-15 мин)

Expired продукты отображаются в списке холодильника, хотя концептуально они уже утилизированы.

**Документация**:
- [`FRONTEND_UX_ROOT_CAUSE.md`](./FRONTEND_UX_ROOT_CAUSE.md) - Диагностика проблемы
- [`FRONTEND_EXPIRED_FIX.md`](./FRONTEND_EXPIRED_FIX.md) - Пошаговое решение

**Решение**: Фильтровать expired items и показывать отдельным блоком

---

### 2. Backend Auth Middleware  
**Статус**: ⏳ Ожидает fix (5-10 мин)

`/api/history/losses` проверяет только Bearer header, игнорирует cookie-based auth.

**Документация**:
- [`QUICK_AUTH_FIX.md`](./QUICK_AUTH_FIX.md) - Быстрый fix (5 мин)
- [`BACKEND_AUTH_FIX.md`](./BACKEND_AUTH_FIX.md) - Детальный гайд
- [`AUTH_ARCHITECTURE_STATUS.md`](./AUTH_ARCHITECTURE_STATUS.md) - Статус архитектуры

**Решение**: Унифицировать auth middleware (cookie + Bearer support)

---

## 🎉 Completed Features

### Loss History (Dec 28, 2025)
**Статус**: Frontend ✅ готов | Backend ⏳ требует auth fix

**Документация**:
- [`FRONTEND_COMPLETE.md`](./FRONTEND_COMPLETE.md) - Что сделано frontend
- [`LOSS_HISTORY_SUMMARY.md`](./LOSS_HISTORY_SUMMARY.md) - Краткая сводка
- [`LOSSES_INTEGRATION.md`](./LOSSES_INTEGRATION.md) - Интеграция

---

## Structure

### `/active` - Aktualna dokumentacja
Aktywnie używane dokumenty referencyjne:
- `API_ENDPOINTS.md` - Dokumentacja API endpoints
- `API_UNION_TYPE_FIX.md` - Fix dla union types w API
- `MODAL_USAGE.md` - Jak używać modali w projekcie
- `SONNER_QUICK_REFERENCE.md` - Quick reference dla notyfikacji
- `TREASURY_INTEGRATION.md` - Integracja systemu treasury
- `USER_ACTION_MODAL.md` - Modal dla akcji użytkownika
- `WELCOME_BONUS.md` - System powitalnego bonusu

### `/archive` - Archiwum
Historyczne dokumenty fix'ów i migracji - zachowane dla kontekstu, ale nie aktywne:
- Fix documentation (AUTH_*, FRIDGE_*, RECIPE_*)
- Migration reports (AI_UX_MIGRATION_REPORT.md)
- Diagnostic checklists
- Integration manuals

## Główne dokumenty w root
- `README.md` - Główny README projektu
- `clean-restart.sh` - Script do czyszczenia projektu

---

📝 Dokumentacja jest regularnie czyszczona - stare fix'y i checklisty trafiają do `/archive`
