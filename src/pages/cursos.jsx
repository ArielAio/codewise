import { useState, useEffect } from 'react';
import Head from 'next/head';
import CourseEvaluation from '../components/CourseEvaluation';

function VideoSkeleton() {
  return (
    <div className="relative pb-[56.25%] h-0 bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
  );
}

function LessonInfoSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

export default function Course() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [canGenerateCertificate, setCanGenerateCertificate] = useState(false);

  // Simular o nome do estudante (você pode obter isso de um contexto de autenticação)
  const studentName = "Nome do Estudante";

  const course = {
    title: "Fundamentos de Programação",
    description: "Aprenda os conceitos básicos de programação e inicie sua jornada no mundo do desenvolvimento de software.",
    lessons: [
      {
        title: "Introdução à Lógica de Programação",
        videoUrl: "https://www.youtube.com/embed/8mei6uVttho"
      },
      {
        title: "Variáveis e Tipos de Dados",
        videoUrl: "https://www.youtube.com/embed/M2Af7gkbbro?si=inEOQs9vgwKa-LRG"
      },
      {
        title: "Estruturas de Controle",
        videoUrl: "https://www.youtube.com/embed/Ig4QZNpVZYs?si=uMlkK1i86Ioq_tQA"
      },
      {
        title: "Funções e Modularização",
        videoUrl: "https://www.youtube.com/embed/_g05aHdBAEY?si=EHksiFMafvcTxnCr"
      },
      {
        title: "Introdução a Estruturas de Dados",
        videoUrl: "https://www.youtube.com/embed/5-5Mf_L0UKw"
      },
    ]
  };

  const questions = [
    {
      question: "O que é uma variável em programação?",
      options: [
        "Um valor fixo que não pode ser alterado",
        "Um espaço na memória para armazenar dados",
        "Um tipo de função",
        "Uma estrutura de controle"
      ],
      correctAnswer: "Um espaço na memória para armazenar dados"
    },
    // Adicione mais questões aqui
  ];

  const handleEvaluationComplete = (passed) => {
    setShowEvaluation(false);
    setCanGenerateCertificate(passed);
  };

  const closeEvaluation = () => {
    setShowEvaluation(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeEvaluation();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentLesson]);

  useEffect(() => {
    if (currentLesson > 0 && !completedLessons[currentLesson - 1]) {
      setCompletedLessons(prev => ({ ...prev, [currentLesson - 1]: true }));
    }

    const allCompleted = Object.values(completedLessons).filter(Boolean).length === course.lessons.length;
    setAllLessonsCompleted(allCompleted);
  }, [currentLesson, completedLessons, course.lessons.length]);

  const toggleLessonCompletion = (index) => {
    setCompletedLessons(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
      <Head>
        <title>{course.title} - CodeWise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">{course.title}</h1>
          <p className="text-xl text-blue-700">{course.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {isLoading ? (
                <VideoSkeleton />
              ) : (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={course.lessons[currentLesson].videoUrl}
                    title={course.lessons[currentLesson].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              )}
              {isLoading ? (
                <LessonInfoSkeleton />
              ) : (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                    {course.lessons[currentLesson].title}
                  </h2>
                  <label className="flex items-center text-blue-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completedLessons[currentLesson] || false}
                      onChange={() => toggleLessonCompletion(currentLesson)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Marcar como concluída</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Aulas do Curso</h3>
            <ul className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <li 
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    index === currentLesson 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => setCurrentLesson(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{lesson.title}</span>
                    <input
                      type="checkbox"
                      checked={completedLessons[index] || false}
                      onChange={() => toggleLessonCompletion(index)}
                      onClick={(e) => e.stopPropagation()}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </div>
                </li>
              ))}
            </ul>
            {allLessonsCompleted && !showEvaluation && !canGenerateCertificate && (
              <button
                onClick={() => setShowEvaluation(true)}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Iniciar Avaliação do Curso
              </button>
            )}
            {canGenerateCertificate && (
              <button
                onClick={() => {/* Lógica para gerar certificado */}}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Gerar Certificado
              </button>
            )}
          </div>
        </div>

        <section className="mt-16 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Seu Progresso</h3>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(Object.values(completedLessons).filter(Boolean).length / course.lessons.length) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2 text-blue-700 text-center">
            {Object.values(completedLessons).filter(Boolean).length} de {course.lessons.length} aulas concluídas
          </p>
        </section>
      </main>

      <footer className="text-center py-8 bg-blue-600 text-white mt-16">
        <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
      </footer>

      {showEvaluation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleOutsideClick}
        >
          <CourseEvaluation
            courseName={course.title}
            questions={questions}
            onComplete={handleEvaluationComplete}
            onClose={closeEvaluation}
          />
        </div>
      )}
    </div>
  );
}