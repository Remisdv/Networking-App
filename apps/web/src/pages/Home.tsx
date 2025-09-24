import { Card, Badge, Button } from "@alt-platform/ui";

export function HomePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 py-12">
      <header className="space-y-3 text-center">
        <Badge variant="success" className="uppercase tracking-wide">
          Alt Platform
        </Badge>
        <h1 className="text-4xl font-bold text-slate-900">Frontend is live</h1>
        <p className="text-lg text-slate-600">
          Use this simple landing page to confirm that the Docker + Nginx setup serves the latest build.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">API status</h2>
          <p className="text-sm text-slate-600">
            The Nest API is available at <code className="rounded bg-slate-100 px-2 py-1">http://localhost:3000/docs</code>.
            Open it in your browser to browse the Swagger documentation.
          </p>
          <a
            href="http://localhost:3000/docs"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Visit Swagger UI
          </a>
        </Card>

        <Card className="space-y-3 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Frontend status</h2>
          <p className="text-sm text-slate-600">
            This interface is rendered from <code className="rounded bg-slate-100 px-2 py-1">apps/web</code>
            and served by Nginx on <code className="rounded bg-slate-100 px-2 py-1">http://localhost:8085</code>.
            Update the source and rebuild to see your changes.
          </p>
          <Button type="button" onClick={() => window.location.reload()}>
            Reload this page
          </Button>
        </Card>
      </section>

      <footer className="text-center text-sm text-slate-500">
        Deployed locally with Docker Compose · Traefik routes traffic to the API and web app.
      </footer>
    </div>
  );
}

// export function HomePage() {
//   return (
//     <div style={{ padding: 24 }}>
//       <h1 style={{ margin: 0 }}>✅ Front OK</h1>
//       <p>Build Nginx + Vite fonctionne. Ceci est un rendu statique.</p>
//       <ul>
//         <li>
//           <a href="http://localhost:3000/docs" target="_blank" rel="noreferrer">
//             API Swagger
//           </a>
//         </li>
//         <li>
//           <a href="http://localhost:4000" target="_blank" rel="noreferrer">
//             Firebase Emulators UI
//           </a>
//         </li>
//       </ul>
//     </div>
//   )
// }


