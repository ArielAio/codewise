// src/lib/progress.js
import { db } from './firebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const progressCollection = collection(db, 'userProgress');

export const updateUserProgress = async (userId, courseId, completedLessons, totalLessons) => {
  const progressPercentage = (completedLessons / totalLessons) * 100;

  const progressDocRef = doc(progressCollection, `${userId}_${courseId}`);
  const progressDoc = await getDoc(progressDocRef);

  if (progressDoc.exists()) {
    await setDoc(progressDocRef, {
      userId,
      courseId,
      completedLessons,
      progressPercentage,
    }, { merge: true });
    console.log(`Progresso atualizado: ${completedLessons} de ${totalLessons} aulas concluídas`);
  } else {
    await setDoc(progressDocRef, {
      userId,
      courseId,
      completedLessons,
      progressPercentage,
    });
    console.log(`Progresso criado: ${completedLessons} de ${totalLessons} aulas concluídas`);
  }
};