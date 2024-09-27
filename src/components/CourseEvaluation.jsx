import React, { useState } from 'react';

export default function CourseEvaluation({ courseName, questions, onComplete, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const passingScore = Math.ceil(questions.length * 0.7); // 70% para passar

  const handleComplete = () => {
    onComplete(score >= passingScore);
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Resultados da Avaliação</h2>
        <p className="mb-4 text-blue-700">
          Você acertou {score} de {questions.length} questões.
        </p>
        <p className="mb-6 text-blue-700">
          {score >= passingScore 
            ? "Parabéns! Você passou na avaliação e pode gerar seu certificado."
            : "Infelizmente, você não atingiu a pontuação mínima para gerar o certificado."}
        </p>
        <button 
          onClick={handleComplete}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {score >= passingScore ? "Gerar Certificado" : "Tentar Novamente"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Avaliação do Curso: {courseName}</h2>
      <p className="mb-4 text-blue-700">
        Questão {currentQuestion + 1} de {questions.length}
      </p>
      <p className="mb-6 text-blue-700">{questions[currentQuestion].question}</p>
      <div className="space-y-2">
        {questions[currentQuestion].options.map((option, index) => (
          <button 
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full px-4 py-2 text-blue-700 border border-blue-700 rounded hover:bg-blue-100"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}