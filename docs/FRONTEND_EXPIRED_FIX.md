# 🔧 Frontend Fix - Исключение expired items из списка холодильника

**Дата**: 28 декабря 2025  
**Проблема**: Просроченные продукты отображаются в списке холодильника и учитываются в статистике  
**Решение**: Фильтровать expired items и показывать их отдельным блоком

---

## 📝 Изменения в `/app/fridge/page.tsx`

### 1. Добавить фильтрацию items (строка ~34)

**После этих строк:**
```tsx
  const [quantitySheetItem, setQuantitySheetItem] = useState<FridgeItem | null>(null);

  useEffect(() => {
```

**Добавить:**
```tsx
  const [quantitySheetItem, setQuantitySheetItem] = useState<FridgeItem | null>(null);

  // 🔥 Фильтрация: разделяем active/critical vs expired
  const activeItems = items.filter(item => item.status !== 'expired');
  const expiredItems = items.filter(item => item.status === 'expired');

  useEffect(() => {
```

---

### 2. Заменить Statistics на activeItems (строка ~267)

**Было:**
```tsx
                {/* 📊 Statistics */}
                {items.length > 0 && <FridgeStats items={items} />}
```

**Стало:**
```tsx
                {/* 📊 Statistics - ТОЛЬКО для active + critical */}
                {activeItems.length > 0 && <FridgeStats items={activeItems} />}
```

---

### 3. Добавить блок просроченных продуктов (после Statistics, строка ~270)

**После:**
```tsx
                {activeItems.length > 0 && <FridgeStats items={activeItems} />}
```

**Добавить:**
```tsx
                {activeItems.length > 0 && <FridgeStats items={activeItems} />}

                {/* 🗑️ Блок просроченных продуктов (отдельно от холодильника) */}
                {expiredItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800/30 rounded-xl shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                            🗑️ Produkty zostały zutylizowane
                          </h3>
                        </div>
                        <p className="text-sm text-red-800 dark:text-red-200">
                          {expiredItems.length} {(() => {
                            const count = expiredItems.length;
                            if (count === 1) return 'produkt';
                            if (count >= 2 && count <= 4) return 'produkty';
                            return 'produktów';
                          })()} • {expiredItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2)} PLN strat
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                          Produkty z przeterminowanym terminem ważności zostały automatycznie usunięte z lodówki
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/losses')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md flex-shrink-0"
                      >
                        Zobacz historię
                      </button>
                    </div>
                  </motion.div>
                )}
```

---

### 4. Заменить AI Actions на activeItems (строка ~271)

**Было:**
```tsx
                {/* ✨ AI Actions */}
                {items.length > 0 && (
```

**Стало:**
```tsx
                {/* ✨ AI Actions - ТОЛЬКО если есть active items */}
                {activeItems.length > 0 && (
```

---

### 5. Заменить FridgeList на activeItems (строка ~310)

**Было:**
```tsx
                {/* 📋 Lista produktów lub empty state */}
                <FridgeList 
                  items={items} 
                  onDelete={handleRemoveItem} 
                  onPriceClick={handlePriceClick}
                  onQuantityClick={handleQuantityClick}
                />
```

**Стало:**
```tsx
                {/* 📋 Lista produktów lub empty state - ТОЛЬКО active + critical */}
                <FridgeList 
                  items={activeItems} 
                  onDelete={handleRemoveItem} 
                  onPriceClick={handlePriceClick}
                  onQuantityClick={handleQuantityClick}
                />
```

---

### 6. Заменить critical items hint на activeItems (строка ~355)

**Было:**
```tsx
                {items.length > 0 && items.some(item => item.status === 'critical' || item.status === 'expired') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/30 rounded-lg flex gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        ⚠️ Produkty wymagające szybkiego użycia
                      </p>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        {(() => {
                          const criticalItems = items.filter(item => item.status === 'critical' || item.status === 'expired');
                          const criticalValue = criticalItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                          if (criticalValue > 0) {
                            return `Produkty za ${criticalValue.toFixed(2)} PLN wkrótce się zepsują. AI może zaproponować, co z nich ugotować.`;
                          }
                          return `Masz ${criticalItems.length} ${criticalItems.length === 1 ? 'produkt' : 'produktów'} do szybkiego użycia.`;
                        })()}
                      </p>
                    </div>
                  </motion.div>
                )}
```

**Стało:**
```tsx
                {/* 💡 Economic hint for critical items - TYLKO critical */}
                {activeItems.some(item => item.status === 'critical') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/30 rounded-lg flex gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        ⚠️ Produkty wymagające szybkiego użycia
                      </p>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        {(() => {
                          const criticalItems = activeItems.filter(item => item.status === 'critical');
                          const criticalValue = criticalItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                          if (criticalValue > 0) {
                            return `Produkty za ${criticalValue.toFixed(2)} PLN wkrótce się zepsują. AI może zaproponować, co z nich ugotować.`;
                          }
                          return `Masz ${criticalItems.length} ${criticalItems.length === 1 ? 'produkt' : 'produktów'} do szybkiego użycia.`;
                        })()}
                      </p>
                    </div>
                  </motion.div>
                )}
```

---

### 7. Заменить final hint на activeItems (строка ~380)

**Было:**
```tsx
                {items.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 rounded-lg flex gap-3">
```

**Стало:**
```tsx
                {activeItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 rounded-lg flex gap-3">
```

---

## ✅ Результат после изменений

### Что изменилось:

1. **Статистика** (`FridgeStats`):
   - ❌ Было: Считает все 12 продуктов (включая expired)
   - ✅ Стало: Считает только active + critical (9 продуктов)

2. **Список продуктов** (`FridgeList`):
   - ❌ Было: Показывает expired карточки с красной меткой "Nie używaj"
   - ✅ Стало: Показывает только active + critical

3. **Новый блок "Zutylizowane"**:
   - ✅ Показывается когда есть expired items
   - ✅ Отображает количество и стоимость потерь
   - ✅ Кнопка "Zobacz historię" → переход к `/losses`

4. **AI Actions**:
   - ❌ Было: Показываются даже если только expired items
   - ✅ Стало: Показываются только если есть active items

---

## 🧪 Проверка

После изменений:

1. Открыть `/fridge`
2. Если есть expired items:
   - ✅ НЕ должны быть в списке холодильника
   - ✅ Должен появиться красный блок "🗑️ Produkty zostały zutylizowane"
   - ✅ Статистика должна считать только active + critical

3. Нажать "Zobacz historię"
   - ✅ Должен открыться `/losses` с детальной историей

---

## 📊 UI изменения

### До ❌
```
┌─ Статистика ─────────────────┐
│ Produkty: 12                  │ ← Включает expired
│ Koszt: 107.81 PLN             │ ← Включает expired
└───────────────────────────────┘

┌─ Список холодильника ────────┐
│ 🥛 Mleko (active)             │
│ 🍞 Chleb (critical)           │
│ 🧀 Ser (expired) ❌ Nie używaj│ ← Плохой UX
└───────────────────────────────┘
```

### После ✅
```
┌─ Статистика ─────────────────┐
│ Produkty: 9                   │ ← Только active + critical
│ Koszt: 89.50 PLN              │ ← Только active + critical
└───────────────────────────────┘

┌─ Zutylizowane ───────────────┐
│ 🗑️ Produkty zostały zutylizowane │
│ 3 produkty • 18.31 PLN strat  │
│ [Zobacz historię]             │ ← Переход к losses
└───────────────────────────────┘

┌─ Список холодильника ────────┐
│ 🥛 Mleko (active)             │
│ 🍞 Chleb (critical)           │
└───────────────────────────────┘ ← Expired items удалены
```

---

**Время выполнения**: 10-15 минут  
**Сложность**: Средняя (много мест замены)  
**Тестирование**: Обязательно проверить все условия
