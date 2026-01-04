"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Coins,
  Timer
} from "lucide-react";

// Mock recipe data (replace with API call later)
const getMockRecipe = (id: string) => ({
  id,
  name: "Spaghetti Carbonara",
  steps: [
    {
      id: 1,
      title: "Przygotuj składniki",
      description: "Wytnij boczek w kostkę. Oddziel żółtka od białek (potrzebujemy tylko żółtka). Zetrzyj parmezan.",
      timer: null,
    },
    {
      id: 2,
      title: "Ugotuj makaron",
      description: "Zagotuj wodę z solą. Dodaj spaghetti i gotuj al dente według instrukcji na opakowaniu (około 10 minut).",
      timer: 10, // minutes
    },
    {
      id: 3,
      title: "Usmaż boczek",
      description: "Na patelni bez tłuszczu usmaż boczek do złotego koloru. Zdejmij z ognia.",
      timer: 5,
    },
    {
      id: 4,
      title: "Połącz składniki",
      description: "W misce wymieszaj żółtka z parmezanem. Dodaj odcedzony makaron do boczku, wymieszaj. Zdejmij z ognia i dodaj sos jajeczny. Szybko wymieszaj (jajka nie mogą się zetrzeć!).",
      timer: null,
    },
    {
      id: 5,
      title: "Podaj danie",
      description: "Nałóż na talerze, posyp parmezanem i świeżo zmielonym pieprzem. Gotowe!",
      timer: null,
    },
  ],
  totalTime: 25,
  servings: 4,
});

export default function CookingModePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  const [recipe] = useState(getMockRecipe(recipeId));
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const step = recipe.steps[currentStep];
  const isLastStep = currentStep === recipe.steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            // Play sound or notification
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (isLastStep) {
      setIsCompleted(true);
    } else {
      setCurrentStep(currentStep + 1);
      setTimerActive(false);
      setTimerSeconds(0);
    }
  };

  const handlePrevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
      setTimerActive(false);
      setTimerSeconds(0);
    }
  };

  const startTimer = () => {
    if (step.timer) {
      setTimerSeconds(step.timer * 60);
      setTimerActive(true);
    }
  };

  const handleComplete = async () => {
    // TODO: Send to backend:
    // - Save to history
    // - Award ChefTokens (+5 CT)
    // - Update fridge (subtract used ingredients)
    
    // Mock: Just show success and redirect
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/recipes/saved?cooked=true");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Gratulacje!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Udało Ci się ugotować <strong>{recipe.name}</strong>! 🎉
          </p>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Coins className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">+5 CT</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ChefTokens zdobyte za ugotowanie przepisu!
            </p>
          </div>

          <button
            onClick={handleComplete}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            ✅ Zapisz i zakończ
          </button>

          <button
            onClick={() => router.push("/recipes/saved")}
            className="w-full mt-3 py-3 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all"
          >
            Powrót do Mojej kuchni
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Wróć
          </button>

          <div className="flex items-center gap-3 mb-3">
            <ChefHat className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tryb gotowania
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {recipe.name}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Krok {currentStep + 1} z {recipe.steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / recipe.steps.length) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-500"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/10 dark:to-cyan-900/10 p-8 rounded-2xl border border-sky-200 dark:border-sky-800 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                {step.id}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h2>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Timer */}
            {step.timer && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Zalecany czas:
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {timerActive ? formatTime(timerSeconds) : `${step.timer} min`}
                  </span>
                </div>

                {!timerActive && (
                  <button
                    onClick={startTimer}
                    className="w-full mt-4 py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    ⏱️ Start timer
                  </button>
                )}

                {timerActive && timerSeconds === 0 && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-center">
                    <span className="text-green-700 dark:text-green-300 font-semibold">
                      ✅ Czas minął!
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevStep}
            disabled={isFirstStep}
            className="flex-1 py-4 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Poprzedni krok
          </button>

          <button
            onClick={handleNextStep}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Zakończ gotowanie
              </>
            ) : (
              <>
                Następny krok
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Completed steps indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {recipe.steps.map((s, idx) => (
            <div
              key={s.id}
              className={`w-3 h-3 rounded-full ${
                completedSteps.includes(idx)
                  ? "bg-green-500"
                  : idx === currentStep
                  ? "bg-sky-500"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
