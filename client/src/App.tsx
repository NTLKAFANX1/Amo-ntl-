import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/components/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background text-foreground" dir="rtl">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h1>
                  <a href="/" className="text-primary hover:underline">
                    العودة للرئيسية
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
