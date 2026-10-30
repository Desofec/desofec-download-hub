'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Goal } from '@/lib/types';

export function OnboardingForm({ goals }: { goals: Goal[] }) {
  const router = useRouter();
  const requestedGoal = useSearchParams().get('goal');
  const [goal, setGoal] = useState(
    goals.some((entry) => entry.id === requestedGoal) ? (requestedGoal as string) : (goals[0]?.id ?? '')
  );

  return (
    <form
      className="onboarding-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (goal) router.push(`/results/${encodeURIComponent(goal)}`);
      }}
    >
      <div className="form-group">
        <label htmlFor="goal">What do you want to do?</label>
        <select id="goal" name="goal" value={goal} onChange={(event) => setGoal(event.target.value)} required>
          {goals.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary block-btn" type="submit">
        Show my recommendation
      </button>
    </form>
  );
}
