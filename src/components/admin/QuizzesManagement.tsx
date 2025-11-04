import { useState } from 'react';
import { Plus, Trash2, FileQuestion, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getQuizzes, addQuiz, deleteQuiz } from '@/lib/storage';
import { Quiz, QuizQuestion } from '@/types';
import { toast } from 'sonner';

const QuizzesManagement = () => {
  const [quizzes, setQuizzes] = useState(getQuizzes());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    duration: 10,
    questions: [] as QuizQuestion[],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const refreshQuizzes = () => {
    setQuizzes(getQuizzes());
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(o => !o)) {
      toast.error('Tous les champs de la question doivent être remplis');
      return;
    }

    const question: QuizQuestion = {
      id: Date.now().toString(),
      ...currentQuestion,
    };

    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, question],
    });

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });

    toast.success('Question ajoutée');
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.description) {
      toast.error('Titre et description sont requis');
      return;
    }

    if (newQuiz.questions.length === 0) {
      toast.error('Ajoutez au moins une question');
      return;
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      ...newQuiz,
      createdAt: new Date().toISOString(),
    };

    addQuiz(quiz);
    toast.success(`Quiz "${quiz.title}" créé et disponible pour tous`);
    setNewQuiz({ title: '', description: '', duration: 10, questions: [] });
    setIsDialogOpen(false);
    refreshQuizzes();
  };

  const handleDeleteQuiz = (quizId: string, quizTitle: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le quiz "${quizTitle}" ?`)) {
      deleteQuiz(quizId);
      toast.success(`Quiz "${quizTitle}" supprimé`);
      refreshQuizzes();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Gestion des Quiz</h1>
          <p className="text-muted-foreground">
            Créez et gérez les évaluations QCM
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fire-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Créer un Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Quiz</DialogTitle>
              <DialogDescription>
                Créez un QCM chronométré pour vos utilisateurs
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Quiz Info */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Informations du Quiz</h3>
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Titre</Label>
                  <Input
                    id="quiz-title"
                    placeholder="QCM - Les Fondamentaux"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-description">Description</Label>
                  <Input
                    id="quiz-description"
                    placeholder="Testez vos connaissances..."
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-duration">Durée (minutes)</Label>
                  <Input
                    id="quiz-duration"
                    type="number"
                    min="1"
                    value={newQuiz.duration}
                    onChange={(e) => setNewQuiz({ ...newQuiz, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Add Question Form */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold">Ajouter une Question</h3>
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="Quelle est la réponse correcte ?"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Options de Réponse</Label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                      />
                      <Button
                        type="button"
                        variant={currentQuestion.correctAnswer === index ? 'default' : 'outline'}
                        onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                      >
                        {currentQuestion.correctAnswer === index ? '✓ Correct' : 'Correct ?'}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button onClick={handleAddQuestion} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter cette Question
                </Button>
              </div>

              {/* Questions List */}
              {newQuiz.questions.length > 0 && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Questions ({newQuiz.questions.length})</h3>
                  {newQuiz.questions.map((q, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Question {index + 1}</CardTitle>
                            <CardDescription>{q.question}</CardDescription>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className={optIndex === q.correctAnswer ? 'text-green-600 font-semibold' : ''}>
                              {optIndex === q.correctAnswer && '✓ '}{opt}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="fire-gradient" onClick={handleCreateQuiz}>
                Créer le Quiz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <Card 
            key={quiz.id}
            className="card-shadow animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full fire-gradient flex items-center justify-center mb-4">
                <FileQuestion className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{quiz.questions.length} questions</span>
                <span className="text-muted-foreground">{quiz.duration} min</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileQuestion className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun quiz créé</h3>
            <p className="text-muted-foreground">
              Commencez par créer votre premier quiz
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesManagement;
