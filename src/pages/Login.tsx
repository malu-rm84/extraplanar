
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/auth/login-form";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
