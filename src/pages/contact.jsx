import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FaUserCircle, FaLinkedin, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const profiles = [
  { name: 'Ariel Aio', link: 'https://www.linkedin.com/in/ariel-aio/' },
  { name: 'Gabriel Nossa', link: 'https://www.linkedin.com/in/gabriel-nossa-0951842ba/' },
  { name: 'Leonardo Sanga', link: 'https://www.linkedin.com/in/leonardo-minguini-sanga-386336224/' },
  { name: 'Lucas Siconeli', link: 'https://www.linkedin.com/in/lucas-siconeli-b532262b6/' },
  { name: 'Matheus Coltro', link: 'https://www.linkedin.com/in/matheus-coltro-36a307280/' },
  { name: 'Vinicius Bruno', link: 'https://www.linkedin.com/in/vinicius-leandro-bruno-07aab1281/' },
];

export default function Contato() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Fale Conosco - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
            👥 Nossa Equipe
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-readable">
            Fale <span className="codewise-text-gradient">Conosco</span>
          </h1>
          <p className="text-xl text-readable-muted max-w-2xl mx-auto">
            Entre em contato com nossos especialistas e descubra como podemos ajudar em sua jornada de aprendizado
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={profile.link} target="_blank" rel="noopener noreferrer">
                <Card className="codewise-card group h-full cursor-pointer hover:shadow-xl transition-all duration-300 text-center">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#001a2c] to-[#002d4a] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <FaUserCircle className="text-4xl text-[#00FA9A]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00FA9A] rounded-full flex items-center justify-center shadow-md">
                          <FaLinkedin className="text-sm text-[#001a2c]" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-readable group-hover:text-[#00FA9A] transition-colors">
                      {profile.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-center text-sm text-readable-muted group-hover:text-[#00FA9A] transition-colors">
                      <FaExternalLinkAlt className="mr-2 h-3 w-3" />
                      <span>Ver perfil no LinkedIn</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-readable">Tem alguma dúvida ou sugestão?</h2>
          <p className="text-readable-muted mb-6 max-w-xl mx-auto">
            Nossa equipe está sempre disponível para ajudar. Entre em contato conosco através do LinkedIn ou visite nossos perfis para saber mais sobre nossa experiência.
          </p>
          <Badge className="bg-[#00FA9A] text-[#001a2c] px-6 py-2 text-sm font-semibold">
            Resposta em até 24 horas
          </Badge>
        </div>
      </main>

      <footer className="text-center py-8 bg-[#001a2c] text-white mt-16">
        <p>&copy; 2024 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}