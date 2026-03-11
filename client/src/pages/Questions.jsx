import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questions from '../lib/questions';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { track } from '../utils/analytics';

export default function Questions() {
  const { eventType } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState('forward');

  const eventQuestions = questions[eventType];

  useEffect(() => {
    if (!eventQuestions) navigate('/', { replace: true });
    if (eventQuestions && token) {
      track('page_view', { page: 'questions', eventType }, { token });
    }
  }, [eventQuestions, navigate, eventType, token]);

  if (!eventQuestions) return null;

  const total = eventQuestions.length;
  const question = eventQuestions[currentStep];

  function handleAnswer(value) {
    const updated = { ...answers, [question.id]: value };
    setAnswers(updated);

    if (currentStep < total - 1) {
      setDirection('forward');
      setCurrentStep((s) => s + 1);
    } else {
      navigate('/checklist', { state: { eventType, answers: updated } });
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((s) => s - 1);
    } else {
      navigate('/home');
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col px-4 py-12 sm:py-20">
      {/* Progress dots — pill for current, inset for past, raised for future */}
      <div className="mb-10 flex items-center justify-center gap-2.5">
        {eventQuestions.map((_, i) => (
          <span
            key={i}
            className={cn(
              'block rounded-full transition-all duration-300 ease-out',
              i === currentStep
                ? 'h-3 w-8 bg-neu-accent shadow-neu-raised-sm'
                : i < currentStep
                  ? 'h-2.5 w-2.5 bg-neu-bg shadow-neu-inset-sm'
                  : 'h-2.5 w-2.5 bg-neu-bg shadow-neu-raised-sm'
            )}
          />
        ))}
      </div>

      {/* Step counter */}
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-neu-muted">
        Step {currentStep + 1} of {total}
      </p>

      {/* Question card */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          key={question.id}
          className={cn(
            'w-full transition-all duration-300 ease-out',
            direction === 'forward'
              ? 'animate-[slideInRight_0.3s_ease-out]'
              : 'animate-[slideInLeft_0.3s_ease-out]'
          )}
        >
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-neu-fg sm:text-3xl">
            {question.text}
          </h2>

          <div className="flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer(option.value)}
                  className={cn(
                    'w-full rounded-2xl px-6 py-4 text-base font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
                    isSelected
                      ? 'bg-neu-accent text-white translate-y-0.5 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.15)]'
                      : 'bg-neu-bg text-neu-fg shadow-neu-raised hover:-translate-y-0.5 hover:shadow-neu-raised-hover active:shadow-neu-inset active:translate-y-0.5'
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-10">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium btn-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
