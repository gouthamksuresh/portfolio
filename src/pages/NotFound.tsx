import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-mono p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">$ cat /dev/null/{location.pathname}</p>
          <h1 className="text-6xl sm:text-8xl font-extrabold text-primary text-glow">404</h1>
          <p className="text-lg text-muted-foreground">segmentation fault (core dumped)</p>
        </div>
        <div className="border border-border rounded-md bg-card p-4 text-left text-sm space-y-1">
          <p><span className="text-terminal-red">ERROR:</span> route not found</p>
          <p className="text-muted-foreground">path: <span className="text-terminal-cyan">{location.pathname}</span></p>
          <p className="text-muted-foreground">status: <span className="text-terminal-amber">404</span></p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          $ cd ~
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
