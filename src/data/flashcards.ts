export interface Flashcard {
  id: string;
  english: string;
  spanish: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exampleSentence?: string;
  pronunciation?: string;
}

export const flashcards: Flashcard[] = [
  {
    id: 'greeting-1',
    english: 'Hello',
    spanish: 'Hola',
    category: 'greetings',
    difficulty: 'beginner',
    exampleSentence: 'Hola, ¿cómo estás?'
  },
  {
    id: 'greeting-2',
    english: 'Goodbye',
    spanish: 'Adiós',
    category: 'greetings',
    difficulty: 'beginner',
    exampleSentence: 'Adiós, ¡que tengas un buen día!'
  },
  {
    id: 'greeting-3',
    english: 'Good morning',
    spanish: 'Buenos días',
    category: 'greetings',
    difficulty: 'beginner',
    exampleSentence: 'Buenos días, ¿cómo amaneciste?'
  },
  {
    id: 'food-1',
    english: 'Water',
    spanish: 'Agua',
    category: 'food',
    difficulty: 'beginner',
    exampleSentence: 'Quiero un vaso de agua, por favor.'
  },
  {
    id: 'food-2',
    english: 'Bread',
    spanish: 'Pan',
    category: 'food',
    difficulty: 'beginner',
    exampleSentence: 'El pan está muy fresco.'
  },
  {
    id: 'food-3',
    english: 'Apple',
    spanish: 'Manzana',
    category: 'food',
    difficulty: 'beginner',
    exampleSentence: 'Me gusta comer una manzana cada día.'
  },
  {
    id: 'number-1',
    english: 'One',
    spanish: 'Uno',
    category: 'numbers',
    difficulty: 'beginner',
    exampleSentence: 'Tengo uno hermano.'
  },
  {
    id: 'number-2',
    english: 'Two',
    spanish: 'Dos',
    category: 'numbers',
    difficulty: 'beginner',
    exampleSentence: 'Necesito dos boletos para el cine.'
  },
  {
    id: 'number-3',
    english: 'Three',
    spanish: 'Tres',
    category: 'numbers',
    difficulty: 'beginner',
    exampleSentence: 'Hay tres libros sobre la mesa.'
  },
  {
    id: 'color-1',
    english: 'Red',
    spanish: 'Rojo',
    category: 'colors',
    difficulty: 'beginner',
    exampleSentence: 'El coche es rojo.'
  },
  {
    id: 'color-2',
    english: 'Blue',
    spanish: 'Azul',
    category: 'colors',
    difficulty: 'beginner',
    exampleSentence: 'El cielo es azul.'
  },
  {
    id: 'color-3',
    english: 'Green',
    spanish: 'Verde',
    category: 'colors',
    difficulty: 'beginner',
    exampleSentence: 'La hierba es verde.'
  },
  {
    id: 'animal-1',
    english: 'Dog',
    spanish: 'Perro',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'Mi perro es muy amigable.'
  },
  {
    id: 'animal-2',
    english: 'Cat',
    spanish: 'Gato',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El gato está durmiendo en el sofá.'
  },
  {
    id: 'animal-3',
    english: 'Bird',
    spanish: 'Pájaro',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El pájaro canta en la mañana.'
  },
  {
    id: 'animal-4',
    english: 'Horse',
    spanish: 'Caballo',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El caballo corre muy rápido.'
  },
  {
    id: 'animal-5',
    english: 'Cow',
    spanish: 'Vaca',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La vaca da leche fresca.'
  },
  {
    id: 'animal-6',
    english: 'Pig',
    spanish: 'Cerdo',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El cerdo está en la granja.'
  },
  {
    id: 'animal-7',
    english: 'Sheep',
    spanish: 'Oveja',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La oveja tiene lana suave.'
  },
  {
    id: 'animal-8',
    english: 'Chicken',
    spanish: 'Pollo',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El pollo come maíz.'
  },
  {
    id: 'animal-9',
    english: 'Fish',
    spanish: 'Pez',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El pez nada en el agua.'
  },
  {
    id: 'animal-10',
    english: 'Mouse',
    spanish: 'Ratón',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El ratón es pequeño.'
  },
  {
    id: 'animal-11',
    english: 'Rabbit',
    spanish: 'Conejo',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El conejo salta muy alto.'
  },
  {
    id: 'animal-12',
    english: 'Elephant',
    spanish: 'Elefante',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El elefante tiene una trompa larga.'
  },
  {
    id: 'animal-13',
    english: 'Lion',
    spanish: 'León',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El león es el rey de la selva.'
  },
  {
    id: 'animal-14',
    english: 'Tiger',
    spanish: 'Tigre',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El tigre tiene rayas.'
  },
  {
    id: 'animal-15',
    english: 'Bear',
    spanish: 'Oso',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El oso come miel.'
  },
  {
    id: 'animal-16',
    english: 'Monkey',
    spanish: 'Mono',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El mono come plátanos.'
  },
  {
    id: 'animal-17',
    english: 'Giraffe',
    spanish: 'Jirafa',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La jirafa tiene un cuello largo.'
  },
  {
    id: 'animal-18',
    english: 'Zebra',
    spanish: 'Cebra',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La cebra tiene rayas blancas y negras.'
  },
  {
    id: 'animal-19',
    english: 'Snake',
    spanish: 'Serpiente',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La serpiente se arrastra por el suelo.'
  },
  {
    id: 'animal-20',
    english: 'Frog',
    spanish: 'Rana',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La rana salta en el estanque.'
  },
  {
    id: 'animal-21',
    english: 'Turtle',
    spanish: 'Tortuga',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La tortuga camina despacio.'
  },
  {
    id: 'animal-22',
    english: 'Butterfly',
    spanish: 'Mariposa',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La mariposa tiene alas coloridas.'
  },
  {
    id: 'animal-23',
    english: 'Bee',
    spanish: 'Abeja',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La abeja hace miel.'
  },
  {
    id: 'animal-24',
    english: 'Spider',
    spanish: 'Araña',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'La araña teje una telaraña.'
  },
  {
    id: 'animal-25',
    english: 'Wolf',
    spanish: 'Lobo',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El lobo aúlla a la luna.'
  },
  {
    id: 'animal-26',
    english: 'Fox',
    spanish: 'Zorro',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El zorro es muy astuto.'
  },
  {
    id: 'animal-27',
    english: 'Deer',
    spanish: 'Ciervo',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El ciervo tiene astas grandes.'
  },
  {
    id: 'animal-28',
    english: 'Duck',
    spanish: 'Pato',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El pato nada en el lago.'
  },
  {
    id: 'animal-29',
    english: 'Penguin',
    spanish: 'Pingüino',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El pingüino vive en la Antártida.'
  },
  {
    id: 'animal-30',
    english: 'Dolphin',
    spanish: 'Delfín',
    category: 'animals',
    difficulty: 'beginner',
    exampleSentence: 'El delfín es muy inteligente.'
  },
  {
    id: 'family-1',
    english: 'Mother',
    spanish: 'Madre',
    category: 'family',
    difficulty: 'beginner',
    exampleSentence: 'Mi madre es muy cariñosa.'
  },
  {
    id: 'family-2',
    english: 'Father',
    spanish: 'Padre',
    category: 'family',
    difficulty: 'beginner',
    exampleSentence: 'Mi padre trabaja mucho.'
  },
  {
    id: 'family-3',
    english: 'Sister',
    spanish: 'Hermana',
    category: 'family',
    difficulty: 'beginner',
    exampleSentence: 'Mi hermana es muy divertida.'
  },
  {
    id: 'time-1',
    english: 'Minute',
    spanish: 'Minuto',
    category: 'time',
    difficulty: 'beginner',
    exampleSentence: 'Espera un minuto, por favor.'
  },
  {
    id: 'time-2',
    english: 'Hour',
    spanish: 'Hora',
    category: 'time',
    difficulty: 'beginner',
    exampleSentence: 'La clase dura una hora.'
  },
  {
    id: 'time-3',
    english: 'Day',
    spanish: 'Día',
    category: 'time',
    difficulty: 'beginner',
    exampleSentence: 'Hoy es un buen día.'
  },
  {
    id: 'weather-1',
    english: 'Sun',
    spanish: 'Sol',
    category: 'weather',
    difficulty: 'beginner',
    exampleSentence: 'El sol brilla hoy.'
  },
  {
    id: 'weather-2',
    english: 'Rain',
    spanish: 'Lluvia',
    category: 'weather',
    difficulty: 'beginner',
    exampleSentence: 'La lluvia cae suavemente.'
  },
  {
    id: 'weather-3',
    english: 'Wind',
    spanish: 'Viento',
    category: 'weather',
    difficulty: 'beginner',
    exampleSentence: 'El viento sopla fuerte.'
  },
  {
    id: 'place-1',
    english: 'House',
    spanish: 'Casa',
    category: 'places',
    difficulty: 'beginner',
    exampleSentence: 'Mi casa es pequeña.'
  },
  {
    id: 'place-2',
    english: 'School',
    spanish: 'Escuela',
    category: 'places',
    difficulty: 'beginner',
    exampleSentence: 'Voy a la escuela todos los días.'
  },
  {
    id: 'place-3',
    english: 'Park',
    spanish: 'Parque',
    category: 'places',
    difficulty: 'beginner',
    exampleSentence: 'Me gusta jugar en el parque.'
  },
  {
    id: 'clothing-1',
    english: 'Shirt',
    spanish: 'Camisa',
    category: 'clothing',
    difficulty: 'beginner',
    exampleSentence: 'Me gusta tu camisa.'
  },
  {
    id: 'clothing-2',
    english: 'Pants',
    spanish: 'Pantalones',
    category: 'clothing',
    difficulty: 'beginner',
    exampleSentence: 'Necesito comprar pantalones nuevos.'
  },
  {
    id: 'clothing-3',
    english: 'Shoes',
    spanish: 'Zapatos',
    category: 'clothing',
    difficulty: 'beginner',
    exampleSentence: 'Mis zapatos son cómodos.'
  },
];

export const categories = [
  {
    id: 'greetings',
    name: 'Greetings',
    icon: '👋',
    color: 'bg-spanish-teal',
    gradient: {
      from: '#20B2AA',
      to: '#8FDFD8'
    }
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    icon: '🍽️',
    color: 'bg-spanish-orange',
    gradient: {
      from: '#FF8C42',
      to: '#FFAC71'
    }
  },
  {
    id: 'numbers',
    name: 'Numbers',
    icon: '🔢',
    color: 'bg-spanish-yellow',
    gradient: {
      from: '#F9C74F',
      to: '#FFEAA0'
    }
  },
  {
    id: 'colors',
    name: 'Colors',
    icon: '🎨',
    color: 'bg-spanish-purple',
    gradient: {
      from: '#7B68EE',
      to: '#A594F9'
    }
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: '🐕',
    color: 'bg-spanish-red',
    gradient: {
      from: '#E63946',
      to: '#FF6F7C'
    }
  },
  {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-green-600',
    gradient: {
      from: '#43AA8B',
      to: '#8ED1BD'
    }
  },
  {
    id: 'time',
    name: 'Time',
    icon: '⏰',
    color: 'bg-blue-600',
    gradient: {
      from: '#4361EE',
      to: '#7DA0FA'
    }
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: '☀️',
    color: 'bg-yellow-500',
    gradient: {
      from: '#FFD166',
      to: '#FFE9AD'
    }
  },
  {
    id: 'places',
    name: 'Places',
    icon: '🏙️',
    color: 'bg-indigo-600',
    gradient: {
      from: '#5E60CE',
      to: '#9D9FE4'
    }
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: '👕',
    color: 'bg-pink-500',
    gradient: {
      from: '#FF5D8F',
      to: '#FF9DB6'
    }
  }
];
