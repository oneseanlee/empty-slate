import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';
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

    // Load quiz if available
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
    
    // Check if lesson is already completed
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
      
      // Show success message with XP earned
      if (data?.data?.xpAwarded) {
        alert(`Lesson completed! You earned ${data.data.xpAwarded} XP!`);
      }

      // Check for new badges
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-xl shadow-card p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Lesson not found</h1>
          <p className="text-neutral-600 mb-6">We couldn’t load this lesson. Try returning to the catalog.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-900 transition-all"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/courses" className="text-primary-700 hover:text-primary-900 font-medium">
            Back to Courses
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-card p-8 mb-6">
          <div className="mb-6">
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wide">
              {lesson?.courses?.categories?.name}
            </span>
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">{lesson?.title}</h1>
            {completed && (
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </div>
            )}
          </div>

          {/* Video Player Placeholder */}
          <div className="bg-neutral-900 rounded-lg aspect-video mb-8 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-lg mb-2">Video Player</p>
              <p className="text-sm text-neutral-400">Duration: {lesson?.duration_minutes} minutes</p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Lesson Content</h2>
            <div 
              className="text-neutral-700 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson?.content_html || '<p>This lesson covers important concepts in credit repair.</p>') }}
            />
          </div>

          {/* Quiz Section */}
          {quiz && !showQuiz && !quizResult && (
            <div className="border-t border-neutral-200 pt-8">
              <div className="bg-primary-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{quiz.title}</h3>
                    <p className="text-neutral-700">Test your knowledge with a quick quiz</p>
                    <p className="text-sm text-neutral-600 mt-1">Passing score: {quiz.passing_score}%</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowQuiz(true);
                      setQuizAnswers(new Array((quiz.questions_json || []).length).fill(-1));
                    }}
                    className="px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-900 transition-all shadow-sm"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Questions */}
          {quiz && showQuiz && !quizResult && (
            <div className="border-t border-neutral-200 pt-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">{quiz.title}</h3>
              <div className="space-y-6">
                {(quiz.questions_json || []).map((question: any, qIndex: number) => (
                  <div key={qIndex} className="bg-neutral-50 rounded-lg p-6">
                    <p className="font-semibold text-neutral-900 mb-4">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option: string, oIndex: number) => (
                        <label
                          key={oIndex}
                          className="flex items-center p-3 bg-white rounded-lg border-2 border-neutral-200 cursor-pointer hover:border-primary-500 transition-all"
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
                          <span className="text-neutral-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleQuizSubmit}
                disabled={quizAnswers.some(a => a === -1)}
                className="mt-6 px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </div>
          )}

          {/* Quiz Results */}
          {quizResult && (
            <div className="border-t border-neutral-200 pt-8">
              <div className={`rounded-lg p-6 ${quizResult.passed ? 'bg-success-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {quizResult.passed ? 'Congratulations!' : 'Try Again'}
                    </h3>
                    <p className="text-neutral-700 mt-2">
                      You scored {quizResult.score}% ({quizResult.correctCount}/{quizResult.totalQuestions} correct)
                    </p>
                    {quizResult.passed && quizResult.xpAwarded > 0 && (
                      <p className="text-success-700 font-semibold mt-1 flex items-center">
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
                  className="px-6 py-2 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-900 transition-all"
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
            className="flex items-center px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-900 rounded-lg font-semibold hover:border-primary-500 transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Catalog
          </button>
          
          {!completed && (
            <button 
              onClick={handleCompleteLesson}
              disabled={completing}
              className="px-6 py-3 bg-success-700 text-white rounded-lg font-semibold hover:bg-success-800 transition-all shadow-sm flex items-center disabled:opacity-50"
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
