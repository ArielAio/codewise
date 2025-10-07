//imports
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { FaPlay, FaBookOpen, FaUsers, FaCertificate, FaStar, FaArrowRight, FaCode, FaLaptopCode, FaMobile, FaServer } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Função para extrair tecnologias dos títulos e descrições dos cursos
  const generateTechStackFromCourses = (coursesList) => {
    // Apenas as 3 tecnologias solicitadas: JavaScript, React e Node.js
    const techKeywords = {
      'javascript': { name: "JavaScript", icon: "💛", level: "Essencial" },
      'react': { name: "React", icon: "⚛️", level: "Avançado" },
      'node': { name: "Node.js", icon: "🟢", level: "Backend" },
      'nodejs': { name: "Node.js", icon: "🟢", level: "Backend" }
    };

    const foundTechs = new Map(); // Usar Map para evitar duplicatas

    coursesList.forEach(course => {
      const searchText = `${course.title} ${course.description || ''}`.toLowerCase();
      
      Object.keys(techKeywords).forEach(keyword => {
        if (searchText.includes(keyword)) {
          const tech = techKeywords[keyword];
          // Usar o nome como chave para evitar duplicatas (Node.js)
          foundTechs.set(tech.name, tech);
        }
      });
    });

    // Se não encontrar tecnologias específicas, mostrar as 3 tecnologias padrão
    if (foundTechs.size === 0) {
      return [
        { name: "JavaScript", icon: "💛", level: "Essencial" },
        { name: "React", icon: "⚛️", level: "Avançado" },
        { name: "Node.js", icon: "🟢", level: "Backend" }
      ];
    }

    // Retornar apenas as tecnologias encontradas (máximo 3)
    return Array.from(foundTechs.values());
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'cursos');
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
        if (coursesList.length > 0) {
          setFeaturedCourse(coursesList[0]);
        }

        // Gerar tech stack baseado nos cursos existentes
        const generatedTechStack = generateTechStackFromCourses(coursesList);
        setTechStack(generatedTechStack);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleExploreCourses = () => {
    router.push('/courses');
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Bom dia';
    if (hours < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const features = [
    {
      icon: FaCode,
      title: "Aprendizado Prático",
      description: "Projetos reais para consolidar seu conhecimento e construir um portfólio impressionante."
    },
    {
      icon: FaUsers,
      title: "Comunidade Ativa", 
      description: "Conecte-se com outros desenvolvedores e compartilhe experiências de aprendizado."
    },
   
    {
      icon: FaLaptopCode,
      title: "Mentoria Especializada",
      description: "Acompanhamento personalizado com profissionais experientes da área."
    }
  ];



  const testimonials = [
    {
      name: "Paulo Mazuque",
      role: "Full Stack Developer",
      avatar: "PM",
      content: "A CodeWise transformou minha carreira. Saí do zero e hoje trabalho como desenvolvedor sênior.",
      rating: 5
    },
    {
      name: "Pedro Colavite", 
      role: "Frontend Developer",
      avatar: "PC",
      content: "Os projetos práticos me deram a confiança que precisava para conseguir meu primeiro emprego na área.",
      rating: 5
    },
    {
      name: "Ana Silva",
      role: "Backend Developer", 
      avatar: "AS",
      content: "Metodologia incrível e suporte excepcional. Recomendo para qualquer pessoa que queira aprender programação.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Head>
        <title>CodeWise - Transformando vidas através da programação</title>
        <meta name="description" content="Aprenda programação com os melhores cursos práticos e uma comunidade ativa de desenvolvedores." />
      </Head>

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {user && (
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-[#001a2c] text-[#00FA9A]">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium text-slate-800">{getGreeting()}, {user.name}!</p>
                    <p className="text-slate-600">Pronto para continuar aprendendo?</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
                  🚀 Transforme sua carreira
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-readable">
                  Domine a <span className="codewise-text-gradient">Programação</span> do Zero ao Profissional
                </h1>
                <p className="text-xl text-readable-muted leading-relaxed">
                  Aprenda com projetos reais, mentoria especializada e uma metodologia que já transformou centenas de carreiras na tecnologia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="codewise-button-primary text-lg px-8 font-semibold"
                  onClick={handleExploreCourses}
                >
                  <FaPlay className="mr-2 h-4 w-4" />
                  Começar Agora
                </Button>
                <Button variant="outline" size="lg" className="codewise-button-secondary text-lg px-8">
                  <FaBookOpen className="mr-2 h-4 w-4" />
                  Ver Cursos
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-readable-muted">
                <div className="flex items-center space-x-2">
                  <FaUsers className="h-4 w-4 text-[#00FA9A]" />
                  <span className="font-medium">500+ Alunos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="h-4 w-4 text-[#00FA9A]" />
                  <span className="font-medium">4.9/5 Avaliação</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCertificate className="h-4 w-4 text-[#00FA9A]" />
                  <span className="font-medium">Certificado</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {featuredCourse && !loading ? (
                <Card className="codewise-gradient shadow-2xl border-2 border-[#00FA9A]/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="codewise-button-primary font-semibold">🔥 Curso em Destaque</Badge>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="h-4 w-4 text-[#00FA9A]" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white font-bold">{featuredCourse.title}</CardTitle>
                    <CardDescription className="text-slate-200 text-base leading-relaxed">
                      {featuredCourse.description?.substring(0, 120)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="codewise-button-primary w-full font-semibold text-base py-3"
                      onClick={() => router.push(`/courses/${featuredCourse.id}`)}
                    >
                      Acessar Curso
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-100 animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">✨ Por que escolher a CodeWise?</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-readable">
              Metodologia que <span className="codewise-text-gradient">Funciona</span>
            </h2>
            <p className="text-xl text-readable-muted max-w-2xl mx-auto">
              Nossa abordagem prática e personalizada garante que você não apenas aprenda, mas também aplique seus conhecimentos em projetos reais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="codewise-card h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-[#00FA9A] rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[#001a2c]" />
                    </div>
                    <CardTitle className="text-xl text-readable">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-readable-muted">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        {(techStack.length > 0 || loading) && (
          <section className="py-20 codewise-gradient rounded-3xl my-20 border border-[#00FA9A]/20">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 codewise-button-primary font-semibold">
                🛠️ Tecnologias
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                Domine as Tecnologias dos <span className="text-[#00FA9A]">Nossos Cursos</span>
              </h2>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                {loading 
                  ? "Carregando tecnologias dos cursos disponíveis..."
                  : "Tecnologias ensinadas nos cursos da nossa plataforma com projetos práticos e aplicações reais."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto px-6">
              {loading ? (
                // Loading skeleton para tecnologias
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="bg-white/15 backdrop-blur-sm border-white/30 animate-pulse">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4 bg-white/20 rounded h-12 w-12 mx-auto"></div>
                      <div className="h-6 bg-white/20 rounded mb-2 w-3/4 mx-auto"></div>
                      <div className="h-5 bg-white/20 rounded w-1/2 mx-auto"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                techStack.map((tech, index) => (
                  <motion.div
                    key={`${tech.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/15 backdrop-blur-sm border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{tech.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{tech.name}</h3>
                        <Badge variant="secondary" className="codewise-button-primary font-medium">
                          {tech.level}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">💬 Depoimentos</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-readable">
              O que nossos <span className="codewise-text-gradient">Alunos</span> dizem
            </h2>
            <p className="text-xl text-readable-muted max-w-2xl mx-auto">
              Histórias reais de transformação e sucesso na carreira de tecnologia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="codewise-card h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#001a2c] text-[#00FA9A] font-semibold text-lg">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-readable">{testimonial.name}</h4>
                        <p className="text-sm text-readable-muted">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="h-4 w-4 text-[#00FA9A]" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-readable-muted leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Badge variant="outline" className="text-lg px-4 py-2 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
              🎯 Pronto para começar?
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-readable">
              Sua jornada de <span className="codewise-text-gradient">Sucesso</span> começa agora
            </h2>
            <p className="text-xl text-readable-muted max-w-2xl mx-auto">
              Junte-se a centenas de desenvolvedores que já transformaram suas carreiras com a CodeWise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="codewise-button-primary text-lg px-8 font-semibold"
                onClick={handleExploreCourses}
              >
                Explorar Cursos
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {!user && (
                <Button variant="outline" size="lg" className="codewise-button-secondary text-lg px-8" asChild>
                  <Link href="/register">Criar Conta Grátis</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="codewise-gradient text-white py-12 mt-20 border-t border-[#00FA9A]/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/icon-logo.png" alt="CodeWise" className="h-8 w-auto" />
            <img src="/name-logo.png" alt="CodeWise" className="h-8 w-auto" />
          </div>
          <p className="text-slate-200">
            &copy; {new Date().getFullYear()} CodeWise. Transformando vidas através da programação.
          </p>
        </div>
      </footer>
    </div>
  );
}
