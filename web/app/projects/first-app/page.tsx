import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { FirstAppLab } from '@/components/first-app-lab';
import { Tr } from '@/components/tr';

export const metadata = publicPageMetadata('/projects/first-app', {
  title: 'Build Your First App',
  description: 'Build and test a tiny task tracker while learning the building blocks of an app.'
});

export default function FirstAppProjectPage() {
  return (
    <section className="section">
      <div className="container">
        <p><Tr>This practice page is currently available in English.</Tr></p>
      </div>
      <div className="container first-app-project" lang="en">
        <div className="section-head">
          <span className="eyebrow">Hands-on project · about 20 minutes</span>
          <h1>Build Your First App</h1>
          <p>
            Make a tiny task tracker, try it out, and learn the ideas behind every app: interface, data, actions,
            and testing.
          </p>
        </div>

        <div className="first-app-project-grid">
          <div className="first-app-lessons">
            <section className="first-app-lesson">
              <span className="first-app-step">1</span>
              <div>
                <h2>Start with one problem</h2>
                <p>
                  A useful first app does one job well. This one helps you remember small tasks. In your own project,
                  write down who it helps and what problem it solves.
                </p>
                <p className="first-app-example"><strong>Example:</strong> “I forget the small jobs I need to finish today.”</p>
              </div>
            </section>
            <section className="first-app-lesson">
              <span className="first-app-step">2</span>
              <div>
                <h2>Try the working prototype</h2>
                <p>
                  Add a task, mark it complete, and remove it. The list below is the app’s <strong>interface</strong>;
                  each task is its <strong>data</strong>; the buttons are <strong>actions</strong>.
                </p>
              </div>
            </section>
            <section className="first-app-lesson">
              <span className="first-app-step">3</span>
              <div>
                <h2>Test the edges</h2>
                <p>
                  Try adding a blank task, a long task, and several tasks. Check that the app gives helpful feedback
                  and that completing one task doesn’t change another.
                </p>
              </div>
            </section>
            <section className="first-app-lesson">
              <span className="first-app-step">4</span>
              <div>
                <h2>Plan your next version</h2>
                <p>
                  Pick one improvement—like a due date or a filter. Describe it clearly, then build and test that
                  small change before adding anything else.
                </p>
              </div>
            </section>
          </div>

          <FirstAppLab />
        </div>

        <aside className="first-app-ai-tip">
          <h2>Want to build your own version with AI?</h2>
          <p>
            Try this prompt in GitHub Copilot or OpenAI Codex: “Help me build a beginner-friendly task tracker.
            First explain the smallest version we can make, then guide me one step at a time. Don’t write the whole
            app at once.”
          </p>
          <p>Your tasks in this demo are saved only in this browser on this device.</p>
          <Link className="btn btn-primary" href="/projects/first-app/build">
            Code it yourself: step-by-step tutorial
          </Link>
        </aside>
      </div>
    </section>
  );
}
