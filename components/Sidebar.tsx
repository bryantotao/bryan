
import React from 'react';
import type { Lesson } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  currentLessonId: number;
  onSelectLesson: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ lessons, currentLessonId, onSelectLesson }) => {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex-shrink-0">
      <div className="flex items-center gap-3 mb-8">
         <img src="https://picsum.photos/40/40" alt="Roblox Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-bold text-white">Aulas de Script</h1>
      </div>
      <nav>
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <button
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm font-medium transition-colors ${
                  currentLessonId === lesson.id
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                <lesson.icon className="w-5 h-5 flex-shrink-0" />
                <span>{lesson.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
