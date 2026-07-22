import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 relative">
      {/* Background neon glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-600/10 dark:bg-blue-600/5 blur-3xl" />
        <div className="absolute right-0 top-100 h-100 w-100 rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-3xl" />
      </div>

      <Navbar />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-2 lg:pb-28 lg:pt-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Better teamwork starts here
          </div>

          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl text-slate-900 dark:text-white">
            Plan less.
            <span className="block bg-linear-to-r from-blue-600 via-cyan-500 to-violet-600 dark:from-blue-300 dark:via-cyan-200 dark:to-violet-300 bg-clip-text text-transparent">
              Achieve more.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            TaskFlow helps teams create, assign, and complete meaningful work
            without losing track of what matters.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Create free account →
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 px-6 py-3.5 text-center font-bold text-slate-700 dark:text-white transition hover:bg-slate-200 dark:hover:bg-white/10"
            >
              Explore features
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-300">
            <span>✓ Role-based access</span>
            <span>✓ Task tracking</span>
            <span>✓ Secure JWT login</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-blue-500/20 to-violet-500/20 blur-2xl dark:from-blue-500/25 dark:to-violet-500/25" />

          {/* Interactive mockup representation */}
          <div className="relative rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 px-2 pb-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">TaskFlow Dashboard</span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-600 p-4 text-white">
                <p className="text-xs text-blue-100">Total tasks</p>
                <p className="mt-2 text-3xl font-black">24</p>
                <p className="mt-2 text-xs text-blue-100">↑ 12% this week</p>
              </div>

              <div className="rounded-2xl bg-violet-600 p-4 text-white">
                <p className="text-xs text-violet-100">Completed</p>
                <p className="mt-2 text-3xl font-black">18</p>
                <p className="mt-2 text-xs text-violet-100">75% progress</p>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 text-slate-800 dark:text-white">
                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">6</p>
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-300">Needs attention</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-4 text-slate-900 dark:text-white border border-slate-100 dark:border-transparent">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white">Today’s tasks</h2>
                <span className="rounded-full bg-blue-100 dark:bg-blue-500/20 px-3 py-1 text-xs text-blue-700 dark:text-blue-200">
                  3 tasks
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  ["Design login screen", "In progress", "bg-blue-400"],
                  ["Connect Register API", "Pending", "bg-amber-400"],
                  ["Write Playwright tests", "Done", "bg-emerald-400"],
                ].map(([task, status, color]) => (
                  <div
                    key={task}
                    className="flex items-center justify-between rounded-xl bg-white dark:bg-white/5 p-3 border border-slate-100 dark:border-transparent shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{task}</span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-400">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-300">
            Everything you need
          </p>

          <h2 className="mt-4 text-center text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
            Work clearly. Move quickly.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "✦",
                title: "Easy task management",
                text: "Create tasks, set descriptions, assign team members, and track progress in one place.",
              },
              {
                icon: "◉",
                title: "Role-based dashboards",
                text: "Assigners manage every task while Viewers focus only on their assigned work.",
              },
              {
                icon: "⌁",
                title: "Secure access",
                text: "JWT authentication ensures every user sees only what they are permitted to access.",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-400/40 shadow-xs"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 dark:bg-blue-500/15 text-2xl text-blue-600 dark:text-blue-300">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-300">
              Simple workflow
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
              From assignment to achievement.
            </h2>
          </div>

          <div className="space-y-5">
            {[
              ["01", "Create an account", "Register as an Assigner or Viewer."],
              ["02", "Organize your work", "Assign tasks with clear titles and descriptions."],
              ["03", "Track progress", "Complete tasks and see progress update instantly."],
            ].map(([number, title, text]) => (
              <div key={number} className="flex gap-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-xs">
                <span className="text-xl font-black text-blue-600 dark:text-blue-300">{number}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="rounded-3xl bg-linear-to-r from-blue-600 to-violet-600 p-8 text-center sm:p-14 text-white shadow-2xl">
          <h2 className="text-3xl font-black sm:text-4xl">
            Ready to bring focus to your team?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create your TaskFlow account and start managing tasks with clarity.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50 shadow-lg hover:scale-102 active:scale-98"
          >
            Start managing tasks →
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-white/10 px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
        © 2026 TaskFlow. Built for better teamwork.
      </footer>
    </main>
  );
}