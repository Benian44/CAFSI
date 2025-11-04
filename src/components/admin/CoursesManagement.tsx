import { useState } from 'react';
import { Plus, Trash2, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getCourses, addCourse, deleteCourse } from '@/lib/storage';
import { Course } from '@/types';
import { toast } from 'sonner';

const CoursesManagement = () => {
  const [courses, setCourses] = useState(getCourses());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    content: '',
    type: 'text' as 'text' | 'pdf',
  });

  const refreshCourses = () => {
    setCourses(getCourses());
  };

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.content) {
      toast.error('Tous les champs sont requis');
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      createdAt: new Date().toISOString(),
    };

    addCourse(course);
    toast.success(`Cours "${course.title}" créé et diffusé à tous les utilisateurs`);
    setNewCourse({ title: '', description: '', content: '', type: 'text' });
    setIsDialogOpen(false);
    refreshCourses();
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${courseTitle}" ?`)) {
      deleteCourse(courseId);
      toast.success(`Cours "${courseTitle}" supprimé`);
      refreshCourses();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Gestion des Cours</h1>
          <p className="text-muted-foreground">
            Créez et gérez les modules de formation
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fire-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Cours
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Cours</DialogTitle>
              <DialogDescription>
                Le cours sera instantanément disponible pour tous les utilisateurs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">Titre du Cours</Label>
                <Input
                  id="course-title"
                  placeholder="Ex: Les Équipements de Protection Individuelle"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-description">Description</Label>
                <Input
                  id="course-description"
                  placeholder="Courte description du cours"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Type de Contenu</Label>
                <RadioGroup
                  value={newCourse.type}
                  onValueChange={(value) => setNewCourse({ ...newCourse, type: value as 'text' | 'pdf' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="type-text" />
                    <Label htmlFor="type-text">Texte (Markdown)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="type-pdf" />
                    <Label htmlFor="type-pdf">PDF (URL)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-content">
                  {newCourse.type === 'pdf' ? 'URL du PDF' : 'Contenu (Markdown supporté)'}
                </Label>
                <Textarea
                  id="course-content"
                  placeholder={
                    newCourse.type === 'pdf'
                      ? 'https://exemple.com/cours.pdf'
                      : '# Titre\n\n## Sous-titre\n\nVotre contenu ici...'
                  }
                  value={newCourse.content}
                  onChange={(e) => setNewCourse({ ...newCourse, content: e.target.value })}
                  rows={10}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="fire-gradient" onClick={handleCreateCourse}>
                Créer et Diffuser
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Card 
            key={course.id}
            className="card-shadow animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCourse(course.id, course.title)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun cours créé</h3>
            <p className="text-muted-foreground">
              Commencez par créer votre premier cours
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;
