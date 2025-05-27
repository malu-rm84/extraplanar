import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Camera, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Settings,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  displayName: string;
  photoURL: string;
  email: string;
  createdAt: Date;
}

const ConfigPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    photoURL: "",
    email: "",
    createdAt: new Date()
  });
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: ""
  });
  const [previewImage, setPreviewImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({
    displayName: "",
    photoURL: ""
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUser?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProfile = {
            displayName: userData.displayName || currentUser.displayName || "",
            photoURL: userData.photoURL || currentUser.photoURL || "",
            email: currentUser.email || "",
            createdAt: userData.createdAt?.toDate() || new Date()
          };
          
          setProfile(userProfile);
          setFormData({
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL
          });
          setPreviewImage(userProfile.photoURL);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Erro ao carregar dados do perfil");
      }
    };

    loadUserProfile();
  }, [currentUser]);

  const validateForm = () => {
    const newErrors = {
      displayName: "",
      photoURL: ""
    };

    // Validar nome
    if (!formData.displayName.trim()) {
      newErrors.displayName = "O apelido é obrigatório";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "O apelido deve ter pelo menos 2 caracteres";
    } else if (formData.displayName.trim().length > 30) {
      newErrors.displayName = "O apelido deve ter no máximo 30 caracteres";
    }

    // Validar URL da foto (opcional)
    if (formData.photoURL.trim()) {
      try {
        new URL(formData.photoURL);
        // Verificar se é uma imagem
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const hasValidExtension = imageExtensions.some(ext => 
          formData.photoURL.toLowerCase().includes(ext)
        );
        const isValidImageHost = formData.photoURL.includes('imgur.com') || 
                                formData.photoURL.includes('cloudinary.com') ||
                                formData.photoURL.includes('github.com') ||
                                formData.photoURL.includes('githubusercontent.com') ||
                                formData.photoURL.startsWith('https://');
        
        if (!hasValidExtension && !isValidImageHost) {
          newErrors.photoURL = "URL deve ser de uma imagem válida";
        }
      } catch {
        newErrors.photoURL = "URL inválida";
      }
    }

    setErrors(newErrors);
    return !newErrors.displayName && !newErrors.photoURL;
  };

  const handlePreviewImage = () => {
    if (formData.photoURL.trim() && !errors.photoURL) {
      setPreviewImage(formData.photoURL);
      setShowPreview(true);
    }
  };

  const handleSave = async () => {
    if (!validateForm() || !currentUser?.uid) return;

    setLoading(true);
    try {
      const updateData = {
        displayName: formData.displayName.trim(),
        photoURL: formData.photoURL.trim(),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, "users", currentUser.uid), updateData);
      
      setProfile(prev => ({
        ...prev,
        displayName: updateData.displayName,
        photoURL: updateData.photoURL
      }));

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      displayName: profile.displayName,
      photoURL: profile.photoURL
    });
    setPreviewImage(profile.photoURL);
    setErrors({ displayName: "", photoURL: "" });
    setShowPreview(false);
  };

  const hasChanges = formData.displayName !== profile.displayName || 
                    formData.photoURL !== profile.photoURL;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Personalize seu perfil e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview do Perfil */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold text-primary flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Preview do Perfil
              </h2>
              
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 mx-auto border-2 border-primary/20">
                  <AvatarImage 
                    src={showPreview ? previewImage : profile.photoURL} 
                    alt="Foto de perfil"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {(formData.displayName || profile.displayName || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                  <Camera className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {formData.displayName || "Seu Apelido"}
                </h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              <Separator className="bg-white/10" />
              
              <div className="text-xs text-muted-foreground">
                <p>Membro desde</p>
                <p className="text-primary">
                  {profile.createdAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Configurações */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informações Pessoais
              </h2>
              <p className="text-sm text-muted-foreground">
                Atualize suas informações de perfil
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Campo de Apelido */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white">
                  Apelido *
                </Label>
                <Input
                  id="displayName"
                  placeholder="Digite seu apelido"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    displayName: e.target.value 
                  }))}
                  className="bg-black/20 border-white/10 focus:border-primary/50 text-white"
                  maxLength={30}
                />
                {errors.displayName && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      {errors.displayName}
                    </AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.displayName.length}/30 caracteres
                </p>
              </div>

              {/* Campo de URL da Foto */}
              <div className="space-y-2">
                <Label htmlFor="photoURL" className="text-white">
                  URL da Foto de Perfil
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="photoURL"
                    placeholder="https://exemplo.com/sua-foto.jpg"
                    value={formData.photoURL}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      photoURL: e.target.value 
                    }))}
                    className="bg-black/20 border-white/10 focus:border-primary/50 text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handlePreviewImage}
                    disabled={!formData.photoURL.trim()}
                    className="bg-black/20 border-primary/30 hover:bg-primary/10"
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.photoURL && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      {errors.photoURL}
                    </AlertDescription>
                  </Alert>
                )}
                <Alert className="border-blue-500/20 bg-blue-500/10">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    Use URLs de imagens de serviços confiáveis como Imgur, GitHub ou Cloudinary
                  </AlertDescription>
                </Alert>
              </div>

              <Separator className="bg-white/10" />

              {/* Botões de Ação */}
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges || loading}
                  className="bg-black/20 border-white/20 hover:bg-white/10 flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resetar
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || loading || !!errors.displayName || !!errors.photoURL}
                  className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 flex-1"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>

          {/* Card de Informações da Conta */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold text-primary">Informações da Conta</h2>
              <p className="text-sm text-muted-foreground">
                Dados da sua conta (somente leitura)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="text-white font-medium">{profile.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Membro desde</Label>
                <p className="text-white font-medium">
                  {profile.createdAt.toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;