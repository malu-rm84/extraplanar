
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User,
  Shield,
  UserCircle
} from "lucide-react";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("player");
  const [masterPassword, setMasterPassword] = useState("");
  const [showMasterField, setShowMasterField] = useState(false);
  
  const handleUserTypeChange = (value: string) => {
    setUserType(value);
    setShowMasterField(value === "master");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar registro com Firebase quando estiver pronto
    console.log("Registro:", { email, password, name, userType, masterPassword });
  };

  return (
    <div className="mystic-card max-w-md mx-auto w-full">
      <div className="space-y-2 text-center">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Criar Nova Conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Registre-se para explorar o multiverso extraplanar
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome ou apelido"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Tipo de Conta</Label>
          <RadioGroup 
            defaultValue="player" 
            value={userType}
            onValueChange={handleUserTypeChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="player" id="player" />
              <Label htmlFor="player" className="flex items-center gap-1.5">
                <UserCircle className="h-4 w-4" />
                Jogador
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="master" id="master" />
              <Label htmlFor="master" className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                Mestre
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {showMasterField && (
          <div className="space-y-2 bg-secondary/50 p-3 rounded-md border">
            <Label htmlFor="masterPassword">Palavra-passe de Mestre</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="masterPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Palavra-passe secreta"
                className="pl-10"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                required={showMasterField}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              A palavra-passe é necessária para criar uma conta de Mestre.
            </p>
          </div>
        )}
        
        <Button type="submit" className="w-full mystic-button">
          Criar Conta
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Faça login
        </Link>
      </div>
    </div>
  );
}
