import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <p className="text-xs text-slate-500">PW UDAY 2027 Commerce OS</p>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sign in</h1>
        </div>
        <div className="space-y-3">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button className="w-full">Continue with Email</Button>
          <Button variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Hook these actions to Supabase Auth or NextAuth providers.
        </p>
      </Card>
    </div>
  );
}

