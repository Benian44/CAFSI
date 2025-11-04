import { useState } from 'react';
import { BookOpen, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourses } from '@/lib/storage';
import { Course } from '@/types';
import ReactMarkdown from 'react-markdown';

const CoursesView = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const courses = getCourses();

  if (selectedCourse) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="outline" onClick={() => setSelectedCourse(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux cours
        </Button>

        <Card className="card-shadow">
          <CardHeader className="fire-gradient text-white">
            <CardTitle className="text-2xl">{selectedCourse.title}</CardTitle>
            <CardDescription className="text-white/90">
              {selectedCourse.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {selectedCourse.type === 'text' ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{selectedCourse.content}</ReactMarkdown>
              </div>
            ) : (
              <iframe
                src={selectedCourse.content}
                className="w-full h-[600px] border rounded-lg"
                title={selectedCourse.title}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Cours Disponibles</h1>
        <p className="text-muted-foreground">
          Accédez à tous les modules de formation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Card 
            key={course.id} 
            className="card-shadow smooth-transition hover:scale-105 cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedCourse(course)}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full fire-gradient flex items-center justify-center mb-4">
                {course.type === 'text' ? (
                  <FileText className="w-6 h-6 text-white" />
                ) : (
                  <BookOpen className="w-6 h-6 text-white" />
                )}
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full fire-gradient">
                <BookOpen className="w-4 h-4 mr-2" />
                Ouvrir le cours
              </Button>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun cours disponible</h3>
            <p className="text-muted-foreground">
              Les cours seront bientôt disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
