
import React from 'react';
import type { Lesson } from '../types';
import { CodeBlock } from './CodeBlock';

interface LessonContentProps {
  lesson: Lesson | undefined;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  if (!lesson) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center">
        <p className="text-gray-500">Selecione uma aula para começar.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lesson.title}</h2>
        <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
            {lesson.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
        <CodeBlock code={lesson.code} />
      </div>
    </main>
  );
};
