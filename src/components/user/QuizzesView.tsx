import { useState, useEffect } from 'react';
import { FileQuestion, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getQuizzes, addResult } from '@/lib/storage';
import { Quiz, QuizResult, User } from '@/types';
import { toast } from 'sonner';

interface QuizzesViewProps {
  user: User;
}

const QuizzesView = ({ user }: QuizzesViewProps) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  const quizzes = getQuizzes();

  useEffect(() => {
    if (selectedQuiz && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedQuiz, timeLeft, isFinished]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.duration * 60);
    setIsFinished(false);
    setResult(null);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < selectedQuiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;

    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === selectedQuiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const quizResult: QuizResult = {
      id: Date.now().toString(),
      userId: user.id,
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      score,
      totalQuestions: selectedQuiz.questions.length,
      completedAt: new Date().toISOString(),
      answers,
    };

    addResult(quizResult);
    setResult(quizResult);
    setIsFinished(true);
    
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    toast.success(`Quiz terminé ! Score: ${percentage}%`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Results View
  if (isFinished && result && selectedQuiz) {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux quiz
        </Button>

        <Card className="card-shadow">
          <CardHeader className={passed ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}>
            <div className="flex items-center gap-3">
              {passed ? (
                <CheckCircle className="w-12 h-12" />
              ) : (
                <XCircle className="w-12 h-12" />
              )}
              <div>
                <CardTitle className="text-2xl">
                  {passed ? 'Félicitations !' : 'Quiz Terminé'}
                </CardTitle>
                <CardDescription className="text-white/90">
                  {selectedQuiz.title}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div>
                <div className="text-6xl font-bold mb-2">{percentage}%</div>
                <div className="text-xl text-muted-foreground">
                  {result.score} / {result.totalQuestions} réponses correctes
                </div>
              </div>
              <Progress value={percentage} className="h-4" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Détail des réponses</h3>
              {selectedQuiz.questions.map((question, index) => {
                const userAnswer = result.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card key={index} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        Question {index + 1}
                      </CardTitle>
                      <CardDescription>{question.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = optIndex === question.correctAnswer;
                          
                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectAnswer ? 'bg-green-50 border-green-500' :
                                isUserAnswer ? 'bg-red-50 border-red-500' :
                                'bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                                <span>{option}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Taking View
  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Abandonner
          </Button>
          
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5 text-primary" />
            <span className={timeLeft < 60 ? 'text-red-600 animate-pulse' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>Question {currentQuestion + 1} / {selectedQuiz.questions.length}</CardTitle>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
              
              <RadioGroup
                value={answers[currentQuestion]?.toString() || ''}
                onValueChange={(value) => handleAnswer(parseInt(value))}
              >
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 smooth-transition">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Précédent
              </Button>

              {currentQuestion === selectedQuiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="fire-gradient"
                  disabled={answers.some(a => a === -1)}
                >
                  Soumettre
                </Button>
              ) : (
                <Button onClick={handleNext} className="fire-gradient">
                  Suivant
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz List View
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Quiz Disponibles</h1>
        <p className="text-muted-foreground">
          Testez vos connaissances avec nos évaluations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz, index) => (
          <Card 
            key={quiz.id}
            className="card-shadow smooth-transition hover:scale-105 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full fire-gradient flex items-center justify-center mb-4">
                <FileQuestion className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-muted-foreground" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{quiz.duration} min</span>
                </div>
              </div>
              
              <Button className="w-full fire-gradient" onClick={() => startQuiz(quiz)}>
                Démarrer le Quiz
              </Button>
            </CardContent>
          </Card>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileQuestion className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun quiz disponible</h3>
            <p className="text-muted-foreground">
              Les quiz seront bientôt disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesView;
