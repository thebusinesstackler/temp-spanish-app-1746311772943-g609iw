
import { categories } from '@/data/flashcards';
import { Check } from 'lucide-react';

interface CategorySelectorProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string | null;
  learnedCategories?: string[];
}

const CategorySelector = ({ onSelectCategory, selectedCategory, learnedCategories = [] }: CategorySelectorProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Choose a category:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const isLearned = learnedCategories.includes(category.id);
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`
                px-4 py-3 rounded-lg flex items-center gap-2 transition-all
                ${selectedCategory === category.id
                  ? `${category.color} text-white shadow-md`
                  : 'bg-white border-2 hover:border-gray-300'
                }
                ${isLearned ? 'border-amber-300' : 'border-gray-200'}
              `}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              {isLearned && selectedCategory !== category.id && (
                <Check size={16} className="text-amber-500 ml-auto" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
