import { User, Course, Quiz, QuizResult, AppSettings } from '@/types';

// Initial data
const INITIAL_USERS: User[] = [
  { id: 'admin', password: 'admin123', name: 'Admin Principal', role: 'admin' },
  { id: 'asi001', password: '1234', name: 'Jean Dupont', role: 'user' },
  { id: 'asi002', password: '5678', name: 'Marie Curie', role: 'user' },
];

const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction à la Sécurité Incendie',
    description: 'Les bases essentielles de la prévention et lutte contre l\'incendie',
    content: `# Introduction à la Sécurité Incendie

## Les Fondamentaux

La sécurité incendie est un ensemble de mesures destinées à prévenir le déclenchement d'un incendie, à limiter sa propagation et à permettre l'évacuation des occupants en toute sécurité.

## Le Triangle du Feu

Pour qu'un incendie se déclare, trois éléments doivent être réunis :
1. **Combustible** : matière inflammable (bois, papier, essence...)
2. **Comburant** : généralement l'oxygène de l'air
3. **Énergie d'activation** : source de chaleur (flamme, étincelle...)

## Classes de Feu

- **Classe A** : Feux de matériaux solides (bois, papier, tissus)
- **Classe B** : Feux de liquides ou solides liquéfiables (essence, alcool)
- **Classe C** : Feux de gaz (butane, propane)
- **Classe D** : Feux de métaux (magnésium, sodium)
- **Classe F** : Feux d'huiles et graisses de cuisson

## Moyens de Protection

### Extincteurs
- Eau pulvérisée (Classe A)
- Poudre ABC (Classes A, B, C)
- CO2 (Classes B, C)

### Systèmes de Détection
- Détecteurs de fumée
- Détecteurs de chaleur
- Détecteurs de flamme

## Évacuation

En cas d'incendie :
1. Déclencher l'alarme
2. Appeler les secours (18 ou 112)
3. Évacuer calmement
4. Ne jamais utiliser les ascenseurs
5. Se diriger vers les issues de secours`,
    type: 'text',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Utilisation des Extincteurs',
    description: 'Techniques et procédures d\'utilisation des différents types d\'extincteurs',
    content: `# Utilisation des Extincteurs

## Méthode PASS

**P** - Pull (Retirer la goupille)
**A** - Aim (Viser la base des flammes)
**S** - Squeeze (Presser la poignée)
**S** - Sweep (Balayer de gauche à droite)

## Règles de Sécurité

1. **Distance** : Se tenir à 2-3 mètres du foyer
2. **Position** : Dos au vent pour éviter fumées et flammes
3. **Mouvement** : Balayer en zigzag à la base des flammes
4. **Vigilance** : Surveiller toute reprise du feu

## Types d'Extincteurs

### Extincteur à Eau
- **Utilisation** : Classe A (solides)
- **Portée** : 3-4 mètres
- **Durée** : 30-45 secondes

### Extincteur à Poudre
- **Utilisation** : Classes A, B, C
- **Portée** : 4-5 mètres
- **Durée** : 6-10 secondes

### Extincteur CO2
- **Utilisation** : Classes B, C
- **Portée** : 1-2 mètres
- **Durée** : 10-15 secondes

## Vérifications Périodiques

- Contrôle visuel mensuel
- Vérification annuelle obligatoire
- Date de péremption
- État du manomètre`,
    type: 'text',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'QCM - Les Bases de la Sécurité Incendie',
    description: 'Testez vos connaissances sur les fondamentaux',
    duration: 10,
    questions: [
      {
        id: '1',
        question: 'Quels sont les trois éléments du triangle du feu ?',
        options: [
          'Combustible, Comburant, Énergie',
          'Feu, Fumée, Chaleur',
          'Oxygène, Azote, Hydrogène',
          'Eau, Air, Terre'
        ],
        correctAnswer: 0,
      },
      {
        id: '2',
        question: 'Quelle classe de feu concerne les liquides inflammables ?',
        options: ['Classe A', 'Classe B', 'Classe C', 'Classe D'],
        correctAnswer: 1,
      },
      {
        id: '3',
        question: 'Quel numéro composer pour appeler les pompiers en France ?',
        options: ['17', '15', '18', '112'],
        correctAnswer: 2,
      },
      {
        id: '4',
        question: 'Que signifie le "P" dans la méthode PASS ?',
        options: ['Presser', 'Protéger', 'Pull (Retirer)', 'Pointer'],
        correctAnswer: 2,
      },
      {
        id: '5',
        question: 'À quelle distance doit-on se tenir pour utiliser un extincteur ?',
        options: ['1 mètre', '2-3 mètres', '5 mètres', '10 mètres'],
        correctAnswer: 1,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: AppSettings = {
  appName: 'CAFSI MINDSET',
  logoUrl: '',
};

// Storage keys
const STORAGE_KEYS = {
  USERS: 'cafsi_users',
  COURSES: 'cafsi_courses',
  QUIZZES: 'cafsi_quizzes',
  RESULTS: 'cafsi_results',
  SETTINGS: 'cafsi_settings',
  CURRENT_USER: 'cafsi_current_user',
};

// Initialize storage if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
};

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
};

export const deleteUser = (userId: string) => {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
};

// Authentication
export const login = (id: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.id === id && u.password === password);
  if (user) {
    const updatedUser = { ...user, lastLogin: new Date().toISOString() };
    updateUser(user.id, { lastLogin: updatedUser.lastLogin });
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    return updatedUser;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

// Courses
export const getCourses = (): Course[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COURSES);
  return data ? JSON.parse(data) : [];
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
};

export const addCourse = (course: Course) => {
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
};

export const deleteCourse = (courseId: string) => {
  const courses = getCourses().filter(c => c.id !== courseId);
  saveCourses(courses);
};

// Quizzes
export const getQuizzes = (): Quiz[] => {
  const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
  return data ? JSON.parse(data) : [];
};

export const saveQuizzes = (quizzes: Quiz[]) => {
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
};

export const addQuiz = (quiz: Quiz) => {
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  saveQuizzes(quizzes);
};

export const deleteQuiz = (quizId: string) => {
  const quizzes = getQuizzes().filter(q => q.id !== quizId);
  saveQuizzes(quizzes);
};

// Results
export const getResults = (): QuizResult[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
};

export const saveResults = (results: QuizResult[]) => {
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
};

export const addResult = (result: QuizResult) => {
  const results = getResults();
  results.push(result);
  saveResults(results);
};

export const getUserResults = (userId: string): QuizResult[] => {
  return getResults().filter(r => r.userId === userId);
};

// Settings
export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : INITIAL_SETTINGS;
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
