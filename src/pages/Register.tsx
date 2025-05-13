
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RegisterForm } from "@/components/auth/register-form";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
