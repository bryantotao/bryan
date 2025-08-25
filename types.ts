
import type React from 'react';

export interface Lesson {
  id: number;
  title: string;
  icon: (props: React.ComponentProps<'svg'>) => React.ReactNode;
  description: string[];
  code: string;
}
