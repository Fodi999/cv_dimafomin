'use client';

import { Badge } from '@/components/ui/badge';

type AIRequestType = 'recipe' | 'meal-idea' | 'technique' | 'learning-plan' | 'photo-check';

interface TokenCostBadgeProps {
  type: AIRequestType;
  size?: 'sm' | 'md' | 'lg';
}

const REQUEST_COSTS: Record<AIRequestType, number> = {
  'recipe': 5,
  'meal-idea': 10,
  'technique': 3,
  'learning-plan': 20,
  'photo-check': 50,
};

const REQUEST_LABELS: Record<AIRequestType, string> = {
  'recipe': '🍱 Спроси рецепт',
  'meal-idea': '🍳 Идеи ужина',
  'technique': '🔪 Объясни технику',
  'learning-plan': '🧠 План обучения',
  'photo-check': '📸 Проверка блюда',
};

export function TokenCostBadge({ type, size = 'md' }: TokenCostBadgeProps) {
  const cost = REQUEST_COSTS[type];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      <span className="font-medium">{REQUEST_LABELS[type]}</span>
      <Badge variant="secondary" className="ml-auto">
        💎 {cost} CT
      </Badge>
    </div>
  );
}

export function TokenWarning({ balance, requiredCost }: { balance: number; requiredCost: number }) {
  const shortage = requiredCost - balance;
  
  return (
    <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
      <div className="flex gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h4 className="font-semibold text-orange-900">Недостаточно токенов</h4>
          <p className="text-sm text-orange-700 mt-1">
            У вас есть <strong>{balance} CT</strong>, но нужно <strong>{requiredCost} CT</strong>
          </p>
          <p className="text-sm text-orange-700 mt-2">
            Не хватает <strong>{shortage} CT</strong>
          </p>
          <button className="mt-3 text-sm font-semibold text-orange-900 hover:text-orange-700 underline">
            Купить токены →
          </button>
        </div>
      </div>
    </div>
  );
}

export function AIRequestTypeSelector({
  selected,
  onSelect,
}: {
  selected: AIRequestType | null;
  onSelect: (type: AIRequestType) => void;
}) {
  const types: AIRequestType[] = ['recipe', 'meal-idea', 'technique', 'learning-plan', 'photo-check'];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selected === type
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-xl mb-2">{REQUEST_LABELS[type].split(' ')[0]}</div>
          <div className="text-sm font-medium text-gray-700">
            {REQUEST_LABELS[type].split(' ').slice(1).join(' ')}
          </div>
          <div className="text-xs text-blue-600 mt-2 font-semibold">
            {REQUEST_COSTS[type]} CT
          </div>
        </button>
      ))}
    </div>
  );
}
