import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-8xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg fill="#155dfc" height="60px" width="60px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M256.451,231.685c16.64,11.489,39.439,7.309,50.922-9.33l91.591-132.679c11.966-17.335,35.806-21.702,53.139-9.731 l69.837,48.21c8.401,5.798,14.038,14.519,15.878,24.555c1.838,10.036-0.341,20.188-6.142,28.586l-91.589,132.675 c-11.485,16.639-7.309,39.437,9.33,50.922c6.35,4.383,13.593,6.485,20.763,6.485c11.624,0,23.056-5.524,30.159-15.815 l91.587-132.673c16.91-24.493,23.268-54.104,17.905-83.377c-5.364-29.271-21.805-54.705-46.299-71.612l-69.835-48.21 C443.137-15.213,373.611-2.475,338.711,48.084l-91.591,132.679C235.634,197.403,239.81,220.199,256.451,231.685z"></path> <path d="M313.979,440.081l-132.681,91.593c-8.399,5.8-18.55,7.984-28.584,6.14c-10.036-1.838-18.757-7.478-24.555-15.876 L79.946,452.1c-11.968-17.335-7.599-41.175,9.737-53.141l132.677-91.591c16.639-11.485,20.815-34.283,9.33-50.922 c-11.485-16.64-34.285-20.821-50.922-9.33L48.089,338.708C-2.47,373.61-15.208,443.136,19.695,493.697l48.214,69.839 c16.91,24.491,42.343,40.933,71.612,46.297c6.777,1.241,13.568,1.856,20.313,1.856c22.393-0.002,44.242-6.765,63.064-19.759 l132.677-91.593c16.639-11.485,20.815-34.283,9.33-50.922C353.416,432.772,330.616,428.592,313.979,440.081z"></path> <path d="M426.242,202.848c-16.174-12.129-39.119-8.851-51.251,7.321l-70.637,94.18l-94.184,70.643 c-16.174,12.13-19.451,35.077-7.321,51.249c7.192,9.59,18.183,14.644,29.313,14.644c7.642,0,15.352-2.382,21.937-7.323 l98.368-73.78c2.775-2.08,5.238-4.546,7.321-7.321l73.778-98.364C445.694,237.924,442.416,214.979,426.242,202.848z"></path> <path d="M416.349,469.052l-8.736,113.556c-0.3,4.115,0.316,8.488,2.007,12.559c5.78,13.921,21.752,20.519,35.671,14.739 c13.921-5.78,20.519-21.752,14.739-35.673L416.349,469.052z"></path> <path d="M611.914,432.724c-1.155-15.027-14.276-26.272-29.305-25.115l-113.554,8.734l105.179,43.679 c3.817,1.57,8.166,2.346,12.561,2.009C601.824,460.876,613.069,447.755,611.914,432.724z"></path> </g> </g> </g></svg>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡Ups! No pudimos encontrar esta página
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Parece que la página que buscas no existe o ha sido movida. 
            No te preocupes, esto sucede a veces.
          </p>

          {/* Helpful Actions */}
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué puedes hacer?
              </h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Verificar que la dirección esté escrita correctamente
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Regresar a la página principal
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Buscar el servicio que necesitas
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-lg"
            >
              Ir a la página principal
            </Link>
            
            <Link
              to="/servicios"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 text-lg"
            >
              Ver todos los servicios
            </Link>
          </div>

          {/* Contact Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              ¿Sigues teniendo problemas?{' '}
              <Link
                to="/settings"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Contáctanos para obtener ayuda
              </Link>
            </p>
          </div>

          {/* Popular Links */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Páginas más visitadas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/servicios"
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
              >
                📋 Buscar servicios
              </Link>
              <Link
                to="/citas"
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
              >
                📅 Mis citas
              </Link>
              <Link
                to="/registro"
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
              >
                ✏️ Crear cuenta
              </Link>
              <Link
                to="/settings"
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
              >
                ⚙️ Configuración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
