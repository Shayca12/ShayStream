// Jenkins Declarative Pipeline — בונה את כל ה-images ודוחף ל-registry המקומי.
pipeline {
  agent any

  environment {
    REGISTRY = 'localhost:5000'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          // מתייגים לפי ה-commit הקצר — כך כל build ניתן לזיהוי חד-ערכי.
          env.TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        }
        echo "🔖 בונים גרסה: ${env.TAG}"
      }
    }

    stage('Test services') {
      steps {
        script {
          // מריצים את הטסטים בקונטיינר node נקי. --volumes-from נותן לו גישה
          // ל-workspace של Jenkins (בגלל שאנחנו ב-docker-out-of-docker).
          for (s in ['auth-service', 'media-service', 'stream-service']) {
            sh "docker run --rm --volumes-from shaystream-jenkins -w \"\$WORKSPACE/services/${s}\" node:20-alpine sh -c 'npm ci && npm test'"
          }
        }
      }
    }

    stage('Build & Push services') {
      steps {
        script {
          for (s in ['auth-service', 'media-service', 'stream-service']) {
            sh """
              docker build -t ${REGISTRY}/shaystream/${s}:${env.TAG} -t ${REGISTRY}/shaystream/${s}:latest ./services/${s}
              docker push ${REGISTRY}/shaystream/${s}:${env.TAG}
              docker push ${REGISTRY}/shaystream/${s}:latest
            """
          }
        }
      }
    }

    stage('Build & Push frontend') {
      steps {
        sh "docker build --build-arg NEXT_PUBLIC_AUTH_URL=http://localhost:3001 --build-arg NEXT_PUBLIC_MEDIA_URL=http://localhost:3002 --build-arg NEXT_PUBLIC_STREAM_URL=http://localhost:3005 -t ${REGISTRY}/shaystream/frontend:${env.TAG} -t ${REGISTRY}/shaystream/frontend:latest ./frontend"
        sh "docker push ${REGISTRY}/shaystream/frontend:${env.TAG}"
        sh "docker push ${REGISTRY}/shaystream/frontend:latest"
      }
    }
  }

  post {
    success {
      echo "✅ כל ה-images נבנו ונדחפו ל-${REGISTRY} עם תגית ${env.TAG}"
    }
    failure {
      echo '❌ ה-pipeline נכשל — בדוק את הלוג של השלב שנכשל.'
    }
  }
}
