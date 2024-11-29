import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logovision.png';
import logopitw from '@/assets/image.png';

export default function Home() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <header className="bg-green-700 text-white py-20 px-5 text-center">
        <Image src={logo} alt="Vision Bin" className='mx-auto' width={300} height={300} />
        <h1 className="text-4xl font-bold">
          Vision Bin
        </h1>
        <p className="mt-4 text-lg mb-8">
          Transformando comunidades con educación ambiental y reportes inteligentes.
        </p>
        <Link className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold mt-8 px-6 py-2 rounded-lg" href="#beneficios">
          Conoce Más
        </Link>
      </header>
      <section className="py-20 px-5 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-green-800">¿Cuál es el problema?</h2>
        <p className="mt-6 text-lg text-center">
          En Ixtapaluca, se generan 43 toneladas de residuos diarios, pero 5 toneladas terminan en lugares inadecuados. *Vision Bin* busca cambiar esta realidad.
        </p>
        <h2 className="text-3xl font-bold text-center text-green-800 mt-10">Nuestra Solución</h2>
        <p className="mt-6 text-lg text-center">
          Una app móvil que permite reportar residuos sólidos y enseña cómo separarlos correctamente, promoviendo la participación ciudadana.
        </p>
      </section>
      <section className="py-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-800">Características Clave</h2>
        <div className="flex flex-wrap justify-center mt-8">
          <div className="max-w-sm bg-gray-200 p-6 m-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Reportes Inteligentes</h3>
            <p className="mt-4">
              Usa nuestra herramienta de alertas para localizar y reportar residuos en zonas inadecuadas.
            </p>
          </div>
          <div className="max-w-sm bg-gray-200 p-6 m-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Educación Ambiental</h3>
            <p className="mt-4">
              Aprende a separar residuos de manera sencilla usando la cámara de tu celular.
            </p>
          </div>
          <div className="max-w-sm bg-gray-200 p-6 m-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Mapa Interactivo</h3>
            <p className="mt-4">
              Encuentra puntos de reciclaje y zonas de impacto en tu comunidad.
            </p>
          </div>
        </div>
      </section>
      <section className="py-10 px-5 bg-green-100">
        <h2 className="text-3xl font-bold text-center text-green-800" id='beneficios'>Beneficios de Vision Bin</h2>
        <ul className="mt-6 space-y-4 text-lg text-center">
          <li>- Menor probabilidad de inundaciones.</li>
          <li>- Mejora la calidad del aire.</li>
          <li>- Comunidades más limpias y sostenibles.</li>
        </ul>
      </section>
      <section className="py-20 bg-white px-5 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-green-800">¿Quieres probar la alpha de Vision Bin?</h2>
        <p className="mt-4 text-center">
          Ingresa al siguiente enlace para que seas de los primeros en probar nuestra app.
        </p>
        <Link className="bg-green-700 hover:bg-green-800 text-white font-bold mt-6 px-6 py-2 rounded-lg" href="https://expo.dev/preview/update?message=corrections&updateRuntimeVersion=1.0.0&createdAt=2024-11-29T18%3A07%3A00.842Z&slug=exp&projectId=029f935d-d3b2-429f-8a87-cba2049eda30&group=b01aec35-42fe-44a5-914d-17f936c43ac7" target="_blank">
          Prueba la Alpha
        </Link>
      </section>
      <section className="py-10 px-5">
        <h2 className="text-3xl font-bold text-center text-green-800">Nuestro Equipo</h2>
        <p className="text-center mt-4">
          Conoce a los desarrolladores detrás de Vision Bin.
        </p>
        <div className="flex flex-wrap justify-center mt-6">
          {['Luis', 'Alan', 'Jesús', 'Alexei', 'Sofía'].map((name) => (
            <div
              key={name}
              className="bg-gray-200 p-6 m-4 max-w-xs rounded-lg text-center shadow-lg"
            >
              <h3 className="text-xl font-bold">{name}</h3>
              <p>Ingeniería en Sistemas Computacionales</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-10 bg-white">
        <Image src={logopitw} alt="Programmers in the Wild" className='mx-auto invert' width={300} height={300} />
        <h1 className="text-3xl font-bold text-center text-green-800">Nosotros somos Programmers in the World</h1>
        <p className="mt-4 text-center">
          Desarrollamos aplicaciones web y móviles para resolver problemas reales.
        </p>
        <div className="flex justify-center mt-6">
          <Link className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-2 rounded-lg" href="https://programmersintheworld.com" target="_blank">
            Conoce Más
          </Link>
        </div>
      </section>
      <footer className="bg-green-700 text-white py-10 text-center">
        <h2 className="text-2xl font-bold">Únete a la Revolución Ambiental</h2>
        <p className="my-4">
          Sigue el desarrollo de Vision Bin y mantente informado sobre su lanzamiento.
        </p>
        <Link className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold mt-6 px-6 py-2 rounded-lg" href="https://programmersintheworld.com/#contact">
          Contáctanos
        </Link>
      </footer>
    </div>
  );
}
