import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ChevronLeft, Award, TrendingUp } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function LessonPlayerPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (lessonId) loadLesson();
  }, [lessonId, user]);

  const loadLesson = async () => {
    setLoading(true);
    setLesson(null);
    setQuiz(null);
    setActiveLessonId(null);
    setCompleted(false);
    setShowQuiz(false);
    setQuizAnswers([]);
    setQuizResult(null);

    let resolvedLesson = null as any;

    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*, courses(id, title, categories(name))')
      .eq('id', lessonId)
      .maybeSingle();

    resolvedLesson = lessonData;

    if (!resolvedLesson && lessonId) {
      const { data: fallbackLesson } = await supabase
        .from('lessons')
        .select('*, courses(id, title, categories(name))')
        .eq('course_id', lessonId)
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();
      resolvedLesson = fallbackLesson;
    }

    setLesson(resolvedLesson);
    setActiveLessonId(resolvedLesson?.id ?? null);

    if (resolvedLesson?.id) {
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', resolvedLesson.id)
        .eq('is_active', true)
        .maybeSingle();

      setQuiz(quizData);
    } else {
      setQuiz(null);
    }
    
    if (user && resolvedLesson?.id) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', resolvedLesson.id)
        .eq('completed', true)
        .maybeSingle();
      
      if (progress) {
        setCompleted(true);
      }
    }

    setLoading(false);
  };

  const handleCompleteLesson = async () => {
    if (!user || completing || !activeLessonId) return;

    setCompleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('complete-lesson', {
        body: { lessonId: activeLessonId }
      });

      if (error) throw error;

      setCompleted(true);
      
      if (data?.data?.xpAwarded) {
        alert(`Lesson completed! You earned ${data.data.xpAwarded} XP!`);
      }

      await supabase.functions.invoke('check-badges');
    } catch (error: any) {
      console.error('Error completing lesson:', error);
      alert('Failed to complete lesson. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!user || !quiz) return;

    try {
      const { data, error } = await supabase.functions.invoke('submit-quiz', {
        body: { 
          quizId: quiz.id, 
          answers: quizAnswers 
        }
      });

      if (error) throw error;

      setQuizResult(data.data);
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
        <p style={{ color: 'hsl(215, 20%, 45%)' }}>Loading...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
        <div className="rounded-xl shadow-lg p-8 max-w-lg w-full text-center" style={{ backgroundColor: '#ffffff' }}>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'hsl(217, 85%, 31%)' }}>Lesson not found</h1>
          <p className="mb-6" style={{ color: 'hsl(215, 20%, 45%)' }}>We couldn't load this lesson. Try returning to the catalog.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
      {/* Navigation */}
      <nav className="shadow-sm" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid hsl(210, 40%, 96%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/courses" className="font-medium flex items-center gap-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
            <ChevronLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="rounded-xl shadow-lg p-8 mb-6" style={{ backgroundColor: '#ffffff' }}>
          <div className="mb-6">
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'hsl(43, 47%, 50%)' }}>
              {lesson?.courses?.categories?.name}
            </span>
            <h1 className="text-3xl font-bold mt-2" style={{ color: 'hsl(217, 85%, 31%)' }}>{lesson?.title}</h1>
            {completed && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </div>
            )}
          </div>

          {/* Video Player Placeholder */}
          <div className="rounded-lg aspect-video mb-8 flex items-center justify-center" style={{ backgroundColor: 'hsl(217, 85%, 15%)' }}>
            <div className="text-center" style={{ color: '#ffffff' }}>
              <p className="text-lg mb-2">Video Player</p>
              <p className="text-sm" style={{ color: 'hsl(210, 40%, 70%)' }}>Duration: {lesson?.duration_minutes} minutes</p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'hsl(217, 85%, 31%)' }}>Lesson Content</h2>
            <div 
              className="leading-relaxed prose max-w-none"
              style={{ color: 'hsl(215, 20%, 35%)' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson?.content_html || '<p>This lesson covers important concepts in credit repair.</p>') }}
            />
          </div>

          {/* Quiz Section */}
          {quiz && !showQuiz && !quizResult && (
            <div className="pt-8" style={{ borderTop: '1px solid hsl(210, 40%, 92%)' }}>
              <div className="rounded-lg p-6" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>{quiz.title}</h3>
                    <p style={{ color: 'hsl(215, 20%, 45%)' }}>Test your knowledge with a quick quiz</p>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215, 20%, 55%)' }}>Passing score: {quiz.passing_score}%</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowQuiz(true);
                      setQuizAnswers(new Array((quiz.questions_json || []).length).fill(-1));
                    }}
                    className="px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
                    style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Questions */}
          {quiz && showQuiz && !quizResult && (
            <div className="pt-8" style={{ borderTop: '1px solid hsl(210, 40%, 92%)' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'hsl(217, 85%, 31%)' }}>{quiz.title}</h3>
              <div className="space-y-6">
                {(quiz.questions_json || []).map((question: any, qIndex: number) => (
                  <div key={qIndex} className="rounded-lg p-6" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
                    <p className="font-semibold mb-4" style={{ color: 'hsl(217, 85%, 31%)' }}>
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option: string, oIndex: number) => (
                        <label
                          key={oIndex}
                          className="flex items-center p-3 rounded-lg cursor-pointer transition-all"
                          style={{ 
                            backgroundColor: '#ffffff',
                            border: quizAnswers[qIndex] === oIndex ? '2px solid hsl(43, 47%, 60%)' : '2px solid hsl(210, 40%, 90%)'
                          }}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={() => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[qIndex] = oIndex;
                              setQuizAnswers(newAnswers);
                            }}
                            className="mr-3"
                          />
                          <span style={{ color: 'hsl(215, 20%, 35%)' }}>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleQuizSubmit}
                disabled={quizAnswers.some(a => a === -1)}
                className="mt-6 px-6 py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
              >
                Submit Quiz
              </button>
            </div>
          )}

          {/* Quiz Results */}
          {quizResult && (
            <div className="pt-8" style={{ borderTop: '1px solid hsl(210, 40%, 92%)' }}>
              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: quizResult.passed ? 'hsla(43, 47%, 60%, 0.15)' : 'hsla(0, 65%, 45%, 0.1)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>
                      {quizResult.passed ? 'Congratulations!' : 'Try Again'}
                    </h3>
                    <p className="mt-2" style={{ color: 'hsl(215, 20%, 45%)' }}>
                      You scored {quizResult.score}% ({quizResult.correctCount}/{quizResult.totalQuestions} correct)
                    </p>
                    {quizResult.passed && quizResult.xpAwarded > 0 && (
                      <p className="font-semibold mt-1 flex items-center" style={{ color: 'hsl(43, 47%, 45%)' }}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{quizResult.xpAwarded} XP Earned!
                      </p>
                    )}
                  </div>
                  <div className="text-5xl">
                    {quizResult.passed ? '✓' : '✗'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setQuizResult(null);
                    setShowQuiz(false);
                  }}
                  className="px-6 py-2 rounded-lg font-semibold transition-all"
                  style={{ backgroundColor: 'hsl(217, 85%, 31%)', color: '#ffffff' }}
                >
                  {quizResult.passed ? 'Review' : 'Retake Quiz'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ backgroundColor: '#ffffff', border: '2px solid hsl(210, 40%, 85%)', color: 'hsl(217, 85%, 31%)' }}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Catalog
          </button>
          
          {!completed && (
            <button 
              onClick={handleCompleteLesson}
              disabled={completing}
              className="px-6 py-3 rounded-lg font-semibold shadow-md transition-all flex items-center disabled:opacity-50"
              style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {completing ? 'Completing...' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
