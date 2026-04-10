# Tasks App - Ionic + Angular + Cordova

Aplicación móvil híbrida basada en gestión de tareas y categorías, construida con Ionic + Angular y configurada para ejecución con Cordova.

## Levantar el proyecto en otro equipo

### 1. Prerrequisitos

Instala estas herramientas antes de clonar el proyecto:

- Git
- Node.js LTS (recomendado 20.x o 22.x)
- npm (incluido con Node.js)
- Git Bash (recomendado para ejecutar comandos en este proyecto)
- Ionic CLI global
- Cordova CLI global

Comando para instalar CLIs globales:

	npm install -g @ionic/cli cordova

### 2. Clonar repositorio

	git clone https://github.com/jdep98/tasks-app.git
	cd tasks-app

### 3. Instalar dependencias

	npm install

### 4. Ejecutar en modo desarrollo web

	ionic serve

Si abre correctamente en navegador, la base Angular/Ionic está lista.

## Ejecución móvil con Cordova

### Android (Windows o Linux)

Prerrequisitos adicionales:

- Android Studio
- Android SDK + Platform Tools
- JDK 17
- Variables de entorno configuradas: JAVA_HOME y ANDROID_HOME o ANDROID_SDK_ROOT

Comandos:

	npx cordova platform add android
	npx cordova run android --device
	ionic cordova run android -l --device --external

Para generar build:

	npx cordova build android

### iOS (solo macOS)

Prerrequisitos adicionales:

- Xcode
- CocoaPods

Comandos:

	npx cordova platform add ios
	npx cordova run ios -l

Para generar build:

	npx cordova build ios

## Limpieza de entorno si algo falla

Si tienes errores de caché o resolución de dependencias, ejecuta:

	rm -rf node_modules package-lock.json .angular/cache
	npm install

